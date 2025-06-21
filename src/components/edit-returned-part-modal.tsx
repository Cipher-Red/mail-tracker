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
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} data-unique-id="98a8db5d-3418-4f59-aecc-2e5b30b6f97d" data-file-name="components/edit-returned-part-modal.tsx">
        <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="b82d32ed-0111-4ad4-b2c5-346f9b3f5e75" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50" data-unique-id="b52f8848-1719-4d4c-afde-c67f73305b20" data-file-name="components/edit-returned-part-modal.tsx">
            <div data-unique-id="5aac9b5e-198a-4cd4-87f6-f9770e4aef09" data-file-name="components/edit-returned-part-modal.tsx">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center" data-unique-id="1cb440ab-4382-4be4-be31-c26bd3204336" data-file-name="components/edit-returned-part-modal.tsx">
                <Package className="mr-3 h-6 w-6 text-blue-600" />
                <span className="editable-text" data-unique-id="978d0e4b-546f-422c-90de-89f72adcf85a" data-file-name="components/edit-returned-part-modal.tsx">Edit Returned Part</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1" data-unique-id="9ad34d0d-771b-4aa8-97b1-22797e479f43" data-file-name="components/edit-returned-part-modal.tsx">
                <span className="editable-text" data-unique-id="8c9bc1bd-bf53-42f5-9995-6cd173d775ea" data-file-name="components/edit-returned-part-modal.tsx">Modify the returned part information</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 transition-colors" data-unique-id="c2e3ecd6-3cae-4426-bc9a-166091abaeaa" data-file-name="components/edit-returned-part-modal.tsx">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="9529593d-b317-4563-bede-7b49b065999c" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="caef1675-1849-4045-bbbe-a4bc4e30e219" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
              {/* Customer & Order Information */}
              <div className="space-y-4" data-unique-id="a37b5275-a0f0-4ad1-9142-96c4a6381120" data-file-name="components/edit-returned-part-modal.tsx">
                <div data-unique-id="4c34c472-a7ae-4f97-bd91-76b33452a20e" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="80190ccc-4dbb-4b91-afbf-36c7f55c7c72" data-file-name="components/edit-returned-part-modal.tsx">
                    <User className="inline h-4 w-4 mr-1" />
                    <span className="editable-text" data-unique-id="2fc3b4df-89ee-415b-91b0-f199b1c7261b" data-file-name="components/edit-returned-part-modal.tsx">Customer Name</span>
                  </label>
                  <input type="text" value={formData.customerName} onChange={e => handleInputChange('customerName', e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Enter customer name" data-unique-id="ce645ba3-6a8f-496b-a61b-9431367008be" data-file-name="components/edit-returned-part-modal.tsx" />
                  {errors.customerName && <p className="mt-1 text-sm text-red-600 flex items-center" data-unique-id="2df89cdc-54cb-44b7-82e0-ea8192640681" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.customerName}
                    </p>}
                </div>

                <div data-unique-id="cacba51e-7fd7-4410-96b5-be13d3882f8e" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="03b33097-a823-4f6c-aef9-f42b84b45b6c" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="eae778d5-b353-4b78-a7b9-09d61f790abc" data-file-name="components/edit-returned-part-modal.tsx">Customer Email</span>
                  </label>
                  <input type="email" value={formData.customerEmail} onChange={e => handleInputChange('customerEmail', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter customer email" data-unique-id="12e83ba3-fecb-4d7a-8f27-52e5ab8dbd18" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="badd56e7-86cd-482f-8420-958e15af4cdc" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="7317f330-61e4-41d4-b5fe-e381a0f4683c" data-file-name="components/edit-returned-part-modal.tsx">
                    <FileText className="inline h-4 w-4 mr-1" />
                    <span className="editable-text" data-unique-id="4bdd2f5f-83fb-439d-833e-898f15da850a" data-file-name="components/edit-returned-part-modal.tsx">Order Number</span>
                  </label>
                  <input type="text" value={formData.orderNumber} onChange={e => handleInputChange('orderNumber', e.target.value)} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.orderNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Enter order number" data-unique-id="95997fcf-c9a5-4234-98d7-a891342f66c1" data-file-name="components/edit-returned-part-modal.tsx" />
                  {errors.orderNumber && <p className="mt-1 text-sm text-red-600 flex items-center" data-unique-id="3fa47409-04df-4b39-b8cb-fa429f0b59e8" data-file-name="components/edit-returned-part-modal.tsx" data-dynamic-text="true">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.orderNumber}
                    </p>}
                </div>
              </div>

              {/* Shipping & Status Information */}
              <div className="space-y-4" data-unique-id="81012e13-9edb-46d6-a694-453a1f25adae" data-file-name="components/edit-returned-part-modal.tsx">
                <div data-unique-id="b62742b6-014c-4d74-a2c3-27b70418f3bf" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="8db46998-d21a-45c4-8c81-3814080045f6" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="f74fe33b-7742-4ba5-9fa9-2498bbee8f11" data-file-name="components/edit-returned-part-modal.tsx">Return Reason</span>
                  </label>
                  <select value={formData.returnReason} onChange={e => handleInputChange('returnReason', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="843e1e85-5fe1-465c-a319-8b22e59ded6c" data-file-name="components/edit-returned-part-modal.tsx">
                    <option value="Defective" data-unique-id="4b2e8cc4-da39-4d7d-9d67-d546fc1c4c84" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="e091f28d-5c4f-456b-984a-28005b1ae285" data-file-name="components/edit-returned-part-modal.tsx">Defective</span></option>
                    <option value="Wrong Part" data-unique-id="f3bc2096-76ec-4f3b-b56e-d9d541eff4fd" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="eb0a1da3-f335-4ede-8a19-8b487b421220" data-file-name="components/edit-returned-part-modal.tsx">Wrong Part</span></option>
                    <option value="Not Needed" data-unique-id="170e913d-b9f2-431e-bff4-4ff9b83c15b2" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="4bd66f56-9617-47c4-8529-a98748d36b64" data-file-name="components/edit-returned-part-modal.tsx">Not Needed</span></option>
                    <option value="Warranty" data-unique-id="66451388-7fec-4f7a-9fb9-4a65ccc88c49" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="300c924f-fd8d-4dba-b4b8-f9bba309671c" data-file-name="components/edit-returned-part-modal.tsx">Warranty</span></option>
                    <option value="Customer Changed Mind" data-unique-id="4e4c1deb-2646-4b43-94b3-a8cde928bd79" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="810eded0-9c2f-41f3-9114-0bbf4e9d53c6" data-file-name="components/edit-returned-part-modal.tsx">Customer Changed Mind</span></option>
                    <option value="Damaged in Shipping" data-unique-id="6b94c231-eb77-4454-8750-9e4a65525718" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="cdfb0766-9604-4b2b-af7b-93272f2a2e68" data-file-name="components/edit-returned-part-modal.tsx">Damaged in Shipping</span></option>
                    <option value="Other" data-unique-id="8dda80a1-6b4b-4e81-86fc-2efae18c4909" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="e4d822d3-99b6-4740-9961-c75d6753a7db" data-file-name="components/edit-returned-part-modal.tsx">Other</span></option>
                  </select>
                </div>

                <div data-unique-id="7c2782ef-5a77-46e6-893a-ee72f3406ccd" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="41286f4c-0190-438e-984a-b69d3214e014" data-file-name="components/edit-returned-part-modal.tsx">
                    <Truck className="inline h-4 w-4 mr-1" />
                    <span className="editable-text" data-unique-id="2bafb1d3-8aff-4892-9fff-498ea2c2843d" data-file-name="components/edit-returned-part-modal.tsx">Tracking Number</span>
                  </label>
                  <input type="text" value={formData.trackingNumber} onChange={e => handleInputChange('trackingNumber', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter tracking number" data-unique-id="7f0587e9-0af5-4369-92e3-29a3faea3914" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="2e5419b7-2443-4c30-a58c-3d015f019d4a" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="64558ed9-2325-430e-a6d7-ee4635dc0c85" data-file-name="components/edit-returned-part-modal.tsx">
                    <Calendar className="inline h-4 w-4 mr-1" data-unique-id="d7d92cba-4530-4238-b69d-03987908c5e9" data-file-name="components/edit-returned-part-modal.tsx" />
                    <span className="editable-text" data-unique-id="5288734c-4bd6-4dc1-b394-a4bfc6c53713" data-file-name="components/edit-returned-part-modal.tsx">Shipped Date</span>
                  </label>
                  <input type="date" value={formData.shippedDate} onChange={e => handleInputChange('shippedDate', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="25c140dd-5ec6-4e38-9e29-6be121424a54" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="f3a14f37-bd5f-4ffa-9e8d-6b1ccb01343c" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="47a6d5ed-b70e-4e1a-9d85-0c879fede3f3" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="589e593c-7043-4558-b8b1-db8f679aaece" data-file-name="components/edit-returned-part-modal.tsx">Expected Arrival</span>
                  </label>
                  <input type="date" value={formData.expectedArrival} onChange={e => handleInputChange('expectedArrival', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="dff452b1-5872-47f3-98f3-cde9aba8c7c2" data-file-name="components/edit-returned-part-modal.tsx" />
                </div>

                <div data-unique-id="aace7dfe-45bd-41cd-a078-f98a18af917f" data-file-name="components/edit-returned-part-modal.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="a8a1f4ba-633e-4f4f-b710-caeb70b5792e" data-file-name="components/edit-returned-part-modal.tsx">
                    <span className="editable-text" data-unique-id="585f1319-76b3-4341-84b3-af71e46dc9c1" data-file-name="components/edit-returned-part-modal.tsx">Status</span>
                  </label>
                  <select value={formData.status} onChange={e => handleInputChange('status', e.target.value as ReturnedPart['status'])} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="6a0f3d3a-2a1c-427c-86b5-7e1e61490ffb" data-file-name="components/edit-returned-part-modal.tsx">
                    <option value="shipped" data-unique-id="71d4dd0e-2ca9-4aab-8491-08a64c6f90f9" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="c0caabee-57a8-4b18-bc08-6c12da746c95" data-file-name="components/edit-returned-part-modal.tsx">Shipped</span></option>
                    <option value="in_transit" data-unique-id="304ad9df-f025-462c-aa61-dffe7cd53522" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="53a22569-9c4a-4d87-9c84-36061a0506ae" data-file-name="components/edit-returned-part-modal.tsx">In Transit</span></option>
                    <option value="arrived" data-unique-id="057931dc-178d-4c6f-9ce3-0d6f9f629265" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="13511b66-02b1-41de-96c0-89aab71ff346" data-file-name="components/edit-returned-part-modal.tsx">Arrived</span></option>
                    <option value="inspecting" data-unique-id="dfd2f284-4948-47ef-b932-58889522e414" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="95e8b431-00ac-4735-abaf-b69cd5170e59" data-file-name="components/edit-returned-part-modal.tsx">Inspecting</span></option>
                    <option value="inspected" data-unique-id="ea45ccdb-8b6a-4c6f-8cfc-e755481b31b3" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="d19ba597-372d-4504-9084-eb4dda1d97f8" data-file-name="components/edit-returned-part-modal.tsx">Inspected</span></option>
                    <option value="processed" data-unique-id="db48fb33-da8f-4332-9955-4e01b288d55e" data-file-name="components/edit-returned-part-modal.tsx"><span className="editable-text" data-unique-id="8b91a9f8-a6eb-4388-805d-4125ba7ecf47" data-file-name="components/edit-returned-part-modal.tsx">Processed</span></option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6" data-unique-id="67935f3a-f17e-4401-9924-f669409342b0" data-file-name="components/edit-returned-part-modal.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="eb67fb06-eb1f-44c7-a6ab-01bfbfac2fd6" data-file-name="components/edit-returned-part-modal.tsx">
                <FileText className="inline h-4 w-4 mr-1" />
                <span className="editable-text" data-unique-id="a6047832-e347-4880-8f57-07058f08819d" data-file-name="components/edit-returned-part-modal.tsx">Notes</span>
              </label>
              <textarea value={formData.notes || ''} onChange={e => handleInputChange('notes', e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Add any additional notes..." data-unique-id="38fe3bc8-ee01-495d-9321-6c61c3d02d5c" data-file-name="components/edit-returned-part-modal.tsx" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50 space-x-3" data-unique-id="2accf2b9-c916-4304-82e0-c13da7e30e9f" data-file-name="components/edit-returned-part-modal.tsx">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-unique-id="56a74cfd-734c-4b30-bb63-51dacafa1846" data-file-name="components/edit-returned-part-modal.tsx">
              <span className="editable-text" data-unique-id="95279f10-491f-4adb-a9b1-c69c4b66838f" data-file-name="components/edit-returned-part-modal.tsx">Cancel</span>
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center" data-unique-id="f4eddabb-94cf-46dc-90e4-a51fcdeec785" data-file-name="components/edit-returned-part-modal.tsx">
              <Save className="h-4 w-4 mr-2" />
              <span className="editable-text" data-unique-id="3de33f37-d6a3-4fac-8bf1-e6a8135e6cfa" data-file-name="components/edit-returned-part-modal.tsx">Save Changes</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}