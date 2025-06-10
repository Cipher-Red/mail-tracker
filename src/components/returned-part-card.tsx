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
  }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200" data-unique-id="24516220-d702-4445-8550-4e644295a9ed" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="p-6 border-b border-gray-100" data-unique-id="9f4f8510-a426-4409-930c-44a45cfd452e" data-file-name="components/returned-part-card.tsx">
        <div className="flex items-start justify-between mb-4" data-unique-id="9afec910-9ebb-4a9e-b20f-ae7d0666a4a5" data-file-name="components/returned-part-card.tsx">
          <div className="flex items-center gap-3" data-unique-id="90d54536-a77b-43a0-a9ee-a36c534ba590" data-file-name="components/returned-part-card.tsx">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center" data-unique-id="b4ea16da-911e-4caf-a406-80704a393e4e" data-file-name="components/returned-part-card.tsx">
              <Package2 className="h-5 w-5 text-orange-600" />
            </div>
            <div data-unique-id="3d727c79-77ff-4208-9587-7b0c1f86951b" data-file-name="components/returned-part-card.tsx">
              <h3 className="font-semibold text-gray-800" data-unique-id="3e7ca057-2f58-45ab-81b7-1302abfb5ca2" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.partName}</h3>
              <p className="text-sm text-gray-600" data-unique-id="4fa06aeb-5be1-4730-9d56-0ebef0ab7c53" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="76c8a7f9-d3e1-49d1-a741-9cf30eb6d3db" data-file-name="components/returned-part-card.tsx">#</span>{part.partNumber}</p>
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(part.status)}`} data-unique-id="19b1dac2-7700-4da5-83c7-2a0470bf95bb" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
            {getStatusIcon(part.status)}
            {part.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm" data-unique-id="83116b7a-ddaa-4e56-81e9-1223411ad6a8" data-file-name="components/returned-part-card.tsx">
          <div data-unique-id="2b6fbc0f-1b73-4d12-92de-131fb6936ae2" data-file-name="components/returned-part-card.tsx">
            <p className="text-gray-500" data-unique-id="0031e82f-3166-4392-b38c-1235ac48adf7" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="ce3d4606-2799-4f93-a4ad-1f8c82bac3cc" data-file-name="components/returned-part-card.tsx">Customer</span></p>
            <p className="font-medium text-gray-800" data-unique-id="b17dd23b-c633-480b-8864-a3f1cebe6d3d" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.customerName}</p>
          </div>
          <div data-unique-id="dbd6f9f0-949a-4fdd-a2ec-d6aa4e772465" data-file-name="components/returned-part-card.tsx">
            <p className="text-gray-500" data-unique-id="fe1f90da-c7e1-4438-a804-b2b485dc83f4" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="0366748b-538c-4fa9-b063-9d0c2588d1b7" data-file-name="components/returned-part-card.tsx">Order #</span></p>
            <p className="font-medium text-gray-800" data-unique-id="adef0212-d0f6-4083-b2db-2a2a30623449" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.orderNumber}</p>
          </div>
        </div>
      </div>

      {/* Tracking Info */}
      <div className="p-6" data-unique-id="df74de95-7d13-442c-9be7-abe817db0045" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
        <div className="space-y-4" data-unique-id="60a9ca25-6172-4317-8d53-a53ff286e0f2" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
          <div className="flex items-center gap-3" data-unique-id="da5d22ba-ca0a-408b-a036-45f19ed00fe7" data-file-name="components/returned-part-card.tsx">
            <Truck className="h-4 w-4 text-gray-400" />
            <div className="flex-1" data-unique-id="45a13cb6-09f9-44c0-8ebb-de48b0371174" data-file-name="components/returned-part-card.tsx">
              <div className="flex items-center justify-between" data-unique-id="e8229d1c-10b7-41a7-97f4-d75c1b1516a1" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="15306dee-7ace-48d7-8eaa-f5d04c45ce7b" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="3846870d-a4c3-4f6b-83b0-5ca719c0ffe8" data-file-name="components/returned-part-card.tsx">Tracking</span></span>
                <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${part.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1" data-unique-id="5a967f8a-67c8-42ba-ac4a-0818d176ea95" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="7481b7db-0d9f-4448-b906-5bfc020a6e80" data-file-name="components/returned-part-card.tsx">
                  Track </span><ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-sm font-mono text-gray-800" data-unique-id="c27f64f3-69cb-4e65-bbd9-c3e6d6aceff7" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.trackingNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3" data-unique-id="824a19a1-53ab-477a-8fc5-15bc19acd2dd" data-file-name="components/returned-part-card.tsx">
            <Calendar className="h-4 w-4 text-gray-400" data-unique-id="28069b90-0daf-45a7-a4c1-ec0b5a235017" data-file-name="components/returned-part-card.tsx" />
            <div className="flex-1" data-unique-id="870aecba-a1af-454f-9fb4-725a46b0b850" data-file-name="components/returned-part-card.tsx">
              <span className="text-sm text-gray-600" data-unique-id="ac546a38-6f27-433e-b4db-228ee06061b8" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="17b9a0a9-de26-4e07-94aa-83ab9f6b2473" data-file-name="components/returned-part-card.tsx">Expected Arrival</span></span>
              <p className="text-sm font-medium text-gray-800" data-unique-id="49c83f09-9a63-4d27-af1d-911a95ebb1f8" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                {new Date(part.expectedArrival).toLocaleDateString()}
              </p>
            </div>
          </div>

          {part.arrivedDate && <div className="flex items-center gap-3" data-unique-id="d41bb7b2-b328-4eba-ba8a-cda2766a79ba" data-file-name="components/returned-part-card.tsx">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1" data-unique-id="4d0005d6-9092-4d18-8c5a-677a195c2a44" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="e52be427-f442-4fa0-951b-87527c7cb781" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="ae9fa88e-f2a8-48f5-a973-2260a28fbacc" data-file-name="components/returned-part-card.tsx">Arrived</span></span>
                <p className="text-sm font-medium text-gray-800" data-unique-id="607b9dc8-781f-4cab-af28-5306485fead1" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                  {new Date(part.arrivedDate).toLocaleDateString()}
                </p>
              </div>
            </div>}

          {/* Inspection Status */}
          {part.arrivedDate && !part.inspectionDate && <div className="flex items-center gap-3" data-unique-id="8298c8e5-0988-41c5-95d2-b80d65c334fd" data-file-name="components/returned-part-card.tsx">
              <Eye className="h-4 w-4 text-purple-500" />
              <div className="flex-1" data-unique-id="785a617d-4e3f-40c2-aa06-0dd3344a6f60" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="3c88a2af-69dd-4d44-9fc7-7a33d3abf0f8" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="ffeba9ae-9eda-4a81-b21e-d046b2206b6a" data-file-name="components/returned-part-card.tsx">Inspection</span></span>
                <p className="text-sm font-medium text-gray-800" data-unique-id="e3cdf97b-ef32-4fa6-91b2-c715f4ca38eb" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                  {isInspectionDue() ? 'Due for completion' : `${getDaysUntilInspection()} days remaining`}
                </p>
              </div>
            </div>}

          {part.inspectionDate && <div className="flex items-center gap-3" data-unique-id="3436c0a0-3296-4a23-9f00-f726f7238c6a" data-file-name="components/returned-part-card.tsx">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1" data-unique-id="c6582657-2e47-4e59-bf21-16d0f64dff4a" data-file-name="components/returned-part-card.tsx">
                <span className="text-sm text-gray-600" data-unique-id="9ff1a195-dc15-4f10-ad72-2de6e9c23490" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="fc769ed1-b843-4dc3-be0f-824791b803ad" data-file-name="components/returned-part-card.tsx">Inspection Complete</span></span>
                <p className="text-sm font-medium text-gray-800" data-unique-id="d7f7b5bb-7f63-4c8a-8928-00b5515f58be" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
                  {new Date(part.inspectionDate).toLocaleDateString()}
                </p>
              </div>
            </div>}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-2" data-unique-id="466b43f5-c15a-40f7-a48a-7f6e5d8cc3d6" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
          {part.status === 'in_transit' && <button onClick={() => onMarkArrived(part.id)} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium" data-unique-id="0346d455-4040-4fe0-9fcb-e80ad516d783" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="833b83da-d9d1-4c46-9468-22f3a68658a0" data-file-name="components/returned-part-card.tsx">
              Mark as Arrived
            </span></button>}
          
          {part.status === 'arrived' && isInspectionDue() && <button onClick={() => onMarkInspected(part.id)} className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium" data-unique-id="6797f6bb-6bcd-4a9f-b792-bf5a83f50a6b" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="17f8a91c-d567-4949-ab30-d582fdad3515" data-file-name="components/returned-part-card.tsx">
              Complete Inspection
            </span></button>}

          <button onClick={() => setShowDetails(!showDetails)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium" data-unique-id="b1c55c7e-6f39-42c9-a9d5-1c40edb6e6c8" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
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
      }} className="mt-4 pt-4 border-t border-gray-100" data-unique-id="d1181d27-de1a-4876-bc91-ab07c03caa3f" data-file-name="components/returned-part-card.tsx">
            <div className="space-y-3 text-sm" data-unique-id="13c143db-f60f-4918-91ef-92dcc58d489c" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">
              <div data-unique-id="73111440-21a2-4a95-ab02-94e96988d677" data-file-name="components/returned-part-card.tsx">
                <span className="text-gray-500" data-unique-id="cfa43444-8e1d-4b4a-8229-7254ba9d92d9" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="58eb62a3-8aa4-41d5-939e-cc122453d891" data-file-name="components/returned-part-card.tsx">Return Reason:</span></span>
                <p className="text-gray-800" data-unique-id="b10b4752-0bcd-4525-9d13-78cd2f95e126" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.returnReason}</p>
              </div>
              
              <div data-unique-id="b70a2731-2e82-43ee-b2b9-566d41cf23cd" data-file-name="components/returned-part-card.tsx">
                <span className="text-gray-500" data-unique-id="bea6fff5-bcb0-4075-8a58-e6237690ae49" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="d178c4ac-37eb-4f80-8be7-a9f67b67077d" data-file-name="components/returned-part-card.tsx">Shipped Date:</span></span>
                <p className="text-gray-800" data-unique-id="58a4111d-3c8d-4057-ac31-e6fd86317249" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{new Date(part.shippedDate).toLocaleDateString()}</p>
              </div>
              
              {part.notes && <div data-unique-id="d963c2df-e984-4db2-a858-4f737184ceec" data-file-name="components/returned-part-card.tsx">
                  <span className="text-gray-500" data-unique-id="9cd9162b-51da-47ff-b108-d8354516ed6d" data-file-name="components/returned-part-card.tsx"><span className="editable-text" data-unique-id="a741a09d-4382-48ae-8425-2e4d6bbaad4b" data-file-name="components/returned-part-card.tsx">Notes:</span></span>
                  <p className="text-gray-800" data-unique-id="f577c673-2a4f-4c77-9f2a-ba131acfed6d" data-file-name="components/returned-part-card.tsx" data-dynamic-text="true">{part.notes}</p>
                </div>}
            </div>
          </motion.div>}
      </div>

      {/* Notification Badge */}
      {isInspectionDue() && <div className="absolute top-2 right-2" data-unique-id="ca360053-928e-41be-bec6-cf196132fea4" data-file-name="components/returned-part-card.tsx">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" data-unique-id="3b85ed78-4970-42e3-809d-012f0744ad77" data-file-name="components/returned-part-card.tsx"></div>
        </div>}
    </motion.div>;
}