'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package2, Plus, Search, Bell, Clock, CheckCircle, AlertCircle, Calendar, Truck, FileText, Eye, Edit, Trash2, FileSpreadsheet, Download, Mail, Share } from 'lucide-react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { useNotificationStore } from '@/lib/notification-store';
import { supabase } from '@/lib/supabase-client';
import ReturnedPartCard from './returned-part-card';
import AddReturnedPartModal from './add-returned-part-modal';
import ExcelReturnedPartsProcessor from './excel-returned-parts-processor';
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
  const [showExcelProcessor, setShowExcelProcessor] = useState(false);
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
    setShowExcelProcessor(false);

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
  return <div className="container mx-auto max-w-7xl" data-unique-id="215f0605-444c-41c2-b2a5-caa5bc2aaea0" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="flex items-center justify-between mb-8" data-unique-id="fd3fe5d6-34c0-4e2c-b6f9-8e0be403bac2" data-file-name="components/returned-parts-manager.tsx">
        <div className="flex items-center gap-3" data-unique-id="45fb25cc-0e41-48c9-8779-04c77a6e06ce" data-file-name="components/returned-parts-manager.tsx">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center" data-unique-id="996ef62c-5404-44f0-ac6f-f07f25e5d321" data-file-name="components/returned-parts-manager.tsx">
            <Package2 className="h-6 w-6 text-white" />
          </div>
          <div data-unique-id="28fba870-9e5b-43b3-90b5-60d87e3970dc" data-file-name="components/returned-parts-manager.tsx">
            <h1 className="text-3xl font-bold text-gray-800" data-unique-id="f9c70108-ac99-4bc2-b320-46caa1fff03f" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="d8185a31-71de-4292-916a-0b0ffc6be731" data-file-name="components/returned-parts-manager.tsx">Returned Parts & Tracking</span></h1>
            <p className="text-gray-600" data-unique-id="8f5793ab-2425-4a28-90c7-95638c61cac3" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="d9e4f557-7293-41b4-9ce9-a9ba3c7c763a" data-file-name="components/returned-parts-manager.tsx">Track returned parts, arrivals, and inspection status</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4" data-unique-id="db0f55a7-915b-44d3-8495-e155d1cfdc1c" data-file-name="components/returned-parts-manager.tsx">
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
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors" data-unique-id="e80256c2-b53b-4868-a255-25ef0d564138" data-file-name="components/returned-parts-manager.tsx">
            <Plus className="h-4 w-4" /><span className="editable-text" data-unique-id="72aa0581-58ec-4ea5-b294-62a961c8c1d3" data-file-name="components/returned-parts-manager.tsx">
            Add Returned Part
          </span></button>
          <button onClick={() => setShowExcelProcessor(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" data-unique-id="9920598a-e5d8-4068-baf6-1793ae44d949" data-file-name="components/returned-parts-manager.tsx">
            <FileSpreadsheet className="h-4 w-4" /><span className="editable-text" data-unique-id="28a0d691-95a1-4201-a317-a014d06a1e88" data-file-name="components/returned-parts-manager.tsx">
            Import from Excel
          </span></button>
          <button onClick={exportReturnedPartsAsOrders} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" data-unique-id="4e2be600-4b2c-496c-bde2-d9c53f0891db" data-file-name="components/returned-parts-manager.tsx">
            <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="4bd47e37-e39c-4e1f-94a0-b385ce9c1115" data-file-name="components/returned-parts-manager.tsx">
            Export as Orders
          </span></button>
          <button onClick={clearAllData} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" data-unique-id="1c152bd8-e7e8-4e3a-8ff3-10ee451e2dfe" data-file-name="components/returned-parts-manager.tsx">
            <Trash2 className="h-4 w-4" /><span className="editable-text" data-unique-id="0cda399d-63f9-4722-b960-3ccc2e3df180" data-file-name="components/returned-parts-manager.tsx">
            Clear All Data
          </span></button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-unique-id="b1931e51-db6b-4fd0-8d7f-2b002335c3c7" data-file-name="components/returned-parts-manager.tsx">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="fc3ab748-f7e3-44cd-9847-d1d275d74a32" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="1a636f0a-07cc-44cc-9388-e01e9730f5dc" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="fa71917d-5f3f-496c-b05b-6a41dc115472" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="93729e8c-3f9f-406f-96e0-c79a7757d45b" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="c9d5bfcc-b9f9-421a-8e19-974ce67462d1" data-file-name="components/returned-parts-manager.tsx">Total Returns</span></p>
              <p className="text-2xl font-bold text-gray-800" data-unique-id="c61f6386-8019-45cd-8a47-ed702c0fa265" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{returnedParts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center" data-unique-id="12ff03f0-f84e-43cc-afe9-b562e446830c" data-file-name="components/returned-parts-manager.tsx">
              <Package2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="10db77a0-2c50-4f66-be92-a703029327cb" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="b84aab15-6ef8-413e-a6d6-e3471c3a8294" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="587fccc3-6cf9-4b13-8904-716b08483119" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="7d1ccdc9-a15f-4534-8f93-8a53d8a6f749" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="b06ce903-e4a8-4366-b647-51a0311eedb0" data-file-name="components/returned-parts-manager.tsx">In Transit</span></p>
              <p className="text-2xl font-bold text-amber-600" data-unique-id="5a3588bf-01ee-45e9-9e0f-dc5b37d688c0" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{statusCounts.in_transit || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center" data-unique-id="9a37749e-43a6-4ab3-bc9b-5762ec152e66" data-file-name="components/returned-parts-manager.tsx">
              <Truck className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="e6ee92da-d841-4965-8f23-d148cb154812" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="cf75fdf0-406c-4b6c-8ab0-0672daa3acf8" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="21e0090e-404c-4b02-b929-df53f2bec604" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="88faff48-195d-4cef-8eb1-5a3408c3efd7" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="117064ec-a118-4e4b-966b-debffc9ade1a" data-file-name="components/returned-parts-manager.tsx">Arrived</span></p>
              <p className="text-2xl font-bold text-green-600" data-unique-id="f1b41406-b05d-43ef-9570-de1eb07d2044" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{statusCounts.arrived || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center" data-unique-id="c054c11a-2fdc-46a0-9e6a-8e7917a1a277" data-file-name="components/returned-parts-manager.tsx">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-unique-id="ded4803e-354d-4f52-acf9-ac17c7b53c09" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex items-center justify-between" data-unique-id="214fc3a8-ebe8-4bb6-940b-2b69af62c80b" data-file-name="components/returned-parts-manager.tsx">
            <div data-unique-id="7284a4b9-9192-4665-b807-9a308d56b51b" data-file-name="components/returned-parts-manager.tsx">
              <p className="text-sm text-gray-600" data-unique-id="f847cb23-d366-44b9-99a7-8d6b5d293be3" data-file-name="components/returned-parts-manager.tsx"><span className="editable-text" data-unique-id="26805489-c08c-4bf2-a9de-129d01b0091d" data-file-name="components/returned-parts-manager.tsx">Inspected</span></p>
              <p className="text-2xl font-bold text-purple-600" data-unique-id="85cfb04f-51e5-4134-9035-dbbbfd4bac40" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">{statusCounts.inspected || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center" data-unique-id="171e93ea-d547-45e2-b583-68ac57bdd287" data-file-name="components/returned-parts-manager.tsx">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6" data-unique-id="0f17c352-6009-4a22-adf8-0338eaae8e3e" data-file-name="components/returned-parts-manager.tsx">
        <div className="flex flex-col md:flex-row gap-4" data-unique-id="95bc02de-13f7-42ea-9b0c-66fc4706c48c" data-file-name="components/returned-parts-manager.tsx">
          <div className="flex-1 relative" data-unique-id="888d073d-b5f2-4a59-9f32-0a463de61c28" data-file-name="components/returned-parts-manager.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by part name, number, customer, or order..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" data-unique-id="28a8709f-272a-4cba-93b3-bcb7021e3b88" data-file-name="components/returned-parts-manager.tsx" />
          </div>
          
          <div className="flex gap-2" data-unique-id="103e2bf1-9280-441a-bcc3-69fac976a741" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
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
          }].map(filter => <button key={filter.key} onClick={() => setStatusFilter(filter.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === filter.key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} data-unique-id="699d0644-0fea-4975-9737-0054b9490235" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
                {filter.label}<span className="editable-text" data-unique-id="cd000a3e-968d-416b-b078-96cfa47cadf4" data-file-name="components/returned-parts-manager.tsx"> (</span>{filter.count}<span className="editable-text" data-unique-id="443bfd1e-de65-4e09-9c8e-203636dc56f6" data-file-name="components/returned-parts-manager.tsx">)
              </span></button>)}
          </div>
        </div>
      </div>

      {/* Parts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" data-unique-id="801adc3d-7134-40e1-a6b9-121b0b4c6c78" data-file-name="components/returned-parts-manager.tsx">
        <AnimatePresence>
          {filteredParts.map(part => <div key={part.id} className="relative" data-unique-id="c1d88f44-9563-43bd-b6ce-cdc9d1c61b0a" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
              <ReturnedPartCard part={part} onMarkArrived={markAsArrived} onMarkInspected={markInspectionComplete} onUpdate={updatePartStatus} />
              {/* Edit button overlay */}
              <div className="absolute top-2 right-2 flex space-x-1" data-unique-id="6e68b3f0-807b-46f0-a39a-7fe96ad3605b" data-file-name="components/returned-parts-manager.tsx">
                <button onClick={() => handleEditPart(part)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors" title="Edit Part" data-unique-id="424a082f-a2ba-46ca-8cb1-a65f3555d411" data-file-name="components/returned-parts-manager.tsx">
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            </div>)}
        </AnimatePresence>
      </div>

      {filteredParts.length === 0 && <div className="text-center py-12" data-unique-id="ff4976bb-e33f-4279-899d-f4abf341e450" data-file-name="components/returned-parts-manager.tsx">
          <Package2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2" data-unique-id="ac3a5de8-49c9-4d73-840c-804b14831fa7" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
            {searchQuery || statusFilter !== 'all' ? 'No matching returned parts found' : 'No returned parts yet'}
          </h3>
          <p className="text-gray-500" data-unique-id="39eb5a79-acf1-4269-8fc4-7ea0aaac098d" data-file-name="components/returned-parts-manager.tsx" data-dynamic-text="true">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Add your first returned part to start tracking'}
          </p>
        </div>}

      {/* Add Part Modal */}
      <AddReturnedPartModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={addReturnedPart} />
      
      {/* Excel Import Processor */}
      <ExcelReturnedPartsProcessor isOpen={showExcelProcessor} onClose={() => setShowExcelProcessor(false)} onPartsProcessed={processReturnedParts} />
      
      {/* Edit Part Modal */}
      <EditReturnedPartModal part={editingPart} isOpen={showEditModal} onClose={() => {
      setShowEditModal(false);
      setEditingPart(null);
    }} onSave={handleSaveEditedPart} />
      
      {/* Toast Notifications */}
      <NotificationToast notifications={toastNotifications} onRemove={removeToastNotification} />
    </div>;
}