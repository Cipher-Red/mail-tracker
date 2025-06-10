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
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="8076e624-7fd1-4d73-a15a-6cc2596f532d" data-file-name="app/archives/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }} className="container mx-auto" data-unique-id="e967b20b-cd08-40e2-8954-ab0d917f9cd8" data-file-name="app/archives/page.tsx">
          <div className="mb-8" data-unique-id="f02a08fb-cdfc-4466-830e-c66d802e769a" data-file-name="app/archives/page.tsx">
            <h1 className="text-3xl font-bold text-primary mb-2 flex items-center" data-unique-id="16fb36fd-22b8-450c-867e-967fb1315de6" data-file-name="app/archives/page.tsx">
              <Archive className="mr-3 h-7 w-7" />
              <span className="editable-text" data-unique-id="6bfcd584-5a79-4b9a-867a-ac61cef48ffe" data-file-name="app/archives/page.tsx">Excel Sheet & Order Archives</span>
            </h1>
            <p className="text-muted-foreground" data-unique-id="08a9d5e1-1a93-4fd8-9130-08fd18152e3e" data-file-name="app/archives/page.tsx">
              <span className="editable-text" data-unique-id="8d42a83e-4c9a-4394-b9e9-54bdb6d6ac95" data-file-name="app/archives/page.tsx">
                Access, manage and view orders from your previously uploaded Excel sheets
              </span>
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded-lg" data-unique-id="9085a1df-d895-4675-8f28-55007bb3b603" data-file-name="app/archives/page.tsx">
              <div className="flex items-center" data-unique-id="e619c2f4-8416-4cdc-abc4-98dd5e05922e" data-file-name="app/archives/page.tsx">
                <FileSpreadsheet className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <p className="text-blue-700 dark:text-blue-300 text-sm" data-unique-id="5b80b2b6-63c7-4a7d-b586-2556bec63420" data-file-name="app/archives/page.tsx">
                  <span className="font-medium" data-unique-id="15eda3a7-4b10-43fd-a108-0f7c199cfe4a" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="4ee18b85-181d-42a3-9d28-719c7cca6d89" data-file-name="app/archives/page.tsx">New Feature:</span></span><span className="editable-text" data-unique-id="275c0f96-9189-434c-8097-c671dae87589" data-file-name="app/archives/page.tsx"> You can now view orders directly from archived Excel files without re-uploading them.
                </span></p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3" data-unique-id="0aafa438-266f-4db9-a1c3-3d92a05864c8" data-file-name="app/archives/page.tsx">
            <div className="lg:col-span-2" data-unique-id="ccc29abe-8025-44cc-a2c9-bc4d29b22f87" data-file-name="app/archives/page.tsx">
              <ExcelArchivesManager onSelectArchive={setSelectedArchive} />
            </div>
            
            <div className="lg:col-span-1" data-unique-id="66204a8c-5c7e-4505-97ff-34015dd83129" data-file-name="app/archives/page.tsx">
              <motion.div layout className="bg-card rounded-lg shadow-lg border border-border p-6" data-unique-id="b8d8bb3b-3acc-452b-b622-367fa856eeac" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                <h2 className="text-xl font-medium mb-6 flex items-center" data-unique-id="647b699d-0c6c-447c-a4b0-a661a02f87e4" data-file-name="app/archives/page.tsx">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                  <span className="editable-text" data-unique-id="8d79dfb4-bf6e-45b5-94fc-59701c70f500" data-file-name="app/archives/page.tsx">Archive Details</span>
                </h2>
                
                {selectedArchive ? <div className="space-y-4" data-unique-id="838eb641-a504-4bf7-8799-ae960e257749" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                    <div className="p-4 bg-primary/5 rounded-lg border border-border" data-unique-id="651f9e97-761d-4155-81c9-5d9bdedb0a9a" data-file-name="app/archives/page.tsx">
                      <h3 className="font-medium text-lg mb-2" data-unique-id="428bad86-6126-4652-8043-b5beb50206d8" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.fileName}</h3>
                      <div className="space-y-2 text-sm" data-unique-id="45328521-f5ac-4db1-87af-d155140a57bf" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                        <div className="flex justify-between" data-unique-id="b2fb5b38-5f1a-4314-bcd6-aaab929351a4" data-file-name="app/archives/page.tsx">
                          <span className="text-muted-foreground" data-unique-id="e3013368-b74c-4348-990d-4995fe1c9829" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="13cc9d1f-d8e5-448b-ad56-8cdca9854f88" data-file-name="app/archives/page.tsx">Upload Date:</span></span>
                          <span className="font-medium flex items-center" data-unique-id="b0701366-a67e-42c9-bd6d-849387e87f16" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                            <Clock className="h-3.5 w-3.5 mr-1 text-primary" />
                            {new Date(selectedArchive.uploadDate).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between" data-unique-id="b34b5b65-fbeb-4b50-b87e-c6be50cc58d4" data-file-name="app/archives/page.tsx">
                          <span className="text-muted-foreground" data-unique-id="4ea1aebf-0c9c-49b1-b8f5-dd29eaf64ac3" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="d49529f5-c47f-41ad-9339-6150de6d3fd9" data-file-name="app/archives/page.tsx">File Size:</span></span>
                          <span className="font-medium" data-unique-id="0f22e88e-ce58-4b35-9a23-cc444ad0a85d" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{(selectedArchive.fileSize / 1024).toFixed(2)}<span className="editable-text" data-unique-id="844bdd0f-d25b-4162-bf97-848eb13cf7ab" data-file-name="app/archives/page.tsx"> KB</span></span>
                        </div>
                        
                        {selectedArchive.metadata?.rowCount && <div className="flex justify-between" data-unique-id="817497af-d8cf-42d5-a0a7-533ea563c7f0" data-file-name="app/archives/page.tsx">
                            <span className="text-muted-foreground" data-unique-id="ecc9aa99-e251-41fc-bd1e-3ab75ba4059b" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="ec736c48-9232-4bd3-b84d-236fbe1f73a5" data-file-name="app/archives/page.tsx">Rows:</span></span>
                            <span className="font-medium" data-unique-id="ab33e653-e939-4d5b-9bc9-b522f0fc1f1c" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.metadata.rowCount}</span>
                          </div>}
                        
                        {selectedArchive.metadata?.sheets && <div className="flex justify-between" data-unique-id="76bf7d20-ff49-49a9-838f-c809b3c2a1c2" data-file-name="app/archives/page.tsx">
                            <span className="text-muted-foreground" data-unique-id="4acf9af8-23fb-45b0-864b-d4edaecf03a3" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="a993f48a-65b4-46ed-a69e-74bab0c4dbc0" data-file-name="app/archives/page.tsx">Sheets:</span></span>
                            <span className="font-medium" data-unique-id="9ea260e3-db6a-4f69-b6fc-47eef7085148" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.metadata.sheets.length}</span>
                          </div>}
                      </div>
                    </div>
                    
                    {selectedArchive.metadata?.sheets && <div className="mt-4" data-unique-id="33a89817-06fa-4888-a04a-00686e8f84e4" data-file-name="app/archives/page.tsx">
                        <h4 className="text-sm font-medium mb-2" data-unique-id="4610c98f-7dcd-4f0a-aef2-fd8094fb9ecb" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="b3e6a16e-a300-41c9-b66f-b573302d81bf" data-file-name="app/archives/page.tsx">Worksheet Names:</span></h4>
                        <div className="space-y-1" data-unique-id="a7962d63-7715-44b4-a889-adf2a08e376a" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                          {selectedArchive.metadata.sheets.map((sheet, index) => <div key={index} className="px-3 py-2 bg-accent/5 rounded-md text-sm" data-unique-id="a8a8a1e0-4972-4beb-8088-d59205217608" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                              {sheet}
                            </div>)}
                        </div>
                      </div>}
                    
                    <div className="mt-6 pt-6 border-t border-border" data-unique-id="8a638758-ad33-4b6d-9563-fb9d3d3b2d86" data-file-name="app/archives/page.tsx">
                      <div className="flex justify-between" data-unique-id="7dfc4216-82f6-4a5a-9a9d-85a404742a5c" data-file-name="app/archives/page.tsx">
                        <button className="px-4 py-2 border border-border rounded-md hover:bg-accent/10 flex items-center" onClick={() => setSelectedArchive(null)} data-unique-id="d4cabb85-2ad9-45f3-9602-51cdfda4579a" data-file-name="app/archives/page.tsx">
                          <span className="editable-text" data-unique-id="4994757b-a272-403b-9473-5550d8d2d16c" data-file-name="app/archives/page.tsx">Close</span>
                        </button>
                        
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center" onClick={() => {
                      // Download logic will be handled separately by the component
                      // This just triggers the detail view to download
                      const customEvent = new CustomEvent('download-archive', {
                        detail: selectedArchive
                      });
                      window.dispatchEvent(customEvent);
                    }} data-unique-id="f706f8f8-a8e0-47ba-afe3-58396d5c2426" data-file-name="app/archives/page.tsx">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          <span className="editable-text" data-unique-id="09823fbb-28c5-443a-80d4-ab8ca441aa10" data-file-name="app/archives/page.tsx">Download</span>
                        </button>
                      </div>
                    </div>
                  </div> : <div className="text-center py-12 text-muted-foreground" data-unique-id="cb1bebb9-1c36-4dc1-9c02-c152678913fe" data-file-name="app/archives/page.tsx">
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="mb-2" data-unique-id="4bf1efd0-2333-428c-9b83-0f637d3e532f" data-file-name="app/archives/page.tsx">
                      <span className="editable-text" data-unique-id="013b6b09-a6c1-4a90-83e3-b841ec84dcb0" data-file-name="app/archives/page.tsx">No archive selected</span>
                    </p>
                    <p className="text-sm" data-unique-id="a9e4bb9f-3313-40c6-a61f-1845725f8c37" data-file-name="app/archives/page.tsx">
                      <span className="editable-text" data-unique-id="b06edf0a-70b4-4ff0-a93a-1c4bc2a4d756" data-file-name="app/archives/page.tsx">Select an archive from the list to view details</span>
                    </p>
                  </div>}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </>;
}