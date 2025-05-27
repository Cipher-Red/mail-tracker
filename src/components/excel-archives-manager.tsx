'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExcelArchiveItem, excelArchiveService } from '@/lib/excel-archive-service';
import { FileSpreadsheet, Clock, Download, Trash2, ArrowUpDown, Search, Filter, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatFileSize } from '@/lib/utils';
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
    }} className="bg-card rounded-lg border border-border p-4" data-unique-id="9f37a0df-3f0a-4d07-874e-10afad7e649c" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
        <h3 className="text-lg font-medium mb-3 flex items-center" data-unique-id="ebbcd0d1-4162-4dc6-a9c9-25b43e6ffe2c" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
          <span className="editable-text" data-unique-id="245cba1c-1a6b-4068-9126-ae49a04414cc" data-file-name="components/excel-archives-manager.tsx">Previous Uploads</span>
          <span className="ml-2 text-sm text-muted-foreground" data-unique-id="0d13cd50-d47e-4621-b208-ba6fc05cd956" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c22ca048-5a39-4c9f-8b56-c0a0644e577a" data-file-name="components/excel-archives-manager.tsx">(</span>{archives.length}<span className="editable-text" data-unique-id="9d3c8152-23ee-47bf-a206-e67e28ac7aed" data-file-name="components/excel-archives-manager.tsx">)</span></span>
        </h3>
        
        {isLoading ? <div className="flex justify-center items-center py-6" data-unique-id="90e90157-137a-4fd9-a9ca-786758919d09" data-file-name="components/excel-archives-manager.tsx">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : archives.length === 0 ? <div className="text-center py-6 text-muted-foreground" data-unique-id="dad7f2a7-25a6-4f98-8bd0-d9de2ee9421d" data-file-name="components/excel-archives-manager.tsx">
            <span className="editable-text" data-unique-id="210d6302-a8c3-4494-a624-1e8b138ea708" data-file-name="components/excel-archives-manager.tsx">No archived Excel files found</span>
          </div> : <div className="space-y-2 max-h-64 overflow-y-auto" data-unique-id="06fbca2f-62da-44ee-8cae-f9817eea6a53" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
            {filteredArchives.slice(0, 5).map(archive => <button key={archive.id} className="w-full text-left p-3 rounded-md hover:bg-accent/10 transition-colors border border-border flex justify-between items-center" onClick={() => onSelectArchive?.(archive)} data-unique-id="8077cd86-3c70-44e7-aa3e-60fe1cf17917" data-file-name="components/excel-archives-manager.tsx">
                <div className="flex items-center" data-unique-id="4a9c8e9e-984a-4e40-8039-114717353098" data-file-name="components/excel-archives-manager.tsx">
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
                  <div data-unique-id="e5ca3f25-28c5-4525-aa3f-13905691cb59" data-file-name="components/excel-archives-manager.tsx">
                    <div className="font-medium truncate max-w-[200px]" data-unique-id="990c246f-57fc-4704-9abd-368da9d350a1" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">{archive.fileName}</div>
                    <div className="text-xs text-muted-foreground flex items-center" data-unique-id="223361b0-4c8d-4fa7-9dcc-74f62914ded8" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
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
            
            {filteredArchives.length > 5 && <button className="w-full text-center py-2 text-sm text-primary hover:underline" onClick={() => setSelectedArchive(null)} data-unique-id="f2d2b4df-37c6-41eb-8afc-72d7d4579a0e" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="b1001e82-84c2-4095-b84c-bb01511bd3c1" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">Show all {filteredArchives.length} archives</span>
              </button>}
          </div>}
      </motion.div>;
  }

  // Full view with all management capabilities
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="bg-card rounded-lg shadow-lg p-6" data-unique-id="7dbc382e-e1e3-4daf-8358-8a768a0870cf" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-6" data-unique-id="354e6cc5-f74d-4fe8-90dd-3ebb6fcac397" data-file-name="components/excel-archives-manager.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="9986499d-e0e3-4852-9d05-fd17f4b319e3" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="mr-2 h-5 w-5" />
          <span className="editable-text" data-unique-id="fbc62f19-a2d7-4cad-9d4f-b2cd88dc415a" data-file-name="components/excel-archives-manager.tsx">Excel Archives</span>
          <span className="ml-2 text-sm text-muted-foreground" data-unique-id="5e705d22-6feb-4efd-9e3b-6c1b125a2211" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="058f0493-5234-46a0-a55c-c91f50cd629b" data-file-name="components/excel-archives-manager.tsx">(</span>{archives.length}<span className="editable-text" data-unique-id="19a4f95c-587d-41ba-855e-f0cf6c7e8b71" data-file-name="components/excel-archives-manager.tsx">)</span></span>
        </h2>
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-4 space-y-3" data-unique-id="da0b6dd0-a821-4e77-9e37-8222c5234218" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
        <div className="flex items-center gap-2" data-unique-id="ab6290e7-a1f9-4d19-a1c4-9fa6a00576b3" data-file-name="components/excel-archives-manager.tsx">
          <div className="relative flex-grow" data-unique-id="9ffb0f0e-1676-4cf6-885b-7d2131a30678" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search by file name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="6fe3e725-634e-4251-971b-feb5f1c45ddb" data-file-name="components/excel-archives-manager.tsx" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="0950c2be-dce4-44ca-8a4b-5c0e30666aec" data-file-name="components/excel-archives-manager.tsx">
                <X className="h-4 w-4" />
              </button>}
          </div>
          
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-md border ${showFilters ? 'border-primary bg-primary/5' : 'border-border'} flex items-center`} data-unique-id="dc1223e4-0ae0-4ea6-a85c-154bfcf82f5a" data-file-name="components/excel-archives-manager.tsx">
            <Filter className="h-4 w-4 mr-1" />
            <span className="editable-text" data-unique-id="126d9e47-ef4d-4135-8034-97ce07e21543" data-file-name="components/excel-archives-manager.tsx">Filters</span>
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
      }} className="p-3 border border-border rounded-md bg-accent/5" data-unique-id="4735562a-1064-4b1e-a9b5-61480bf0d136" data-file-name="components/excel-archives-manager.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="6d5b9125-20d7-490d-8ef9-7456c144e474" data-file-name="components/excel-archives-manager.tsx">
              <div data-unique-id="115e2055-c7df-4f13-94da-f192bcef4ca4" data-file-name="components/excel-archives-manager.tsx">
                <label className="block text-sm font-medium mb-1" data-unique-id="98fd6209-8964-4204-91e6-812cd5844bd4" data-file-name="components/excel-archives-manager.tsx">
                  <span className="editable-text" data-unique-id="e8c9baa1-e6be-494a-999d-147e1b0bb8bb" data-file-name="components/excel-archives-manager.tsx">Upload Date</span>
                </label>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md" data-unique-id="75ab604e-433c-420d-ab8c-55174b585560" data-file-name="components/excel-archives-manager.tsx" />
              </div>
            </div>
            
            <div className="mt-3 flex justify-end" data-unique-id="db98a411-8781-41a1-924e-a53c06ef3c09" data-file-name="components/excel-archives-manager.tsx">
              <button onClick={() => {
            setDateFilter('');
            setSearchQuery('');
          }} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="2768b8ab-4741-47ea-b0df-0472bd383c12" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="1671fdf3-e30c-48fe-937f-13a5a31fcce8" data-file-name="components/excel-archives-manager.tsx">Reset Filters</span>
              </button>
            </div>
          </motion.div>}
      </div>
      
      {/* Archives list */}
      {archives.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="4c6a7426-e6dd-4f30-aec0-d17cdcc96e8a" data-file-name="components/excel-archives-manager.tsx">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-2" data-unique-id="43b4058b-ef7f-4ff3-8865-6953e966d432" data-file-name="components/excel-archives-manager.tsx"><span className="editable-text" data-unique-id="b329d582-b95b-46b3-adbe-32d4d52fab23" data-file-name="components/excel-archives-manager.tsx">No archived Excel files found</span></p>
          <p className="text-sm" data-unique-id="0f601699-c6a0-4b21-b066-f9eba4b4695c" data-file-name="components/excel-archives-manager.tsx"><span className="editable-text" data-unique-id="01108bc0-3be3-4d37-9158-1aca1edaca32" data-file-name="components/excel-archives-manager.tsx">Upload an Excel file to get started</span></p>
        </div> : <>
          {/* Archives table */}
          <div className="border border-border rounded-md overflow-hidden" data-unique-id="492d2edb-fcc0-4f59-a1de-41a28ca5a967" data-file-name="components/excel-archives-manager.tsx">
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="5d13bacc-85f2-405c-8bac-2eec41ca5bf2" data-file-name="components/excel-archives-manager.tsx">
              <div className="col-span-5 flex items-center cursor-pointer" onClick={() => handleSort('fileName')} data-unique-id="dfbe2b8f-988f-4254-be95-2b5545943cb7" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="c09b9c22-28ed-41f7-a949-fb12d03ead7e" data-file-name="components/excel-archives-manager.tsx">File Name</span>
                {sortField === 'fileName' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort('uploadDate')} data-unique-id="bdb5dc8e-e949-45e1-9855-d51991133ec2" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="c7f7fec4-23e7-4184-8af0-989ce7372a63" data-file-name="components/excel-archives-manager.tsx">Upload Date</span>
                {sortField === 'uploadDate' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('fileSize')} data-unique-id="0e7ba4a4-5199-4326-9545-96d6a5f730ec" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="73a7fe0a-128d-44d8-9bb4-ba378a7244ff" data-file-name="components/excel-archives-manager.tsx">Size</span>
                {sortField === 'fileSize' && (sortDirection === 'asc' ? <ArrowUpDown className="h-3 w-3 ml-1" /> : <ArrowUpDown className="h-3 w-3 ml-1" />)}
              </div>
              <div className="col-span-2 text-right" data-unique-id="ea42c127-c0a9-4658-b5b5-886b42e856aa" data-file-name="components/excel-archives-manager.tsx">
                <span className="editable-text" data-unique-id="01116017-8a79-4a86-9acf-d01de0c6906c" data-file-name="components/excel-archives-manager.tsx">Actions</span>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto" data-unique-id="70bb1cbf-c709-4ae5-a50e-c77a347d93eb" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
              {filteredArchives.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="672230c9-4097-4f6f-a939-4947ef1e17c0" data-file-name="components/excel-archives-manager.tsx">
                  <span className="editable-text" data-unique-id="a6fbcbef-eaa3-414f-94d9-1e98422fead1" data-file-name="components/excel-archives-manager.tsx">No matching archives found</span>
                </div> : filteredArchives.map(archive => <div key={archive.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center hover:bg-accent/5 cursor-pointer" onClick={() => {
            setSelectedArchive(archive);
            onSelectArchive?.(archive);
          }} data-unique-id="445b5ed6-f046-4fcd-bad3-63ff60f20c33" data-file-name="components/excel-archives-manager.tsx">
                    <div className="col-span-5 font-medium flex items-center" data-unique-id="31f5eb1b-3828-498c-b182-a7fb8d2fafcc" data-file-name="components/excel-archives-manager.tsx">
                      <FileSpreadsheet className="h-4 w-4 text-primary mr-2" />
                      <span className="truncate" title={archive.fileName} data-unique-id="6ae9aa5a-434d-486a-a55a-1d7aec75432f" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">{archive.fileName}</span>
                    </div>
                    <div className="col-span-3 text-muted-foreground flex items-center" data-unique-id="43e906d3-1b82-4ce3-a389-43575ee901ba" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(archive.uploadDate).toLocaleString()}
                    </div>
                    <div className="col-span-2 text-muted-foreground" data-unique-id="4a52b3ae-2198-41c4-8a34-d18ccf24d28c" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      {formatFileSize(archive.fileSize)}
                    </div>
                    <div className="col-span-2 flex justify-end space-x-1" data-unique-id="26761444-e836-4711-becd-1bd2af3808ca" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
                      <button className="p-1.5 rounded-md hover:bg-accent/20 transition-colors" title="Download file" onClick={e => {
                e.stopPropagation();
                downloadArchive(archive);
              }} data-unique-id="3e8d0732-c465-419b-abb7-6d5bb8966d23" data-file-name="components/excel-archives-manager.tsx">
                        <Download className="h-4 w-4 text-primary" />
                      </button>
                      
                      {confirmDelete === archive.id ? <div className="flex space-x-1" data-unique-id="dacd4383-a3c4-4370-bda0-2d360abd1976" data-file-name="components/excel-archives-manager.tsx">
                          <button className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200" onClick={e => {
                  e.stopPropagation();
                  deleteArchive(archive.id);
                }} data-unique-id="8620cb66-f3f5-4abe-b852-050bf5b5063d" data-file-name="components/excel-archives-manager.tsx">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" onClick={e => {
                  e.stopPropagation();
                  setConfirmDelete(null);
                }} data-unique-id="714f20a6-28e4-4d1a-9a7a-bab6d3aca1d7" data-file-name="components/excel-archives-manager.tsx">
                            <X className="h-4 w-4" />
                          </button>
                        </div> : <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors" title="Delete archive" onClick={e => {
                e.stopPropagation();
                setConfirmDelete(archive.id);
                // Clear confirmation after 5 seconds if not acted upon
                setTimeout(() => {
                  setConfirmDelete(current => current === archive.id ? null : current);
                }, 5000);
              }} data-unique-id="40f2d0b3-b321-4a06-ab91-b8da40ad3ab9" data-file-name="components/excel-archives-manager.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>}
                    </div>
                  </div>)}
            </div>
          </div>
          
          {/* Archive stats */}
          <div className="mt-4 text-sm text-muted-foreground flex justify-between" data-unique-id="b9db96d9-cdb8-4498-a64b-cc582621ee20" data-file-name="components/excel-archives-manager.tsx">
            <div data-unique-id="359a2c42-4669-4386-8ab1-6d71659ebd54" data-file-name="components/excel-archives-manager.tsx" data-dynamic-text="true">
              <span className="editable-text" data-unique-id="3fc94a33-7927-44ea-b08d-f723e8d75dae" data-file-name="components/excel-archives-manager.tsx">Showing </span>
              {filteredArchives.length}
              <span className="editable-text" data-unique-id="e2c07ae5-b7bd-43d7-bcf3-1ef6f924c850" data-file-name="components/excel-archives-manager.tsx"> of </span>
              {archives.length}
              <span className="editable-text" data-unique-id="383cd7c8-73f6-4366-ba98-4e8cbec241a8" data-file-name="components/excel-archives-manager.tsx"> archives</span>
            </div>
          </div>
        </>}
    </motion.div>;
}