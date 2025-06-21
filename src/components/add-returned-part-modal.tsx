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
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} data-unique-id="613e82fd-3958-455c-892b-297e2ea3cbea" data-file-name="components/add-returned-part-modal.tsx">
        <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="46013a13-e769-4385-a736-ffde245c8ec1" data-file-name="components/add-returned-part-modal.tsx" data-dynamic-text="true">
          {/* Header */}
          <div className="bg-orange-500 text-white p-6" data-unique-id="9e7723a2-3fc6-4b4f-9d3e-f26b813af51b" data-file-name="components/add-returned-part-modal.tsx">
            <div className="flex items-center justify-between" data-unique-id="3244b6e8-83f6-45ad-afc9-29716cbe8472" data-file-name="components/add-returned-part-modal.tsx">
              <div className="flex items-center gap-3" data-unique-id="5e5b6ef4-50a0-485c-9ef1-0d2095f5a141" data-file-name="components/add-returned-part-modal.tsx">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center" data-unique-id="1bb430e0-9113-4799-b3b7-6844c6fa9e04" data-file-name="components/add-returned-part-modal.tsx">
                  <Package2 className="h-5 w-5" />
                </div>
                <div data-unique-id="b7be35a3-6cd2-4e20-9136-f474e0d044f8" data-file-name="components/add-returned-part-modal.tsx">
                  <h2 className="text-xl font-semibold" data-unique-id="2a96b989-d699-494d-a243-0cfd5972e7b5" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="7c0d26e3-8e8a-49ec-b1a0-29f12963e67d" data-file-name="components/add-returned-part-modal.tsx">Add Returned Part</span></h2>
                  <p className="text-orange-100 text-sm" data-unique-id="51e09bc0-598d-4b54-9ecd-6b0ace3de20e" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="f8bd018f-8fa9-42c9-9742-6e104432967e" data-file-name="components/add-returned-part-modal.tsx">Track a new returned part</span></p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors" data-unique-id="9177dd85-fa77-4971-8779-38d9f576641a" data-file-name="components/add-returned-part-modal.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6" data-unique-id="e3c1b04d-7541-4252-b973-19390593db47" data-file-name="components/add-returned-part-modal.tsx" data-dynamic-text="true">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="3efdc60f-d27d-4d3e-b836-b27863e92041" data-file-name="components/add-returned-part-modal.tsx" data-dynamic-text="true">
              {/* Part Information */}
              <div className="space-y-4" data-unique-id="2f89c936-960b-4806-8c3e-92455a3fd842" data-file-name="components/add-returned-part-modal.tsx">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2" data-unique-id="af5dc1e6-4b01-4dce-9889-c3567ed57142" data-file-name="components/add-returned-part-modal.tsx">
                  <Package2 className="h-4 w-4 text-orange-500" /><span className="editable-text" data-unique-id="72a0c0f6-0ec0-44f0-981c-33f89a17bd5a" data-file-name="components/add-returned-part-modal.tsx">
                  Part Information
                </span></h3>
                
                <div data-unique-id="b4e5fdca-23bd-4eea-95d9-decc1d1958f8" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="3ec8065e-4955-4754-bc47-8653389c0fbb" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="2288a8c6-f21d-4147-a260-c4afd653dd4a" data-file-name="components/add-returned-part-modal.tsx">
                    Part Name *
                  </span></label>
                  <input type="text" value={formData.partName} onChange={e => handleChange('partName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter part name" required data-unique-id="0dfebaee-c475-4811-a0a7-739a7379335b" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="70b94aff-09bb-45e6-857e-b5fc4184ec71" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="818bff39-d376-437a-a14a-b3f2ee5e1170" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="3a82ea93-394f-41d2-8e7d-5c6c919e9bee" data-file-name="components/add-returned-part-modal.tsx">
                    Part Number *
                  </span></label>
                  <input type="text" value={formData.partNumber} onChange={e => handleChange('partNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter part number" required data-unique-id="4d1163aa-e841-4fbd-b0ea-d81d863f2139" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="c8887e32-f4b9-462f-9741-dfcbdd6f240b" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="51b741e4-5548-423a-8b06-7103eaa90622" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="247094e1-6cd1-4102-a6de-96cc09fd3049" data-file-name="components/add-returned-part-modal.tsx">
                    Return Reason
                  </span></label>
                  <select value={formData.returnReason} onChange={e => handleChange('returnReason', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="2d4feaa1-f938-4122-a942-11bf9e8264b0" data-file-name="components/add-returned-part-modal.tsx">
                    <option value="" data-unique-id="3aae1c74-0b64-40f0-88cb-3ae3428f4315" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="4f7a2bf3-b3f5-4f67-89de-7b6d72a6cb0a" data-file-name="components/add-returned-part-modal.tsx">Select reason</span></option>
                    <option value="Defective" data-unique-id="9c6dff58-6303-41ad-94cd-81584acc67bb" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="d599498c-6b2f-4632-a43e-4c13a8ef4825" data-file-name="components/add-returned-part-modal.tsx">Defective</span></option>
                    <option value="Wrong Part" data-unique-id="a5d73f21-eedb-4563-8ef0-403ce03eeddb" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="a2231db5-a0c4-4c74-824e-444f45804947" data-file-name="components/add-returned-part-modal.tsx">Wrong Part</span></option>
                    <option value="Customer Return" data-unique-id="f7a7fa55-7f7f-4810-b673-6dbde027752a" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="8ffaa9f3-fe31-40e8-9840-4ba9383ae2c4" data-file-name="components/add-returned-part-modal.tsx">Customer Return</span></option>
                    <option value="Warranty" data-unique-id="bc173863-4832-4e19-b03f-58167a6e53a4" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="bc1780a1-69fd-477c-b294-daa6b2ace88f" data-file-name="components/add-returned-part-modal.tsx">Warranty</span></option>
                    <option value="Quality Issue" data-unique-id="84cd9ad3-36d2-4000-b716-91fd361ee48c" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="b8a01c29-c48b-4a07-b7cd-5e1d8b939c9c" data-file-name="components/add-returned-part-modal.tsx">Quality Issue</span></option>
                    <option value="Other" data-unique-id="686f127f-8b87-46e2-ab3c-21d41195572f" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="7da23940-2e4c-46f0-b9d7-51159a77d15e" data-file-name="components/add-returned-part-modal.tsx">Other</span></option>
                  </select>
                </div>
              </div>

              {/* Customer & Order Information */}
              <div className="space-y-4" data-unique-id="80304b56-4085-42f1-af65-4f4e8a0decc8" data-file-name="components/add-returned-part-modal.tsx">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2" data-unique-id="d568c79e-a956-4c52-b0ee-9ce10af5b28f" data-file-name="components/add-returned-part-modal.tsx">
                  <User className="h-4 w-4 text-orange-500" /><span className="editable-text" data-unique-id="5a91550a-db52-4e48-b2a8-06567a127959" data-file-name="components/add-returned-part-modal.tsx">
                  Customer & Order
                </span></h3>
                
                <div data-unique-id="cdfc9d44-3c69-4746-9341-8954b740f6e2" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="3f8312be-3996-455b-af26-85df5120afa5" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="df4b6967-8954-4312-95c5-d822af245363" data-file-name="components/add-returned-part-modal.tsx">
                    Customer Name *
                  </span></label>
                  <input type="text" value={formData.customerName} onChange={e => handleChange('customerName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter customer name" required data-unique-id="2268ff2a-e8b5-4bab-b68d-b2f938f93dff" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="a846de7a-e5c5-4afd-87bf-443bad87447e" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="9e8c9500-c865-481a-8a3f-70b4d1c4703c" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="e1f5c632-7a8a-4ac9-a11b-88623e36bae3" data-file-name="components/add-returned-part-modal.tsx">
                    Customer Email *
                  </span></label>
                  <input type="email" value={formData.customerEmail} onChange={e => handleChange('customerEmail', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter customer email" required data-unique-id="f15ad325-d53c-4e01-82e9-ba0b6bce5209" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="94b7b528-1397-4558-99cd-1363011dfedd" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="a5e5a1fc-71e3-42b0-95a2-6a93181ff0a3" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="2e678789-1d07-4c01-b7a6-502beeddd03d" data-file-name="components/add-returned-part-modal.tsx">
                    Order Number
                  </span></label>
                  <input type="text" value={formData.orderNumber} onChange={e => handleChange('orderNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter order number" data-unique-id="3491f46d-231e-4a99-b861-15b87b9acb69" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="ba8bae85-24a5-4a16-b9aa-15c8c4040f00" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="cc072e8c-b594-47a2-8869-acb14100db90" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="9de24b5a-9982-49d9-b29e-6469698b961c" data-file-name="components/add-returned-part-modal.tsx">
                    Status
                  </span></label>
                  <select value={formData.status} onChange={e => handleChange('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="ee09f490-872f-453a-9997-4f5e45c46303" data-file-name="components/add-returned-part-modal.tsx">
                    <option value="shipped" data-unique-id="9a609fae-7b37-4584-926c-e7a4e9a9d5c6" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="4b7a8d92-cc42-41ee-9864-1a5117de83a6" data-file-name="components/add-returned-part-modal.tsx">Shipped</span></option>
                    <option value="in_transit" data-unique-id="6f52158d-3cab-4ca5-9e44-a74caefaea63" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="104fa2b2-080b-4cb1-b23b-38c00acbf20e" data-file-name="components/add-returned-part-modal.tsx">In Transit</span></option>
                    <option value="arrived" data-unique-id="b3644eaa-de5f-467d-9f4a-1603dbdc19ab" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="37622c40-01e7-4277-bc72-1fe5016183e3" data-file-name="components/add-returned-part-modal.tsx">Arrived</span></option>
                    <option value="inspecting" data-unique-id="555aaa32-912f-4d95-b8e2-0d569f5851b8" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="38bd9493-395f-4872-ab20-209973dc4386" data-file-name="components/add-returned-part-modal.tsx">Inspecting</span></option>
                    <option value="inspected" data-unique-id="da86f257-f50f-4cb5-a71e-5fd20e8364d9" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="13fb3b5c-19c9-4a07-8180-667fbe0ba685" data-file-name="components/add-returned-part-modal.tsx">Inspected</span></option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mt-6 space-y-4" data-unique-id="32c2e9c8-7529-4e69-8960-9f19bb27787a" data-file-name="components/add-returned-part-modal.tsx">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2" data-unique-id="9a9ed2ef-4ae8-4e56-9480-8edf36ffe086" data-file-name="components/add-returned-part-modal.tsx">
                <Calendar className="h-4 w-4 text-orange-500" data-unique-id="70f12e66-d2f9-414b-bd54-ac35c847ab3e" data-file-name="components/add-returned-part-modal.tsx" /><span className="editable-text" data-unique-id="94738cef-1f38-4a80-a56d-f5e02152a9e0" data-file-name="components/add-returned-part-modal.tsx">
                Shipping Information
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="c7a5396c-527a-4a2f-a9e4-0e7416fd3e48" data-file-name="components/add-returned-part-modal.tsx">
                <div data-unique-id="2325274c-430f-43a2-a2ce-17f5d8574e23" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="db200b51-8373-472a-8ab8-95aa0e43ce2a" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="23596ff0-3e07-4b29-bb9c-ea7b4c81a929" data-file-name="components/add-returned-part-modal.tsx">
                    Tracking Number
                  </span></label>
                  <input type="text" value={formData.trackingNumber} onChange={e => handleChange('trackingNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter tracking number" data-unique-id="6ebea37a-9c7a-46dc-9751-9ff2cb969405" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="bc8d736a-6a6d-45cd-8f2d-0a56323c2cf9" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="9be6c420-6b06-4e9d-9584-7b99e1095953" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="1b2e29d6-ff42-4fd5-a1ee-ab505ed07204" data-file-name="components/add-returned-part-modal.tsx">
                    Shipped Date
                  </span></label>
                  <input type="date" value={formData.shippedDate} onChange={e => handleChange('shippedDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="ae8e22e8-9aea-447f-a243-95f23c615bc0" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
                
                <div data-unique-id="289736fa-9631-4709-9e0e-b70eecbf13e0" data-file-name="components/add-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="3276a451-f7dc-4e15-8693-e6662a53eca6" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="65cad2d9-e662-4d02-8e4a-3f380de7862a" data-file-name="components/add-returned-part-modal.tsx">
                    Expected Arrival
                  </span></label>
                  <input type="date" value={formData.expectedArrival} onChange={e => handleChange('expectedArrival', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="d10580e1-a45a-431a-a548-62ccb5263ce4" data-file-name="components/add-returned-part-modal.tsx" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6" data-unique-id="98310f3a-5dd9-4458-87b2-bc72f2a652e2" data-file-name="components/add-returned-part-modal.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" data-unique-id="c8adc8f7-6079-4cfb-be8c-d86bf91446d6" data-file-name="components/add-returned-part-modal.tsx">
                <FileText className="h-4 w-4 text-orange-500" /><span className="editable-text" data-unique-id="f410e38a-3c0a-4eea-a642-5a71ddf57150" data-file-name="components/add-returned-part-modal.tsx">
                Notes
              </span></label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Add any additional notes..." data-unique-id="5241f42c-5837-452a-85da-64d5b3d28fc7" data-file-name="components/add-returned-part-modal.tsx" />
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-4" data-unique-id="fa2728d6-c032-45cf-8f7d-c8b1babde581" data-file-name="components/add-returned-part-modal.tsx">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" data-unique-id="4c0b2817-3f3d-469d-8d1b-e898304547ef" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="380885c0-1f72-4a58-be40-61aba9f0a238" data-file-name="components/add-returned-part-modal.tsx">
                Cancel
              </span></button>
              <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors" data-unique-id="49649ad9-40b0-4e82-8837-a8d2652b1759" data-file-name="components/add-returned-part-modal.tsx"><span className="editable-text" data-unique-id="6ecf9a54-7e96-4cee-8815-cf397f2cb17a" data-file-name="components/add-returned-part-modal.tsx">
                Add Returned Part
              </span></button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}