'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package2, Calendar, User, FileText } from 'lucide-react';
import { ReturnedPart } from './returned-parts-manager';
interface AddReturnedPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (part: Omit<ReturnedPart, 'id' | 'createdAt'>) => void;
}
export default function AddReturnedPartModal({
  isOpen,
  onClose,
  onAdd
}: AddReturnedPartModalProps) {
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    customerName: '',
    customerEmail: '',
    orderNumber: '',
    returnReason: '',
    trackingNumber: '',
    shippedDate: '',
    expectedArrival: '',
    status: 'shipped' as ReturnedPart['status'],
    notes: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partName || !formData.partNumber || !formData.customerName) {
      return;
    }
    onAdd(formData);

    // Reset form
    setFormData({
      partName: '',
      partNumber: '',
      customerName: '',
      customerEmail: '',
      orderNumber: '',
      returnReason: '',
      trackingNumber: '',
      shippedDate: '',
      expectedArrival: '',
      status: 'shipped',
      notes: ''
    });
  };
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  if (!isOpen) return null;
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} data-unique-id="235a067b-ad90-43ed-8f28-08b8ddec46fa" data-file-name="components/add-returned-part-modal.tsx">
        <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="93fe54fd-cf22-48ec-9e2f-3f87588cfbe3" data-file-name="components/add-returned-part-modal.tsx" data-dynamic-text="true">
          {/* Header */}
          <div className="bg-orange-500 text-white p-6" data-unique-id="02054489-f312-4a2d-9917-e6fa1c91a304" data-file-name="components/add-returned-part-modal.tsx">
            <div className="flex items-center justify-between" data-unique-id="ab150a22-7fc7-409c-b519-0740c025e9ec" data-file-name="components/add-returned-part-modal.tsx">
              <div className="flex items-center gap-3" data-unique-id="b8a76874-cf00-4dfd-bbdd-983dd66ec9d7" data-file-name="components/add-returned-part-modal.tsx">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center" data-unique-id="d8e4ee91-0042-43fa-a88f-014981b4e218" data-file-name="components/add-returned-part-modal.tsx">
                  <Package2 className="h-5 w-5" />
                </div>
                <div data-unique-id="2ba71684-f5b2-4abb-9da1-dbd335254a72" data-file-name="components/add-returned-part-modal.tsx">
                  <h2 className="text-xl font-semibold" data-unique-id="03f75905-3558-4ca5-abe2-63bc2d4f10ef" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="e8725b52-83f9-4c98-9a3a-1821e3b3c700" data-file-name="components/add-returned-part-modal.tsx">Add Returned Part</span></h2>
                  <p className="text-orange-100 text-sm" data-unique-id="5bd71592-5036-4acc-aa44-f9477e63e74c" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="9a91da29-dc16-408f-82f1-2383023448a7" data-file-name="components/add-returned-part-modal.tsx">Track a new returned part</span></p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors" data-unique-id="bee3e47f-562a-4810-a2b5-19fc1545b588" data-file-name="components/add-returned-part-modal.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6" data-unique-id="6bd652f8-163d-4fc6-accb-84d9e0ea04e4" data-file-name="components/add-returned-part-modal.tsx" data-dynamic-text="true">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="37580d9f-4ab2-47b6-8009-8508dba81c40" data-file-name="components/add-returned-part-modal.tsx" data-dynamic-text="true">
              {/* Part Information */}
              <div className="space-y-4" data-unique-id="c2441db0-92b2-4420-8674-f2de130c4e8b" data-file-name="components/add-returned-part-modal.tsx">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2" data-unique-id="db78062e-3bce-42a8-bd26-bde232535233" data-file-name="components/add-returned-part-modal.tsx">
                  <Package2 className="h-4 w-4 text-orange-500" /><span className="editable-text" data-unique-id="e6d44f20-2704-4294-aca0-96d227cd0002" data-file-name="components/add-returned-part-modal.tsx">
                  Part Information
                </span></h3>
                
                <div data-unique-id="db9db2b9-d30f-47b3-9b6e-0df50604661b" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="5bcc4e96-d01a-47c5-9771-216070709b1b" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="6222711f-e4bd-4e2a-8fe3-07fe5b2fa660" data-file-name="components/add-returned-part-modal.tsx">
                    Part Name *
                  </span></label>
                  <input type="text" value={formData.partName} onChange={e => handleChange('partName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter part name" required data-unique-id="71df883a-b957-4eef-93c7-3f23f95464d7" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="ac93e176-93a1-42dc-9c17-f3e15f301b39" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="5588be0d-d827-4f7c-8d8c-db76286bec30" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="3b92716d-6e66-4740-90d3-b5aa50667fc7" data-file-name="components/add-returned-part-modal.tsx">
                    Part Number *
                  </span></label>
                  <input type="text" value={formData.partNumber} onChange={e => handleChange('partNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter part number" required data-unique-id="4c168d1f-2465-480d-bd0c-c18e621da950" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="6785e238-d24b-4d22-8022-2ca511361b63" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="a370ceac-2078-479d-8ed4-dd92121e728e" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="bdcf4e23-0ed1-4443-9969-6f86a645594c" data-file-name="components/add-returned-part-modal.tsx">
                    Return Reason
                  </span></label>
                  <select value={formData.returnReason} onChange={e => handleChange('returnReason', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="763331f5-9368-4a76-8269-64b2c10d4fa6" data-file-name="components/add-returned-part-modal.tsx">
                    <option value="" data-unique-id="2e6edef6-4290-4ee0-b7c0-91a794a1ade4" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="72503a7b-66d2-4e0e-8103-6cfafab4faba" data-file-name="components/add-returned-part-modal.tsx">Select reason</span></option>
                    <option value="Defective" data-unique-id="729b9789-ee70-49ae-820a-01547462ab5c" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="0cd8bd68-4ce3-4048-9d69-4f20a34d2f4c" data-file-name="components/add-returned-part-modal.tsx">Defective</span></option>
                    <option value="Wrong Part" data-unique-id="dfae0a42-c449-420d-bdd1-5165d53fa919" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="58fa9509-613c-4063-9f9e-a23d9fee306b" data-file-name="components/add-returned-part-modal.tsx">Wrong Part</span></option>
                    <option value="Customer Return" data-unique-id="2798657c-0701-4d4d-8610-1ada55ac41c2" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="638efb55-2bf2-4f4b-ad8c-053b26699a0d" data-file-name="components/add-returned-part-modal.tsx">Customer Return</span></option>
                    <option value="Warranty" data-unique-id="d2e45536-920b-4e1b-b2d0-23f1283c188c" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="e7baf138-8595-4499-8133-b36213f536a3" data-file-name="components/add-returned-part-modal.tsx">Warranty</span></option>
                    <option value="Quality Issue" data-unique-id="b4f9968c-6476-4d17-8c43-1c720e33290c" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="2cfaf0c9-01f1-4ec6-9c46-5f507ea3292b" data-file-name="components/add-returned-part-modal.tsx">Quality Issue</span></option>
                    <option value="Other" data-unique-id="891dc1a8-2079-49dc-8d78-baeee05d3963" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="d9ceeda1-29e0-403a-ad06-768408146478" data-file-name="components/add-returned-part-modal.tsx">Other</span></option>
                  </select>
                </div>
              </div>

              {/* Customer & Order Information */}
              <div className="space-y-4" data-unique-id="2f48f87e-0ab1-4c33-a2bc-bb7b9c589841" data-file-name="components/add-returned-part-modal.tsx">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2" data-unique-id="73af950d-47d3-458b-a5ff-858ba82525dc" data-file-name="components/add-returned-part-modal.tsx">
                  <User className="h-4 w-4 text-orange-500" /><span className="editable-text" data-unique-id="f1ad530e-963a-4d62-a42e-56826879abfd" data-file-name="components/add-returned-part-modal.tsx">
                  Customer & Order
                </span></h3>
                
                <div data-unique-id="81dc94f6-b2c8-4ce2-bbfd-75c42ac24d02" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="35aa88fd-ea63-4890-a2e6-f96bfe1a47aa" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="f8f01fd3-b15e-442d-8838-2826dee3efc6" data-file-name="components/add-returned-part-modal.tsx">
                    Customer Name *
                  </span></label>
                  <input type="text" value={formData.customerName} onChange={e => handleChange('customerName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter customer name" required data-unique-id="b575f35a-8245-4f36-9153-dad6e616286d" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="977eb0bc-d421-494a-9f1b-55147329bebc" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="f6c24829-44a9-4b74-8ed9-bb731fb666a7" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="5441c54b-5021-4392-b581-bb56a499e6ef" data-file-name="components/add-returned-part-modal.tsx">
                    Customer Email *
                  </span></label>
                  <input type="email" value={formData.customerEmail} onChange={e => handleChange('customerEmail', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter customer email" required data-unique-id="d6557915-a771-428e-a43f-087874cddb49" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="6406fa6f-e3c9-4296-bdc9-f31bf9bfbf78" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="8c857865-7b0d-434d-8bcf-16a49d502f9c" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="d083de0b-69b3-482f-91bd-b618825465a4" data-file-name="components/add-returned-part-modal.tsx">
                    Order Number
                  </span></label>
                  <input type="text" value={formData.orderNumber} onChange={e => handleChange('orderNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter order number" data-unique-id="82f54a80-b97a-4c6d-911e-e11efef7813d" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="5cc6608c-0e3c-45d6-9819-33246d2aa334" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="0173d455-6bce-4d2a-bd69-e9fab7623bb6" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="86b2a6ca-ff8d-4764-9975-149876f4841d" data-file-name="components/add-returned-part-modal.tsx">
                    Status
                  </span></label>
                  <select value={formData.status} onChange={e => handleChange('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="ea724b1b-e1c4-458d-b6db-1bba9b054e3f" data-file-name="components/add-returned-part-modal.tsx">
                    <option value="shipped" data-unique-id="5776ac81-cd10-4bad-a7d0-d16064e02c12" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="2036e14f-3a14-4523-b1ec-bcb804f64006" data-file-name="components/add-returned-part-modal.tsx">Shipped</span></option>
                    <option value="in_transit" data-unique-id="d29aedbc-a0d3-4f35-9666-63d34cd9179b" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="bb79273d-931c-4650-9d92-f59eeaa4b033" data-file-name="components/add-returned-part-modal.tsx">In Transit</span></option>
                    <option value="arrived" data-unique-id="4dccbad0-8b7c-4e38-8ad4-9f312fadad62" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="d89e243d-e55b-4254-b68d-291890543af4" data-file-name="components/add-returned-part-modal.tsx">Arrived</span></option>
                    <option value="inspecting" data-unique-id="89ad59d1-fb3f-478d-9430-6d454fe115e4" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="607dfa1a-6c73-4eea-a3ac-7059baca7b99" data-file-name="components/add-returned-part-modal.tsx">Inspecting</span></option>
                    <option value="inspected" data-unique-id="8b63e9e8-813b-4770-85cc-c1db3613a592" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="75378490-4c0b-4f3c-b943-d2979e560765" data-file-name="components/add-returned-part-modal.tsx">Inspected</span></option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mt-6 space-y-4" data-unique-id="de58eddc-001b-496d-8d84-2830251c8513" data-file-name="components/add-returned-part-modal.tsx">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2" data-unique-id="25655f21-b520-4317-a1aa-dce354de0470" data-file-name="components/add-returned-part-modal.tsx">
                <Calendar className="h-4 w-4 text-orange-500" data-unique-id="ae6378cb-13ff-4d22-8360-a98910af52db" data-file-name="components/add-returned-part-modal.tsx" /><span className="editable-text" data-unique-id="8b7e952d-dfb9-42e3-91eb-092ebf2f3e2f" data-file-name="components/add-returned-part-modal.tsx">
                Shipping Information
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="58459b7d-ada8-4f70-b9d3-854e894d09c8" data-file-name="components/add-returned-part-modal.tsx">
                <div data-unique-id="e99bddd1-c760-4e38-8c84-0b64fa36b02a" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="c1280cd8-0e48-4e6b-a29d-aacbec59cf2f" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="eeedad0a-e2cd-4eeb-b569-bf0e6f61f8c2" data-file-name="components/add-returned-part-modal.tsx">
                    Tracking Number
                  </span></label>
                  <input type="text" value={formData.trackingNumber} onChange={e => handleChange('trackingNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter tracking number" data-unique-id="3e43de56-050f-4e0d-b6fb-7de16f9de7a6" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="deec2bba-2470-489d-850e-e626f24816ec" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="ce42e8fa-b980-481b-8a69-bf974abfcd36" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="06ce517b-3ac3-4a99-8cbc-bb757778ce12" data-file-name="components/add-returned-part-modal.tsx">
                    Shipped Date
                  </span></label>
                  <input type="date" value={formData.shippedDate} onChange={e => handleChange('shippedDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="cfa2828d-b21f-4d1c-b7a7-6586f392df9d" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="a350b515-b0cf-4f1c-b027-cf5370d2161d" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="d47fa4f2-b190-4d9b-ab5b-be063581fa9f" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="33fc73b8-2cc6-475f-8c99-bf7d201aa320" data-file-name="components/add-returned-part-modal.tsx">
                    Expected Arrival
                  </span></label>
                  <input type="date" value={formData.expectedArrival} onChange={e => handleChange('expectedArrival', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="b0a49b86-0d46-4eeb-b078-fac9c059f79e" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6" data-unique-id="2800831c-cb5b-4f34-8efb-ebde9885006b" data-file-name="components/add-returned-part-modal.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" data-unique-id="38186acf-5d45-435a-960c-0c43cc5e261f" data-file-name="components/add-returned-part-modal.tsx">
                <FileText className="h-4 w-4 text-orange-500" /><span className="editable-text" data-unique-id="23cf9e72-cbd2-404c-9e7a-2fb09efe0757" data-file-name="components/add-returned-part-modal.tsx">
                Notes
              </span></label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Add any additional notes..." data-unique-id="86f5a3d4-9390-465e-8ec2-9ed578c95b44" data-file-name="components/add-returned-part-modal.tsx" />
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-4" data-unique-id="338f85e7-2704-4c33-80a4-c200cb8021c8" data-file-name="components/add-returned-part-modal.tsx">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" data-unique-id="50ae44bc-bc64-4d00-9bd1-7f5ad0205683" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="6ef7306c-769d-4701-8bf1-ea69243d3784" data-file-name="components/add-returned-part-modal.tsx">
                Cancel
              </span></button>
              <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors" data-unique-id="f7b2c53b-0d62-4ed7-8774-8955a884ca59" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="c07a6b0b-a2fe-4a50-8e19-df67e37b66b7" data-file-name="components/add-returned-part-modal.tsx">
                Add Returned Part
              </span></button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}