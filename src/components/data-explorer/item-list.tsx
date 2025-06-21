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
    return <div className="flex flex-col items-center justify-center p-16 bg-card rounded-lg border border-border" data-unique-id="e082b6f7-ed66-4246-9713-bb72e0e4d011" data-file-name="components/data-explorer/item-list.tsx">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2" data-unique-id="d24b6506-4a3c-4910-b922-2cf315fcafbb" data-file-name="components/data-explorer/item-list.tsx"><span className="editable-text" data-unique-id="5b148156-cfe4-4484-b858-8d8f6e072914" data-file-name="components/data-explorer/item-list.tsx">No Action Entries Found</span></h3>
        <p className="text-muted-foreground text-center" data-unique-id="768719ad-7b00-45b8-81a7-1f7d57f5d7dd" data-file-name="components/data-explorer/item-list.tsx"><span className="editable-text" data-unique-id="63225ab2-e8a7-4185-8f73-48738bbfa5ec" data-file-name="components/data-explorer/item-list.tsx">
          Try adjusting your filters or importing data from an Excel file.
        </span></p>
      </div>;
  }
  return <div className="space-y-4" data-unique-id="664ddee6-76be-482b-98e7-52a1db633c81" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
      {filteredItems.map((item, index) => <motion.div key={item.id} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: index * 0.05
    }} onClick={() => setSelectedItem(item)} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/30" data-unique-id="ffcd12f5-275d-4a13-9a88-a1024985daa7" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-4" data-unique-id="f6636d6a-98c6-49ac-a7be-2a965832ee5d" data-file-name="components/data-explorer/item-list.tsx">
            <div className="flex items-center space-x-3" data-unique-id="b4defba9-8bf4-485e-a223-6d06a8764e74" data-file-name="components/data-explorer/item-list.tsx">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium" data-unique-id="9a90aefc-65be-4296-87d0-e72a49dc7396" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                {item.customer.charAt(0)}
              </div>
              <div data-unique-id="b9c71d8f-3f9f-4391-9fc0-959693e8d58c" data-file-name="components/data-explorer/item-list.tsx">
                <h3 className="font-semibold text-lg" data-unique-id="bea2357d-c461-4792-85df-fbad78d56a7c" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.customer}</h3>
                <div className="flex items-center text-sm text-muted-foreground" data-unique-id="ff9acabd-9f2c-4fc4-8969-1a61ea2beb3b" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                  <Calendar className="h-3 w-3 mr-1" data-unique-id="a1f0a791-b09d-46ee-b7c9-a6db5947a636" data-file-name="components/data-explorer/item-list.tsx" />
                  {formatDate(item.date)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="17c402c6-a6f1-42c2-afc6-f0772f8ba1b5" data-file-name="components/data-explorer/item-list.tsx">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPushPullColor(item.pushPull)}`} data-unique-id="299740ed-8386-4dec-bff0-3caacffb160c" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                {getPushPullIcon(item.pushPull)}
                <span className="ml-1" data-unique-id="36e8b8c1-d97e-4cc5-9111-27c57ba87917" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.pushPull}</span>
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(item.progress)}`} data-unique-id="1027ab65-c83c-4d88-acd6-304c1ec4ed98" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">
                {item.progress}
              </span>
            </div>
          </div>

          {/* Content Row */}
          <div className="mb-4" data-unique-id="f8878fa4-0fdb-4b80-b174-e0e61267a9d4" data-file-name="components/data-explorer/item-list.tsx">
            <p className="text-muted-foreground text-sm line-clamp-2" data-unique-id="ba11f168-c75f-485d-aef1-b2ed79f426ea" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.notes}</p>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-sm" data-unique-id="daf78554-c824-438a-a7db-adfe32a17869" data-file-name="components/data-explorer/item-list.tsx">
            <div className="flex items-center space-x-4" data-unique-id="7faeae43-dc6c-4fc6-8213-444f83dfe8c4" data-file-name="components/data-explorer/item-list.tsx">
              <div className="flex items-center text-muted-foreground" data-unique-id="f19883d1-6e8f-4218-be09-b0a901c6dc79" data-file-name="components/data-explorer/item-list.tsx">
                <Users className="h-4 w-4 mr-1" data-unique-id="28a1a5e3-92f8-4626-9ca7-ba4678f097c8" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true" />
                <span data-unique-id="83adc00f-d0b8-41d0-9621-7e080b612a74" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.team}</span>
              </div>
              <div className="flex items-center text-muted-foreground" data-unique-id="fd71382e-3cd4-459a-82a2-13f29dcc42e8" data-file-name="components/data-explorer/item-list.tsx">
                <User className="h-4 w-4 mr-1" data-unique-id="fd6d58fd-9f8c-448c-885c-d019e8ef7562" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true" />
                <span data-unique-id="e8ccabb8-72cb-4cf1-9575-c63886677f24" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.owner}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground" data-unique-id="09935f97-c126-41c7-bb88-51b57bd7489c" data-file-name="components/data-explorer/item-list.tsx">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full" data-unique-id="76076389-d616-4d2b-8749-cdfe4a88b202" data-file-name="components/data-explorer/item-list.tsx" data-dynamic-text="true">{item.type}</span>
            </div>
          </div>
        </motion.div>)}
    </div>;
}