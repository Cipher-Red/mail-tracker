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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8" data-unique-id="88f76340-5e70-4b30-9937-810732e992cf" data-file-name="app/data-explorer/page.tsx">
        <div className="container mx-auto max-w-7xl" data-unique-id="88c82ec1-cf80-4a5f-9bc8-7f820f5947d1" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
          <div className="flex items-center justify-between mb-8" data-unique-id="f79cbb88-5eb7-4238-9565-3a91bb5864c6" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
            <div className="flex items-center gap-3" data-unique-id="203fbaf3-7a8d-48f0-ad5b-a350ad59fcbd" data-file-name="app/data-explorer/page.tsx">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" data-unique-id="efbc1b32-0227-446a-91ff-8d537fb1f0e3" data-file-name="app/data-explorer/page.tsx">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div data-unique-id="cc79cc31-63a1-4bbf-a58a-e528743d7b49" data-file-name="app/data-explorer/page.tsx">
                <h1 className="text-3xl font-bold text-gray-800" data-unique-id="781eb1f7-1f81-4088-a3be-17c04345fb3d" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="32c27161-7299-44fd-a528-711bd8138caa" data-file-name="app/data-explorer/page.tsx">Action Data Explorer</span></h1>
                <p className="text-muted-foreground" data-unique-id="ed58b6d8-9a95-49d1-9b0c-717a333dc06a" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="549c2938-7866-40cf-b452-33fb6bdf75d2" data-file-name="app/data-explorer/page.tsx">Track and analyze customer interactions</span></p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-white rounded-lg shadow-sm border border-border p-1" data-unique-id="678ce983-e01a-44f1-9464-7ea55a2e6200" data-file-name="app/data-explorer/page.tsx">
              <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'}`} data-unique-id="872bc920-b0db-4828-88a5-43f6bdc69cf5" data-file-name="app/data-explorer/page.tsx">
                <Filter className="h-4 w-4 inline mr-2" /><span className="editable-text" data-unique-id="01a7ee12-6ed6-49e6-b432-4c42a9008856" data-file-name="app/data-explorer/page.tsx">
                Data View
              </span></button>
              <button onClick={() => setActiveTab('summary')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'summary' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'}`} data-unique-id="c2bd29c3-dfe4-4cb9-8436-263d991af983" data-file-name="app/data-explorer/page.tsx">
                <BarChart3 className="h-4 w-4 inline mr-2" /><span className="editable-text" data-unique-id="8aee3476-ae23-4458-9b79-f6c2b727a8d5" data-file-name="app/data-explorer/page.tsx">
                Summary
              </span></button>
              <button onClick={() => setActiveTab('import')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'import' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'}`} data-unique-id="025c37e1-0865-4402-87d0-bf5c61cc4152" data-file-name="app/data-explorer/page.tsx">
                <FileSpreadsheet className="h-4 w-4 inline mr-2" /><span className="editable-text" data-unique-id="8573285c-be46-41f8-908d-96c912c54eb8" data-file-name="app/data-explorer/page.tsx">
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
        }} data-unique-id="f39ef619-43bd-42c1-b3aa-946e06ad4560" data-file-name="app/data-explorer/page.tsx">
              <DataSummary />
            </motion.div> : activeTab === 'import' ? <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3
        }} data-unique-id="bc99d57c-b2f1-42e6-8c1c-d9d81d8021d7" data-file-name="app/data-explorer/page.tsx">
              <ExcelImporter onImportComplete={() => setActiveTab('list')} />
            </motion.div> : <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-unique-id="8be670e7-43e3-4a72-a89e-b0772e582db3" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
              {/* Left side - Filter panel */}
              <div className="lg:col-span-3" data-unique-id="ec0a736a-bdb3-456e-bba1-c349aa9c0534" data-file-name="app/data-explorer/page.tsx">
                <FilterPanel />
              </div>

              {/* Right side - List or details */}
              <div className="lg:col-span-9" data-unique-id="8f2ed1bb-86bb-4140-9342-4538805840bf" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
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
            }} data-unique-id="dc300999-42f7-4e01-88cb-ef1af42d99d4" data-file-name="app/data-explorer/page.tsx">
                    <button onClick={() => setSelectedItem(null)} className="mb-4 flex items-center text-primary hover:underline font-medium" data-unique-id="10799ab8-e02c-4626-9edf-8436e90155f1" data-file-name="app/data-explorer/page.tsx">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      <span data-unique-id="8d121837-b7a0-490e-9ca9-fc089bd45b78" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="245ac20d-9eeb-4026-a81a-719ed116150a" data-file-name="app/data-explorer/page.tsx">Back to results</span></span>
                    </button>
                    <ItemDetails item={selectedItem} />
                  </motion.div> : <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.3
            }} data-unique-id="b5bc9921-bb60-44ab-bc9f-ce7572ee3577" data-file-name="app/data-explorer/page.tsx">
                    <div className="mb-6 p-4 bg-white rounded-lg border border-border shadow-sm" data-unique-id="3f1fa602-be7b-48f3-bc92-fd2c484ed8a4" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                      <h2 className="text-lg font-semibold text-gray-800" data-unique-id="184c5334-ad38-4519-91ff-22d13d5f2d6f" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="0e490d6a-85ed-40d5-8815-d90c79058df0" data-file-name="app/data-explorer/page.tsx">Action Entries</span></h2>
                      <p className="text-muted-foreground text-sm" data-unique-id="a908cc6e-18eb-4bcd-99cc-fde363670f03" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                        {filteredItems.length === 0 ? "No entries match your search criteria. Try adjusting your filters or import data from Excel." : `Showing ${filteredItems.length} ${filteredItems.length === 1 ? 'entry' : 'entries'}`}
                      </p>
                      {Object.keys(filterCriteria).length > 0 && <div className="mt-3 flex flex-wrap gap-1" data-unique-id="83b8e416-772c-4a8c-bf1c-c86bb5a11115" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                          <span className="text-xs text-muted-foreground mr-2" data-unique-id="55c507f9-1007-4671-8e21-b1bdf425847b" data-file-name="app/data-explorer/page.tsx"><span className="editable-text" data-unique-id="ddce427e-2bae-4770-bd17-6a5cd508d2a4" data-file-name="app/data-explorer/page.tsx">Active filters:</span></span>
                          {Object.entries(filterCriteria).map(([key, value]) => <span key={key} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium" data-unique-id="a67a1791-676f-47be-921b-bca7d76fa277" data-file-name="app/data-explorer/page.tsx" data-dynamic-text="true">
                              {key}<span className="editable-text" data-unique-id="41dc7cd1-e2c0-4d47-9f8b-d41e5f00e939" data-file-name="app/data-explorer/page.tsx">: </span>{value}
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