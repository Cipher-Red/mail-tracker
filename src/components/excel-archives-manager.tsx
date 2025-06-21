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
    }} className="bg-card rounded-lg border border-border p-4" data-unique-id="e45a969b-559d-46cc-bdf4-dc2c70bcafe6" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
        <h3 className="text-lg font-medium mb-3 flex items-center" data-unique-id="e8667b95-a0ef-4e3f-97c4-efb6c8a4be9d" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
          <span className="editable-text" data-unique-id="837d7f44-632d-4591-b45e-4b8d0c3b0d65" data-file-name="components/excel-archives-manager.tsx">Previous Uploads</span>
          <span className="ml-2 text-sm text-muted-foreground" data-unique-id="604e5382-a1e8-495c-a366-4d0b5b4a9dd5" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="74f2187e-64e0-478f-85b4-da7508dd2480" data-file-name="components/excel-archives-manager.tsx">(</span>{archives.length}<span className="editable-text" data-unique-id="efd23430-0c80-47c4-9566-34b8746dad18" data-file-name="components/excel-archives-manager.tsx">)</span></span>
        </h3>
        
        {isLoading ? <div className="flex justify-center items-center py-6" data-unique-id="8f8bb26f-a1a3-49ee-9047-dd2f1cdb2115" data-file-name="components/excel-archives-manager.tsx">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : archives.length === 0 ? <div className="text-center py-6 text-muted-foreground" data-unique-id="d5b02ffc-e722-4899-b026-11aef24c8b3d" data-file-name="components/excel-archives-manager.tsx">
            <span className="editable-text" data-unique-id="f1d4664e-dc66-4444-9d3d-96ce1ecb7f91" data-file-name="components/excel-archives-manager.tsx">No archived Excel files found</span>
          </div> : <div className="space-y-2 max-h-64 overflow-y-auto" data-unique-id="4ee7475b-8e0c-4691-8792-c12fdb1772a8" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
            {filteredArchives.slice(0, 5).map(archive => <button key={archive.id} className="w-full text-left p-3 rounded-md hover:bg-accent/10 transition-colors border border-border flex justify-between items-center" onClick={() => onSelectArchive?.(archive)} data-unique-id="18bcc34e-1514-4c88-bf28-b78faa3bdeff" data-file-name="components/excel-archives-manager.tsx">
                <div className="flex items-center" data-unique-id="7a5a617f-d844-4738-bc97-a8f93835c145" data-file-name="components/excel-archives-manager.tsx">
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
                  <div data-unique-id="6659d528-81e4-4505-be7b-7f7efa0f84ea" data-file-name="components/excel-archives-manager.tsx">
                    <div className="font-medium truncate max-w-[200px]" data-unique-id="a40b8a62-cd2f-4d95-ac97-b3fb0a3e22a9" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">{archive.fileName}</div>
                    <div className="text-xs text-muted-foreground flex items-center" data-unique-id="320bd9f3-a520-4e00-9d2a-885f936b6823" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
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
            
            {filteredArchives.length > 5 && <button className="w-full text-center py-2 text-sm text-primary hover:underline" onClick={() => setSelectedArchive(null)} data-unique-id="495c1040-9815-42dc-bb13-5badc3147e6b" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="6f7c2aac-fe79-4d77-9493-62e4ad772aa3" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">Show all {filteredArchives.length} archives</span>
              </button>}
          </div>}
      </motion.div>;
  }

  // Full view with all management capabilities
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="bg-card rounded-lg shadow-lg p-6" data-unique-id="8eb4d495-6f5f-4d8f-bfe5-727136718a84" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="3018e9bb-4837-48d2-860a-bc37279348e0" data-file-name="components/excel-archives-manager.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="dea1c463-88ac-411d-80d4-3cbff8df384b" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="mr-2 h-5 w-5" />
          <span className="editable-text" data-unique-id="cd3dd2bd-dfff-4a06-bbc8-c7549f560fa0" data-file-name="components/excel-archives-manager.tsx">Excel Archives</span>
          <span className="ml-2 text-sm text-muted-foreground" data-unique-id="aa082a5b-611b-4898-bc94-4cbb839a4e8a" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c85730a9-7e37-45ee-9b5d-f21de3100084" data-file-name="components/excel-archives-manager.tsx">(</span>{archives.length}<span className="editable-text" data-unique-id="aa4e7cdf-e93f-4297-8246-69d74d451311" data-file-name="components/excel-archives-manager.tsx">)</span></span>
        </h2>
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-4 space-y-3" data-unique-id="732c965b-0729-4d45-9ff0-4ce66a0194a0" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
        <div className="flex items-center gap-2" data-unique-id="ae590bd4-737d-4131-91a2-0b4954361386" data-file-name="components/excel-archives-manager.tsx">
          <div className="relative flex-grow" data-unique-id="93fdf0b1-a9f4-44bd-90fc-2baf9ae971da" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search by file name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="fccfb7bb-07d2-48c9-9310-6e7a591ff257" data-file-name="components/excel-archives-manager.tsx" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="6262c20f-2952-4c01-a186-434494c501b7" data-file-name="components/excel-archives-manager.tsx">
                <X className="h-4 w-4" />
              </button>}
          </div>
          
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-md border ${showFilters ? 'border-primary bg-primary/5' : 'border-border'} flex items-center`} data-unique-id="bf1d8b18-2479-4788-813d-0d2943a6efff" data-file-name="components/excel-archives-manager.tsx">
            <Filter className="h-4 w-4 mr-1" />
            <span className="editable-text" data-unique-id="6126cf51-7d44-4b76-9862-5d1f13bdd3b6" data-file-name="components/excel-archives-manager.tsx">Filters</span>
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
      }} className="p-3 border border-border rounded-md bg-accent/5" data-unique-id="f7cbe4cd-b884-4334-8242-744be4837830" data-file-name="components/excel-archives-manager.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="daefbbdd-b25e-4de6-b5f7-04f6a3870c69" data-file-name="components/excel-archives-manager.tsx">
              <div data-unique-id="d20d0db0-7029-42ec-bc4a-318df1937f8f" data-file-name="components/excel-archives-manager.tsx">
                <label className="block text-sm font-medium mb-1" data-unique-id="d0340ee1-6126-45ac-a29f-e2330692b81d" data-file-name="components/excel-archives-manager.tsx">
                  <span className="editable-text" data-unique-id="918eef72-3ea4-47cb-bf28-0f39a2e5c1a1" data-file-name="components/excel-archives-manager.tsx">Upload Date</span>
                </label>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md" data-unique-id="92084697-1eed-4e71-825f-46975d1283d2" data-file-name="components/excel-archives-manager.tsx" />
              </div>
            </div>
            
            <div className="mt-3 flex justify-end" data-unique-id="198add80-45e9-4ed7-817a-f91f47e64f00" data-file-name="components/excel-archives-manager.tsx">
              <button onClick={() => {
            setDateFilter('');
            setSearchQuery('');
          }} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="429444de-9227-4bff-9a7d-56ab44ca6f60" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="8fd500f8-3534-4d98-83dd-ef6e84aa3815" data-file-name="components/excel-archives-manager.tsx">Reset Filters</span>
              </button>
            </div>
          </motion.div>}
      </div>
      
      {/* Archives list */}
      {archives.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="b89d9280-0c22-4f25-aacc-6d02b913f6f4" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-2" data-unique-id="77a74b0f-5985-4891-bff0-0dd7c6f9777c" data-file-name="components/excel-archives-manager.tsx"><span className="editable-text" data-unique-id="d4759f13-d57a-4aec-b467-84172db00b90" data-file-name="components/excel-archives-manager.tsx">No archived Excel files found</span></p>
          <p className="text-sm" data-unique-id="61d4e250-9fcc-45b3-b735-1182a37066eb" data-file-name="components/excel-archives-manager.tsx"><span className="editable-text" data-unique-id="e022bab6-9b78-40ca-bbae-9bc0d67cdbc1" data-file-name="components/excel-archives-manager.tsx">Upload an Excel file to get started</span></p>
        </div> : <>
          {/* Archives table */}
          <div className="border border-border rounded-md overflow-hidden" data-unique-id="6534dc70-8cf7-43b1-ba76-4a82e7db7d61" data-file-name="components/excel-archives-manager.tsx">
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="b12d3aaa-ba0d-4156-8b2f-41d9f6bd30b1" data-file-name="components/excel-archives-manager.tsx">
              <div className="col-span-5 flex items-center cursor-pointer" onClick={() => handleSort('fileName')} data-unique-id="b8c73d2e-a8d8-4dab-9fb6-cdb026c978ec" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="695c9cc2-2678-4e63-ad7e-6c6771079736" data-file-name="components/excel-archives-manager.tsx">File Name</span>
                {sortField === 'fileName' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort('uploadDate')} data-unique-id="0d56febf-5366-461d-9b0b-cb21ff811d70" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="9d6047d4-1a01-43ad-bc29-2d6429dc0c6f" data-file-name="components/excel-archives-manager.tsx">Upload Date</span>
                {sortField === 'uploadDate' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('fileSize')} data-unique-id="5e1a722a-931c-41fc-877f-e6059ea5c0b5" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="e4f6e940-4f5e-44aa-8b7e-becc8323405d" data-file-name="components/excel-archives-manager.tsx">Size</span>
                {sortField === 'fileSize' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-2 text-right" data-unique-id="4f60b0c2-d7c7-4395-9501-e3ceb23e715e" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="71e209a6-217f-4536-8606-d5398d559f7a" data-file-name="components/excel-archives-manager.tsx">Actions</span>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto" data-unique-id="cfa444d0-2259-4865-b056-2237cf0c4588" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
              {filteredArchives.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="4b93cc76-8910-40d8-8352-c8081b2649e0" data-file-name="components/excel-archives-manager.tsx">
                  <span className="editable-text" data-unique-id="82f9315e-ec6b-45ca-91f0-05ac5caf5e92" data-file-name="components/excel-archives-manager.tsx">No matching archives found</span>
                </div> : filteredArchives.map(archive => <div key={archive.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center hover:bg-accent/5 cursor-pointer" onClick={() => {
            setSelectedArchive(archive);
            onSelectArchive?.(archive);
          }} data-unique-id="da6cc08d-df79-4215-87ad-f49dd8cb1c2a" data-file-name="components/excel-archives-manager.tsx">
                    <div className="col-span-5 font-medium flex items-center" data-unique-id="b0a02f7a-b2af-46e3-8e32-4475dc541abf" data-file-name="components/excel-archives-manager.tsx">
                      <FileSpreadsheet className="h-4 w-4 text-primary mr-2" />
                      <span className="truncate" title={archive.fileName} data-unique-id="e38f25f7-0f86-46d6-91e4-013ddd7bcd10" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">{archive.fileName}</span>
                    </div>
                    <div className="col-span-3 text-muted-foreground flex items-center" data-unique-id="ed1ddff9-bc09-4c59-b641-197db42b4d8c" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(archive.uploadDate).toLocaleString()}
                    </div>
                    <div className="col-span-2 text-muted-foreground" data-unique-id="4242da81-b727-44e5-8296-cad1b50a9004" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      {formatFileSize(archive.fileSize)}
                    </div>
                    <div className="col-span-2 flex justify-end space-x-1" data-unique-id="e88adb58-b2f1-4385-9e1a-0e6f922f71e8" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      <button className="p-1.5 rounded-md hover:bg-accent/20 transition-colors" title="Download file" onClick={e => {
                e.stopPropagation();
                downloadArchive(archive);
              }} data-unique-id="6e36830a-0b65-4bd3-b80d-21160cd8c19b" data-file-name="components/excel-archives-manager.tsx">
                        <Download className="h-4 w-4 text-primary" />
                      </button>
                      
                      {confirmDelete === archive.id ? <div className="flex space-x-1" data-unique-id="ce95f948-45b2-4886-adf1-37b73d02f5f1" data-file-name="components/excel-archives-manager.tsx">
                          <button className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200" onClick={e => {
                  e.stopPropagation();
                  deleteArchive(archive.id);
                }} data-unique-id="62480901-fc56-44d9-b53c-b62af2afebe2" data-file-name="components/excel-archives-manager.tsx">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" onClick={e => {
                  e.stopPropagation();
                  setConfirmDelete(null);
                }} data-unique-id="17ed2066-a67b-4757-ade2-8ee130d012a2" data-file-name="components/excel-archives-manager.tsx">
                            <X className="h-4 w-4" />
                          </button>
                        </div> : <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors" title="Delete archive" onClick={e => {
                e.stopPropagation();
                setConfirmDelete(archive.id);
                // Clear confirmation after 5 seconds if not acted upon
                setTimeout(() => {
                  setConfirmDelete(current => current === archive.id ? null : current);
                }, 5000);
              }} data-unique-id="d0970186-27c1-4f46-86b8-d8f32f182a8a" data-file-name="components/excel-archives-manager.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>}
                    </div>
                  </div>)}
            </div>
          </div>
          
          {/* Archive stats */}
          <div className="mt-4 text-sm text-muted-foreground flex justify-between" data-unique-id="364a76f9-fe1a-4409-b404-d9690331ef1a" data-file-name="components/excel-archives-manager.tsx">
            <div data-unique-id="bd3e6aa6-0e0c-41be-93d2-6cac66d8f083" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
              <span className="editable-text" data-unique-id="dfa171bb-5a60-4f70-8bca-2a4c82427b31" data-file-name="components/excel-archives-manager.tsx">Showing </span>
              {filteredArchives.length}
              <span className="editable-text" data-unique-id="06c7588c-92f2-483a-a2a6-53039f8f7e1a" data-file-name="components/excel-archives-manager.tsx"> of </span>
              {archives.length}
              <span className="editable-text" data-unique-id="1f03a25a-3298-4bce-9809-c6a6694382cd" data-file-name="components/excel-archives-manager.tsx"> archives</span>
            </div>
          </div>
        </>}
    </motion.div>;
}