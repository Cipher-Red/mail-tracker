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
    return <div className="flex flex-col items-center justify-center p-16 bg-card rounded-lg border border-border" data-unique-id="f4089214-5f3a-4e35-9c6c-8d8c639c62fd" data-file-name="components/data-explorer/item-details.tsx">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-xl font-medium mb-2" data-unique-id="be43eaa3-8773-4232-90d4-4b22ffe5ccfc" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="74a1fe74-b364-407b-b811-0a0d5b21f9d7" data-file-name="components/data-explorer/item-details.tsx">Action Entry Not Found</span></h3>
        <p className="text-muted-foreground" data-unique-id="f877b983-b37f-4538-977b-820d92ae6e1e" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="45f57a07-6da3-4ece-94bf-e8de812ca075" data-file-name="components/data-explorer/item-details.tsx">
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
  }} className="bg-card border border-border rounded-lg shadow-md overflow-hidden" data-unique-id="52523e16-ce29-4ffe-a2b1-a7d6a2c01043" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50" data-unique-id="7fac7d75-8036-4d3a-8d19-56e2e6a7ce4c" data-file-name="components/data-explorer/item-details.tsx">
        <div className="flex justify-between items-start" data-unique-id="55ecb225-ea73-406a-9cf7-0fddad61e7d2" data-file-name="components/data-explorer/item-details.tsx">
          <div className="flex items-center space-x-4" data-unique-id="acb38855-b0e6-4624-b5b5-5ecffda9ca43" data-file-name="components/data-explorer/item-details.tsx">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl" data-unique-id="f808d19d-204a-452d-a3e0-953be1cb6e63" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {(item.customer || item.agentName || 'U').charAt(0)}
            </div>
            <div data-unique-id="05cab992-70ad-485d-9825-3b46e60e82fb" data-file-name="components/data-explorer/item-details.tsx">
              <h2 className="text-2xl font-semibold text-gray-800" data-unique-id="8d6a100b-9950-4692-aa5a-1bb894230999" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.customer || item.agentName || 'Unknown'}</h2>
              <p className="text-muted-foreground text-sm mt-1" data-unique-id="3ed3a00c-85f3-4049-8c27-846790bd411f" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="23fba3df-1f00-4b57-ad8c-4e840df974d2" data-file-name="components/data-explorer/item-details.tsx">Entry ID: </span>{item.id.substring(0, 8)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2" data-unique-id="8788dbae-2e71-4119-8e8a-9529c4c75e7b" data-file-name="components/data-explorer/item-details.tsx">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPushPullColor(item.pushPull)}`} data-unique-id="04378b63-c2db-4f04-92b4-08e57546dba6" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {getPushPullIcon(item.pushPull)}
              <span className="ml-2" data-unique-id="d5929f21-36cf-4402-b93a-2a47e1758320" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.pushPull}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProgressColor(item.progress)}`} data-unique-id="ddb6c217-f1b6-4e69-b5c7-b452b55e53d9" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {item.progress}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6" data-unique-id="4748eace-aa83-4eae-870d-96371d4eea5f" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
        {/* Left Column - Main Content */}
        <div className="md:col-span-8 space-y-6" data-unique-id="d729f95a-f27d-4649-91ee-dc6c1200c4b6" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
          <div data-unique-id="7a77b848-14b6-4f5c-a2b9-7b77ee47681f" data-file-name="components/data-explorer/item-details.tsx">
            <h3 className="font-medium mb-3 flex items-center" data-unique-id="1b3d25ea-cdd1-46a0-8b16-41c836003f08" data-file-name="components/data-explorer/item-details.tsx">
              <FileText className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="67fa38b3-499b-4840-bef3-47b9401bd850" data-file-name="components/data-explorer/item-details.tsx">
              Notes & Details
            </span></h3>
            <div className="bg-gray-50 p-4 rounded-lg border" data-unique-id="b590bf13-84fc-4e3b-ac53-b9901e10ccaa" data-file-name="components/data-explorer/item-details.tsx">
              <p className="text-gray-700 leading-relaxed" data-unique-id="8db4f05a-24fa-42a0-9e3c-01e1e4982773" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.notes}</p>
            </div>
          </div>
          
          {/* Timeline visualization could go here */}
          <div className="border-t border-border pt-6" data-unique-id="5597a4d2-99a4-4a12-9a7a-32704bcd849a" data-file-name="components/data-explorer/item-details.tsx">
            <h3 className="font-medium mb-3 flex items-center" data-unique-id="125a18bf-5ec9-482a-8b72-68a176ac1213" data-file-name="components/data-explorer/item-details.tsx">
              <BarChart3 className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="60a7b6c1-b78e-4c2d-9be8-00bb2ed907cb" data-file-name="components/data-explorer/item-details.tsx">
              Activity Timeline
            </span></h3>
            <div className="h-32 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg flex items-center justify-center text-muted-foreground text-sm border" data-unique-id="19084889-8e03-48c4-a486-5597a24efba6" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="1e9187a9-f16f-4e24-9794-3ac364e33321" data-file-name="components/data-explorer/item-details.tsx">
              Activity timeline and progress tracking would appear here
            </span></div>
          </div>
        </div>
        
        {/* Right Column - Details */}
        <div className="md:col-span-4 space-y-4" data-unique-id="44575663-6743-4a4a-be84-b11ebacd6553" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
          <div className="bg-accent/10 p-4 rounded-lg border" data-unique-id="6a08ae77-6cec-4ca1-af4d-097c435f4166" data-file-name="components/data-explorer/item-details.tsx">
            <h3 className="font-medium mb-4" data-unique-id="8d0d66dc-a761-44b1-a7da-693cd907f18a" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="4bcfa1af-7aa8-4ea6-8008-b7a922fb5571" data-file-name="components/data-explorer/item-details.tsx">Action Details</span></h3>
            
            <div className="space-y-4" data-unique-id="234db14e-ec1b-4715-86a5-1a54c6956e9f" data-file-name="components/data-explorer/item-details.tsx">
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="e882478e-9336-4fd7-9a02-d8a6a119b7e3" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="216fad33-fd86-4111-8380-0741b702d29c" data-file-name="components/data-explorer/item-details.tsx">
                  <Calendar className="h-4 w-4 mr-2" data-unique-id="cbd55fc9-f8e9-4722-b16e-fbc9bea1ea0d" data-file-name="components/data-explorer/item-details.tsx" />
                  <span data-unique-id="40239ef2-91e2-42d0-bbf6-ab8a405753ba" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="816fc969-01a4-453b-8db5-7f21ffd0ce61" data-file-name="components/data-explorer/item-details.tsx">Date</span></span>
                </div>
                <span className="font-medium text-right text-sm" data-unique-id="b2b0be58-8d51-4c9b-aef9-d3808e0f44f7" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{formatDate(item.date)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="53d0f672-5b33-448d-b182-71635a3c5da6" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="1b340c48-0b61-461f-8ad6-bd103a15d494" data-file-name="components/data-explorer/item-details.tsx">
                  <Users className="h-4 w-4 mr-2" />
                  <span data-unique-id="dcb1381e-d071-4722-9a5a-b8437f14a477" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="da8e5367-5897-4f06-b48c-0e79b2ab617a" data-file-name="components/data-explorer/item-details.tsx">Team</span></span>
                </div>
                <span className="font-medium" data-unique-id="0a4b34ee-f8e9-4104-81d8-f5e53bba0373" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.team}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="327cd181-a78e-4c1d-9b89-b569bbd97a31" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="8294ddad-430b-4084-aae9-bb40d5cd8900" data-file-name="components/data-explorer/item-details.tsx">
                  <User className="h-4 w-4 mr-2" />
                  <span data-unique-id="a141e2e1-b067-4580-9310-9e13d9403692" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="f171e0cf-e6e6-4d3f-8bc4-eaa4fee5c40a" data-file-name="components/data-explorer/item-details.tsx">Owner</span></span>
                </div>
                <span className="font-medium" data-unique-id="420fd478-2405-46e3-99e5-6a4b3021e6d4" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.owner}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/50" data-unique-id="77535941-10a6-4a75-ac0d-ec3770142b84" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="3d5d2bbf-c574-450a-8936-1ecfe219f368" data-file-name="components/data-explorer/item-details.tsx">
                  <Tag className="h-4 w-4 mr-2" />
                  <span data-unique-id="deb9aa69-f431-4d38-90bb-f4ce81a5dd87" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="3467e978-b941-4e76-b31b-74473c16d54e" data-file-name="components/data-explorer/item-details.tsx">Type</span></span>
                </div>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium" data-unique-id="bec05600-a9ca-4cca-b92c-b9487b5448b2" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{item.type}</span>
              </div>
              
              <div className="flex items-center justify-between py-2" data-unique-id="598b2792-f582-49b7-ae1f-1fd795a052ce" data-file-name="components/data-explorer/item-details.tsx">
                <div className="flex items-center text-muted-foreground" data-unique-id="0ab9e257-0f9f-476e-ab9a-2ce6cf353941" data-file-name="components/data-explorer/item-details.tsx">
                  <Clock className="h-4 w-4 mr-2" />
                  <span data-unique-id="cc209522-5508-4d7f-be2c-feab5dbba3db" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="69999767-9414-43b5-b416-7ef62480de0f" data-file-name="components/data-explorer/item-details.tsx">Added</span></span>
                </div>
                <span className="text-sm text-muted-foreground" data-unique-id="ddf61bbc-bd53-4323-b791-5726b4e840ef" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-2" data-unique-id="8e101548-0388-4afb-8f63-9979d82a52af" data-file-name="components/data-explorer/item-details.tsx">
            <button onClick={handleItemAction} disabled={isLoading} className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center" data-unique-id="3e13c260-6570-4936-8a64-c8e2409b537e" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">
              {isLoading ? <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" data-unique-id="d24aebdf-cb1c-4bbc-b7b6-1d7fa02db5aa" data-file-name="components/data-explorer/item-details.tsx" />
                  Processing...
                </> : 'Add Follow-up'}
            </button>
            
            <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-200" data-unique-id="3e7b92ec-9614-4aa1-bd1a-6a6faf88774f" data-file-name="components/data-explorer/item-details.tsx"><span className="editable-text" data-unique-id="0f91c603-ffe5-4f55-bbca-d82cdcdd2ad9" data-file-name="components/data-explorer/item-details.tsx">
              Export Details
            </span></button>
          </div>
          
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-unique-id="d866f98e-df02-4a98-b185-bad0b9c2c04a" data-file-name="components/data-explorer/item-details.tsx">
              <p className="text-sm text-red-700" data-unique-id="f3f403c4-bd6b-46b6-8af8-c134493c86cc" data-file-name="components/data-explorer/item-details.tsx" data-dynamic-text="true">{error}</p>
            </div>}
        </div>
      </div>
    </motion.div>;
}