'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Search, UserPlus, Users, X, Edit, Trash2, Check, Download, ChevronDown, ChevronUp, Filter, Calendar, Mail, Phone, Clock, AlertCircle, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import toast from 'react-hot-toast';
import CustomerStats from './customer-stats';
import { processCustomerExcel } from '@/lib/excel-customer-processor';
import * as XLSX from 'xlsx';
export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  tags?: string[];
  addedAt: string;
  lastContact?: string;
  notes?: string;
}
export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Toaster for notifications
  const [visibleFilters, setVisibleFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Customer>('addedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const isInitialLoad = useRef(true);

  // New customer template
  const newCustomerTemplate: Omit<Customer, 'id'> = {
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
    tags: [],
    addedAt: new Date().toISOString(),
    lastContact: '',
    notes: ''
  };

  // Form state for adding/editing customers
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>(newCustomerTemplate);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  // Load customers from localStorage on component mount
  useEffect(() => {
    try {
      // Load directly from localStorage
      const savedCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
      setCustomers(savedCustomers);

      // Extract all unique tags from customers
      const tags = savedCustomers.flatMap(customer => customer.tags || []);
      setAvailableTags([...new Set(tags)]);
    } catch (error) {
      console.error('Error loading customers from localStorage:', error);
      // Initialize with empty array if there was an error
      setCustomers([]);
      setAvailableTags([]);
    }
  }, []);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    // We don't want to save on initial load
    if (!isInitialLoad.current) {
      try {
        // Update available tags
        const tags = customers.flatMap(customer => customer.tags || []);
        setAvailableTags([...new Set(tags)]);

        // Save directly to localStorage
        setLocalStorage('emailCustomers', customers);
      } catch (error) {
        console.error('Error saving customers to localStorage:', error);
      }
    }

    // After first render, set isInitialLoad to false
    isInitialLoad.current = false;
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
  const handleInputChange = (field: keyof Omit<Customer, 'id' | 'tags'>, value: string) => {
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
      alert('Name and email are required');
      return;
    }
    try {
      if (editingCustomer) {
        // Update existing customer via API
        const response = await fetch(`/api/customers/${editingCustomer.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update customer');
        }
        const updatedCustomer = await response.json();

        // Update local state
        const updatedCustomers = customers.map(customer => customer.id === editingCustomer.id ? updatedCustomer : customer);
        setCustomers(updatedCustomers);
        setEditingCustomer(null);
      } else {
        // Add new customer via API
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create customer');
        }
        const newCustomer = await response.json();
        setCustomers([...customers, newCustomer]);
      }

      // Reset form
      setFormData(newCustomerTemplate);
      setIsAddingCustomer(false);
      setShowAdvancedFields(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      alert(`Error saving customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      addedAt: customer.addedAt,
      lastContact: customer.lastContact || '',
      notes: customer.notes || ''
    });
    setIsAddingCustomer(true);
    setShowAdvancedFields(true);
  };

  // Delete a customer with better UI and error handling
  const deleteCustomer = async (id: string) => {
    try {
      // Show loading state
      const toastId = toast.loading('Removing customer data...');

      // Get customer name for confirmation message
      const customerToDelete = customers.find(c => c.id === id);
      const customerName = customerToDelete?.name || 'Customer';
      const customerEmail = customerToDelete?.email || '';

      // Delete from API
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete customer');
      }

      // Update local state
      setCustomers(customers.filter(customer => customer.id !== id));

      // Also remove from selected list if present
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));

      // Remove from localStorage as fallback in case API fails silently
      try {
        if (typeof window !== 'undefined') {
          // Remove customer from emailCustomers
          const localCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
          const filteredLocalCustomers = localCustomers.filter(c => c.id !== id);
          setLocalStorage('emailCustomers', filteredLocalCustomers);

          // Also remove associated orders (matching by email if available)
          if (customerEmail) {
            ['lastProcessedOrders', 'orderDataForEmails', 'lastExportedOrders'].forEach(key => {
              try {
                const orderData = localStorage.getItem(key);
                if (orderData) {
                  const orders = JSON.parse(orderData);
                  if (Array.isArray(orders)) {
                    const filteredOrders = orders.filter((order: any) => order.shipToEmail !== customerEmail);
                    localStorage.setItem(key, JSON.stringify(filteredOrders));
                  }
                }
              } catch (e) {
                console.warn(`Could not process orders in ${key}:`, e);
              }
            });
          }
        }
      } catch (localError) {
        console.warn('Could not update localStorage:', localError);
      }

      // Clear any pending confirmation
      setShowConfirmDelete(null);

      // Show success toast with customer name
      toast.success(`"${customerName}" and their associated orders have been removed`, {
        id: toastId,
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error(`Error removing customer data: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        duration: 4000
      });
      setShowConfirmDelete(null);
    }
  };

  // Function to show delete confirmation
  const confirmDelete = (id: string) => {
    setShowConfirmDelete(id);

    // Auto-hide after a few seconds if not acted upon
    setTimeout(() => {
      setShowConfirmDelete(prev => prev === id ? null : prev);
    }, 8000);
  };

  // Toggle customer selection
  const toggleSelectCustomer = (id: string) => {
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
      alert('No customers to export');
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
        // Update our local state with merged customers
        const existingCustomers = getLocalStorage<Customer[]>('emailCustomers', []);

        // Merge: remove existing customers with matching emails, then add new ones
        const mergedCustomers = existingCustomers.filter(existing => !result.customers.some(processed => processed.email.toLowerCase() === existing.email.toLowerCase())).concat(result.customers);

        // Save to localStorage
        setLocalStorage('emailCustomers', mergedCustomers);

        // Update the state
        setCustomers(mergedCustomers);

        // Update available tags
        const tags = mergedCustomers.flatMap(customer => customer.tags || []);
        setAvailableTags([...new Set(tags)]);
        toast.success(`Successfully processed ${result.customers.length} customers. ` + `(${result.stats.imported} new, ${result.stats.updated} updated)`, {
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
  }} className="bg-card rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl" data-unique-id="a182489e-bf5c-4482-91ac-c72764b3bbcd" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      <Toaster position="top-center" />
      <Toaster position="top-center" />
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="3ca29740-f7c7-49b6-be20-8d5dfcc90d17" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="6a6a4388-3f42-4816-a039-c89542ad7001" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="3b9d4297-066c-46ba-8491-d99c99541268" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="bd377053-c3b2-4d12-b75b-bba7f3415aa4" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="ab522220-3b63-49e5-9163-110df3c56e3a" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Customer statistics overview */}
      <CustomerStats customers={customers} />
      
      {/* Excel template info */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-md text-sm" data-unique-id="49119ef9-cf6d-4e7c-99aa-b11a8f4f9829" data-file-name="components/customer-management.tsx">
        <div className="flex items-center" data-unique-id="711f904e-28a5-46e1-a4d5-1bf2771e5db6" data-file-name="components/customer-management.tsx">
          <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
          <div data-unique-id="4596f6bc-77c8-4055-8568-cb3991445d1b" data-file-name="components/customer-management.tsx">
            <p className="font-medium text-blue-800" data-unique-id="ef2185f6-03ac-4a62-be5a-1cc3a5329211" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="72f94cb3-bc07-4db0-822b-0729e9a03aec" data-file-name="components/customer-management.tsx">Excel Import Format</span></p>
            <p className="text-blue-600" data-unique-id="662f2829-52a6-4378-a989-d19a8c1b8093" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="63cb069a-6fc3-454a-a6e6-3d554a84acee" data-file-name="components/customer-management.tsx">Required columns: name, email. Optional: company, phone, address, city, state, postalCode, tags, notes</span></p>
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
      }} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center" data-unique-id="4a0f2916-9101-43bd-ac9e-cf44576ba716" data-file-name="components/customer-management.tsx">
          <Download className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="4b6add88-721a-4bce-9997-644ea3cbe8b1" data-file-name="components/customer-management.tsx">
          Download Template
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4" data-unique-id="14f4ead0-f2b2-479d-9108-7eead40f8c56" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap items-center gap-4" data-unique-id="539d9798-07a2-4918-84eb-1041fabf3913" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="relative flex-grow" data-unique-id="6e273c53-1b1b-4d32-a8d3-0bb64f452964" data-file-name="components/customer-management.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="e6c5fcb7-915f-4d2b-90a7-3ef44e171b63" data-file-name="components/customer-management.tsx" />
          </div>
          
          <button onClick={() => setVisibleFilters(!visibleFilters)} className={`px-4 py-2 border ${visibleFilters ? 'border-primary bg-primary/5' : 'border-border'} rounded-md flex items-center space-x-2 hover:bg-accent/10 transition-colors`} data-unique-id="ef3f7bf1-c2c3-4a95-8d88-4eb480a17e60" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Filter className={`h-4 w-4 ${visibleFilters ? 'text-primary' : ''}`} />
            <span data-unique-id="9268f56a-b0eb-4378-ba4f-8e14a18df6d6" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{visibleFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {visibleFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* Import/Export buttons */}
          <div className="flex space-x-2" data-unique-id="31c72dda-6e33-41e5-a091-1a053583769b" data-file-name="components/customer-management.tsx">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" id="excel-import" disabled={isImporting} data-unique-id="c1ff8627-a182-46d6-a809-67b8ba023831" data-file-name="components/customer-management.tsx" />
            
            <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="34cc5132-66b3-4a2d-bbcb-537168bb8ef6" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {isImporting ? <>
                  <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                  Importing...
                </> : <>
                  <FileSpreadsheet className="h-4 w-4 inline mr-2" />
                  Import Excel
                </>}
            </button>
            
            <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="dfe7ae40-dbc8-4680-81d8-1b97b171e16a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-lg border border-border" data-unique-id="7426d871-d3f7-4dc0-b284-95ec1402f62a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {/* Tag filter */}
            <div data-unique-id="431ccdca-9ae8-4041-8d6e-37fdbbf849b8" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="aebddd66-6675-4754-9dc4-aa882d60178f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="cb4f9303-9718-4820-84dd-6a6321102714" data-file-name="components/customer-management.tsx">Filter by Tag</span></label>
              <div className="relative" data-unique-id="c93bb68a-1545-48b0-984b-492b8f50bc23" data-file-name="components/customer-management.tsx">
                <select value={filterTag || ''} onChange={e => setFilterTag(e.target.value === '' ? null : e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="f7489426-140e-4690-93a7-ffa3b53228ef" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="ae93ed7e-5dcb-49d9-bd72-3b37a6d2922c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5b54be82-3753-4e21-a814-488c399c1299" data-file-name="components/customer-management.tsx">All Tags</span></option>
                  {availableTags.map(tag => <option key={tag} value={tag} data-unique-id="b142c513-24f1-40f2-ab30-8e751a7f83da" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            
            {/* Date filter */}
            <div data-unique-id="e500b789-b018-4865-b2d6-6c467bac6d24" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2 flex items-center" data-unique-id="242cf593-0b9c-4183-8f61-fe577d7c75d5" data-file-name="components/customer-management.tsx">
                <Calendar className="h-4 w-4 mr-1" data-unique-id="76a80a02-f8f2-4a33-a1e7-0001e1d95530" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="0778e23a-7b93-4715-ae65-3b1342dc7de6" data-file-name="components/customer-management.tsx">
                Filter by Date
              </span></label>
              <div className="relative" data-unique-id="aa87e6a0-16a0-4370-961a-671dc7fdbac5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="0989bf28-7bed-40cf-ace1-15c04167f475" data-file-name="components/customer-management.tsx" />
                {dateFilter && <button onClick={() => setDateFilter('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear date filter" data-unique-id="ed7874ca-cc93-4a8a-8c7e-0d80ad9c659d" data-file-name="components/customer-management.tsx">
                    <X className="h-4 w-4" />
                  </button>}
              </div>
            </div>
            
            {/* Status filter */}
            <div data-unique-id="354b50ca-acb3-4549-af9b-7ded15b34bed" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="0043acf7-a3d7-4539-a9df-cb8493224f37" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="eb727a49-c4c3-41b5-a37f-06d53a781c67" data-file-name="components/customer-management.tsx">Customer Status</span></label>
              <div className="relative" data-unique-id="b18c73c8-cb75-4dfa-b1d9-79aa7081e990" data-file-name="components/customer-management.tsx">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="2f5de13e-5405-4fa1-969a-7667ebbbbee6" data-file-name="components/customer-management.tsx">
                  <option value="" data-unique-id="46bede6f-773b-463a-91dc-9100ce69ae1e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="85eeffe6-d0e4-4404-bfa3-3238917b9381" data-file-name="components/customer-management.tsx">All Customers</span></option>
                  <option value="withEmail" data-unique-id="1bc4eda9-223f-4436-a5ec-51f0777ba0e9" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d1b5ab62-5559-430f-a084-f2bd196e5c43" data-file-name="components/customer-management.tsx">With Email</span></option>
                  <option value="withPhone" data-unique-id="0e1a1873-a0b8-40c2-a0b8-fd436c378aea" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="081a7727-ca28-4208-a8be-b9749be849ba" data-file-name="components/customer-management.tsx">With Phone</span></option>
                  <option value="withNotes" data-unique-id="ce8c4c04-fa88-493c-9dcb-6f01263f079a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c01e7815-375b-42b4-aa0e-9ff058317d15" data-file-name="components/customer-management.tsx">With Notes</span></option>
                  <option value="withoutNotes" data-unique-id="9ee29d62-e018-4c26-82f2-7e878f973ffe" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="7d525756-de8a-4fcf-8d7e-da7d92d98d46" data-file-name="components/customer-management.tsx">Without Notes</span></option>
                  <option value="recentlyAdded" data-unique-id="59d08fda-3de2-4201-8521-cd56ef1f71ec" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9896eb56-8d66-44b0-96f5-881ec542b64f" data-file-name="components/customer-management.tsx">Recently Added (7 days)</span></option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </motion.div>}
        
        {/* Active filters display */}
        {(searchQuery || filterTag || dateFilter || statusFilter) && <div className="flex flex-wrap gap-2 mt-2" data-unique-id="4c02b76f-5a20-4b7c-8c02-2e8ca3be0229" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {searchQuery && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="4066c1bc-e388-4eb5-a573-5f2d812922bb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Search className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="6dc0817c-7de3-4636-876d-869a75daeab7" data-file-name="components/customer-management.tsx">
                Search: </span>{searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary/70" data-unique-id="9d64b0e6-caa3-4ecd-964d-9ca92d069760" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {filterTag && <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="e4aea3b2-04b6-45c6-b979-77f8a9081a45" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Filter className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="1d8dedcb-d82e-442f-b703-89aeacff4631" data-file-name="components/customer-management.tsx">
                Tag: </span>{filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-blue-500" data-unique-id="cf383618-3959-42cb-89a7-4a09ac86691d" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {dateFilter && <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="5e4dfd52-6974-4e91-ab6f-926560e31f03" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Calendar className="h-3 w-3 mr-1" data-unique-id="19a91661-3000-4a36-be1e-717cd33d575b" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="8165546c-aeeb-40fd-92c3-bef457932bfe" data-file-name="components/customer-management.tsx">
                Date: </span>{new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="ml-1 hover:text-green-500" data-unique-id="d2a39832-3d1a-4fe9-abb1-2e06cde91265" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {statusFilter && <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="bce0525f-f813-4fe0-968f-1fa2326f361b" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {statusFilter === 'withEmail' && <Mail className="h-3 w-3 mr-1" />}
                {statusFilter === 'withPhone' && <Phone className="h-3 w-3 mr-1" />}
                {statusFilter === 'withNotes' || statusFilter === 'withoutNotes' ? <Edit className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="41733bec-b4a0-47e3-b7cd-c112e1f5ff86" data-file-name="components/customer-management.tsx">
                Status: </span>{statusFilter === 'withEmail' ? 'With Email' : statusFilter === 'withPhone' ? 'With Phone' : statusFilter === 'withNotes' ? 'With Notes' : statusFilter === 'withoutNotes' ? 'Without Notes' : 'Recently Added'}
                <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-amber-500" data-unique-id="e5c52965-cbd3-447c-9720-05c267f7ec5a" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            <button onClick={() => {
          setSearchQuery('');
          setFilterTag(null);
          setDateFilter('');
          setStatusFilter('');
        }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center hover:bg-gray-200" data-unique-id="6f1131d5-807a-459b-a19b-3c909c2c341f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1574ec48-90a0-4b27-be31-c16133454b68" data-file-name="components/customer-management.tsx">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="87f7594b-c569-4f13-b935-3fce715e7814" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="38b8ad1e-3a6a-4384-8863-06090ed6cdea" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="a473a75e-3630-4826-9c7c-7d5f336d8ccd" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="c83f141d-c02f-4964-990e-8f221da021d4" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="b9d364d4-d853-403b-ab79-d3e96a546ece" data-file-name="components/customer-management.tsx">
            <div data-unique-id="53160784-b735-4444-9692-103e3716537c" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="7091e240-bc42-40ce-8989-d83e3466360f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e91c5832-bc45-4967-acde-9d98fedc28d5" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="bb828cae-2857-4f0f-b8aa-5582c9828baf" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="7ac22337-eac7-4dcc-ad2d-9ee9251db14b" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="56e7bed3-9f96-4aa5-976c-86dda9ba9cb3" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="0f68e9ab-472f-406d-9642-dd15e46b541f" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="3932f7bc-aed2-433e-962e-6c6f31b0bbb8" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="826b4004-ea9f-4829-9975-25d12accd72f" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="b0e23890-8666-4c54-9ab6-92433f189f8a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="be116f1a-7ba0-41e0-bede-d67cbcc379ac" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="fc61a85d-c30c-4924-962b-4f071dc8b3f3" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="bfd7e023-4260-4c51-a604-1f76392bdd1c" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="0020018e-10f0-444a-8fd4-99334b254200" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="7f6b6582-ee8c-4b8f-af73-cfa6834dbf50" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="34feec05-cc1f-4f9d-8163-8d370d1bb4b6" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="82fab7dc-201a-43ce-bfe1-8f09deb07515" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="02df290b-b584-4aad-8240-bd329d14add3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="98216cf9-1d34-4f1d-a954-3d137f861652" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="404c72df-3699-4f38-8d64-94754d4a59f5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="42004d6a-6107-4e6d-b24a-76135b2aa304" data-file-name="components/customer-management.tsx">
              <div data-unique-id="4fd467d1-2611-4733-ae10-48a5aa0d1541" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="56247dae-b1b9-4e17-b705-1542f1e63068" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="7e2dd8ba-3a71-4102-b8f9-27109c47b598" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="0b582883-78b3-405d-bffc-5ccfa34e287b" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="418a760b-d0a6-45f6-bd21-0205b602622a" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="4dc2b803-360f-43b9-bcfd-8481f50ecee1" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="59c72ae3-2824-4bda-a9c6-b60e54e72106" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="9253da87-1f2f-401c-8329-eb75c95f707d" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="b46316c8-4fe6-4e66-bfd9-f53e5fbbfef4" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="7e8d09b9-f5fc-44c8-b5e6-600d51416892" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8d70f592-9307-4468-9c9e-c7f8b739cc48" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="d0bfc5aa-2c9d-4ea1-84f3-5f0bcd952116" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="b6214616-15fc-4607-a621-f60ed41727cb" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="b64725b7-196c-49bd-9844-e3b91848ab3a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="58facd59-26c4-4bf3-aae4-3acf9eda8c9f" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="3947f7b3-3654-4d57-bd08-88c26afd04d4" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="e797545e-f73e-48ce-9c60-90d31cbe64dc" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="545a9c4d-b2f6-457c-800d-3c4fda92f3ae" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="2d9bdedf-b2a2-47d3-ae3a-81824129e00d" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="980d67a9-d9a0-444d-818b-a790dcf8581c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="e8df9288-8790-48aa-900b-ce902ad70a6b" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="3587ed51-6f9c-46a6-a0f4-8cb7c3ebb787" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="23f76500-d063-4369-b973-bffc055ab367" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="806664d6-d654-4e0a-b99e-0fb0ef5839bc" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="3fb169f4-1dcc-4472-abe5-5c4151ba43fe" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="79cf3832-f81d-41c6-aa58-630e7d0251cf" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="d4426c94-982d-4a14-8603-3a69280140d3" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="50032dcb-21a2-4e7c-b190-9e48919a793a" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="0d1c885e-8b27-4f64-8986-63aa264acd70" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e705e5cc-15d6-49b0-8175-0b5eac475801" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="eebd8222-d837-4379-97b3-11c45245f526" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="048bb532-ddde-4664-b86a-49d965671791" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="7736929a-bb0c-4125-8b54-412843a66094" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="83ffd365-3897-4e10-81cc-cc28a2e23bf4" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="w-full max-h-[70vh] overflow-y-auto" data-unique-id="a4cefd6f-7b4c-4199-b482-5b28c8786863" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground bg-card" data-unique-id="ceb63029-4fc6-4c27-bc96-49703b461fae" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="99cf24bb-72ca-4c54-bf35-73fdc202befb" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="1b00f858-99fd-40ce-94e0-1786d5f7c22e" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="9e57a714-8e81-4f36-842d-35214af691ca" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="f80af8ad-e1f0-47fe-bc00-5b7d2048de5b" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="83e73249-4a89-43a1-a8bd-c291217c965c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="d5a55f01-d8a0-4ed7-bc70-600cde1a8834" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="8d39ec39-b6d4-40bf-88e3-6610f8fd2fe2" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="bfa17bc8-7cba-4ac2-8617-3b38e7c6d086" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {showConfirmDelete === customer.id ? <div className="flex space-x-1" data-unique-id="62bada33-d613-473c-adf9-428c25742f81" data-file-name="components/customer-management.tsx">
                      <button onClick={() => deleteCustomer(customer.id)} className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 flex items-center space-x-1" title="Confirm delete" data-unique-id="0372682e-f219-444e-bedf-f7866e7e9294" data-file-name="components/customer-management.tsx">
                        <Check className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600 font-medium" data-unique-id="19fd243e-e00a-418c-bed2-6fd5522c659e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="39e151b5-9c11-4f91-a3ce-cb536f359064" data-file-name="components/customer-management.tsx">Confirm</span></span>
                      </button>
                      <button onClick={() => setShowConfirmDelete(null)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" title="Cancel" data-unique-id="e008d70d-1938-44b5-b9b8-e59a0e265791" data-file-name="components/customer-management.tsx">
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div> : <>
                      <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit customer" data-unique-id="97fac141-ada5-4053-9c9a-25b78b267c53" data-file-name="components/customer-management.tsx">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => confirmDelete(customer.id)} className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 transition-colors flex items-center space-x-1" title="Delete customer data" data-unique-id="c6f72424-4e41-439e-8339-15fe7fa9a366" data-file-name="components/customer-management.tsx">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 inline" data-unique-id="87884081-aa9c-4b01-939a-ef54a267e0b6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4a4825c5-bff3-48e6-be75-902c084f810f" data-file-name="components/customer-management.tsx">Remove</span></span>
                      </button>
                    </>}
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="7368c3a2-221c-487a-ae37-e554bf1e3f7d" data-file-name="components/customer-management.tsx">
          <div data-unique-id="694f4763-91f4-49aa-9576-48e4b433a456" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="0969c886-e64c-4582-a908-2a2ea3b89fe8" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="ef7e4440-5927-4a1b-b8f9-fe3a206c2643" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="f953741a-9a64-438f-ac17-7c26cf0285f0" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="3fa7e7cb-6cf1-485e-899b-b1b315b53fbb" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="71085d36-dcc7-4380-8da9-7d989bd35f43" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="88dd010d-916f-44d2-a475-df11c9c59c37" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="d73be6bb-f8e8-4f0b-9970-b0a522d4612b" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}