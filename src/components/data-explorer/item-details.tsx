'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, User, FileText, ArrowUp, ArrowDown, Tag, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { useState } from 'react';

// Define the action entry type based on our data structure
interface ActionEntry {
  id: string;
  date: string;
  orderId: string;
  parts: string;
  sku: string;
  trackingNumber: string;
  pushPull: 'Push' | 'Pull';
  agentName: string;
  whAction: string;
  notes: string;
  urgent: boolean;
  createdAt: string;
  // Legacy fields for backward compatibility
  customer?: string;
  team?: string;
  owner?: string;
  progress?: string;
  type?: string;
}
interface ItemDetailsProps {
  item: ActionEntry;
}
export default function ItemDetails({
  item
}: ItemDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the item exists (error handling)
  if (!item) {
    return <div className="flex flex-col items-center justify-center p-16 bg-card rounded-lg border border-border" data-unique-id="f060d27a-095e-4927-99a0-58a5f6a5ec5b" data-file-name="components/data-explorer/item-details.tsx">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-xl font-medium mb-2" data-unique-id="5a9d77f9-585f-466a-aaa1-9f477aa30910" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="0b2e4d60-cc79-40b0-ae1c-c5fc2b3deef6" data-file-name="components/data-explorer/item-details.tsx">Action Entry Not Found</span></h3>
        <p className="text-muted-foreground" data-unique-id="4d5bbc1e-df72-4118-8b48-7a103507b100" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="b6e1c6f6-552a-43d5-829a-b3df4d8f15f8" data-file-name="components/data-explorer/item-details.tsx">
          The requested action entry could not be found or is no longer available.
        </span></p>
      </div>;
  }

  // Simulate an action on the item (e.g., updating status, adding follow-up)
  const handleItemAction = async () => {
    setIsLoading(true);
    setError(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Success state - would normally update something in the store
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process the action. Please try again.');
      setIsLoading(false);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getPushPullIcon = (pushPull: string) => {
    return pushPull === 'Push' ? <ArrowUp className="h-5 w-5 text-green-600" /> : <ArrowDown className="h-5 w-5 text-blue-600" />;
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
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="bg-card border border-border rounded-lg shadow-md overflow-hidden" data-unique-id="0b2f971a-4c09-4185-86d7-33d4e42184ee" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50" data-unique-id="431fc643-1e07-4301-afbb-b0dcf06eb52a" data-file-name="components/data-explorer/item-details.tsx">
        <div className="flex justify-between items-start" data-unique-id="73a04fb0-4cb2-4b33-93b0-ebd115c4c73b" data-file-name="components/data-explorer/item-details.tsx">
          <div className="flex items-center space-x-4" data-unique-id="617d31c4-dd08-4100-b966-6071141b6c74" data-file-name="components/data-explorer/item-details.tsx">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl" data-unique-id="9aa37f92-bc46-46f8-94c6-96b71e28e5ee" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {(item.customer || item.agentName || 'U').charAt(0)}
            </div>
            <div data-unique-id="40da1f98-fa68-4a8d-96e5-e3a6427e1e38" data-file-name="components/data-explorer/item-details.tsx">
              <h2 className="text-2xl font-semibold text-gray-800" data-unique-id="6d8d2384-7a27-4721-b885-bb92d83d1dc0" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.customer || item.agentName || 'Unknown'}</h2>
              <p className="text-muted-foreground text-sm mt-1" data-unique-id="47d1e14d-cbe5-42fb-87dd-8484be46281f" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="46b54fe6-d5ef-451b-8b63-f5f090881ab0" data-file-name="components/data-explorer/item-details.tsx">Entry ID: </span>{item.id.substring(0, 8)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2" data-unique-id="8313e400-402c-4d0d-a7dd-ddd40a5f66a6" data-file-name="components/data-explorer/item-details.tsx">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPushPullColor(item.pushPull)}`} data-unique-id="26bff728-b165-4290-ac75-ba7acf4e143d" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {getPushPullIcon(item.pushPull)}
              <span className="ml-2" data-unique-id="4264bcb2-aef4-4db6-9c67-42021382c884" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.pushPull}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProgressColor(item.progress)}`} data-unique-id="1df24336-7df4-4976-a8ba-eb8e30122a98" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {item.progress}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6" data-unique-id="d8dc70f5-b235-4f5e-8eb3-00b1e4c9bc03" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
        {/* Left Column - Main Content */}
        <div className="md:col-span-8 space-y-6" data-unique-id="1cd70008-361a-4027-a056-6ddf9b87ae6a" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
          <div data-unique-id="9f32d43a-4134-4cae-83d9-e31ba8e8c1ac" data-file-name="components/data-explorer/item-details.tsx">
            <h3 className="font-medium mb-3 flex items-center" data-unique-id="55a89c1b-bc20-4dfa-9cd3-eeb92516be96" data-file-name="components/data-explorer/item-details.tsx">
              <FileText className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="81065108-6a3f-4e6c-9b0e-d76dc5095eda" data-file-name="components/data-explorer/item-details.tsx">
              Notes & Details
            </span></h3>
            <div className="bg-gray-50 p-4 rounded-lg border" data-unique-id="4e9a91e8-f805-4034-9e00-ac2a7504f495" data-file-name="components/data-explorer/item-details.tsx">
              <p className="text-gray-700 leading-relaxed" data-unique-id="289782fe-7072-4ccb-86ca-b8c9df8faa3f" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.notes}</p>
            </div>
          </div>
          
          {/* Timeline visualization could go here */}
          <div className="border-t border-border pt-6" data-unique-id="d0cfc446-a935-4985-871c-f4b9480adbd3" data-file-name="components/data-explorer/item-details.tsx">
            <h3 className="font-medium mb-3 flex items-center" data-unique-id="794fad5a-9b03-40c7-8ee9-cf66316a89f4" data-file-name="components/data-explorer/item-details.tsx">
              <BarChart3 className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="10ee89bb-ba65-4cda-9d48-8d212a1b1f7f" data-file-name="components/data-explorer/item-details.tsx">
              Activity Timeline
            </span></h3>
            <div className="h-32 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg flex items-center justify-center text-muted-foreground text-sm border" data-unique-id="570bc882-7dea-4766-a695-df650c1e797e" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="cace6d4c-b72a-40d9-aa5f-9880c232eb54" data-file-name="components/data-explorer/item-details.tsx">
              Activity timeline and progress tracking would appear here
            </span></div>
          </div>
        </div>
        
        {/* Right Column - Details */}
        <div className="md:col-span-4 space-y-4" data-unique-id="8c2dfe20-58cc-45b1-aa5b-93ef349969c4" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
          <div className="bg-accent/10 p-4 rounded-lg border" data-unique-id="52889b0d-0e62-4366-9fb0-a1a3dc8f2824" data-file-name="components/data-explorer/item-details.tsx">
            <h3 className="font-medium mb-4" data-unique-id="f4fdf95c-611c-4aa1-a352-fe0debc9869c" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="c2ea0b03-961e-44d6-8371-0e25f6b88883" data-file-name="components/data-explorer/item-details.tsx">Action Details</span></h3>
            
            <div className="space-y-4" data-unique-id="00fd758c-1ddf-4985-be7b-6ea9f52160cf" data-file-name="components/data-explorer/item-details.tsx">
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="b3514799-93b6-48ac-bfbd-906844e3d7a3" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="2a9ca8b7-1383-4793-a2a7-4c9ba73eeeb0" data-file-name="components/data-explorer/item-details.tsx">
                  <Calendar className="h-4 w-4 mr-2" data-unique-id="218e101c-942e-4e9c-9f2e-8b647b07690a" data-file-name="components/data-explorer/item-details.tsx" />
                  <span data-unique-id="805fac91-3c0e-44a0-ab21-0048e30db6ef" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="769fc28d-aa04-452d-a315-ee718ba23bb5" data-file-name="components/data-explorer/item-details.tsx">Date</span></span>
                </div>
                <span className="font-medium text-right text-sm" data-unique-id="0a11dd4c-aca8-4779-9e6b-eaecca595d2d" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{formatDate(item.date)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="5dd04a30-5964-46fe-a2bd-2a5598353aa6" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="17ffeb20-01ea-41d5-9178-da13ffcc401b" data-file-name="components/data-explorer/item-details.tsx">
                  <Users className="h-4 w-4 mr-2" />
                  <span data-unique-id="530c3f85-f3b6-4396-8bf4-66820402715c" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="f2f9c52c-d117-4b20-b11e-149efd2f42ec" data-file-name="components/data-explorer/item-details.tsx">Team</span></span>
                </div>
                <span className="font-medium" data-unique-id="76f5bc87-dfed-4bc8-b714-03feb20758e2" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.team}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="75d5e522-2fa5-432b-b27c-4ad991cc0bb8" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="100ef24a-bbc6-44a1-9965-3cba926c817f" data-file-name="components/data-explorer/item-details.tsx">
                  <User className="h-4 w-4 mr-2" />
                  <span data-unique-id="a98910cb-32a2-4a3c-a832-6d7e554a417b" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="6e860869-90ea-47e1-bbaa-6402abb7b9f8" data-file-name="components/data-explorer/item-details.tsx">Owner</span></span>
                </div>
                <span className="font-medium" data-unique-id="ec8f2dd5-bfd7-49e5-9f8a-00c15406ed82" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.owner}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="4ffee8b8-d24b-4682-8491-3d68a9bcaeb6" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="eed6ed9b-2661-4d88-89b3-74e2b1c64daf" data-file-name="components/data-explorer/item-details.tsx">
                  <Tag className="h-4 w-4 mr-2" />
                  <span data-unique-id="afd182de-852b-44a1-8c91-41e95789d35b" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="ff9fa289-55c3-4ca8-988d-b330b51c5a39" data-file-name="components/data-explorer/item-details.tsx">Type</span></span>
                </div>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium" data-unique-id="750ae0e6-3514-4ed2-87c5-be1db10a5b0f" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.type}</span>
              </div>
              
              <div className="flex items-center justify-between py-2" data-unique-id="9d8b8ff9-8bda-4702-9286-d2a441910b56" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="91a18927-0f4e-4284-8f62-77cd9db8f532" data-file-name="components/data-explorer/item-details.tsx">
                  <Clock className="h-4 w-4 mr-2" />
                  <span data-unique-id="f4aa256a-db63-435c-998d-29b51a2ba5fb" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="12af84bb-778c-460d-8b5c-6788c309ee73" data-file-name="components/data-explorer/item-details.tsx">Added</span></span>
                </div>
                <span className="text-sm text-muted-foreground" data-unique-id="ce717b6e-081a-407c-873b-8b23ff6a69cf" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-2" data-unique-id="0a8f8450-5852-4234-afe8-736783ffcdb6" data-file-name="components/data-explorer/item-details.tsx">
            <button onClick={handleItemAction} disabled={isLoading} className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center" data-unique-id="f5a991d5-9a2f-4bdb-b16b-126b824f6f0b" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {isLoading ? <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" data-unique-id="83098ba9-40fe-48c4-98db-8384a0e48341" data-file-name="components/data-explorer/item-details.tsx" />
                  Processing...
                </> : 'Add Follow-up'}
            </button>
            
            <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-200" data-unique-id="1c3cfb1e-11c4-4dd2-87b2-b7f1f5881000" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="f80cac6a-9653-4316-ad8b-0ada50a5b9f7" data-file-name="components/data-explorer/item-details.tsx">
              Export Details
            </span></button>
          </div>
          
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-unique-id="96c4d349-993b-494b-b546-f33900b018ad" data-file-name="components/data-explorer/item-details.tsx">
              <p className="text-sm text-red-700" data-unique-id="e7b1ca4d-b371-48dd-a8d9-871300fc631e" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{error}</p>
            </div>}
        </div>
      </div>
    </motion.div>;
}