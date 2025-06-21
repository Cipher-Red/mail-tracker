'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Search, UserPlus, Users, X, Edit, Trash2, Check, Download, ChevronDown, ChevronUp, Filter, Calendar, Mail, Phone, Clock, AlertCircle, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { customerService, subscribeToChanges } from '@/lib/supabase-client';
import { Customer } from '@/db/schema';
import { useRealtimeCustomers } from '@/lib/use-realtime-data';
import toast from 'react-hot-toast';
import CustomerStats from './customer-stats';
import { processCustomerExcel } from '@/lib/excel-customer-processor';
import * as XLSX from 'xlsx';
export type { Customer } from '@/db/schema';
export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  // Use real-time customers data
  const {
    data: customers,
    isLoading,
    error,
    lastSyncTime,
    isConnected,
    refreshData,
    addRecord: addCustomer,
    updateRecord: updateCustomer,
    deleteRecord: deleteCustomer
  } = useRealtimeCustomers({
    onInsert: record => {
      toast.success(`New customer added: ${record.name}`);
    },
    onUpdate: (record, oldRecord) => {
      toast.success(`Customer updated: ${record.name}`);
    },
    onDelete: record => {
      toast.error(`Customer deleted: ${record.name}`);
    }
  });

  // Add Toaster for notifications
  const [visibleFilters, setVisibleFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [sortField, setSortField] = useState<keyof Customer>('addedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // New customer template
  const newCustomerTemplate = {
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
    tags: [] as string[],
    lastContact: '',
    notes: ''
  };

  // Form state for adding/editing customers
  const [formData, setFormData] = useState(newCustomerTemplate);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  // Extract available tags from customers
  useEffect(() => {
    const tags = customers.flatMap(customer => customer.tags || []);
    setAvailableTags([...new Set(tags)] as string[]);
  }, [customers]);

  // Filter and sort customers based on multiple criteria
  const filteredCustomers = customers.filter(customer => {
    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = customer.name.toLowerCase().includes(searchLower) || customer.email.toLowerCase().includes(searchLower) || customer.company && customer.company.toLowerCase().includes(searchLower) || customer.notes && customer.notes.toLowerCase().includes(searchLower);

    // Apply tag filter
    const matchesTag = !filterTag || customer.tags?.includes(filterTag);

    // Apply date filter
    const matchesDate = !dateFilter || customer.addedAt && new Date(customer.addedAt).toISOString().split('T')[0] === dateFilter || customer.lastContact && new Date(customer.lastContact).toISOString().split('T')[0] === dateFilter;

    // Apply status filter (based on presence of certain data)
    const matchesStatus = !statusFilter || statusFilter === 'withEmail' && !!customer.email || statusFilter === 'withPhone' && !!customer.phone || statusFilter === 'withNotes' && !!customer.notes || statusFilter === 'withoutNotes' && !customer.notes || statusFilter === 'recentlyAdded' && customer.addedAt && new Date().getTime() - new Date(customer.addedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    return matchesSearch && matchesTag && matchesDate && matchesStatus;
  }).sort((a, b) => {
    // Handle string comparison
    if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
      return sortDirection === 'asc' ? (a[sortField] as string).localeCompare(b[sortField] as string) : (b[sortField] as string).localeCompare(a[sortField] as string);
    }

    // Default case
    return sortDirection === 'asc' ? 1 : -1;
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const newTag = e.currentTarget.value.trim();
      if (newTag && (!formData.tags || !formData.tags.includes(newTag))) {
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), newTag]
        });
        e.currentTarget.value = '';
      }
      e.preventDefault();
    }
  };

  // Remove a tag from the current form data
  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag)
    });
  };

  // Add or update a customer
  const saveCustomer = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }
    try {
      if (editingCustomer) {
        // Update existing customer
        await updateCustomer(editingCustomer.id, {
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          address: formData.address || null,
          tags: formData.tags,
          lastContact: formData.lastContact ? new Date(formData.lastContact) : null,
          notes: formData.notes || null
        });
        toast.success('Customer updated successfully');
        setEditingCustomer(null);
      } else {
        // Add new customer
        await addCustomer({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          address: formData.address || null,
          tags: formData.tags,
          lastContact: formData.lastContact ? new Date(formData.lastContact) : null,
          notes: formData.notes || null
        });
        toast.success('Customer added successfully');
      }

      // Reset form
      setFormData(newCustomerTemplate);
      setIsAddingCustomer(false);
      setShowAdvancedFields(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(`Error saving customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Start editing a customer
  const startEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      company: customer.company || '',
      phone: customer.phone || '',
      address: customer.address || '',
      tags: customer.tags || [],
      lastContact: customer.lastContact ? new Date(customer.lastContact).toISOString().split('T')[0] : '',
      notes: customer.notes || ''
    });
    setIsAddingCustomer(true);
    setShowAdvancedFields(true);
  };

  // Delete a customer with better UI and error handling
  const handleDeleteCustomer = async (id: number) => {
    try {
      // Show loading state
      const toastId = toast.loading('Removing customer data...');

      // Get customer name for confirmation message
      const customerToDelete = customers.find(c => c.id === id);
      const customerName = customerToDelete?.name || 'Customer';

      // Delete using real-time hook
      await deleteCustomer(id);

      // Also remove from selected list if present
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));

      // Clear any pending confirmation
      setShowConfirmDelete(null);

      // Show success toast with customer name
      toast.success(`"${customerName}" has been removed`, {
        id: toastId,
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error(`Error removing customer: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        duration: 4000
      });
      setShowConfirmDelete(null);
    }
  };

  // Function to show delete confirmation
  const confirmDelete = (id: number) => {
    setShowConfirmDelete(id);

    // Auto-hide after a few seconds if not acted upon
    setTimeout(() => {
      setShowConfirmDelete(prev => prev === id ? null : prev);
    }, 8000);
  };

  // Toggle customer selection
  const toggleSelectCustomer = (id: number) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  // Toggle sort direction or change sort field
  const handleSortChange = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export customers as CSV
  const exportCustomersCSV = () => {
    // Choose which customers to export - selected or all if none selected
    const customersToExport = selectedCustomers.length > 0 ? customers.filter(c => selectedCustomers.includes(c.id)) : customers;
    if (customersToExport.length === 0) {
      toast.error('No customers to export');
      return;
    }

    // Create CSV content
    const headers = 'name,email,company,phone,address,tags,addedAt,lastContact,notes';
    const csvRows = customersToExport.map(customer => {
      const tags = customer.tags ? customer.tags.join(';') : '';
      const values = [customer.name, customer.email, customer.company || '', customer.phone || '', `"${customer.address || ''}"`, `"${tags}"`, customer.addedAt, customer.lastContact || '', `"${customer.notes?.replace(/"/g, '""') || ''}"`];
      return values.join(',');
    });
    const csvContent = [headers, ...csvRows].join('\n');

    // Create and download the file - only run in browser context
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([csvContent], {
        type: 'text/csv'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'detroit-axle-customers.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Customer data exported successfully');
    }
  };

  // For excel import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsImporting(true);
    try {
      const toastId = toast.loading('Processing Excel file...');
      const result = await processCustomerExcel(file);
      if (result.customers.length > 0) {
        // Import customers to Supabase
        let importedCount = 0;
        let updatedCount = 0;
        for (const customer of result.customers) {
          try {
            // Check if customer exists by email
            const existingCustomer = customers.find(c => c.email.toLowerCase() === customer.email.toLowerCase());
            if (existingCustomer) {
              // Update existing customer
              await updateCustomer(existingCustomer.id, {
                name: customer.name,
                company: customer.company || null,
                phone: customer.phone || null,
                address: customer.address || null,
                tags: customer.tags || [],
                notes: customer.notes || null
              });
              updatedCount++;
            } else {
              // Create new customer
              await addCustomer({
                name: customer.name,
                email: customer.email,
                company: customer.company || null,
                phone: customer.phone || null,
                address: customer.address || null,
                tags: customer.tags || [],
                lastContact: null,
                notes: customer.notes || null
              });
              importedCount++;
            }
          } catch (customerError) {
            console.error('Error processing customer:', customer.email, customerError);
          }
        }
        toast.success(`Successfully processed ${result.customers.length} customers. ` + `(${importedCount} new, ${updatedCount} updated)`, {
          id: toastId
        });
      } else {
        toast.error('No valid customers found in the file', {
          id: toastId
        });
      }
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast.error(`Error importing customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="bg-card rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl" data-unique-id="a8e91027-194f-4bd5-a57b-3f63f7bbb20d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      <Toaster position="top-center" />
      <Toaster position="top-center" />
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="a9b0de92-7dcc-4ee7-be18-69e0be1245e6" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="d5b23c5e-30c0-40d7-9e28-f4d047fdda38" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="0e3c5bb4-f6f3-47b1-8562-561d3138d678" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="4a80b584-bfb8-4e81-9289-a0f89a46e9d4" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="5af5e73a-0d95-4a5c-86ce-d1a9dbab4000" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Customer statistics overview */}
      <CustomerStats customers={customers} />
      
      {/* Excel template info */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-md text-sm" data-unique-id="62120039-83ba-4139-b0ce-3c9ad4613045" data-file-name="components/customer-management.tsx">
        <div className="flex items-center" data-unique-id="8ed2667c-fddb-41d7-8033-9dd9bf0514ac" data-file-name="components/customer-management.tsx">
          <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
          <div data-unique-id="8f0eb1ea-6855-47bb-b5d8-e15ebd84ec27" data-file-name="components/customer-management.tsx">
            <p className="font-medium text-blue-800" data-unique-id="3b1aeef6-5e2d-48ae-935b-8ee46b7b2d91" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="cda03393-65ae-401d-a375-9c8c68d28003" data-file-name="components/customer-management.tsx">Excel Import Format</span></p>
            <p className="text-blue-600" data-unique-id="a64e753b-dbdc-40cb-91d0-dd3fed8a26f1" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="342d3fbf-8b26-4c2a-ba72-cb6ba7bc3124" data-file-name="components/customer-management.tsx">Required columns: name, email. Optional: company, phone, address, city, state, postalCode, tags, notes</span></p>
          </div>
        </div>
        
        <button onClick={() => {
        // Create a sample Excel template
        const wb = XLSX.utils.book_new();
        const wsData = [["name", "email", "company", "phone", "address", "city", "state", "postalCode", "tags", "notes"], ["John Smith", "john@example.com", "Detroit Axle", "555-1234", "123 Main St", "Detroit", "MI", "48201", "vip;retail", "Preferred customer"], ["Jane Doe", "jane@example.com", "Acme Inc", "555-5678", "456 Oak Ave", "Troy", "MI", "48098", "wholesale", "New account"]];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Customers");

        // Generate and download the Excel file
        if (typeof window !== 'undefined') {
          XLSX.writeFile(wb, "customer-import-template.xlsx");
        }
      }} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center" data-unique-id="bd1608f4-cfaf-4116-bdb3-4271a34ea7d3" data-file-name="components/customer-management.tsx">
          <Download className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="ff5407dc-030d-41e2-94c7-d4d2c5811d9e" data-file-name="components/customer-management.tsx">
          Download Template
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4" data-unique-id="808a220d-a03e-4680-9d82-3a1469856cb5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap items-center gap-4" data-unique-id="4697531a-aa97-4ab3-abe1-ccb8c343a992" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="relative flex-grow" data-unique-id="6606c2fe-9070-4e30-bfb2-88771560fc04" data-file-name="components/customer-management.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="7de12e90-1418-4187-b1b3-9a041aa8a9e2" data-file-name="components/customer-management.tsx" />
          </div>
          
          <button onClick={() => setVisibleFilters(!visibleFilters)} className={`px-4 py-2 border ${visibleFilters ? 'border-primary bg-primary/5' : 'border-border'} rounded-md flex items-center space-x-2 hover:bg-accent/10 transition-colors`} data-unique-id="6c4f963c-c10c-421b-b059-ec19b24fe49a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Filter className={`h-4 w-4 ${visibleFilters ? 'text-primary' : ''}`} />
            <span data-unique-id="6e12d28a-4dc9-4a78-872d-844477481a22" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{visibleFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {visibleFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* Import/Export buttons */}
          <div className="flex space-x-2" data-unique-id="809c89a9-b2ea-4d0b-a6d6-639cb84fbacc" data-file-name="components/customer-management.tsx">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" id="excel-import" disabled={isImporting} data-unique-id="1dc9648d-5cb1-47b3-a4d8-ff01e2b0fef9" data-file-name="components/customer-management.tsx" />
            
            <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="587334b3-b1f7-47d5-812f-f15c08efe5ee" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {isImporting ? <>
                  <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                  Importing...
                </> : <>
                  <FileSpreadsheet className="h-4 w-4 inline mr-2" />
                  Import Excel
                </>}
            </button>
            
            <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="3482c789-d03e-4f71-ae3a-35cf12ad4c60" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              <Download className="h-4 w-4 inline mr-2" />
              {selectedCustomers.length > 0 ? `Export (${selectedCustomers.length})` : 'Export All'}
            </button>
          </div>
        </div>
        
        {/* Advanced filters */}
        {visibleFilters && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.2
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-lg border border-border" data-unique-id="c2bc6d24-d7ef-4986-9b02-1319eb4da559" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {/* Tag filter */}
            <div data-unique-id="33380897-5e2a-42ef-8c42-769cf39ea1eb" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="1771f104-1d74-4365-82ab-323c0e6d5682" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="0f031f80-6201-411d-a064-47738d93203b" data-file-name="components/customer-management.tsx">Filter by Tag</span></label>
              <div className="relative" data-unique-id="ce0e19ac-07f4-4953-89a1-4cc1755e65fa" data-file-name="components/customer-management.tsx">
                <select value={filterTag || ''} onChange={e => setFilterTag(e.target.value === '' ? null : e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="f0647ffb-41f5-4501-a215-86c688f34603" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="e68a2db8-1910-4a8f-b9ec-fb30a6ce09e3" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="13daed90-23e4-4734-a676-35b92217e4b3" data-file-name="components/customer-management.tsx">All Tags</span></option>
                  {availableTags.map(tag => <option key={tag} value={tag} data-unique-id="fe63bbb5-19d0-4ebd-b17a-850656e63498" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            
            {/* Date filter */}
            <div data-unique-id="5d98c10d-3edf-48b2-8a5c-c84f0b5425ce" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2 flex items-center" data-unique-id="1a1e2ff2-ed5c-4f96-92b4-6a4e19ae6bbc" data-file-name="components/customer-management.tsx">
                <Calendar className="h-4 w-4 mr-1" data-unique-id="5eb57377-9437-4715-8ad8-4b34f6c8d7fd" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="b57090be-0a6a-4fb1-ab66-94dfa137fc1b" data-file-name="components/customer-management.tsx">
                Filter by Date
              </span></label>
              <div className="relative" data-unique-id="fa68d13f-9e56-41d7-93f9-12b14c4c30bf" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="822caebf-1ef8-45d8-8da0-601265f865d9" data-file-name="components/customer-management.tsx" />
                {dateFilter && <button onClick={() => setDateFilter('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear date filter" data-unique-id="f08cf379-7a95-4f5b-ad27-29804f6e11bd" data-file-name="components/customer-management.tsx">
                    <X className="h-4 w-4" />
                  </button>}
              </div>
            </div>
            
            {/* Status filter */}
            <div data-unique-id="371ad400-040f-4b00-81cd-758c93bde793" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="1cd6e89a-f3eb-415d-8c2e-78c16554470b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5e8113cf-514e-4f85-b299-e4a127e00c70" data-file-name="components/customer-management.tsx">Customer Status</span></label>
              <div className="relative" data-unique-id="cc0c2c68-cb3a-4c03-a6e8-80ca0adb44ea" data-file-name="components/customer-management.tsx">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="93b201f8-589c-4a93-948a-3d105e15c355" data-file-name="components/customer-management.tsx">
                  <option value="" data-unique-id="82a89eb6-c461-44c3-948f-fcbff5ebbb8f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a14ddfc6-45c2-4d34-a371-a4883b9b9a27" data-file-name="components/customer-management.tsx">All Customers</span></option>
                  <option value="withEmail" data-unique-id="d9b42fc2-cf00-4262-bae9-23c728528f03" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="db25e780-2b3d-4599-be58-eca67b792f1d" data-file-name="components/customer-management.tsx">With Email</span></option>
                  <option value="withPhone" data-unique-id="3bff465d-90e6-42fe-90c8-cd13eee75654" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a57e0dba-f5ce-4bd2-9086-27a8f58e5b0f" data-file-name="components/customer-management.tsx">With Phone</span></option>
                  <option value="withNotes" data-unique-id="432517a8-71b8-42b5-ab64-def8b87219d5" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="0cdc1050-49ba-4800-8dbd-ce0e06b935da" data-file-name="components/customer-management.tsx">With Notes</span></option>
                  <option value="withoutNotes" data-unique-id="46ef61eb-e3ba-4619-a95d-5948d0084eda" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="7fa37ca7-2092-4ac3-a88e-62c8e3558805" data-file-name="components/customer-management.tsx">Without Notes</span></option>
                  <option value="recentlyAdded" data-unique-id="924a2ebb-2356-4463-b98f-78746342abdd" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="facf7c15-fbae-432f-9505-92b9eaf7283e" data-file-name="components/customer-management.tsx">Recently Added (7 days)</span></option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </motion.div>}
        
        {/* Active filters display */}
        {(searchQuery || filterTag || dateFilter || statusFilter) && <div className="flex flex-wrap gap-2 mt-2" data-unique-id="e19e078d-9508-482a-86d2-5ca85a843dab" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {searchQuery && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="8f9966d4-c363-4c58-a204-21c85af58542" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Search className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="ef7855c8-9226-4239-ba6e-d2db4ff17b0a" data-file-name="components/customer-management.tsx">
                Search: </span>{searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary/70" data-unique-id="7adba9d5-7e12-4f8c-a302-30c48d219c91" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {filterTag && <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="c9d6002d-defc-409e-b55b-82119ced5965" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Filter className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="7d9bc326-f9bc-4679-b156-422067c9713c" data-file-name="components/customer-management.tsx">
                Tag: </span>{filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-blue-500" data-unique-id="a487b26a-0e8f-4713-aa18-e9b2cc974d16" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {dateFilter && <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="a31630b5-12d9-455b-a653-d12e56db00c1" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Calendar className="h-3 w-3 mr-1" data-unique-id="f66df488-2d36-4e25-99e3-66031f5af7ba" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="104ea0de-8908-45a2-9791-80f083eb0c80" data-file-name="components/customer-management.tsx">
                Date: </span>{new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="ml-1 hover:text-green-500" data-unique-id="ac69125c-f651-4fb4-9662-fe32743aae3d" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {statusFilter && <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="11094077-ccb6-4f48-8d50-3aa64d4b4217" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {statusFilter === 'withEmail' && <Mail className="h-3 w-3 mr-1" />}
                {statusFilter === 'withPhone' && <Phone className="h-3 w-3 mr-1" />}
                {statusFilter === 'withNotes' || statusFilter === 'withoutNotes' ? <Edit className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="a223a3e7-d765-4c20-b068-40972332b8c4" data-file-name="components/customer-management.tsx">
                Status: </span>{statusFilter === 'withEmail' ? 'With Email' : statusFilter === 'withPhone' ? 'With Phone' : statusFilter === 'withNotes' ? 'With Notes' : statusFilter === 'withoutNotes' ? 'Without Notes' : 'Recently Added'}
                <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-amber-500" data-unique-id="25f20e1f-3f25-497f-97ee-b0276bd22d60" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            <button onClick={() => {
          setSearchQuery('');
          setFilterTag(null);
          setDateFilter('');
          setStatusFilter('');
        }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center hover:bg-gray-200" data-unique-id="84a828bd-6f2f-4028-9b6d-798075981488" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d7f5fa15-d1c8-4e01-b680-e520235cb3ec" data-file-name="components/customer-management.tsx">
              Clear All Filters
            </span></button>
          </div>}
      </div>
      
      {/* Add/Edit customer form */}
      {isAddingCustomer && <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="2bd26ecb-92a8-42fb-97b3-bba30206061e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="011927b1-7e7d-4bab-9e70-7f7c9050165e" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="3b762ebc-60c1-4e7e-8f02-37bfd5cd34c6" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="1d79de17-448d-499a-8033-551afef2c413" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="6c4e6ac0-bfec-4a23-9f89-36b401d91fc7" data-file-name="components/customer-management.tsx">
            <div data-unique-id="b8d7589a-95d3-438c-ab55-b667db1991c3" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="3e21a602-7f4b-4d05-b242-cdeb10b0d2e6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1bb527e2-3b68-48fc-aecf-398cc9493a3d" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="02a0b7b6-bc0f-4ead-9d52-351d7196a450" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="694efe6b-428d-42a0-8809-810d1d4319b6" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="21c5d128-4968-467c-bbb1-7cded52b756e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6d6ed370-b74a-486b-a1cc-bfe9f19a26d3" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="adeab2ae-828d-4b24-91dd-9d974ed00057" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="4d764f0d-1dbc-40e6-831d-988e08c0c804" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="cbf291ad-0001-4858-8591-1323365c80c2" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9f2afe38-9a7c-4d05-a958-2090de214536" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="c24f017b-e32d-493a-97bd-2275e600d91a" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="ce6c643b-739a-495d-97ef-c7463f0fea0a" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="052bb963-84a7-4c79-a7db-e59f3c273b67" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="0f4d3832-54cd-4b51-8f29-378e9c9d0ef9" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="c720e461-4558-48af-9c8e-b6970125955c" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="c45f4cea-4c46-4f9c-80a5-2cefd3f24e8c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="11372622-2f79-4896-8836-2105b1f4cc78" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="5d78743e-a4c0-46a9-a5da-84246267ad29" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="fe14731c-cf04-4b57-a056-d508788cb2a9" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="a4738d54-3b86-4688-bd5b-b27e31cc725a" data-file-name="components/customer-management.tsx">
              <div data-unique-id="20276509-aa7f-4a6c-91e1-a5c091029c23" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="0a3c6b8d-f49f-4234-ba82-da13570df2d6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="0651faef-0ca9-4fdc-bc11-489e077ab972" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="e15238a4-bf47-4f64-a272-25f20e2075c4" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="13d82048-6638-4023-8b5e-a694c29d795f" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="41fa444b-2598-41b3-b8a6-427a0f1fe703" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="90388cf5-a9e3-46fc-867f-711ccbad1bf6" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="7ced240a-d797-46eb-bc45-7669172b02da" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="0c626753-9139-4724-8487-6fa6ea23a9c3" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="13cf1d49-c074-404c-a128-f50fef855e78" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4138e9a2-e25f-4842-b3de-731474d7d22b" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="92d66293-c93f-4c5e-8b92-08350dfc822b" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="2859c260-020b-4571-b81a-1bf30f2376ed" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="da7fb40b-d979-4539-bbf4-f811df119c1c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="18918487-8d96-4aca-b3e4-2e80b3b1c84a" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="1a4cb60d-e634-4da1-9ad6-1be6495e684f" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="d4412619-b81c-43dd-b982-0ab213d0f904" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="4bd1a6c2-c592-46a5-aa81-6fde5d0761a0" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="530f3edc-5ba2-4ee8-89b1-247b062b9343" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="297bb8f7-f53e-425f-9911-4e3bd505c896" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="05a4baa6-aa00-484b-98b9-1b3f9953572c" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="fb091dd8-396a-4e7c-8a2d-5e0c01227bdd" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="80284db7-c1a9-420d-a928-311b3461050f" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="0b266dda-e575-4687-a1df-f37debcf9a10" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="c414a903-9a8e-495e-b628-b8a023254d44" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3f781466-30a5-46e8-a97b-053f2e5c5014" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="e32edd06-c9b4-4e37-bd8f-0ba353b8544c" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d5c198f4-4b91-4376-8296-30644582eaa1" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="ef5a7acd-9e75-4954-a132-36cc6834ad19" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="3458a794-9fd4-45d2-abe0-b24e3b96f551" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="93f25702-cdc3-4cb3-b832-a28987b0e2ab" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7df27ba5-883c-4053-8743-95466ce892e7" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="b52f4736-f583-46fe-91af-67d290867e96" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="2e03df82-ab91-44c8-adfd-12c9974ef63e" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="w-full max-h-[70vh] overflow-y-auto" data-unique-id="36f28ad0-4fa7-4f26-962d-21e13bd8b358" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {isLoading ? <div className="p-6 text-center" data-unique-id="f2d23685-2062-4aa9-98ce-0d6aac764df2" data-file-name="components/customer-management.tsx">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground" data-unique-id="d4370628-8a8d-4c02-b2d0-57d2fc4fb62a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="fa5b7195-4cec-48bc-8569-67089b8f52ac" data-file-name="components/customer-management.tsx">Loading customers...</span></p>
            </div> : filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground bg-card" data-unique-id="f0f088db-770b-4902-b45c-89c5d5a5b62e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="843d09b6-b773-4b94-b901-a11227729852" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="e441766e-e918-426a-a632-af2a40a418b8" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="d4bdfd1c-bc74-41cd-919a-f2f1c985b442" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="9c375a34-7ed0-4879-bf30-0dd0172a4d02" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="775aef05-7531-448f-ada2-e486f3d85f9d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="1eba37a9-5cd6-4f84-8151-5709f8081385" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="a8c92be9-67a6-41ed-a677-eb8a750f5313" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="f814da04-73e3-4933-98a5-5815f03e576a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {showConfirmDelete === customer.id ? <div className="flex space-x-1" data-unique-id="cceb7b84-2dce-44c7-a150-4a68064bb436" data-file-name="components/customer-management.tsx">
                      <button onClick={() => handleDeleteCustomer(customer.id)} className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 flex items-center space-x-1" title="Confirm delete" data-unique-id="5e294149-0d1f-4a74-bfee-10c0f56c8be1" data-file-name="components/customer-management.tsx">
                        <Check className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600 font-medium" data-unique-id="ad14ae19-23e4-4902-a5d9-e829d014307a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="139fc300-4abc-42c8-8b50-17a8243750e1" data-file-name="components/customer-management.tsx">Confirm</span></span>
                      </button>
                      <button onClick={() => setShowConfirmDelete(null)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" title="Cancel" data-unique-id="3fc3cb76-468a-4bae-85ee-6ad7eb20d1d8" data-file-name="components/customer-management.tsx">
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div> : <>
                      <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit customer" data-unique-id="631377e1-3be3-4f15-9b9c-8d4a908a6dfb" data-file-name="components/customer-management.tsx">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => confirmDelete(customer.id)} className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 transition-colors flex items-center space-x-1" title="Delete customer data" data-unique-id="436c6f84-4f93-4d11-ae69-5302a1b01eb2" data-file-name="components/customer-management.tsx">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 inline" data-unique-id="4078f498-a9d3-45a4-af29-33f8cb1e1b31" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="83ba06c3-3476-42f2-aab5-5c1ffb1b8a7a" data-file-name="components/customer-management.tsx">Remove</span></span>
                      </button>
                    </>}
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="d3a67f83-f720-4cb3-bf4f-a40834bd3be1" data-file-name="components/customer-management.tsx">
          <div data-unique-id="2e285d48-899b-495f-8c53-dfa2b65e1afc" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="4d66331a-23f3-4232-882f-4f6a68441039" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="3fffd7cf-20e2-4dd4-accb-6db4179697cb" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="a80c62ad-9b38-4997-8210-e6a9e0948b1a" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="f605fe5b-0d62-4217-81ec-fe172f21ad50" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="40c2bf22-e9e1-4005-939e-d2584db858ae" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="ad83a4f5-5703-4a93-85c4-8a1a4d612a4a" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="19e92d72-492b-420d-a6c7-029b9c0858d1" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}