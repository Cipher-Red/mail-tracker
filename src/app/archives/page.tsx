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
      <main className="min-h-screen bg-background p-4 md:p-8" data-unique-id="889c9269-74eb-49c6-b579-e0e49a3aa90b" data-file-name="app/archives/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }} className="container mx-auto" data-unique-id="f9c52673-0568-4b35-8e7f-80f52b18f121" data-file-name="app/archives/page.tsx">
          <div className="mb-8" data-unique-id="bb18d34a-c283-41b5-91e8-e8c3bc4ccac1" data-file-name="app/archives/page.tsx">
            <h1 className="text-3xl font-bold text-primary mb-2 flex items-center" data-unique-id="42ea2082-cb18-4825-80e2-5debfe94e297" data-file-name="app/archives/page.tsx">
              <Archive className="mr-3 h-7 w-7" />
              <span className="editable-text" data-unique-id="204538bd-2d4c-43b1-9cfc-844554a16e21" data-file-name="app/archives/page.tsx">Excel Sheet Archives</span>
            </h1>
            <p className="text-muted-foreground" data-unique-id="1b985b8b-02fb-41a0-b5e6-cbece6dc6f40" data-file-name="app/archives/page.tsx">
              <span className="editable-text" data-unique-id="f061d4e3-a547-4806-94b3-e52bfed13a86" data-file-name="app/archives/page.tsx">
                Access, manage and restore your previously uploaded Excel sheets
              </span>
            </p>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3" data-unique-id="789f7f0c-6c14-430f-a201-74244f100045" data-file-name="app/archives/page.tsx">
            <div className="lg:col-span-2" data-unique-id="ab36c793-1831-4ff5-878e-65eecee29297" data-file-name="app/archives/page.tsx">
              <ExcelArchivesManager onSelectArchive={setSelectedArchive} />
            </div>
            
            <div className="lg:col-span-1" data-unique-id="113c9227-2ded-44ff-9a65-7ba5799be66a" data-file-name="app/archives/page.tsx">
              <motion.div layout className="bg-card rounded-lg shadow-lg border border-border p-6" data-unique-id="9b15dae5-f3f1-4d7f-9172-da6bdd4404f7" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                <h2 className="text-xl font-medium mb-6 flex items-center" data-unique-id="dc7fbd18-963e-421d-9a44-d6866a421979" data-file-name="app/archives/page.tsx">
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                  <span className="editable-text" data-unique-id="807e058a-7e29-450c-986b-cec7eea8f40e" data-file-name="app/archives/page.tsx">Archive Details</span>
                </h2>
                
                {selectedArchive ? <div className="space-y-4" data-unique-id="04779352-db97-4727-8734-1080a68c462e" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                    <div className="p-4 bg-primary/5 rounded-lg border border-border" data-unique-id="3cae45c6-3948-4fcf-a447-20fd72aba6b6" data-file-name="app/archives/page.tsx">
                      <h3 className="font-medium text-lg mb-2" data-unique-id="1a6963e7-d8ff-45e9-b1aa-be0e53244039" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.fileName}</h3>
                      <div className="space-y-2 text-sm" data-unique-id="9c0ff488-b11b-4898-8248-0387ff7696d5" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                        <div className="flex justify-between" data-unique-id="2ea6235a-82ac-4566-9d33-8e766ac1d52f" data-file-name="app/archives/page.tsx">
                          <span className="text-muted-foreground" data-unique-id="7fb56d8b-b1c9-40e7-95f6-6072a7965389" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="077cd2c4-c57c-4ad7-b4bf-12ff1253504b" data-file-name="app/archives/page.tsx">Upload Date:</span></span>
                          <span className="font-medium flex items-center" data-unique-id="301e8582-fe1a-4ee7-9b50-e5f96c38ba9b" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                            <Clock className="h-3.5 w-3.5 mr-1 text-primary" />
                            {new Date(selectedArchive.uploadDate).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between" data-unique-id="79f07e4b-3aff-4c5d-9485-1c5efe6ad65f" data-file-name="app/archives/page.tsx">
                          <span className="text-muted-foreground" data-unique-id="1b4199fd-160c-42f8-93ce-0347f3393414" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="813a8cbb-49ed-493f-be15-65c4d7abeea0" data-file-name="app/archives/page.tsx">File Size:</span></span>
                          <span className="font-medium" data-unique-id="eb387d07-356c-42e0-962b-d085ce499c6f" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{(selectedArchive.fileSize / 1024).toFixed(2)}<span className="editable-text" data-unique-id="0e64990f-84e1-40f6-af7b-5ef4cdb051f7" data-file-name="app/archives/page.tsx"> KB</span></span>
                        </div>
                        
                        {selectedArchive.metadata?.rowCount && <div className="flex justify-between" data-unique-id="7a48330a-c518-4455-9803-a519f1398012" data-file-name="app/archives/page.tsx">
                            <span className="text-muted-foreground" data-unique-id="c1064b79-ab60-467d-9c48-e6d97207fbeb" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="89da86ca-1b7f-4924-b8f2-81f1589d5996" data-file-name="app/archives/page.tsx">Rows:</span></span>
                            <span className="font-medium" data-unique-id="01d0bf38-14c9-4ca0-a9d5-da53c38be121" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.metadata.rowCount}</span>
                          </div>}
                        
                        {selectedArchive.metadata?.sheets && <div className="flex justify-between" data-unique-id="1bad645c-0a3f-4632-82d2-a89f92042793" data-file-name="app/archives/page.tsx">
                            <span className="text-muted-foreground" data-unique-id="78599a99-a598-4778-a50a-60d7c1a4fcf5" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="fef184be-2734-4589-9117-b82d30a3bb19" data-file-name="app/archives/page.tsx">Sheets:</span></span>
                            <span className="font-medium" data-unique-id="de2af6bf-4375-4c77-9121-077b072cf8ea" data-file-name="app/archives/page.tsx" data-dynamic-text="true">{selectedArchive.metadata.sheets.length}</span>
                          </div>}
                      </div>
                    </div>
                    
                    {selectedArchive.metadata?.sheets && <div className="mt-4" data-unique-id="3f6f0cbd-d07a-45aa-8e34-07d06a160911" data-file-name="app/archives/page.tsx">
                        <h4 className="text-sm font-medium mb-2" data-unique-id="af83bbfc-3974-41ba-a2e8-3056752690c6" data-file-name="app/archives/page.tsx"><span className="editable-text" data-unique-id="83178001-2139-4996-b794-029fc3d62780" data-file-name="app/archives/page.tsx">Worksheet Names:</span></h4>
                        <div className="space-y-1" data-unique-id="41957f80-4c30-4582-96cd-ee9ebfcacacf" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                          {selectedArchive.metadata.sheets.map((sheet, index) => <div key={index} className="px-3 py-2 bg-accent/5 rounded-md text-sm" data-unique-id="2f62d2f8-3e57-44d5-966b-bbb76a15aab7" data-file-name="app/archives/page.tsx" data-dynamic-text="true">
                              {sheet}
                            </div>)}
                        </div>
                      </div>}
                    
                    <div className="mt-6 pt-6 border-t border-border" data-unique-id="e95d3cdd-2806-4909-bd07-c4668d26c4c1" data-file-name="app/archives/page.tsx">
                      <div className="flex justify-between" data-unique-id="915e9773-afa4-442d-bbb8-19a1cfe16070" data-file-name="app/archives/page.tsx">
                        <button className="px-4 py-2 border border-border rounded-md hover:bg-accent/10 flex items-center" onClick={() => setSelectedArchive(null)} data-unique-id="faa78683-f91f-4978-8a25-a9675f392724" data-file-name="app/archives/page.tsx">
                          <span className="editable-text" data-unique-id="4a68f638-a929-4afc-983c-1f493c8f67fa" data-file-name="app/archives/page.tsx">Close</span>
                        </button>
                        
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center" onClick={() => {
                      // Download logic will be handled separately by the component
                      // This just triggers the detail view to download
                      const customEvent = new CustomEvent('download-archive', {
                        detail: selectedArchive
                      });
                      window.dispatchEvent(customEvent);
                    }} data-unique-id="44f3cd37-96ca-4a09-ab76-e13df644ee74" data-file-name="app/archives/page.tsx">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          <span className="editable-text" data-unique-id="a8abc100-f125-4587-a595-a9e1de635cf9" data-file-name="app/archives/page.tsx">Download</span>
                        </button>
                      </div>
                    </div>
                  </div> : <div className="text-center py-12 text-muted-foreground" data-unique-id="3fc2ea16-06e9-4abe-86fd-3105bd70cdde" data-file-name="app/archives/page.tsx">
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="mb-2" data-unique-id="3fa5008d-6feb-4bfa-84f7-6836d786e40b" data-file-name="app/archives/page.tsx">
                      <span className="editable-text" data-unique-id="54062040-8880-48cc-b323-2cb22f31e629" data-file-name="app/archives/page.tsx">No archive selected</span>
                    </p>
                    <p className="text-sm" data-unique-id="7c888fce-bd7c-4822-896c-5cfed491e486" data-file-name="app/archives/page.tsx">
                      <span className="editable-text" data-unique-id="7b6621bd-5707-4db3-a0f0-1bc23f6712e1" data-file-name="app/archives/page.tsx">Select an archive from the list to view details</span>
                    </p>
                  </div>}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </>;
}