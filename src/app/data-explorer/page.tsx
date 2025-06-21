'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import FilterPanel from '@/components/data-explorer/filter-panel';
import ItemList from '@/components/data-explorer/item-list';
import ItemDetails from '@/components/data-explorer/item-details';
import ExcelImporter from '@/components/excel-importer';
import DataSummary from '@/components/data-summary';
import { useDataExplorerStore } from '@/lib/data-explorer-store';
import { Filter, ArrowLeft, FileSpreadsheet, BarChart3 } from 'lucide-react';
export default function DataExplorerPage() {
  const {
    selectedItem,
    setSelectedItem,
    filteredItems,
    filterCriteria
  } = useDataExplorerStore();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'summary' | 'import'>('list');
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  if (!isMounted) {
    return null; // Prevent hydration errors
  }
  return <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8" data-unique-id="e5f423eb-be99-4a09-b886-0bcd1fd14ac3" data-file-name="app/data-explorer/page.tsx">
        <div className="container mx-auto max-w-7xl" data-unique-id="11c47d35-8109-4626-8ba3-aa63e185eea8" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
          <div className="flex items-center justify-between mb-8" data-unique-id="55ccb963-d021-44d8-9bd6-6beb1a2c4b61" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
            <div className="flex items-center gap-3" data-unique-id="a65509bc-ca17-48e1-8d83-8f37c2ba9d67" data-file-name="app/data-explorer/page.tsx">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" data-unique-id="655e9051-5c11-43ee-bb92-861fd5518ba0" data-file-name="app/data-explorer/page.tsx">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div data-unique-id="e8787293-5c50-45ad-a42a-72467e58f44f" data-file-name="app/data-explorer/page.tsx">
                <h1 className="text-3xl font-bold text-gray-800" data-unique-id="6264a397-4b29-4b75-b817-4c18e0020ef1" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="ce144e9e-7168-4e52-a076-8e57971b0c94" data-file-name="app/data-explorer/page.tsx">Action Data Explorer</span></h1>
                <p className="text-muted-foreground" data-unique-id="83e91e74-f426-46f3-9c92-06443a30ed48" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="68863a5e-a0ad-40db-9513-a593a133264a" data-file-name="app/data-explorer/page.tsx">Track and analyze customer interactions</span></p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-white rounded-lg shadow-sm border border-border p-1" data-unique-id="f3c8e922-f982-4395-a6e9-103d407dba59" data-file-name="app/data-explorer/page.tsx">
              <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'}`} data-unique-id="3d31c620-1fa9-4358-892b-05c73f8b8997" data-file-name="app/data-explorer/page.tsx">
                <Filter className="h-4 w-4 inline mr-2" /><span className="editable-text" data-unique-id="f557a9c1-1a7c-46ea-bfa1-bb538558a534" data-file-name="app/data-explorer/page.tsx">
                Data View
              </span></button>
              <button onClick={() => setActiveTab('summary')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'summary' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'}`} data-unique-id="0266c204-d8d9-46a5-9092-7e704f17bdca" data-file-name="app/data-explorer/page.tsx">
                <BarChart3 className="h-4 w-4 inline mr-2" /><span className="editable-text" data-unique-id="b9c2a433-dd1f-422d-89c1-90987f5e9560" data-file-name="app/data-explorer/page.tsx">
                Summary
              </span></button>
              <button onClick={() => setActiveTab('import')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'import' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'}`} data-unique-id="e95072d6-f3cc-4c55-aa10-f6cc2581de55" data-file-name="app/data-explorer/page.tsx">
                <FileSpreadsheet className="h-4 w-4 inline mr-2" /><span className="editable-text" data-unique-id="10d69b7c-8c61-45c5-9b93-c7ec0bb586f3" data-file-name="app/data-explorer/page.tsx">
                Import
              </span></button>
            </div>
          </div>

          {activeTab === 'summary' ? <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3
        }} data-unique-id="f90ae9b6-0f06-4228-8622-6338fa0d86e1" data-file-name="app/data-explorer/page.tsx">
              <DataSummary />
            </motion.div> : activeTab === 'import' ? <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3
        }} data-unique-id="2dff6e0d-afb3-4681-bf40-1f6231339042" data-file-name="app/data-explorer/page.tsx">
              <ExcelImporter onImportComplete={() => setActiveTab('list')} />
            </motion.div> : <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-unique-id="6483fa40-0614-4eb7-9350-64f8b927521d" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
              {/* Left side - Filter panel */}
              <div className="lg:col-span-3" data-unique-id="cc736fcc-5366-4e34-8552-843774e15fbf" data-file-name="app/data-explorer/page.tsx">
                <FilterPanel />
              </div>

              {/* Right side - List or details */}
              <div className="lg:col-span-9" data-unique-id="94652dbd-fe99-4fce-98d0-0f5c176eb975" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                {selectedItem ? <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.3
            }} data-unique-id="c295d04f-5772-45d7-944d-e40ec4954379" data-file-name="app/data-explorer/page.tsx">
                    <button onClick={() => setSelectedItem(null)} className="mb-4 flex items-center text-primary hover:underline font-medium" data-unique-id="52921e8c-75db-478a-94bf-23d8bf014394" data-file-name="app/data-explorer/page.tsx">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      <span data-unique-id="2585ba93-ec2c-4923-8fe0-3b690cd296d7" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="3e229169-c67c-4c72-8ed3-d2682289dbfd" data-file-name="app/data-explorer/page.tsx">Back to results</span></span>
                    </button>
                    <ItemDetails item={selectedItem} />
                  </motion.div> : <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.3
            }} data-unique-id="f0375058-4b74-4404-8988-8b79a0bb9ca2" data-file-name="app/data-explorer/page.tsx">
                    <div className="mb-6 p-4 bg-white rounded-lg border border-border shadow-sm" data-unique-id="bac144cf-01e8-4c6b-be06-7046525923c5" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                      <h2 className="text-lg font-semibold text-gray-800" data-unique-id="0517e6b5-c2f1-408e-8d4f-0f92e6dd2ef2" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="09779a60-11b6-4705-a7b5-eb366031ff55" data-file-name="app/data-explorer/page.tsx">Action Entries</span></h2>
                      <p className="text-muted-foreground text-sm" data-unique-id="1a4bf5f0-fbb3-4227-96ba-1075e207c397" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                        {filteredItems.length === 0 ? "No entries match your search criteria. Try adjusting your filters or import data from Excel." : `Showing ${filteredItems.length} ${filteredItems.length === 1 ? 'entry' : 'entries'}`}
                      </p>
                      {Object.keys(filterCriteria).length > 0 && <div className="mt-3 flex flex-wrap gap-1" data-unique-id="633b942e-36a4-4adc-a32c-9bd03c8d84ac" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                          <span className="text-xs text-muted-foreground mr-2" data-unique-id="cfe30524-e051-4282-aae1-45711412ccd3" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="4d7c40cf-4ee4-4145-941a-391f79092c95" data-file-name="app/data-explorer/page.tsx">Active filters:</span></span>
                          {Object.entries(filterCriteria).map(([key, value]) => <span key={key} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium" data-unique-id="9b7bf0d4-8ce6-42f3-8ea2-22570c207f1e" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                              {key}<span className="editable-text" data-unique-id="cd6de858-d494-40f0-bd3b-5e00ab283b18" data-file-name="app/data-explorer/page.tsx">: </span>{value}
                            </span>)}
                        </div>}
                    </div>
                    <ItemList />
                  </motion.div>}
              </div>
            </div>}
        </div>
      </main>
    </>;
}