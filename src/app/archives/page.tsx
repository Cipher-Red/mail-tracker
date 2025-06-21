'use client';

import { useState } from 'react';
import { Header } from "@/components/header";
import ExcelArchivesManager from '@/components/excel-archives-manager';
import { ExcelArchiveItem } from '@/lib/excel-archive-service';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Archive, Clock } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
export default function ArchivesPage() {
  const [selectedArchive, setSelectedArchive] = useState<ExcelArchiveItem | null>(null);
  return <>
      <Header />
      <Toaster position="top-center" />
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="59533b92-ddd3-4092-b5e4-f68b05d5c47c" data-file-name="app/archives/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }} className="container mx-auto" data-unique-id="e796b0f7-ddc0-4150-b066-46bff7c8f849" data-file-name="app/archives/page.tsx">
          <div className="mb-8" data-unique-id="afd66c58-1774-4bb1-9e8f-c996ba33ed18" data-file-name="app/archives/page.tsx">
            <h1 className="text-3xl font-bold text-primary mb-2 flex items-center" data-unique-id="f0339efb-839a-4d09-9120-d839e6dd0bc1" data-file-name="app/archives/page.tsx">
              <Archive className="mr-3 h-7 w-7" />
              <span className="editable-text" data-unique-id="4f97d522-abbf-4c7b-984d-fc4e84eb7e29" data-file-name="app/archives/page.tsx">Excel Sheet & Order Archives</span>
            </h1>
            <p className="text-muted-foreground" data-unique-id="78e35c03-39b8-410e-b11a-7000198d7922" data-file-name="app/archives/page.tsx">
              <span className="editable-text" data-unique-id="211b5b05-e664-43e6-a2a8-d7954242e214" data-file-name="app/archives/page.tsx">
                Access, manage and view orders from your previously uploaded Excel sheets
              </span>
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded-lg" data-unique-id="33d6fa15-8be1-4bf2-aa6d-b38cb7d6d77f" data-file-name="app/archives/page.tsx">
              <div className="flex items-center" data-unique-id="f842d7f9-79ec-4815-82a7-355d0b39d9ec" data-file-name="app/archives/page.tsx">
                <FileSpreadsheet className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <p className="text-blue-700 dark:text-blue-300 text-sm" data-unique-id="dd2bbeab-71c0-41ce-b002-81f00b0e3a6f" data-file-name="app/archives/page.tsx">
                  <span className="font-medium" data-unique-id="83cdfc82-8977-4d89-9918-0134c3046031" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="4973ae7c-c4fa-45ec-8095-bc7f1bf84100" data-file-name="app/archives/page.tsx">New Feature:</span></span><span className="editable-text" data-unique-id="be8b21bf-c9fa-4e59-8229-fbc8027ed7d8" data-file-name="app/archives/page.tsx"> You can now view orders directly from archived Excel files without re-uploading them.
                </span></p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3" data-unique-id="4cc34dba-29bd-4fb8-8d01-d65747e3de51" data-file-name="app/archives/page.tsx">
            <div className="lg:col-span-2" data-unique-id="aec265f0-cb37-45c3-b61a-9e843327331f" data-file-name="app/archives/page.tsx">
              <ExcelArchivesManager onSelectArchive={setSelectedArchive} />
            </div>
            
            <div className="lg:col-span-1" data-unique-id="bd2a7974-0840-40cb-8e69-8e8fab051bc6" data-file-name="app/archives/page.tsx">
              <motion.div layout className="bg-card rounded-lg shadow-lg border border-border p-6" data-unique-id="38c92388-5fa0-401e-924b-0e40af7f4739" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                <h2 className="text-xl font-medium mb-6 flex items-center" data-unique-id="dc219cd2-6e43-43e0-8b7a-6e5472be2a9a" data-file-name="app/archives/page.tsx">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                  <span className="editable-text" data-unique-id="43cd352a-e3a3-4e00-9bd1-b8e773497720" data-file-name="app/archives/page.tsx">Archive Details</span>
                </h2>
                
                {selectedArchive ? <div className="space-y-4" data-unique-id="aa68bd83-ca1b-46ae-b5a0-9eb2720d6143" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                    <div className="p-4 bg-primary/5 rounded-lg border border-border" data-unique-id="43386475-d435-4ebf-96de-7f035f421825" data-file-name="app/archives/page.tsx">
                      <h3 className="font-medium text-lg mb-2" data-unique-id="4b091897-c124-4fdd-a778-756de42ffa3e" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.fileName}</h3>
                      <div className="space-y-2 text-sm" data-unique-id="36307124-5aae-4722-bce6-9ddadd40fd49" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                        <div className="flex justify-between" data-unique-id="df220629-5c67-4106-9b72-b2e2c3417fcf" data-file-name="app/archives/page.tsx">
                          <span className="text-muted-foreground" data-unique-id="2daad579-7f2a-4edf-bfe6-d0d9a92c9109" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="36b8424e-d967-4f28-9266-6528e7b3def1" data-file-name="app/archives/page.tsx">Upload Date:</span></span>
                          <span className="font-medium flex items-center" data-unique-id="bbb913f7-4fbf-4aaf-a52c-87dd78c1a9ce" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                            <Clock className="h-3.5 w-3.5 mr-1 text-primary" />
                            {new Date(selectedArchive.uploadDate).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between" data-unique-id="91845bb9-4d98-4f67-9c0d-76f1de110229" data-file-name="app/archives/page.tsx">
                          <span className="text-muted-foreground" data-unique-id="3a74c005-5dae-4a42-8582-929eeb608a55" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="e6df6223-b41b-47c6-bcfa-8450787d02db" data-file-name="app/archives/page.tsx">File Size:</span></span>
                          <span className="font-medium" data-unique-id="379c8ed6-673f-4d97-8bf3-d7edee49eb16" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{(selectedArchive.fileSize / 1024).toFixed(2)}<span className="editable-text" data-unique-id="573193b7-9b94-472a-9971-b5fa2727020b" data-file-name="app/archives/page.tsx"> KB</span></span>
                        </div>
                        
                        {selectedArchive.metadata?.rowCount && <div className="flex justify-between" data-unique-id="9126071d-b580-4f9b-87ec-a903c27c8114" data-file-name="app/archives/page.tsx">
                            <span className="text-muted-foreground" data-unique-id="333b2cf5-8f15-4b24-affc-069dced55fb0" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="3a17e913-c101-430c-b990-e856bc88ea4a" data-file-name="app/archives/page.tsx">Rows:</span></span>
                            <span className="font-medium" data-unique-id="5b2412ed-e5b5-40d1-b5bd-e94dfffa1ec4" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.metadata.rowCount}</span>
                          </div>}
                        
                        {selectedArchive.metadata?.sheets && <div className="flex justify-between" data-unique-id="01640f65-4e74-427b-8fc4-abfb34fb7a8c" data-file-name="app/archives/page.tsx">
                            <span className="text-muted-foreground" data-unique-id="73108fa6-a91f-4acc-99a2-ba9d64c683c8" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="747e5928-a02a-460c-8ac7-d2acd847b671" data-file-name="app/archives/page.tsx">Sheets:</span></span>
                            <span className="font-medium" data-unique-id="dc1d6466-0c2d-4459-b221-64ae28e8ac25" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.metadata.sheets.length}</span>
                          </div>}
                      </div>
                    </div>
                    
                    {selectedArchive.metadata?.sheets && <div className="mt-4" data-unique-id="6c5a1ffa-a798-4f32-8f21-f70249f61585" data-file-name="app/archives/page.tsx">
                        <h4 className="text-sm font-medium mb-2" data-unique-id="476eaeab-1029-4195-9a40-fbf34ca2518c" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="020e8daa-4e0d-4827-aa34-781b53bcdf5d" data-file-name="app/archives/page.tsx">Worksheet Names:</span></h4>
                        <div className="space-y-1" data-unique-id="0aab8d47-a137-45cf-bc34-39d43b8d5337" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                          {selectedArchive.metadata.sheets.map((sheet, index) => <div key={index} className="px-3 py-2 bg-accent/5 rounded-md text-sm" data-unique-id="5827a15c-4701-4e3e-9d2a-a651bbdc00ad" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                              {sheet}
                            </div>)}
                        </div>
                      </div>}
                    
                    <div className="mt-6 pt-6 border-t border-border" data-unique-id="c86c9872-323b-4cb1-b94f-e2e2744459a1" data-file-name="app/archives/page.tsx">
                      <div className="flex justify-between" data-unique-id="2657f6c5-9efb-4131-9ab1-fb9d919a6b4a" data-file-name="app/archives/page.tsx">
                        <button className="px-4 py-2 border border-border rounded-md hover:bg-accent/10 flex items-center" onClick={() => setSelectedArchive(null)} data-unique-id="1c5da57a-6aad-4007-8410-a71f09bc3759" data-file-name="app/archives/page.tsx">
                          <span className="editable-text" data-unique-id="00462768-bdce-4169-b210-385eb97f1433" data-file-name="app/archives/page.tsx">Close</span>
                        </button>
                        
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center" onClick={() => {
                      // Download logic will be handled separately by the component
                      // This just triggers the detail view to download
                      const customEvent = new CustomEvent('download-archive', {
                        detail: selectedArchive
                      });
                      window.dispatchEvent(customEvent);
                    }} data-unique-id="e1a07b2c-f4f5-417b-8ab0-1e989fa7fbdf" data-file-name="app/archives/page.tsx">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          <span className="editable-text" data-unique-id="b8f3951f-78c6-466b-90df-f5ee1cdefec6" data-file-name="app/archives/page.tsx">Download</span>
                        </button>
                      </div>
                    </div>
                  </div> : <div className="text-center py-12 text-muted-foreground" data-unique-id="51be3440-fa62-44eb-b7f6-6c8b93198111" data-file-name="app/archives/page.tsx">
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="mb-2" data-unique-id="2f05b53d-a4af-49a9-8704-8159ad51b8d3" data-file-name="app/archives/page.tsx">
                      <span className="editable-text" data-unique-id="6d2896d8-71f6-42f9-8b71-716d0e8e781f" data-file-name="app/archives/page.tsx">No archive selected</span>
                    </p>
                    <p className="text-sm" data-unique-id="080d9d1d-aff5-4e13-bf4a-90fb6f5bfba6" data-file-name="app/archives/page.tsx">
                      <span className="editable-text" data-unique-id="3e612db2-aabd-4285-afbb-46a290c94b0e" data-file-name="app/archives/page.tsx">Select an archive from the list to view details</span>
                    </p>
                  </div>}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </>;
}