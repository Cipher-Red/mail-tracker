'use client';

import { supabase } from '@/lib/supabase-client';
import { v4 as uuidv4 } from 'uuid';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

export interface ExcelArchiveItem {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  contentType: string;
  data: string; // Base64 encoded file content
  supabasePath?: string; // Path in Supabase storage
  metadata?: {
    rowCount?: number;
    columnCount?: number;
    sheets?: string[];
    description?: string;
  }
}

// Constants for storage
const STORAGE_BUCKET = 'excel-archives';
const LOCAL_STORAGE_KEY = 'excelArchives';

/**
 * Service for managing Excel sheet archives
 */
export const excelArchiveService = {
  /**
   * Store an Excel file in the archives (both Supabase and localStorage)
   */
  archiveExcelFile: async (file: File, fileData: string, metadata?: any): Promise<ExcelArchiveItem> => {
    try {
      // Generate a unique ID for the archive item
      const id = `excel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const filePath = `${id}/${file.name}`;
      
      // Create archive item
      const archiveItem: ExcelArchiveItem = {
        id,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        contentType: file.type,
        data: fileData,
        supabasePath: filePath,
        metadata: {
          ...metadata,
          description: metadata?.description || `Uploaded on ${new Date().toLocaleString()}`
        }
      };

      // Try to upload to Supabase storage
      let supabaseUploadSuccess = false;
      try {
        if (typeof window !== 'undefined' && supabase) {
          console.log('Attempting to upload to Supabase storage:', filePath);
          
          // Convert base64 to blob for upload
          const binaryString = atob(fileData.split(',')[1]);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: file.type });
          
          // Ensure bucket exists before uploading
          const { data: bucketData, error: bucketError } = await supabase.storage
            .getBucket(STORAGE_BUCKET)
            .catch(async (err) => {
              console.log('Bucket might not exist, attempting to create:', STORAGE_BUCKET);
              // Try to create the bucket if it doesn't exist
              return await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
            });
            
          if (bucketError) {
            console.error('Error with storage bucket:', bucketError);
          }
          
          // Upload to Supabase with retries
          let uploadAttempts = 0;
          let uploadSuccess = false;
          let uploadError = null;
          
          while (uploadAttempts < 3 && !uploadSuccess) {
            try {
              uploadAttempts++;
              console.log(`Upload attempt ${uploadAttempts} for ${filePath}`);
              
              const { data, error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, blob, {
                  cacheControl: '3600',
                  upsert: true
                });
                
              if (error) {
                console.error(`Upload attempt ${uploadAttempts} failed:`, error);
                uploadError = error;
              } else {
                uploadSuccess = true;
                console.log('Upload successful:', data);
              }
            } catch (err) {
              console.error(`Upload attempt ${uploadAttempts} exception:`, err);
              uploadError = err;
            }
            
            if (!uploadSuccess && uploadAttempts < 3) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          if (!uploadSuccess) {
            throw uploadError || new Error('Failed to upload after multiple attempts');
          }
          
          // Get public URL for the file
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);
            
          if (urlData) {
            archiveItem.data = urlData.publicUrl; // Store the public URL instead of base64 data
            supabaseUploadSuccess = true;
            console.log('File archived successfully in Supabase:', urlData.publicUrl);
          }
        }
      } catch (supabaseError) {
        console.error('Failed to upload to Supabase, falling back to localStorage:', supabaseError);
        // Continue with localStorage fallback
      }
      
      // Always store metadata in localStorage, but also store data if Supabase upload failed
      const archives = await excelArchiveService.getArchivedExcelFiles();
      
      // Add new archive at the beginning
      archives.unshift(archiveItem);
      
      // Store back to localStorage (either full data or just metadata if in Supabase)
      setLocalStorage(LOCAL_STORAGE_KEY, archives);
      
      // Also, save the archive data to the database via API
      try {
        console.log('Saving archive metadata to database');
        const response = await fetch('/api/archives', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: archiveItem.id,
            fileName: archiveItem.fileName,
            uploadDate: archiveItem.uploadDate,
            fileSize: archiveItem.fileSize,
            contentType: archiveItem.contentType,
            supabasePath: archiveItem.supabasePath,
            metadata: archiveItem.metadata
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to save archive metadata to database:', errorData);
        } else {
          console.log('Archive metadata saved to database successfully');
        }
      } catch (dbError) {
        console.error('Error saving archive to database:', dbError);
      }
      
      // Track successful archiving
      import('@/lib/utils').then(({ trackActivity }) => {
        trackActivity('excel.archived', {
          fileName: file.name,
          fileSize: file.size,
          storedIn: supabaseUploadSuccess ? 'supabase' : 'localStorage',
        });
      });
      
      return archiveItem;
    } catch (error) {
      console.error('Error archiving Excel file:', error);
      throw new Error('Failed to archive Excel file');
    }
  },

  /**
   * Get all archived Excel files
   */
  getArchivedExcelFiles: async (): Promise<ExcelArchiveItem[]> => {
    try {
      // Try to get archives from Supabase first
      let archives: ExcelArchiveItem[] = [];
      
      if (supabase) {
        try {
          // List all files in the bucket
          const { data: files, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list();
            
          if (error) {
            console.error('Error listing files from Supabase:', error);
          } else if (files && files.length > 0) {
            // Get metadata from localStorage to merge with Supabase files
            const localArchives = getLocalStorage<ExcelArchiveItem[]>(LOCAL_STORAGE_KEY, []);
            
            // Process each file from Supabase
            for (const file of files) {
              // Find matching metadata in localStorage if available
              const localMatch = localArchives.find(a => a.supabasePath?.includes(file.name));
              
              if (localMatch) {
                archives.push(localMatch);
              } else {
                // Create basic archive item if no local metadata
                const { data: urlData } = supabase.storage
                  .from(STORAGE_BUCKET)
                  .getPublicUrl(file.name);
                  
                archives.push({
                  id: file.id || `supabase_${file.name}`,
                  fileName: file.name,
                  uploadDate: file.created_at || new Date().toISOString(),
                  fileSize: file.metadata?.size || 0,
                  contentType: file.metadata?.mimetype || 'application/octet-stream',
                  data: urlData?.publicUrl || '',
                  supabasePath: file.name
                });
              }
            }
          }
        } catch (supabaseError) {
          console.error('Error fetching from Supabase:', supabaseError);
        }
      }
      
      // If no Supabase results or error occurred, fallback to localStorage
      if (archives.length === 0) {
        archives = getLocalStorage<ExcelArchiveItem[]>(LOCAL_STORAGE_KEY, []);
      }
      
      return archives;
    } catch (error) {
      console.error('Error getting archived files:', error);
      return getLocalStorage<ExcelArchiveItem[]>(LOCAL_STORAGE_KEY, []);
    }
  },

  /**
   * Get an archived Excel file by ID
   */
  getArchivedExcelFileById: async (id: string): Promise<ExcelArchiveItem | undefined> => {
    // First try to get from localStorage for metadata
    const localArchives = getLocalStorage<ExcelArchiveItem[]>(LOCAL_STORAGE_KEY, []);
    const localArchive = localArchives.find(archive => archive.id === id);
    
    if (localArchive) {
      // If we have a Supabase path, try to get the actual file from Supabase
      if (localArchive.supabasePath && supabase) {
        try {
          // Get the file URL from Supabase
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(localArchive.supabasePath);
            
          if (urlData) {
            // Return archive with updated public URL
            return {
              ...localArchive,
              data: urlData.publicUrl
            };
          }
        } catch (error) {
          console.error('Error getting file from Supabase:', error);
        }
      }
      
      // Return local archive data if Supabase failed or not available
      return localArchive;
    }
    
    return undefined;
  },

  /**
   * Extract order data from an archived Excel file
   */
  extractOrdersFromArchive: async (archive: ExcelArchiveItem): Promise<any[]> => {
    try {
      if (typeof window === 'undefined') return [];
      
      // Import XLSX dynamically to avoid SSR issues
      const XLSX = (await import('xlsx')).default;
      
      // Handle data based on format (URL or base64)
      let bytes: Uint8Array;
      
      try {
        if (archive.data.startsWith('http')) {
          // It's a URL, fetch the data
          const response = await fetch(archive.data);
          if (!response.ok) {
            throw new Error(`Failed to fetch archive from URL (status: ${response.status})`);
          }
          const arrayBuffer = await response.arrayBuffer();
          bytes = new Uint8Array(arrayBuffer);
        } else {
          // It's base64 data
          const base64Data = archive.data;
          const base64Content = base64Data.split(',')[1];
          const binaryString = atob(base64Content);
          bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
        }
        
        // Parse the Excel data
        const workbook = XLSX.read(bytes, { type: 'array' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        
        // Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(ws);
        if (!rawData || rawData.length === 0) {
          throw new Error('No data found in Excel file');
        }
        
        // Process the data through our cleaning/validation function
        const { cleanAndValidateData } = await import('@/lib/data-processor');
        const { cleanedData } = cleanAndValidateData(rawData);
        
        // Store extracted data in localStorage as a cache
        if (cleanedData.length > 0) {
          try {
            localStorage.setItem(`archive_orders_${archive.id}`, JSON.stringify(cleanedData));
          } catch (err) {
            console.warn('Could not save extracted orders to localStorage:', err);
          }
        }
        
        return cleanedData;
      } catch (fetchError) {
        console.error('Error processing archive data:', fetchError);
        
        // Try to retrieve from cache if available
        const cachedData = localStorage.getItem(`archive_orders_${archive.id}`);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error extracting orders from archive:', error);
      return [];
    }
  },

  /**
   * Delete an archived Excel file
   */
  deleteArchivedExcelFile: async (id: string): Promise<boolean> => {
    try {
      const archives = getLocalStorage<ExcelArchiveItem[]>(LOCAL_STORAGE_KEY, []);
      const archiveToDelete = archives.find(archive => archive.id === id);
      
      if (!archiveToDelete) {
        return false; // Nothing to delete
      }
      
      const updatedArchives = archives.filter(archive => archive.id !== id);
      
      // If we have a Supabase path, try to delete from Supabase storage
      if (archiveToDelete.supabasePath && supabase) {
        try {
          const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([archiveToDelete.supabasePath]);
            
          if (error) {
            console.error('Error deleting from Supabase storage:', error);
          }
        } catch (error) {
          console.error('Error during Supabase delete operation:', error);
        }
      }
      
      // Always update localStorage regardless of Supabase result
      setLocalStorage(LOCAL_STORAGE_KEY, updatedArchives);
      
      // Track deletion
      import('@/lib/utils').then(({ trackActivity }) => {
        trackActivity('excel.deleted', {
          fileName: archiveToDelete.fileName,
        });
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting archived Excel file:', error);
      return false;
    }
  },

  /**
   * Update metadata for an archived Excel file
   */
  updateArchiveMetadata: async (id: string, metadata: any): Promise<boolean> => {
    try {
      const archives = getLocalStorage<ExcelArchiveItem[]>(LOCAL_STORAGE_KEY, []);
      const archiveIndex = archives.findIndex(archive => archive.id === id);
      
      if (archiveIndex === -1) {
        return false; // Archive not found
      }
      
      archives[archiveIndex].metadata = {
        ...archives[archiveIndex].metadata,
        ...metadata
      };
      
      setLocalStorage(LOCAL_STORAGE_KEY, archives);
      return true;
    } catch (error) {
      console.error('Error updating archive metadata:', error);
      return false;
    }
  },

  /**
   * Clear all archives
   */
  clearAllArchives: async (): Promise<boolean> => {
    try {
      // Get archives for Supabase paths
      const archives = getLocalStorage<ExcelArchiveItem[]>(LOCAL_STORAGE_KEY, []);
      
      // Try to delete files from Supabase
      if (supabase) {
        try {
          const supabasePaths = archives
            .filter(archive => archive.supabasePath)
            .map(archive => archive.supabasePath!);
            
          if (supabasePaths.length > 0) {
            const { error } = await supabase.storage
              .from(STORAGE_BUCKET)
              .remove(supabasePaths);
              
            if (error) {
              console.error('Error clearing Supabase storage:', error);
            }
          }
        } catch (error) {
          console.error('Error during Supabase clear operation:', error);
        }
      }
      
      // Clear localStorage
      setLocalStorage(LOCAL_STORAGE_KEY, []);
      return true;
    } catch (error) {
      console.error('Error clearing archives:', error);
      return false;
    }
  }
};

/**
 * Helper function to convert base64 to Blob
 */
function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
      
  return new Blob(byteArrays, { type: contentType });
}
