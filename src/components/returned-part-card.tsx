'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package2, Calendar, Truck, Eye, CheckCircle, Clock, AlertCircle, ExternalLink, Edit } from 'lucide-react';
import { ReturnedPart } from './returned-parts-manager';
interface ReturnedPartCardProps {
  part: ReturnedPart;
  onMarkArrived: (id: string) => void;
  onMarkInspected: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ReturnedPart>) => void;
}
export default function ReturnedPartCard({
  part,
  onMarkArrived,
  onMarkInspected,
  onUpdate
}: ReturnedPartCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'arrived':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inspecting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'inspected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'arrived':
        return <CheckCircle className="h-4 w-4" />;
      case 'inspecting':
        return <Eye className="h-4 w-4" />;
      case 'inspected':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  const getDaysUntilInspection = () => {
    if (!part.arrivedDate) return null;
    const arrivedDate = new Date(part.arrivedDate);
    const inspectionDate = new Date(arrivedDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = inspectionDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const isInspectionDue = () => {
    const daysLeft = getDaysUntilInspection();
    return daysLeft !== null && daysLeft <= 0 && part.status === 'arrived';
  };
  return <motion.div id={`part-${part.id}`} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200" data-unique-id="144022eb-17cc-486f-a4a7-7df732fca3ee" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="p-6 border-b border-gray-100" data-unique-id="72509d66-43c2-4016-9bcc-32ccedf302e2" data-file-name="components/returned-part-card.tsx">
        <div className="flex items-start justify-between mb-4" data-unique-id="06002ec4-7db2-4ac9-852f-eaf7170ec33d" data-file-name="components/returned-part-card.tsx">
          <div className="flex items-center gap-3" data-unique-id="ad14999c-1521-47ba-b3c9-43d5cd0a1672" data-file-name="components/returned-part-card.tsx">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center" data-unique-id="6b0751c4-b593-467c-a4a4-777d1dba9982" data-file-name="components/returned-part-card.tsx">
              <Package2 className="h-5 w-5 text-orange-600" />
            </div>
            <div data-unique-id="9de32759-a633-474b-b1c2-28f16070df15" data-file-name="components/returned-part-card.tsx">
              <h3 className="font-semibold text-gray-800" data-unique-id="cd674544-5e31-448c-b06f-707e453909a7" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="bd67823f-a457-4d6e-b548-386ddf8d2cac" data-file-name="components/returned-part-card.tsx">Order #</span>{part.orderNumber}</h3>
              <p className="text-sm text-gray-600" data-unique-id="0501886e-092e-42fe-91ef-58c97c92717d" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.customerName}</p>
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(part.status)}`} data-unique-id="246f26b6-53f3-418f-989f-e094f1944443" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
            {getStatusIcon(part.status)}
            {part.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm" data-unique-id="db09f21a-e62e-4d62-993f-9a6dd55e3402" data-file-name="components/returned-part-card.tsx">
          <div data-unique-id="66392087-4e1e-4788-a2e9-ae182b3600ff" data-file-name="components/returned-part-card.tsx">
            <p className="text-gray-500" data-unique-id="1aa45c01-164f-46ad-8919-4eca8e0471df" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="413a84a5-d468-421d-956a-e4dee351a1e4" data-file-name="components/returned-part-card.tsx">Customer</span></p>
            <p className="font-medium text-gray-800" data-unique-id="83c5c71d-5183-460b-b95c-bbd35c7a1b61" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.customerName}</p>
          </div>
          <div data-unique-id="7a39573c-b8df-4494-a4a3-2b15d165d024" data-file-name="components/returned-part-card.tsx">
            <p className="text-gray-500" data-unique-id="6bae7cb7-8c1a-4e36-a998-9bce642bcb23" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="ff8aad81-3654-4257-bfc3-f45195357a84" data-file-name="components/returned-part-card.tsx">Order #</span></p>
            <p className="font-medium text-gray-800" data-unique-id="ea0ba5ec-d7c8-41ca-bc4b-66926309d2f0" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.orderNumber}</p>
          </div>
        </div>
      </div>

      {/* Tracking Info */}
      <div className="p-6" data-unique-id="9fce850b-cb9a-4f52-b6cc-18be61fa8662" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
        <div className="space-y-4" data-unique-id="ae5707a9-4603-45ec-800b-9b2f4c3c325c" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
          <div className="flex items-center gap-3" data-unique-id="96adff73-c024-48f9-ac8b-e6338f3e4d1b" data-file-name="components/returned-part-card.tsx">
            <Truck className="h-4 w-4 text-gray-400" />
            <div className="flex-1" data-unique-id="5ad21495-6495-4916-ad65-b9e765ae6358" data-file-name="components/returned-part-card.tsx">
              <div className="flex items-center justify-between" data-unique-id="ba4026b4-ccab-44b0-b795-32232296b8b0" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="e26b516b-7ef0-49dd-a8cc-0e24d44c5d16" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="d943abbd-4ce2-46e2-95df-ac0f1eeadd40" data-file-name="components/returned-part-card.tsx">Tracking</span></span>
                <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${part.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1" data-unique-id="4af1a6e8-259c-4c46-880b-d9794a57981d" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="181b205c-921f-4f58-8555-d73339698ba4" data-file-name="components/returned-part-card.tsx">
                  Track </span><ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-sm font-mono text-gray-800" data-unique-id="71be467a-a3b6-4891-aaea-f194a0074ce8" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.trackingNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3" data-unique-id="cee765f0-e5c1-44c6-ace9-435543f12286" data-file-name="components/returned-part-card.tsx">
            <Calendar className="h-4 w-4 text-gray-400" data-unique-id="11ef807f-62ee-4861-865d-1e6584f9f822" data-file-name="components/returned-part-card.tsx" />
            <div className="flex-1" data-unique-id="f4c26a4c-f012-44f6-9523-3790dc394237" data-file-name="components/returned-part-card.tsx">
              <span className="text-sm text-gray-600" data-unique-id="566520f0-9cb8-4765-8877-75da91fc2137" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="46e9cb3f-82fa-4f69-8a85-343e9b0773b0" data-file-name="components/returned-part-card.tsx">Expected Arrival</span></span>
              <p className="text-sm font-medium text-gray-800" data-unique-id="0ab4f9a9-6385-4a2f-9ef5-a8a9b62bf05a" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                {new Date(part.expectedArrival).toLocaleDateString()}
              </p>
            </div>
          </div>

          {part.arrivedDate && <div className="flex items-center gap-3" data-unique-id="bdb35430-a8c5-43da-afc8-f189eb22857d" data-file-name="components/returned-part-card.tsx">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1" data-unique-id="c09a2e83-3a31-49fc-a688-98a4b66bbd5f" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="394ed12f-6330-4f19-833f-2c812dbc8dcb" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="8df1a263-bade-4da0-8c86-b06bdc6d37ae" data-file-name="components/returned-part-card.tsx">Arrived</span></span>
                <p className="text-sm font-medium text-gray-800" data-unique-id="fe153eff-994f-4493-9269-662e7bc54528" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                  {new Date(part.arrivedDate).toLocaleDateString()}
                </p>
              </div>
            </div>}

          {/* Inspection Status */}
          {part.arrivedDate && !part.inspectionDate && <div className="flex items-center gap-3" data-unique-id="3bad7a91-fef0-436f-b1c4-f23e236be9f1" data-file-name="components/returned-part-card.tsx">
              <Eye className="h-4 w-4 text-purple-500" />
              <div className="flex-1" data-unique-id="56162dbc-f6cf-4f67-96a3-92bfd3942ed2" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="fb7c9696-6be3-4b6a-bc50-51d863ce1294" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="e91c24fe-7f61-4ac1-a1b7-210b56493474" data-file-name="components/returned-part-card.tsx">Inspection</span></span>
                <p className="text-sm font-medium text-gray-800" data-unique-id="c4610aea-5f6f-4932-9619-e72ceb927b2d" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                  {isInspectionDue() ? 'Due for completion' : `${getDaysUntilInspection()} days remaining`}
                </p>
              </div>
            </div>}

          {part.inspectionDate && <div className="flex items-center gap-3" data-unique-id="38f996c2-8de7-4ff3-bbb5-836a3638679d" data-file-name="components/returned-part-card.tsx">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1" data-unique-id="c9683c45-54c0-46e3-ade9-33e7784b9b72" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="e6e4e23f-bb4c-49f0-a27e-f40bd810af1c" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="55155027-ff73-4ca0-8271-69a9a9bde47c" data-file-name="components/returned-part-card.tsx">Inspection Complete</span></span>
                <p className="text-sm font-medium text-gray-800" data-unique-id="d6260851-69e6-48cd-a0ee-f88bb0aa8ce9" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                  {new Date(part.inspectionDate).toLocaleDateString()}
                </p>
              </div>
            </div>}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-2" data-unique-id="bfc7dd59-b744-4eaa-8752-305650b1dd6b" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
          {part.status === 'in_transit' && <button onClick={() => onMarkArrived(part.id)} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium" data-unique-id="e1399d94-0082-4b4e-9728-28c83100c7e1" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="98a57159-7908-4637-a56e-593445046665" data-file-name="components/returned-part-card.tsx">
              Mark as Arrived
            </span></button>}
          
          {part.status === 'arrived' && isInspectionDue() && <button onClick={() => onMarkInspected(part.id)} className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium" data-unique-id="fe0dbd77-88f5-48fc-aef2-839176aab9b7" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="d432e775-eb63-4e52-93cb-322467f1cd74" data-file-name="components/returned-part-card.tsx">
              Complete Inspection
            </span></button>}

          <button onClick={() => setShowDetails(!showDetails)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium" data-unique-id="2202ea0d-b329-4799-9f1a-48e1ec13189e" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>

        {/* Expandable Details */}
        {showDetails && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="mt-4 pt-4 border-t border-gray-100" data-unique-id="1488fa11-69ff-4b01-90af-94604982ae73" data-file-name="components/returned-part-card.tsx">
            <div className="space-y-3 text-sm" data-unique-id="c0bf7672-364c-4b7a-932c-c1218a168599" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
              <div data-unique-id="72901586-5ff5-4d6d-9ccf-5cf8d3f52a17" data-file-name="components/returned-part-card.tsx">
                <span className="text-gray-500" data-unique-id="bfa33fc4-2b06-4d71-ab2e-1fe85f9c9a62" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="1c967524-101f-4561-be27-2764a04047db" data-file-name="components/returned-part-card.tsx">Return Reason:</span></span>
                <p className="text-gray-800" data-unique-id="08b23f57-08e9-4401-9157-7879a27fd82f" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.returnReason}</p>
              </div>
              
              <div data-unique-id="4b9bee75-5d9c-4687-85bf-d1dff3165939" data-file-name="components/returned-part-card.tsx">
                <span className="text-gray-500" data-unique-id="d3016f3f-5fa7-4496-9470-0a7cebc13954" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="bcdd7dfb-59c6-4d7f-bd12-3222af913355" data-file-name="components/returned-part-card.tsx">Shipped Date:</span></span>
                <p className="text-gray-800" data-unique-id="20887f42-eb96-4284-b611-9ad8044873ac" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{new Date(part.shippedDate).toLocaleDateString()}</p>
              </div>
              
              {part.notes && <div data-unique-id="baa211f4-54a3-4d86-837b-71978f4be93d" data-file-name="components/returned-part-card.tsx">
                  <span className="text-gray-500" data-unique-id="b21934ca-c43e-4b33-a887-f2f1ac4c4ac5" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="7cd11ff5-ecfc-4dc3-beca-2fa7542de4b8" data-file-name="components/returned-part-card.tsx">Notes:</span></span>
                  <p className="text-gray-800" data-unique-id="9ba7ca90-9177-4ef9-8a8a-66a1180febc3" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.notes}</p>
                </div>}
            </div>
          </motion.div>}
      </div>

      {/* Notification Badge */}
      {isInspectionDue() && <div className="absolute top-2 right-2" data-unique-id="e284ade6-630c-4b40-aabc-a441f38db716" data-file-name="components/returned-part-card.tsx">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" data-unique-id="a5e1588b-7e1b-401e-9a57-81c32c190970" data-file-name="components/returned-part-card.tsx"></div>
        </div>}
    </motion.div>;
}