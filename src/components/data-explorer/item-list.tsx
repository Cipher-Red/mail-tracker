'use client';

import { motion } from 'framer-motion';
import { useDataExplorerStore } from '@/lib/data-explorer-store';
import { Calendar, Users, User, ArrowUp, ArrowDown, FileText, BarChart3 } from 'lucide-react';
export default function ItemList() {
  const {
    filteredItems,
    setSelectedItem
  } = useDataExplorerStore();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const getPushPullIcon = (pushPull: string) => {
    return pushPull === 'Push' ? <ArrowUp className="h-4 w-4 text-green-600" /> : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };
  const getPushPullColor = (pushPull: string) => {
    return pushPull === 'Push' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200';
  };
  const getProgressColor = (progress: string) => {
    if (progress === '100%' || progress === 'Completed') {
      return 'bg-green-100 text-green-800';
    } else if (progress === 'On Hold') {
      return 'bg-red-100 text-red-800';
    } else if (progress === 'In Progress' || progress.includes('%')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };
  if (filteredItems.length === 0) {
    return <div className="flex flex-col items-center justify-center p-16 bg-card rounded-lg border border-border" data-unique-id="10b2ce67-2000-44f9-ad71-93973b576895" data-file-name="components/data-explorer/item-list.tsx">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2" data-unique-id="1b3ea20f-a489-4bcf-a105-c0f0f8f37d5c" data-file-name="components/data-explorer/item-list.tsx"><span className="editable-text" data-unique-id="00109c72-3c85-4cef-92df-b91f59f7592b" data-file-name="components/data-explorer/item-list.tsx">No Action Entries Found</span></h3>
        <p className="text-muted-foreground text-center" data-unique-id="9c871465-0a11-434a-b2e5-0a16a23d4e3f" data-file-name="components/data-explorer/item-list.tsx"><span className="editable-text" data-unique-id="353183e1-aa0d-43fe-867d-0b96a4f3a32d" data-file-name="components/data-explorer/item-list.tsx">
          Try adjusting your filters or importing data from an Excel file.
        </span></p>
      </div>;
  }
  return <div className="space-y-4" data-unique-id="226ba8fa-618f-4394-933c-e0e2c151f148" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
      {filteredItems.map((item, index) => <motion.div key={item.id} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: index * 0.05
    }} onClick={() => setSelectedItem(item)} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/30" data-unique-id="7183385b-fe70-48f6-a7ef-dd4695befb3b" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-4" data-unique-id="64c2e247-5da8-469f-8afc-0c2f4993c4ae" data-file-name="components/data-explorer/item-list.tsx">
            <div className="flex items-center space-x-3" data-unique-id="5860fb5e-4539-46a3-a3ca-9e8e88939a8c" data-file-name="components/data-explorer/item-list.tsx">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium" data-unique-id="9c67a696-4e1f-4a9d-8939-d01f6ab334bb" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                {item.customer.charAt(0)}
              </div>
              <div data-unique-id="458614b8-54bf-41bd-a38c-fe506407867e" data-file-name="components/data-explorer/item-list.tsx">
                <h3 className="font-semibold text-lg" data-unique-id="acc41f9e-63dc-4679-ac11-7de6ac08e6a2" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.customer}</h3>
                <div className="flex items-center text-sm text-muted-foreground" data-unique-id="7c0fb0e9-5061-4cb8-971a-c58b548c8026" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                  <Calendar className="h-3 w-3 mr-1" data-unique-id="fffc0adc-03ed-445f-bd83-d92a11f6ce6a" data-file-name="components/data-explorer/item-list.tsx" />
                  {formatDate(item.date)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="3852594a-72e4-4035-81c4-d1ca5916a6ee" data-file-name="components/data-explorer/item-list.tsx">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPushPullColor(item.pushPull)}`} data-unique-id="e17bf926-7f81-4fd5-a4fc-90e308adb7ad" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                {getPushPullIcon(item.pushPull)}
                <span className="ml-1" data-unique-id="a49f9e2a-f338-4ea4-b3ac-2aad00754962" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.pushPull}</span>
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(item.progress)}`} data-unique-id="593bf3ac-f39a-44b1-9c67-29499d642930" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                {item.progress}
              </span>
            </div>
          </div>

          {/* Content Row */}
          <div className="mb-4" data-unique-id="30c17f03-60ec-4bb1-a37a-df523312d803" data-file-name="components/data-explorer/item-list.tsx">
            <p className="text-muted-foreground text-sm line-clamp-2" data-unique-id="5df7131f-271f-4d8c-8142-cf06f62256c0" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.notes}</p>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-sm" data-unique-id="90362346-55f6-432c-9ccd-64cb9847e500" data-file-name="components/data-explorer/item-list.tsx">
            <div className="flex items-center space-x-4" data-unique-id="d3fe1177-079f-4f90-933e-16e1077203df" data-file-name="components/data-explorer/item-list.tsx">
              <div className="flex items-center text-muted-foreground" data-unique-id="57a57ca3-4d29-4a91-ac7e-f88a5e191beb" data-file-name="components/data-explorer/item-list.tsx">
                <Users className="h-4 w-4 mr-1" data-unique-id="1ffdf525-9851-4ac5-bf26-d58752d00675" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true" />
                <span data-unique-id="91d90b44-dc02-47f1-9e0c-4fe77f64e92a" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.team}</span>
              </div>
              <div className="flex items-center text-muted-foreground" data-unique-id="3a0220a7-3eaf-4c3c-aabc-e14bec659991" data-file-name="components/data-explorer/item-list.tsx">
                <User className="h-4 w-4 mr-1" data-unique-id="ca4d7483-dd67-4e90-8e06-cf45d3991398" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true" />
                <span data-unique-id="7ce71eb9-c870-4aca-83bd-a967094bc572" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.owner}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground" data-unique-id="74be0572-382c-4162-8363-83732846cacb" data-file-name="components/data-explorer/item-list.tsx">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full" data-unique-id="561a8277-a21e-4238-80cb-984b79c19a1e" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.type}</span>
            </div>
          </div>
        </motion.div>)}
    </div>;
}