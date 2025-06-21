'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package2, Plus, Search, Bell, Clock, CheckCircle, AlertCircle, Calendar, Truck, FileText, Eye, Edit, Trash2, FileSpreadsheet, Download, Mail, Share } from 'lucide-react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { useNotificationStore } from '@/lib/notification-store';
import { supabase } from '@/lib/supabase-client';
import ReturnedPartCard from './returned-part-card';
import AddReturnedPartModal from './add-returned-part-modal';
import SmartExcelProcessor from './smart-excel-processor';
import EditReturnedPartModal from './edit-returned-part-modal';
import NotificationCenter from './notification-center';
import RealTimeNotifications from './real-time-notifications';
import NotificationToast from './notification-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
export interface ReturnedPart {
  id: string;
  partName: string;
  partNumber: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  returnReason: string;
  trackingNumber: string;
  shippedDate: string;
  expectedArrival: string;
  arrivedDate?: string;
  inspectionDate?: string;
  status: 'shipped' | 'in_transit' | 'arrived' | 'inspecting' | 'inspected' | 'processed';
  notes?: string;
  createdAt: string;
  dropOffTime?: string;
  deliveryLocation?: string;
}
export default function ReturnedPartsManager() {
  const router = useRouter();
  const [returnedParts, setReturnedParts] = useState<ReturnedPart[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSmartProcessor, setShowSmartProcessor] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPart, setEditingPart] = useState<ReturnedPart | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Notification store
  const {
    addNotification,
    toastNotifications,
    removeToastNotification
  } = useNotificationStore();

  // Load returned parts from localStorage on mount
  useEffect(() => {
    const savedParts = getLocalStorage<ReturnedPart[]>('returnedParts', []);
    setReturnedParts(savedParts);
    checkForNotifications(savedParts);
    setupRealtimeSubscription();
  }, []);

  // Save to localStorage whenever parts change
  useEffect(() => {
    setLocalStorage('returnedParts', returnedParts);
    checkForNotifications(returnedParts);
  }, [returnedParts]);

  // Set up real-time subscription for returned parts
  const setupRealtimeSubscription = () => {
    if (!supabase) return;
    const channel = supabase.channel('returned_parts_realtime').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'returned_parts'
    }, payload => {
      handleRealtimeUpdate(payload);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Handle real-time updates
  const handleRealtimeUpdate = (payload: any) => {
    const {
      eventType,
      new: newRecord,
      old: oldRecord
    } = payload;
    switch (eventType) {
      case 'INSERT':
        {
          // New return added
          addNotification({
            type: 'new_return',
            title: 'New Return Received',
            message: `${newRecord.part_name} (${newRecord.part_number}) has been returned by ${newRecord.customer_name}`,
            priority: 'medium',
            partId: newRecord.id,
            data: newRecord
          });

          // Update local state
          const newPart: ReturnedPart = {
            id: newRecord.id,
            partName: newRecord.part_name,
            partNumber: newRecord.part_number,
            customerName: newRecord.customer_name,
            customerEmail: newRecord.customer_email || '',
            orderNumber: newRecord.order_number,
            returnReason: newRecord.return_reason,
            trackingNumber: newRecord.tracking_number,
            shippedDate: newRecord.shipped_date,
            expectedArrival: newRecord.expected_arrival,
            status: newRecord.status,
            notes: newRecord.notes,
            createdAt: newRecord.created_at
          };
          setReturnedParts(prev => [newPart, ...prev]);
          break;
        }
      case 'UPDATE':
        {
          if (oldRecord.status !== newRecord.status) {
            const priority = getStatusChangePriority(newRecord.status);
            addNotification({
              type: 'status_change',
              title: 'Status Updated',
              message: `${newRecord.part_name} status changed from ${formatStatus(oldRecord.status)} to ${formatStatus(newRecord.status)}`,
              priority,
              partId: newRecord.id,
              data: newRecord
            });
          }

          // Update local state
          setReturnedParts(prev => prev.map(part => part.id === newRecord.id ? {
            ...part,
            status: newRecord.status
          } : part));
          break;
        }
    }
  };
  const getStatusChangePriority = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'high' as const;
      case 'inspected':
        return 'medium' as const;
      case 'processed':
        return 'low' as const;
      default:
        return 'medium' as const;
    }
  };
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Check for notifications based on arrival and inspection dates
  const checkForNotifications = (parts: ReturnedPart[]) => {
    const now = new Date();
    const newNotifications: any[] = [];
    parts.forEach(part => {
      // Check for arrival notifications
      if (part.status === 'in_transit' && part.expectedArrival) {
        const expectedDate = new Date(part.expectedArrival);
        if (now >= expectedDate && !part.arrivedDate) {
          // Mark as arrived and add notification
          newNotifications.push({
            id: `arrival-${part.id}`,
            type: 'arrival',
            partId: part.id,
            title: 'Parts Arrived',
            message: `${part.partName} (${part.partNumber}) has arrived and is ready for inspection`,
            timestamp: now.toISOString(),
            read: false
          });
        }
      }

      // Check for inspection completion notifications
      if (part.arrivedDate && part.status === 'arrived') {
        const arrivedDate = new Date(part.arrivedDate);
        const inspectionDue = new Date(arrivedDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days after arrival

        if (now >= inspectionDue && !part.inspectionDate) {
          newNotifications.push({
            id: `inspection-${part.id}`,
            type: 'inspection',
            partId: part.id,
            title: 'Inspection Complete',
            message: `${part.partName} (${part.partNumber}) has completed its 2-day inspection period`,
            timestamp: now.toISOString(),
            read: false
          });
        }
      }
    });
    setNotifications(newNotifications);
  };

  // Add new returned part
  const addReturnedPart = (partData: Omit<ReturnedPart, 'id' | 'createdAt'>) => {
    const newPart: ReturnedPart = {
      ...partData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setReturnedParts(prev => [newPart, ...prev]);
    setShowAddModal(false);

    // Add notification for new return
    addNotification({
      type: 'new_return',
      title: 'New Return Added',
      message: `${newPart.partName} (${newPart.partNumber}) has been added to tracking`,
      priority: 'medium',
      partId: newPart.id,
      data: newPart
    });
  };

  // Process multiple parts from Excel
  const processReturnedParts = (parts: ReturnedPart[]) => {
    console.log('Processing imported parts:', parts);
    const updatedParts = [...returnedParts, ...parts];
    console.log('Updated parts list:', updatedParts);
    setReturnedParts(updatedParts);
    setShowSmartProcessor(false);

    // Add success notification
    addNotification({
      type: 'new_return',
      title: 'Parts Imported Successfully',
      message: `${parts.length} returned parts have been imported from Excel`,
      priority: 'medium',
      data: {
        count: parts.length
      }
    });
  };

  // Export returned parts in unified order format
  const exportReturnedPartsAsOrders = () => {
    if (returnedParts.length === 0) {
      toast.error('No returned parts to export');
      return;
    }
    try {
      toast.loading('Preparing export...', {
        id: 'export'
      });

      // Convert returned parts to order format
      const orderData = returnedParts.map(part => ({
        'Customer Order Number': part.orderNumber,
        'Ship To Name': part.customerName,
        'Ship To Phone': '',
        // Not available in returned parts
        'Ship To Line1': '',
        // Not available in returned parts
        'Ship To City': '',
        // Not available in returned parts  
        'Ship To State Province': '',
        // Not available in returned parts
        'Ship To Postal Code': '',
        // Not available in returned parts
        'Order Total': 0,
        // Not available in returned parts
        'Actual Ship Date': part.shippedDate,
        'Tracking Link(s)': part.trackingNumber,
        'Order Source': 'Returned Parts System',
        'Order Summary': `${part.partName} (${part.partNumber}) - Return Reason: ${part.returnReason}`,
        'Order Status': 'New',
        'Shipping Status': 'Shipped',
        // Export metadata
        'Export Format': 'DetroitAxleOrderData-v1.0',
        'Exported At': new Date().toISOString(),
        // Returned parts specific data
        'Return Reason': part.returnReason,
        'Part Name': part.partName,
        'Part Number': part.partNumber,
        'Return Status': part.status,
        'Expected Arrival': part.expectedArrival,
        'Notes': part.notes || '',
        'Return Created At': part.createdAt
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(orderData);

      // Set column widths
      const wscols = [{
        wch: 20
      },
      // Customer Order Number
      {
        wch: 20
      },
      // Ship To Name
      {
        wch: 15
      },
      // Ship To Phone
      {
        wch: 25
      },
      // Ship To Line1
      {
        wch: 15
      },
      // Ship To City
      {
        wch: 10
      },
      // Ship To State Province
      {
        wch: 12
      },
      // Ship To Postal Code
      {
        wch: 12
      },
      // Order Total
      {
        wch: 15
      },
      // Actual Ship Date
      {
        wch: 20
      },
      // Tracking Link(s)
      {
        wch: 15
      },
      // Order Source
      {
        wch: 40
      },
      // Order Summary
      {
        wch: 10
      },
      // Order Status
      {
        wch: 15
      },
      // Shipping Status
      {
        wch: 25
      },
      // Export Format
      {
        wch: 15
      },
      // Exported At
      {
        wch: 20
      },
      // Return Reason
      {
        wch: 25
      },
      // Part Name
      {
        wch: 15
      },
      // Part Number
      {
        wch: 15
      },
      // Return Status
      {
        wch: 15
      },
      // Expected Arrival
      {
        wch: 30
      },
      // Notes
      {
        wch: 15
      } // Return Created At
      ];
      ws['!cols'] = wscols;
      XLSX.utils.book_append_sheet(wb, ws, 'Returned Parts as Orders');

      // Generate filename
      const filename = `returned-parts-as-orders-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      toast.success(`Exported ${returnedParts.length} returned parts as order format`, {
        id: 'export'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: 'export'
      });
    }
  };

  // Clear all returned parts data
  const clearAllData = () => {
    if (returnedParts.length === 0) {
      toast.error('No data to clear');
      return;
    }

    // Check if we're in browser environment first
    if (typeof window === 'undefined') {
      return;
    }
    const handleClearConfirmation = () => {
      if (window.confirm('Are you sure you want to remove ALL returned parts data from the system? This action cannot be undone.')) {
        try {
          // Clear parts from state
          setReturnedParts([]);

          // Clear parts from localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('returnedParts');
              localStorage.removeItem('returnedPartsLastUpdated');
            } catch (err) {
              console.warn('Could not clear localStorage:', err);
            }
          }
          toast.success('All returned parts data has been cleared from the system');
        } catch (error) {
          console.error('Error clearing returned parts data:', error);
          toast.error(`Failed to clear data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };
    handleClearConfirmation();
  };

  // Handle editing a part
  const handleEditPart = (part: ReturnedPart) => {
    setEditingPart(part);
    setShowEditModal(true);
  };

  // Handle saving edited part
  const handleSaveEditedPart = (updatedPart: ReturnedPart) => {
    const updatedParts = returnedParts.map(part => part.id === updatedPart.id ? updatedPart : part);
    setReturnedParts(updatedParts);
    setShowEditModal(false);
    setEditingPart(null);

    // Add notification for part update
    addNotification({
      type: 'status_change',
      title: 'Part Updated',
      message: `${updatedPart.partName} (${updatedPart.partNumber}) has been updated`,
      priority: 'low',
      partId: updatedPart.id,
      data: updatedPart
    });
  };

  // Update part status
  const updatePartStatus = (id: string, updates: Partial<ReturnedPart>) => {
    setReturnedParts(prev => prev.map(part => part.id === id ? {
      ...part,
      ...updates
    } : part));
  };

  // Mark part as arrived
  const markAsArrived = (id: string) => {
    const now = new Date().toISOString();
    const part = returnedParts.find(p => p.id === id);
    updatePartStatus(id, {
      status: 'arrived',
      arrivedDate: now
    });
    if (part) {
      addNotification({
        type: 'status_change',
        title: 'Part Arrived',
        message: `${part.partName} (${part.partNumber}) has arrived and is ready for inspection`,
        priority: 'high',
        partId: id,
        data: part
      });
    }
  };

  // Mark inspection as complete
  const markInspectionComplete = (id: string) => {
    const now = new Date().toISOString();
    const part = returnedParts.find(p => p.id === id);
    updatePartStatus(id, {
      status: 'inspected',
      inspectionDate: now
    });
    if (part) {
      addNotification({
        type: 'status_change',
        title: 'Inspection Complete',
        message: `${part.partName} (${part.partNumber}) inspection has been completed`,
        priority: 'medium',
        partId: id,
        data: part
      });
    }
  };

  // Filter parts based on search and status
  const filteredParts = returnedParts.filter(part => {
    const matchesSearch = searchQuery === '' || part.partName.toLowerCase().includes(searchQuery.toLowerCase()) || part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) || part.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || part.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status counts for filter buttons
  const statusCounts = returnedParts.reduce((acc, part) => {
    acc[part.status] = (acc[part.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return <div className="container mx-auto max-w-7xl" data-unique-id="fc4338d2-6a3e-4f7d-b339-386c869e4847" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="flex items-center justify-between mb-8" data-unique-id="62c5e086-5dd5-46f7-b4e2-5c4ef6752eea" data-file-name="components/returned-parts-manager.tsx">
        <div className="flex items-center gap-3" data-unique-id="2ff1b2f2-0c7c-4397-9573-88365b775a58" data-file-name="components/returned-parts-manager.tsx">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center" data-unique-id="89637d3e-4b1b-4c7c-9def-459e7b9e87c1" data-file-name="components/returned-parts-manager.tsx">
            <Package2 className="h-6 w-6 text-white" />
          </div>
          <div data-unique-id="ea40b7d4-6669-4f04-a4f8-f9090fa4bc37" data-file-name="components/returned-parts-manager.tsx">
            <h1 className="text-3xl font-bold text-gray-800" data-unique-id="097b8795-5146-4b04-88ef-3df495051b6e" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="b2ae282f-2eb6-4d14-b1cc-97efc5b79fbf" data-file-name="components/returned-parts-manager.tsx">Returned Parts & Tracking</span></h1>
            <p className="text-gray-600" data-unique-id="896fd72b-820a-4fd7-977e-93c8ec0a4a98" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="22b52ac6-3869-4cb3-8c42-b5fa6a5bad05" data-file-name="components/returned-parts-manager.tsx">Track returned parts, arrivals, and inspection status</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4" data-unique-id="b7ab6f77-af68-4a0e-9e34-e6c448ce2e8e" data-file-name="components/returned-parts-manager.tsx">
          <RealTimeNotifications onNotificationClick={notification => {
          // Handle notification click - could navigate to specific part
          if (notification.partId) {
            const element = document.getElementById(`part-${notification.partId}`);
            element?.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }} />
          <NotificationCenter notifications={notifications} />
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors" data-unique-id="2da8882b-fdfe-4ea1-8f42-d885b507f3c4" data-file-name="components/returned-parts-manager.tsx">
            <Plus className="h-4 w-4" /><span className="editable-text" data-unique-id="d745e76a-54b1-427f-a0e7-3da6a4f1490e" data-file-name="components/returned-parts-manager.tsx">
            Add Returned Part
          </span></button>
          <button onClick={() => setShowSmartProcessor(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl" data-unique-id="13bb23ae-0222-4114-8946-70dfcc0b8d57" data-file-name="components/returned-parts-manager.tsx">
            <FileSpreadsheet className="h-4 w-4" /><span className="editable-text" data-unique-id="475f8897-b5b4-477a-9cd4-75c0c4766873" data-file-name="components/returned-parts-manager.tsx">
            Smart Import
          </span></button>
          <button onClick={exportReturnedPartsAsOrders} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" data-unique-id="c7e59a8c-a06a-465e-99fb-74ad202498e1" data-file-name="components/returned-parts-manager.tsx">
            <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="da686666-10cd-4402-a32c-35617ae014d8" data-file-name="components/returned-parts-manager.tsx">
            Export as Orders
          </span></button>
          <button onClick={clearAllData} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" data-unique-id="dac6b270-9498-4087-8adb-23e44dde8ad0" data-file-name="components/returned-parts-manager.tsx">
            <Trash2 className="h-4 w-4" /><span className="editable-text" data-unique-id="90f4a612-9ae1-463b-a34f-bff1990ee562" data-file-name="components/returned-parts-manager.tsx">
            Clear All Data
          </span></button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-unique-id="00ee8c3a-e06a-43c9-a319-e7ff5f65e3c3" data-file-name="components/returned-parts-manager.tsx">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="fcacc42f-bf5a-477b-8503-660331b52b64" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="751e2f22-ab99-46fb-b69d-3436df569aba" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="ed682b26-eb83-4fa2-853d-90ad19a4caca" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="a6a70f99-9d69-4586-92b1-fbdda3a8597e" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="38f73d16-96c3-413e-aeba-bd908d36c916" data-file-name="components/returned-parts-manager.tsx">Total Returns</span></p>
              <p className="text-2xl font-bold text-gray-800" data-unique-id="d3249687-e9b7-423e-ad83-151ea84dbf5f" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{returnedParts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center" data-unique-id="d449263f-0c9c-4548-aafb-69c190860a62" data-file-name="components/returned-parts-manager.tsx">
              <Package2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="df6201b0-62fd-4517-a04f-79b0b5ad6e7b" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="10f2eca9-b3c7-4ae2-bbfe-0681f242114e" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="31a9bc6a-8a03-44fb-8ba2-001e90f6e822" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="4e1509ec-5e39-4977-a914-de5fd3e8b2a2" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="22a3bd9a-a5fe-4cf8-9019-40d3041e4bd3" data-file-name="components/returned-parts-manager.tsx">In Transit</span></p>
              <p className="text-2xl font-bold text-amber-600" data-unique-id="386321c7-bba5-4aa3-a25f-ec8de39930ba" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{statusCounts.in_transit || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center" data-unique-id="94e50b51-0c9e-46ff-a306-e7e8dbf48103" data-file-name="components/returned-parts-manager.tsx">
              <Truck className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="8da4af0a-7791-4826-b64f-4a82ea74c0d9" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="36832352-5029-4796-bfe7-0c1ca2e99d42" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="9f1e8e17-2d87-4f7c-abaa-fd0a0da35118" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="23760a2d-aa64-492d-8d81-eb2a150c7ca7" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="76bd34d9-d9c5-4b3a-9f6b-764ba3b5546c" data-file-name="components/returned-parts-manager.tsx">Arrived</span></p>
              <p className="text-2xl font-bold text-green-600" data-unique-id="ad0a4de6-2ccc-4622-b730-4899d2f1f67d" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{statusCounts.arrived || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center" data-unique-id="11c4d01a-81ac-44ba-9865-a38e033d56b9" data-file-name="components/returned-parts-manager.tsx">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="5e365d78-b2b9-4328-8679-6e4aeecb25b4" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="dd66fbc3-9e49-40a3-aad4-d627d4c1b176" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="0c700574-d5ea-47ae-b634-61a04a0b9c6d" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="2ed7dcff-d629-47f7-96d8-bc54692c7f5e" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="17511d50-49d4-4854-b8a3-ef226a40168e" data-file-name="components/returned-parts-manager.tsx">Inspected</span></p>
              <p className="text-2xl font-bold text-purple-600" data-unique-id="0ccec528-8ed4-4b08-94ee-8d9ab5f825fb" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{statusCounts.inspected || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center" data-unique-id="c6b7507e-e3c6-4bbf-8878-1d4e65d2b1b5" data-file-name="components/returned-parts-manager.tsx">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6" data-unique-id="f047552b-bb0e-4049-b3c6-28f35b482f06" data-file-name="components/returned-parts-manager.tsx">
        <div className="flex flex-col md:flex-row gap-4" data-unique-id="c41766d0-1454-4005-8fc4-ab1bdfc4d42d" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex-1 relative" data-unique-id="3c471411-5b79-4d69-a63d-c0b4f422cb97" data-file-name="components/returned-parts-manager.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by part name, number, customer, or order..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="aa2c90ec-7f54-453b-b0b2-1626658e4806" data-file-name="components/returned-parts-manager.tsx" />
          </div>
          
          <div className="flex gap-2" data-unique-id="4a67860f-7558-45ed-b5ef-89bacbf98561" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
            {[{
            key: 'all',
            label: 'All',
            count: returnedParts.length
          }, {
            key: 'shipped',
            label: 'Shipped',
            count: statusCounts.shipped || 0
          }, {
            key: 'in_transit',
            label: 'In Transit',
            count: statusCounts.in_transit || 0
          }, {
            key: 'arrived',
            label: 'Arrived',
            count: statusCounts.arrived || 0
          }, {
            key: 'inspecting',
            label: 'Inspecting',
            count: statusCounts.inspecting || 0
          }, {
            key: 'inspected',
            label: 'Inspected',
            count: statusCounts.inspected || 0
          }].map(filter => <button key={filter.key} onClick={() => setStatusFilter(filter.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === filter.key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} data-unique-id="7a0ec4bf-9409-418b-899d-f0991035f958" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
                {filter.label}<span className="editable-text" data-unique-id="dd5925d5-5817-4ee8-9ac5-f0f4b6de0e0d" data-file-name="components/returned-parts-manager.tsx"> (</span>{filter.count}<span className="editable-text" data-unique-id="b977b7bf-a94d-4f6a-95f3-a0b5a437bbb4" data-file-name="components/returned-parts-manager.tsx">)
              </span></button>)}
          </div>
        </div>
      </div>

      {/* Parts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" data-unique-id="82d959e4-d245-4db5-a27c-e723cc2a0801" data-file-name="components/returned-parts-manager.tsx">
        <AnimatePresence>
          {filteredParts.map(part => <div key={part.id} className="relative" data-unique-id="3a796669-d4fc-4269-a77d-7d9ad3d2c1f2" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
              <ReturnedPartCard part={part} onMarkArrived={markAsArrived} onMarkInspected={markInspectionComplete} onUpdate={updatePartStatus} />
              {/* Edit button overlay */}
              <div className="absolute top-2 right-2 flex space-x-1" data-unique-id="74c92dda-6ca2-4c25-8306-7833a5646ced" data-file-name="components/returned-parts-manager.tsx">
                <button onClick={() => handleEditPart(part)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors" title="Edit Part" data-unique-id="45d3c2c9-771d-4132-a690-b67bb1ab2eb0" data-file-name="components/returned-parts-manager.tsx">
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            </div>)}
        </AnimatePresence>
      </div>

      {filteredParts.length === 0 && <div className="text-center py-12" data-unique-id="b7ff6e1f-7818-4a89-8cab-aaf4599f38a1" data-file-name="components/returned-parts-manager.tsx">
          <Package2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2" data-unique-id="fa296380-72c7-438d-b823-650d49d6b36c" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
            {searchQuery || statusFilter !== 'all' ? 'No matching returned parts found' : 'No returned parts yet'}
          </h3>
          <p className="text-gray-500" data-unique-id="673528c3-b94d-4cb7-869d-a6a3d374cbbb" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Add your first returned part to start tracking'}
          </p>
        </div>}

      {/* Add Part Modal */}
      <AddReturnedPartModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={addReturnedPart} />
      
      {/* Smart Excel Processor */}
      <SmartExcelProcessor isOpen={showSmartProcessor} onClose={() => setShowSmartProcessor(false)} onPartsProcessed={processReturnedParts} />
      
      {/* Edit Part Modal */}
      <EditReturnedPartModal part={editingPart} isOpen={showEditModal} onClose={() => {
      setShowEditModal(false);
      setEditingPart(null);
    }} onSave={handleSaveEditedPart} />
      
      {/* Toast Notifications */}
      <NotificationToast notifications={toastNotifications} onRemove={removeToastNotification} />
    </div>;
}