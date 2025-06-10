'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExcelArchiveItem, excelArchiveService } from '@/lib/excel-archive-service';
import { FileSpreadsheet, Clock, Download, Trash2, ArrowUpDown, Search, Filter, X, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};
interface ExcelArchivesManagerProps {
  onSelectArchive?: (archive: ExcelArchiveItem) => void;
  compact?: boolean;
}
export default function ExcelArchivesManager({
  onSelectArchive,
  compact = false
}: ExcelArchivesManagerProps) {
  const [archives, setArchives] = useState<ExcelArchiveItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'uploadDate' | 'fileName' | 'fileSize'>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedArchive, setSelectedArchive] = useState<ExcelArchiveItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load archives on component mount
  useEffect(() => {
    loadArchives();
  }, []);

  // Load archives from storage
  const loadArchives = async () => {
    setIsLoading(true);
    try {
      const storedArchives = await excelArchiveService.getArchivedExcelFiles();
      setArchives(storedArchives);
    } catch (error) {
      console.error('Error loading archives:', error);
      toast.error('Failed to load archived files');
    } finally {
      setIsLoading(false);
    }
  };

  // Download an archived file
  const downloadArchive = async (archive: ExcelArchiveItem) => {
    try {
      // Check if the data is already a URL (from Supabase)
      if (archive.data.startsWith('http')) {
        // Open the URL directly
        window.open(archive.data, '_blank');
        toast.success(`Opening ${archive.fileName}`);
        return;
      }

      // Otherwise process as base64 data
      if (!archive.data.includes('base64')) {
        // Try to get fresh data from archives
        const freshArchive = await excelArchiveService.getArchivedExcelFileById(archive.id);
        if (freshArchive && freshArchive.data.startsWith('http')) {
          window.open(freshArchive.data, '_blank');
          toast.success(`Opening ${archive.fileName}`);
          return;
        } else if (!freshArchive || !freshArchive.data) {
          throw new Error('Archive data not found');
        }
        archive = freshArchive;
      }

      // Create blob from base64 data
      const byteCharacters = atob(archive.data.split(',')[1]);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, {
        type: archive.contentType
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = archive.fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${archive.fileName}`);
    } catch (error) {
      console.error('Error downloading archive:', error);
      toast.error('Failed to download file');
    }
  };

  // Delete an archived file
  const deleteArchive = async (id: string) => {
    try {
      setIsLoading(true);
      const success = await excelArchiveService.deleteArchivedExcelFile(id);
      if (success) {
        toast.success('Archive deleted successfully');
        await loadArchives(); // Refresh list after delete
        setConfirmDelete(null);

        // If the deleted archive was selected, clear selection
        if (selectedArchive && selectedArchive.id === id) {
          setSelectedArchive(null);
        }
      } else {
        toast.error('Failed to delete archive');
      }
    } catch (error) {
      console.error('Error deleting archive:', error);
      toast.error('Error deleting archive');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggling sort field and direction
  const handleSort = (field: 'uploadDate' | 'fileName' | 'fileSize') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending order when changing fields
    }
  };

  // Filter and sort archives
  const filteredArchives = archives.filter(archive => {
    // Apply search filter
    const matchesSearch = searchQuery ? archive.fileName.toLowerCase().includes(searchQuery.toLowerCase()) : true;

    // Apply date filter if set
    const matchesDate = dateFilter ? new Date(archive.uploadDate).toISOString().split('T')[0] === dateFilter : true;
    return matchesSearch && matchesDate;
  }).sort((a, b) => {
    // Apply sorting
    if (sortField === 'uploadDate') {
      return sortDirection === 'asc' ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime() : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    } else if (sortField === 'fileName') {
      return sortDirection === 'asc' ? a.fileName.localeCompare(b.fileName) : b.fileName.localeCompare(a.fileName);
    } else if (sortField === 'fileSize') {
      return sortDirection === 'asc' ? a.fileSize - b.fileSize : b.fileSize - a.fileSize;
    }
    return 0;
  });

  // Compact view shows minimal UI when in compact mode
  if (compact) {
    return <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} className="bg-card rounded-lg border border-border p-4" data-unique-id="93ceb3da-4585-414f-a77f-33d44bae34c5" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
        <h3 className="text-lg font-medium mb-3 flex items-center" data-unique-id="057f1df9-8f97-4f64-92c4-891787557965" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
          <span className="editable-text" data-unique-id="7660037a-fdc5-4330-8da7-62132ecc0aef" data-file-name="components/excel-archives-manager.tsx">Previous Uploads</span>
          <span className="ml-2 text-sm text-muted-foreground" data-unique-id="d6746dc5-1d8d-4745-9ed2-839b8c8cadf4" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0797efbf-50d2-45c6-8a22-9d1f4e6283fc" data-file-name="components/excel-archives-manager.tsx">(</span>{archives.length}<span className="editable-text" data-unique-id="a455dbfc-1022-4561-8fa0-07bd9738bc6e" data-file-name="components/excel-archives-manager.tsx">)</span></span>
        </h3>
        
        {isLoading ? <div className="flex justify-center items-center py-6" data-unique-id="50eb4cc1-189e-4b45-9d9e-570a792f0555" data-file-name="components/excel-archives-manager.tsx">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : archives.length === 0 ? <div className="text-center py-6 text-muted-foreground" data-unique-id="52dcf487-c137-40c9-8aa2-f5c6ea71ed7b" data-file-name="components/excel-archives-manager.tsx">
            <span className="editable-text" data-unique-id="65993ee3-99d0-42cf-8b1e-c72c9a466917" data-file-name="components/excel-archives-manager.tsx">No archived Excel files found</span>
          </div> : <div className="space-y-2 max-h-64 overflow-y-auto" data-unique-id="c8c02562-f334-4846-b4b9-3e7482a78786" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
            {filteredArchives.slice(0, 5).map(archive => <button key={archive.id} className="w-full text-left p-3 rounded-md hover:bg-accent/10 transition-colors border border-border flex justify-between items-center" onClick={() => onSelectArchive?.(archive)} data-unique-id="6e932b5e-8560-4ab1-9ece-f52330f6903b" data-file-name="components/excel-archives-manager.tsx">
                <div className="flex items-center" data-unique-id="7e980b77-8f55-4967-81fa-312cbb013faa" data-file-name="components/excel-archives-manager.tsx">
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
                  <div data-unique-id="00a79b73-d7d5-407f-ab6b-a96ce233ed7d" data-file-name="components/excel-archives-manager.tsx">
                    <div className="font-medium truncate max-w-[200px]" data-unique-id="d1777a2a-2ad7-436f-8090-0dd08ae2f613" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">{archive.fileName}</div>
                    <div className="text-xs text-muted-foreground flex items-center" data-unique-id="fabb63e4-adf1-415d-bb06-ea0995cc7be7" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(archive.uploadDate).toLocaleString()}
                    </div>
                  </div>
                </div>
                <Download className="h-4 w-4 text-muted-foreground hover:text-primary" onClick={e => {
            e.stopPropagation();
            downloadArchive(archive);
          }} />
              </button>)}
            
            {filteredArchives.length > 5 && <button className="w-full text-center py-2 text-sm text-primary hover:underline" onClick={() => setSelectedArchive(null)} data-unique-id="b5d4b63f-5d1e-48c9-8dcd-a4d86a33f14b" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="8d81409d-d02e-4aac-af5d-9d7e8f775f9f" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">Show all {filteredArchives.length} archives</span>
              </button>}
          </div>}
      </motion.div>;
  }

  // Full view with all management capabilities
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="bg-card rounded-lg shadow-lg p-6" data-unique-id="7aaf5d0d-2834-4bbb-935c-1cb9e70e3779" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="5047aef6-c5ac-4b00-8529-8f150c688d03" data-file-name="components/excel-archives-manager.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="dcbba9ce-ee93-44c5-8db7-6fc510c37441" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="mr-2 h-5 w-5" />
          <span className="editable-text" data-unique-id="3302089b-399f-4080-8766-8984aca5eb0e" data-file-name="components/excel-archives-manager.tsx">Excel Archives</span>
          <span className="ml-2 text-sm text-muted-foreground" data-unique-id="c44b847c-aeee-4fc7-9e0b-13b387a7d9a7" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="adcb8719-d7ab-4977-be40-08130027b240" data-file-name="components/excel-archives-manager.tsx">(</span>{archives.length}<span className="editable-text" data-unique-id="4940001a-a289-46e0-aac0-02ac29abf92e" data-file-name="components/excel-archives-manager.tsx">)</span></span>
        </h2>
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-4 space-y-3" data-unique-id="08630fd5-71da-4efb-bc88-a79990d2ffb9" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
        <div className="flex items-center gap-2" data-unique-id="d36d50b8-9481-42c1-a136-cb3399e58b73" data-file-name="components/excel-archives-manager.tsx">
          <div className="relative flex-grow" data-unique-id="13ecdf10-e12a-4423-8ca9-05b1760f38c2" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search by file name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="8f86713c-eec4-4411-976e-97886954b573" data-file-name="components/excel-archives-manager.tsx" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="82ed78b6-65df-4e76-9d9b-3f6e0f340702" data-file-name="components/excel-archives-manager.tsx">
                <X className="h-4 w-4" />
              </button>}
          </div>
          
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-md border ${showFilters ? 'border-primary bg-primary/5' : 'border-border'} flex items-center`} data-unique-id="edff3676-c49b-4ca5-b37b-d4c558274d40" data-file-name="components/excel-archives-manager.tsx">
            <Filter className="h-4 w-4 mr-1" />
            <span className="editable-text" data-unique-id="780e3638-f881-4149-a462-8c107e515c4f" data-file-name="components/excel-archives-manager.tsx">Filters</span>
          </button>
        </div>
        
        {showFilters && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="p-3 border border-border rounded-md bg-accent/5" data-unique-id="f20d5227-4bcf-4230-b220-8d7d7f8926bf" data-file-name="components/excel-archives-manager.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="adb225eb-b910-4ddf-975c-61d89e5e6dda" data-file-name="components/excel-archives-manager.tsx">
              <div data-unique-id="c26f1eea-6c2d-45af-9032-60928a3c0b4b" data-file-name="components/excel-archives-manager.tsx">
                <label className="block text-sm font-medium mb-1" data-unique-id="5085f566-18f5-48cf-a213-8ca7cc2a9791" data-file-name="components/excel-archives-manager.tsx">
                  <span className="editable-text" data-unique-id="4016c3d7-e325-4df0-8090-ff877b46a7b3" data-file-name="components/excel-archives-manager.tsx">Upload Date</span>
                </label>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md" data-unique-id="cb969415-d367-4de3-9878-5aadc675996b" data-file-name="components/excel-archives-manager.tsx" />
              </div>
            </div>
            
            <div className="mt-3 flex justify-end" data-unique-id="b401f3c1-a5f5-4751-926d-c6bd08304765" data-file-name="components/excel-archives-manager.tsx">
              <button onClick={() => {
            setDateFilter('');
            setSearchQuery('');
          }} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="048e1a30-1b81-49d6-9fd5-261690edc7aa" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="ec97ca57-9fe6-4e57-a9e3-f542f9339135" data-file-name="components/excel-archives-manager.tsx">Reset Filters</span>
              </button>
            </div>
          </motion.div>}
      </div>
      
      {/* Archives list */}
      {archives.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="372de266-53ed-4c71-b214-4452e2e6fbb2" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-2" data-unique-id="2710b6b3-27df-4b08-a6ae-a2c16408910e" data-file-name="components/excel-archives-manager.tsx"><span className="editable-text" data-unique-id="328acbe6-e69b-4916-aaec-c2487d0315c2" data-file-name="components/excel-archives-manager.tsx">No archived Excel files found</span></p>
          <p className="text-sm" data-unique-id="b879fc8c-81d6-4e37-b8eb-eb6d8cc2fcd3" data-file-name="components/excel-archives-manager.tsx"><span className="editable-text" data-unique-id="30c2c97a-393a-4793-94a2-14f6b4b7870a" data-file-name="components/excel-archives-manager.tsx">Upload an Excel file to get started</span></p>
        </div> : <>
          {/* Archives table */}
          <div className="border border-border rounded-md overflow-hidden" data-unique-id="697f371b-cbe6-473d-9aa6-8313e49812fc" data-file-name="components/excel-archives-manager.tsx">
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="6781b095-e1f5-4204-9319-96a7d9c6cd27" data-file-name="components/excel-archives-manager.tsx">
              <div className="col-span-5 flex items-center cursor-pointer" onClick={() => handleSort('fileName')} data-unique-id="08dc341d-e449-4f8d-b04f-8616e8358475" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="4c969347-d05f-47bd-ba1a-b50f9bb75229" data-file-name="components/excel-archives-manager.tsx">File Name</span>
                {sortField === 'fileName' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort('uploadDate')} data-unique-id="565bdc38-cbca-444c-a9e1-d23ca843dda3" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="f1ff4f35-8816-4cb3-bc7c-5e5ac52d99b6" data-file-name="components/excel-archives-manager.tsx">Upload Date</span>
                {sortField === 'uploadDate' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('fileSize')} data-unique-id="1f8982eb-db1d-4e23-a56e-2685185aa7eb" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="390956a0-0050-4fa8-a849-c0d998660c58" data-file-name="components/excel-archives-manager.tsx">Size</span>
                {sortField === 'fileSize' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-2 text-right" data-unique-id="da71223a-8b65-496f-854b-c23cc887a887" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="9f57ea41-b7f4-4d59-adc7-5dd4ba040a87" data-file-name="components/excel-archives-manager.tsx">Actions</span>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto" data-unique-id="727d8b82-4ca1-4319-a6bc-ddd6cfff3227" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
              {filteredArchives.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="6c0871da-cf0b-4a2c-aacc-47e315534e64" data-file-name="components/excel-archives-manager.tsx">
                  <span className="editable-text" data-unique-id="36a74c13-f7ea-46c7-bc09-0444cc1ce347" data-file-name="components/excel-archives-manager.tsx">No matching archives found</span>
                </div> : filteredArchives.map(archive => <div key={archive.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center hover:bg-accent/5 cursor-pointer" onClick={() => {
            setSelectedArchive(archive);
            onSelectArchive?.(archive);
          }} data-unique-id="75f09817-42eb-4bf3-8246-cf5e02ba15be" data-file-name="components/excel-archives-manager.tsx">
                    <div className="col-span-5 font-medium flex items-center" data-unique-id="5aec90b7-9253-42fd-948d-32ee1df9abc0" data-file-name="components/excel-archives-manager.tsx">
                      <FileSpreadsheet className="h-4 w-4 text-primary mr-2" />
                      <span className="truncate" title={archive.fileName} data-unique-id="3c6ecd05-57b5-4edc-9941-0ec36cef398e" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">{archive.fileName}</span>
                    </div>
                    <div className="col-span-3 text-muted-foreground flex items-center" data-unique-id="0feef0cc-7e2e-4904-a74f-6ba31bd9fad4" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(archive.uploadDate).toLocaleString()}
                    </div>
                    <div className="col-span-2 text-muted-foreground" data-unique-id="96f5edd8-fac7-4e90-82e0-e252e23839a0" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      {formatFileSize(archive.fileSize)}
                    </div>
                    <div className="col-span-2 flex justify-end space-x-1" data-unique-id="98dae2cc-0e39-4b84-9703-e5f9397c9537" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      <button className="p-1.5 rounded-md hover:bg-accent/20 transition-colors" title="Download file" onClick={e => {
                e.stopPropagation();
                downloadArchive(archive);
              }} data-unique-id="5daacc6b-6783-4460-a1fc-e62f65de10fa" data-file-name="components/excel-archives-manager.tsx">
                        <Download className="h-4 w-4 text-primary" />
                      </button>
                      
                      {confirmDelete === archive.id ? <div className="flex space-x-1" data-unique-id="0f43a162-3b6d-42ed-a48f-aedb6291a0c1" data-file-name="components/excel-archives-manager.tsx">
                          <button className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200" onClick={e => {
                  e.stopPropagation();
                  deleteArchive(archive.id);
                }} data-unique-id="638f6571-f43b-4545-b447-7eaef51130d6" data-file-name="components/excel-archives-manager.tsx">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" onClick={e => {
                  e.stopPropagation();
                  setConfirmDelete(null);
                }} data-unique-id="2a155aaf-9aa3-46ae-9076-0f55ee75c9e0" data-file-name="components/excel-archives-manager.tsx">
                            <X className="h-4 w-4" />
                          </button>
                        </div> : <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors" title="Delete archive" onClick={e => {
                e.stopPropagation();
                setConfirmDelete(archive.id);
                // Clear confirmation after 5 seconds if not acted upon
                setTimeout(() => {
                  setConfirmDelete(current => current === archive.id ? null : current);
                }, 5000);
              }} data-unique-id="79a73075-83e5-4edb-8e9f-6d2c0d1fc023" data-file-name="components/excel-archives-manager.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>}
                    </div>
                  </div>)}
            </div>
          </div>
          
          {/* Archive stats */}
          <div className="mt-4 text-sm text-muted-foreground flex justify-between" data-unique-id="fb6ca888-54dc-4cbe-85c6-ca065f147860" data-file-name="components/excel-archives-manager.tsx">
            <div data-unique-id="9782c048-5039-4da5-90cf-3a867122da95" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
              <span className="editable-text" data-unique-id="58378ca5-56ec-47fa-a59d-db8915854ebd" data-file-name="components/excel-archives-manager.tsx">Showing </span>
              {filteredArchives.length}
              <span className="editable-text" data-unique-id="dfdbf362-5334-4064-969e-fd88b85d6ae4" data-file-name="components/excel-archives-manager.tsx"> of </span>
              {archives.length}
              <span className="editable-text" data-unique-id="d061de6f-33a0-40dc-a566-df36f65b3e32" data-file-name="components/excel-archives-manager.tsx"> archives</span>
            </div>
          </div>
        </>}
    </motion.div>;
}