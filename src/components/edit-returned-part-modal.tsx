'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, Package, User, FileText, Truck, AlertCircle } from 'lucide-react';
import { ReturnedPart } from './returned-parts-manager';
import toast from 'react-hot-toast';
interface EditReturnedPartModalProps {
  part: ReturnedPart | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPart: ReturnedPart) => void;
}
export default function EditReturnedPartModal({
  part,
  isOpen,
  onClose,
  onSave
}: EditReturnedPartModalProps) {
  const [formData, setFormData] = useState<ReturnedPart | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (part) {
      setFormData({
        ...part
      });
      setErrors({});
    }
  }, [part]);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData?.orderNumber) {
      newErrors.orderNumber = 'Order Number is required';
    }
    if (!formData?.customerName) {
      newErrors.customerName = 'Customer Name is required';
    }
    if (!formData?.customerEmail) {
      newErrors.customerEmail = 'Customer Email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = () => {
    if (!formData || !validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    onSave(formData);
    toast.success('Returned part updated successfully');
    onClose();
  };
  const handleInputChange = (field: keyof ReturnedPart, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  if (!isOpen || !formData) return null;
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} data-unique-id="3b6ef30b-79c4-4076-9f2f-9d769abb9524" data-file-name="components/edit-returned-part-modal.tsx">
        <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="eebc8112-506a-434b-a45e-6e37b17c8753" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50" data-unique-id="24c0d07f-f932-4810-a609-5a07ecc7879e" data-file-name="components/edit-returned-part-modal.tsx">
            <div data-unique-id="6daf542b-b125-4cb1-a01b-2b9c2c19e4ba" data-file-name="components/edit-returned-part-modal.tsx">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center" data-unique-id="5f2cdf17-2928-45c5-ae9c-50a1bba4782b" data-file-name="components/edit-returned-part-modal.tsx">
                <Package className="mr-3 h-6 w-6 text-blue-600" />
                <span className="editable-text" data-unique-id="98564155-5fac-4d38-8eb8-804fd0fcb4a3" data-file-name="components/edit-returned-part-modal.tsx">Edit Returned Part</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="559a55e3-f1a8-4d0a-8bfe-644eb501207f" data-file-name="components/edit-returned-part-modal.tsx">
                <span className="editable-text" data-unique-id="dd913bc6-a6a2-47c3-9670-960ff2e0da87" data-file-name="components/edit-returned-part-modal.tsx">Modify the returned part information</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 transition-colors" data-unique-id="f86f6d2a-d7a1-4f50-8df6-bd4108df69b6" data-file-name="components/edit-returned-part-modal.tsx">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="7f48b15f-7fda-4943-8731-f0cfa5cded4e" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="19322c30-61f9-4a16-99db-28b70335a10f" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
              {/* Part Information */}
              <div className="space-y-4" data-unique-id="22471a18-9906-4735-b2f4-3cd6f2c4710e" data-file-name="components/edit-returned-part-modal.tsx">
                <div data-unique-id="8077ecc8-3de0-42ad-98d4-037d04be4ad8" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="20bef4a7-94ba-4764-8a28-c6ac3450c671" data-file-name="components/edit-returned-part-modal.tsx">
                    <Package className="inline h-4 w-4 mr-1" />
                    <span className="editable-text" data-unique-id="3b735972-a82e-4a8f-b54f-ad8f1257b41f" data-file-name="components/edit-returned-part-modal.tsx">Part Name</span>
                  </label>
                  <input type="text" value={formData.partName} onChange={e => handleInputChange('partName', e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.partName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Enter part name" data-unique-id="ca840101-6f64-4de5-ac3d-0caf6709b2d8" data-file-name="components/edit-returned-part-modal.tsx" />
                  {errors.partName && <p className="mt-1 text-sm text-red-600 flex items-center" data-unique-id="e1a5bc67-ab33-4084-95a4-0e4dad045676" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.partName}
                    </p>}
                </div>

                <div data-unique-id="d036af96-225c-4247-bc92-80d2cc76fa5c" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="731a31eb-b0d4-4f7a-85c5-202ce3ac8766" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="248b103f-8d79-404b-8188-3ad6ce944c9a" data-file-name="components/edit-returned-part-modal.tsx">Part Number</span>
                  </label>
                  <input type="text" value={formData.partNumber} onChange={e => handleInputChange('partNumber', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter part number" data-unique-id="ac76de17-0586-4b5d-89d3-73f798fc6483" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="4ac27a4f-e674-42dc-b7f0-597abe1bf8b8" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="4ac9eb50-c0d9-4e15-958f-dd0f24adeb9e" data-file-name="components/edit-returned-part-modal.tsx">
                    <User className="inline h-4 w-4 mr-1" />
                    <span className="editable-text" data-unique-id="9b9c15a6-f98f-4a0e-96ae-1386a492b4fb" data-file-name="components/edit-returned-part-modal.tsx">Customer Name</span>
                  </label>
                  <input type="text" value={formData.customerName} onChange={e => handleInputChange('customerName', e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Enter customer name" data-unique-id="dec93732-daac-424d-9eb4-a0848e3092cc" data-file-name="components/edit-returned-part-modal.tsx" />
                  {errors.customerName && <p className="mt-1 text-sm text-red-600 flex items-center" data-unique-id="c05557a3-0546-4ef9-a0bf-d02a6b2d9e21" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.customerName}
                    </p>}
                </div>

                <div data-unique-id="5261b117-0f73-4c99-a863-b1a1ef3fb5e0" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="bd724864-1e60-44e5-9632-a77acabe95f7" data-file-name="components/edit-returned-part-modal.tsx">
                    <FileText className="inline h-4 w-4 mr-1" />
                    <span className="editable-text" data-unique-id="a424a647-a9ed-4ce5-8958-7385c15451c5" data-file-name="components/edit-returned-part-modal.tsx">Order Number</span>
                  </label>
                  <input type="text" value={formData.orderNumber} onChange={e => handleInputChange('orderNumber', e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.orderNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Enter order number" data-unique-id="6b08d2b6-3db1-4932-93fd-0ad356525977" data-file-name="components/edit-returned-part-modal.tsx" />
                  {errors.orderNumber && <p className="mt-1 text-sm text-red-600 flex items-center" data-unique-id="237dcd0a-fad2-4fa7-bb29-3ba4db74fa3e" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.orderNumber}
                    </p>}
                </div>
              </div>

              {/* Shipping & Status Information */}
              <div className="space-y-4" data-unique-id="1043661f-8338-47e9-bce9-1cd75629a50c" data-file-name="components/edit-returned-part-modal.tsx">
                <div data-unique-id="d6b3fb92-3ac8-4dcf-bd38-28ab269b102b" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="13b10698-2e23-4ece-9a5d-fde28114c4e1" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="5f2ed8d4-4355-40cf-ab08-9d32307afe69" data-file-name="components/edit-returned-part-modal.tsx">Return Reason</span>
                  </label>
                  <select value={formData.returnReason} onChange={e => handleInputChange('returnReason', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="26a9c8ef-9e8b-4c9f-8e7d-85ea0c9b8adb" data-file-name="components/edit-returned-part-modal.tsx">
                    <option value="Defective" data-unique-id="13f11abc-8afe-40b2-bc52-5f3c67bf945d" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="62761d2a-2432-4308-846b-498ae9f425fa" data-file-name="components/edit-returned-part-modal.tsx">Defective</span></option>
                    <option value="Wrong Part" data-unique-id="6b4008dd-c721-484a-9d28-708a93a943d1" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="e2b1d812-c6a7-4e7c-a59a-d9b94ec58800" data-file-name="components/edit-returned-part-modal.tsx">Wrong Part</span></option>
                    <option value="Not Needed" data-unique-id="f5bba011-2ab1-4dd3-a908-422325aa301b" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="0b8a616a-678b-4030-8ed6-c058d5f8cccc" data-file-name="components/edit-returned-part-modal.tsx">Not Needed</span></option>
                    <option value="Warranty" data-unique-id="b8712c55-834a-4a1a-b92f-c1247616c5c7" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="7863c8e9-013c-45fb-8a57-456c1a9baf9c" data-file-name="components/edit-returned-part-modal.tsx">Warranty</span></option>
                    <option value="Customer Changed Mind" data-unique-id="120e6382-29d4-4cb5-9f01-cb9ecc9a36fd" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="a0d3e522-67e5-49e0-82d9-a88c081bbbce" data-file-name="components/edit-returned-part-modal.tsx">Customer Changed Mind</span></option>
                    <option value="Damaged in Shipping" data-unique-id="1dd42442-a11a-4082-b37d-43ec291be2ce" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="80b63946-b995-4bc5-9170-6c2d66caa811" data-file-name="components/edit-returned-part-modal.tsx">Damaged in Shipping</span></option>
                    <option value="Other" data-unique-id="b2de0ca3-8fa1-44dc-b65d-632bf129c7b0" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="6608cfed-ae89-4427-a0d4-49d75d0afdd0" data-file-name="components/edit-returned-part-modal.tsx">Other</span></option>
                  </select>
                </div>

                <div data-unique-id="94ec98c1-c71d-44d4-b0c0-07f270a5b319" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="aa445e46-4bbe-47b8-98c2-729f1625f731" data-file-name="components/edit-returned-part-modal.tsx">
                    <Truck className="inline h-4 w-4 mr-1" />
                    <span className="editable-text" data-unique-id="f1cda5ce-a7b5-4981-9824-e60f757af666" data-file-name="components/edit-returned-part-modal.tsx">Tracking Number</span>
                  </label>
                  <input type="text" value={formData.trackingNumber} onChange={e => handleInputChange('trackingNumber', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter tracking number" data-unique-id="46cca9c6-0f6c-42c2-ab17-8e70fb67040c" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="be6a5461-a200-4599-b4a9-7d940b633f67" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="f5fd6fbf-ab74-4f82-ac44-b25fd6f6dc4b" data-file-name="components/edit-returned-part-modal.tsx">
                    <Calendar className="inline h-4 w-4 mr-1" data-unique-id="2b42aca8-e8ba-4eb4-8bbf-821bcbf69539" data-file-name="components/edit-returned-part-modal.tsx" />
                    <span className="editable-text" data-unique-id="bb856c70-6add-4b78-8821-639bc340d501" data-file-name="components/edit-returned-part-modal.tsx">Shipped Date</span>
                  </label>
                  <input type="date" value={formData.shippedDate} onChange={e => handleInputChange('shippedDate', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="e3f93dbb-9bfe-4a78-aa9a-b4a2d4a19948" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="0aa65607-559b-4b56-8c32-acbb3b389943" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="d693c433-83e0-4314-bab1-0a4c239446d4" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="8575dc9a-a866-4e9c-bede-4756f19362e0" data-file-name="components/edit-returned-part-modal.tsx">Expected Arrival</span>
                  </label>
                  <input type="date" value={formData.expectedArrival} onChange={e => handleInputChange('expectedArrival', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="61a9dcf4-92e2-4ede-9aa8-c2de5c069fc0" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="dc6e7a55-7502-4206-b719-ef5d20a731de" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="96025ed5-e7c8-43f7-bb00-da5eb6506fd7" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="a6084582-2fb2-47e7-941c-6c1a51478187" data-file-name="components/edit-returned-part-modal.tsx">Status</span>
                  </label>
                  <select value={formData.status} onChange={e => handleInputChange('status', e.target.value as ReturnedPart['status'])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="5872fcd9-8405-4cce-9520-5677a520e59f" data-file-name="components/edit-returned-part-modal.tsx">
                    <option value="shipped" data-unique-id="a3acd262-7113-48b2-b6e1-4da2fa63e0da" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="2063dbd6-6539-42eb-b50a-bda4f8c41ae8" data-file-name="components/edit-returned-part-modal.tsx">Shipped</span></option>
                    <option value="in_transit" data-unique-id="2d0ff9af-4c0f-4ef2-bae9-5c0d3f756e13" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="e76bffca-c20c-43d7-897b-e19711b8c0f0" data-file-name="components/edit-returned-part-modal.tsx">In Transit</span></option>
                    <option value="arrived" data-unique-id="4a64c71e-ecec-44e1-aee4-9c466e2201ce" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="43aac56a-ba6f-4b4a-984f-e01e74163ba4" data-file-name="components/edit-returned-part-modal.tsx">Arrived</span></option>
                    <option value="inspecting" data-unique-id="f94633a1-525c-473d-a5eb-c7fa1e586780" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="be156ea1-abcb-455a-9bca-0adccdd30ad7" data-file-name="components/edit-returned-part-modal.tsx">Inspecting</span></option>
                    <option value="inspected" data-unique-id="8fc0a7ab-c6a3-4420-9688-f024722746e1" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="067ec2ee-4c72-48d8-b8e2-9b84f45458ca" data-file-name="components/edit-returned-part-modal.tsx">Inspected</span></option>
                    <option value="processed" data-unique-id="6d8ef3fb-abe4-4811-bc85-c01bdc49ae06" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="48132651-e769-4a81-99f3-b22393dc9e7e" data-file-name="components/edit-returned-part-modal.tsx">Processed</span></option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6" data-unique-id="1a428168-8a69-4173-9a81-0c91a8897567" data-file-name="components/edit-returned-part-modal.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="fe4fc323-9ea4-430d-b216-6a2de17d6853" data-file-name="components/edit-returned-part-modal.tsx">
                <FileText className="inline h-4 w-4 mr-1" />
                <span className="editable-text" data-unique-id="4df383ad-c084-4e92-9b22-9b29a9d0b405" data-file-name="components/edit-returned-part-modal.tsx">Notes</span>
              </label>
              <textarea value={formData.notes || ''} onChange={e => handleInputChange('notes', e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Add any additional notes..." data-unique-id="9e702082-8d96-4f24-920d-ad377ff35494" data-file-name="components/edit-returned-part-modal.tsx" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50 space-x-3" data-unique-id="1ceda6f0-6d52-4749-9302-10cb414b5341" data-file-name="components/edit-returned-part-modal.tsx">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-unique-id="ad8e951c-d3c3-48c4-8590-b7a868bb5be3" data-file-name="components/edit-returned-part-modal.tsx">
              <span className="editable-text" data-unique-id="a09d8884-4cfe-47eb-829d-c5bab1ed7bc2" data-file-name="components/edit-returned-part-modal.tsx">Cancel</span>
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center" data-unique-id="3b0be8ea-e67e-42e8-91c6-d403ec07c78d" data-file-name="components/edit-returned-part-modal.tsx">
              <Save className="h-4 w-4 mr-2" />
              <span className="editable-text" data-unique-id="b85b7975-a144-49bb-bb77-1b8f2553262a" data-file-name="components/edit-returned-part-modal.tsx">Save Changes</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}