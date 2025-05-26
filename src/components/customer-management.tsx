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
  }} className="bg-card rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl" data-unique-id="5600405f-c073-403f-8e1e-ffeec9a3a5a8" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      <Toaster position="top-center" />
      <Toaster position="top-center" />
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="85dd6ffd-bf60-461e-8cbb-a76b5cf6a491" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="4998d6de-d143-4f8a-9e2a-7c84c60e25bb" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="1aa31960-7aab-463e-ac37-20f3fa32d10d" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="cbb0129d-45ce-47bd-a707-f3069689024d" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="f7b7c11a-e628-41d3-9535-9f8e75baaf98" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Customer statistics overview */}
      <CustomerStats customers={customers} />
      
      {/* Excel template info */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-md text-sm" data-unique-id="7a06bbae-2085-462a-9fcd-e6a4fe875fe4" data-file-name="components/customer-management.tsx">
        <div className="flex items-center" data-unique-id="7f7e16f5-90f3-4bb2-abc3-e6162b033035" data-file-name="components/customer-management.tsx">
          <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
          <div data-unique-id="8210f701-7568-421e-b732-debded9776e5" data-file-name="components/customer-management.tsx">
            <p className="font-medium text-blue-800" data-unique-id="63b87629-941e-42cd-9b8c-091f66078c2f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="dd4bec59-b7ab-418c-97bc-b79911071f52" data-file-name="components/customer-management.tsx">Excel Import Format</span></p>
            <p className="text-blue-600" data-unique-id="cf874cd4-905a-437c-a5ff-6ec9de167c1b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1ffa2a15-d74e-45e3-a85d-45e37febc06e" data-file-name="components/customer-management.tsx">Required columns: name, email. Optional: company, phone, address, city, state, postalCode, tags, notes</span></p>
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
      }} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center" data-unique-id="ec921c61-3fc8-41a5-9e3c-ac27a2265db7" data-file-name="components/customer-management.tsx">
          <Download className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="44a12d42-a3ce-4b37-ab01-84463f57a467" data-file-name="components/customer-management.tsx">
          Download Template
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4" data-unique-id="d82e7226-cb93-4873-9641-955e67bfb42a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap items-center gap-4" data-unique-id="a3b80819-6ca1-40dc-a60a-a69251e0bbbf" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="relative flex-grow" data-unique-id="ae0d0021-5ef8-4015-b90a-fac15effe9ed" data-file-name="components/customer-management.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="3321b28c-3300-45e0-bf54-fedd189fc5d3" data-file-name="components/customer-management.tsx" />
          </div>
          
          <button onClick={() => setVisibleFilters(!visibleFilters)} className={`px-4 py-2 border ${visibleFilters ? 'border-primary bg-primary/5' : 'border-border'} rounded-md flex items-center space-x-2 hover:bg-accent/10 transition-colors`} data-unique-id="59a4f7c4-75a3-4e6a-a4dd-f2e2cc044212" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Filter className={`h-4 w-4 ${visibleFilters ? 'text-primary' : ''}`} />
            <span data-unique-id="b2f6e5ce-fca6-4e47-8a4f-3f1e083fa5c5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{visibleFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {visibleFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* Import/Export buttons */}
          <div className="flex space-x-2" data-unique-id="91986a92-5538-47f3-acda-d7d85a1c3a95" data-file-name="components/customer-management.tsx">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" id="excel-import" disabled={isImporting} data-unique-id="b583341f-ea0b-4a86-86b1-e8add458b826" data-file-name="components/customer-management.tsx" />
            
            <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="cbd6ed28-38fd-4ff4-a5cb-3a26796eace3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {isImporting ? <>
                  <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                  Importing...
                </> : <>
                  <FileSpreadsheet className="h-4 w-4 inline mr-2" />
                  Import Excel
                </>}
            </button>
            
            <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="5ee73205-bd6f-4d1e-8547-aa2d66a74e26" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-lg border border-border" data-unique-id="3dd9c48e-cd32-4d1b-9ce0-2278053b518b" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {/* Tag filter */}
            <div data-unique-id="f7b530ef-998b-449a-9dc3-bd3ba2c76f0c" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="b5c8b4ec-b9ba-4782-aa3f-70c8b6b87ea7" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4f329f36-e3a3-4a21-b627-14e09e979514" data-file-name="components/customer-management.tsx">Filter by Tag</span></label>
              <div className="relative" data-unique-id="ef7d60d0-71ab-4025-87f1-e60e2a4c1613" data-file-name="components/customer-management.tsx">
                <select value={filterTag || ''} onChange={e => setFilterTag(e.target.value === '' ? null : e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="7556f950-3f0b-48fc-bb65-8cf2e1bd9a21" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="8ed5f242-a399-4281-a6b4-568530705d11" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="cfbfa75d-526e-492e-af95-a72be57310fd" data-file-name="components/customer-management.tsx">All Tags</span></option>
                  {availableTags.map(tag => <option key={tag} value={tag} data-unique-id="29b2abd2-f71b-4544-bcf2-c513e0b49a54" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            
            {/* Date filter */}
            <div data-unique-id="fcb5fa74-2c79-4440-ace0-54829ec5135d" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2 flex items-center" data-unique-id="0c79baab-c57b-4f72-a70f-1ec7ec68aa03" data-file-name="components/customer-management.tsx">
                <Calendar className="h-4 w-4 mr-1" data-unique-id="dde4e5d5-e8af-4736-a228-03426da8a410" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="6fc5d213-fbc0-4731-b3a4-53cced798fe6" data-file-name="components/customer-management.tsx">
                Filter by Date
              </span></label>
              <div className="relative" data-unique-id="c2f7b6bc-2ed3-490c-86f9-cb29991c2b5e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="f73e4e38-5d87-4c11-b408-82623bb0b4f3" data-file-name="components/customer-management.tsx" />
                {dateFilter && <button onClick={() => setDateFilter('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear date filter" data-unique-id="c56ced55-c94b-4b88-8d12-1172f8f455fe" data-file-name="components/customer-management.tsx">
                    <X className="h-4 w-4" />
                  </button>}
              </div>
            </div>
            
            {/* Status filter */}
            <div data-unique-id="b9c29f31-42e7-4642-8511-0a129e74eec1" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="86bce8f5-63ae-4851-911f-0bd908de17f3" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="72ae3d4b-9deb-4f28-a864-c2ff0f97699a" data-file-name="components/customer-management.tsx">Customer Status</span></label>
              <div className="relative" data-unique-id="37e2e7b3-194e-43e7-a85f-895ca505c82c" data-file-name="components/customer-management.tsx">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="b0c3f1c0-c020-44b3-ae79-49cb34296ae4" data-file-name="components/customer-management.tsx">
                  <option value="" data-unique-id="3ced7981-f7af-4842-96fc-c7bb1cfc752c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e851937c-ffdd-410d-9aa3-95342995fe45" data-file-name="components/customer-management.tsx">All Customers</span></option>
                  <option value="withEmail" data-unique-id="e071c288-6a23-4994-bf0d-ed99a35b2578" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="bee0c3ae-3dc2-4342-962a-3bb1495708d4" data-file-name="components/customer-management.tsx">With Email</span></option>
                  <option value="withPhone" data-unique-id="be43b70f-e024-4fe4-babe-72f1d578ad1d" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b5667a6f-fee0-4144-8c24-b5a240da329b" data-file-name="components/customer-management.tsx">With Phone</span></option>
                  <option value="withNotes" data-unique-id="3bc145a5-c489-4c74-b5a7-87a1e448d077" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="fb5cd598-b56d-4345-80bc-34fd3a442543" data-file-name="components/customer-management.tsx">With Notes</span></option>
                  <option value="withoutNotes" data-unique-id="05ec0fb7-eeee-4bef-ae90-75ba57f85d1a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8f980eb4-00d4-43ec-a040-fe9c2e4f4b80" data-file-name="components/customer-management.tsx">Without Notes</span></option>
                  <option value="recentlyAdded" data-unique-id="dba93e71-935c-4a62-b719-10840e0e3444" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="22834022-18ba-4be3-ba26-36e35187ac26" data-file-name="components/customer-management.tsx">Recently Added (7 days)</span></option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </motion.div>}
        
        {/* Active filters display */}
        {(searchQuery || filterTag || dateFilter || statusFilter) && <div className="flex flex-wrap gap-2 mt-2" data-unique-id="c3665ec5-512f-4a34-b247-cb460d5a9a08" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {searchQuery && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="d38abb5f-b990-4dfb-b4a2-6f0ffa4d8095" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Search className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="3b1f02e8-e003-4de9-a10f-48409ad44bf9" data-file-name="components/customer-management.tsx">
                Search: </span>{searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary/70" data-unique-id="5ec8f935-f850-4ca3-aa53-0bdee9a317e9" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {filterTag && <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="d55af19b-1bf7-42fc-8e44-03288ebfc933" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Filter className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="94d46060-e4b9-41c0-939b-ec0969230f13" data-file-name="components/customer-management.tsx">
                Tag: </span>{filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-blue-500" data-unique-id="015ec93b-721c-4698-9d02-e5d66374c16b" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {dateFilter && <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="4a7f0aa9-4c3a-4552-9832-ddd4422b8c7f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Calendar className="h-3 w-3 mr-1" data-unique-id="7b8d3a83-d3b0-4aec-bf27-daddce91a57a" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="30087531-ba26-4435-a5cb-138bcafe4fa4" data-file-name="components/customer-management.tsx">
                Date: </span>{new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="ml-1 hover:text-green-500" data-unique-id="2edb2c7d-0e44-4400-b3cf-152db19e0cf3" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {statusFilter && <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="94040d70-90eb-4ddf-aadb-eed3fe70efb3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {statusFilter === 'withEmail' && <Mail className="h-3 w-3 mr-1" />}
                {statusFilter === 'withPhone' && <Phone className="h-3 w-3 mr-1" />}
                {statusFilter === 'withNotes' || statusFilter === 'withoutNotes' ? <Edit className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="8b8a082b-cb93-4d44-93e9-9df0a728461f" data-file-name="components/customer-management.tsx">
                Status: </span>{statusFilter === 'withEmail' ? 'With Email' : statusFilter === 'withPhone' ? 'With Phone' : statusFilter === 'withNotes' ? 'With Notes' : statusFilter === 'withoutNotes' ? 'Without Notes' : 'Recently Added'}
                <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-amber-500" data-unique-id="41f3a0ee-e5dc-4edd-843a-17f0695e868f" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            <button onClick={() => {
          setSearchQuery('');
          setFilterTag(null);
          setDateFilter('');
          setStatusFilter('');
        }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center hover:bg-gray-200" data-unique-id="4f5a943c-9d1d-4c40-abc6-ded2cfc6ed21" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="38498431-f486-4b0d-bb6c-263c41fed3aa" data-file-name="components/customer-management.tsx">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="06b028f9-3130-4b3c-a2f4-5b95b89e4bfa" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="b13907e3-9873-447e-ad11-bfc10496e82d" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="e7387016-3023-4ab5-a0e5-3d3f7bfb7eb7" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="ed30af97-8d4e-40c3-b14b-dfb1b6429c70" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="5e8d56d9-1fc0-4a87-9875-f35767f7f875" data-file-name="components/customer-management.tsx">
            <div data-unique-id="9ea38c88-bb67-46ab-864d-1d6562097a6d" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="7bcff595-b766-4120-8e08-7b28aa934de2" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="ba4e075e-04d0-48f8-83f5-b503db55da74" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="b66b5174-2de7-40f0-b8ae-6a01245f88ef" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="df97f7f2-5eb6-4dd9-ba81-7f69cdc5b33c" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="d838c923-aada-4706-b5ac-d24fe750e992" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6bb56d55-8242-4912-8655-a6bf6f861884" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="e3c8e369-a8be-4c92-b923-388e9f0fd76b" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="5afe96f4-a65f-43a0-8f39-fc7c6e326b4d" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="4c97cd91-f32d-4bd6-a480-d69c259b9598" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="029ad29f-cde8-47db-8001-6875039874fc" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="57456c94-2d1a-4790-9026-173304fc840b" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="e4d481df-4228-4449-9b00-30cfa6dd4b32" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="5fc03595-e473-493f-ab5a-8fafcb76c36f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5aee42e4-8e0c-4461-941d-244d1945604f" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="10acb713-2c13-4698-a369-1fd7873cf06a" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="39f9888e-5153-46a0-833d-2ee28f7c6ddb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="e2fc34bb-77ad-45c4-9a56-a886e81cbe3c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="b4399a82-4dab-473a-a671-599933e8a987" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="9efc01c4-0125-474c-9aa6-b2168907c8f7" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="aed23ef1-e0db-4486-a097-3f1078d8d204" data-file-name="components/customer-management.tsx">
              <div data-unique-id="ec46c1e1-5ec3-470f-a0fc-c63dd998bfff" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="ad06ee90-8923-4e1b-94c1-c43227dc0d60" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6e9a8197-18c4-455b-9174-d4acd527aad6" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="e7ab25b6-a611-4566-93ad-a34ccee881e8" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="166620f1-16bf-44f8-80a8-a64c36168932" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="88813e6b-b717-489d-b0c0-5eb4b3b3b8ac" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9f8d98d3-9566-4e36-b645-3bfac03d1b21" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="17fa1574-4520-4d30-8495-39800eaacf4e" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="c25d8b43-335f-4336-89a2-01b9e4968053" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="897e502e-8fec-41a0-be86-482dea7e4673" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e2015aaa-41cc-4874-895d-96e752bb693f" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="1b01226f-b729-4ded-8de7-bf14add8ba6f" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="d8928883-4366-4d42-bed4-d929ea77fe5c" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="2d33989c-96ef-44ed-9b33-53b6ee3c9724" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="421c05d6-fb66-4b49-93d6-4832e1de70e9" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="623e73ce-c91a-4da7-813e-8bf03f9e4a1b" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="8341128d-c3da-4099-b50e-960b2d5ed613" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="8bc29217-0a47-48a2-a288-84628f166581" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="dc73408f-45a5-4ac7-a3d5-5e67bbd26f50" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="68f7c514-4fcd-4d54-bc1b-370128a76525" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="6240e60d-abdc-4e6d-ab7f-c32e3d9164e8" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="d73e12e5-c0ab-4f37-9d0e-8c719318a9ee" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="a39d4908-3fc4-4980-8a78-a08ffd60add1" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="da1effca-6207-43a0-80f0-cf490925b54a" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="43f319e2-7150-4879-a997-6f8af314c452" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f679656e-8fd1-4f3a-bb38-09e719b50a06" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="263c7cc3-aa42-4e9b-8182-2b2bf8b57f8a" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f5286190-fe0a-4149-822e-f7103ba2c724" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="10c925e9-10e7-4cb4-a855-3e86051c0b8f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="96d53707-654e-46a6-a6c5-686cc83be8ec" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="d4b47492-6b5f-4248-8a30-cfaf958498c6" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ab12692b-aef3-4e0c-86f7-7629a26eb9da" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="8a0d207e-4b84-43ba-90b5-4d152b2a3e57" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d58a755a-3cd9-4206-a49c-2ac81c7ba2ba" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="w-full max-h-[70vh] overflow-y-auto" data-unique-id="0c65cee2-65a8-4349-a2ea-eedf90003d61" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground bg-card" data-unique-id="808536cf-a103-4dd7-8bb8-93e99180b32c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="733bb67d-b66e-4152-9c76-8abd1b26914b" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="20e7cf05-0fbd-49da-bb0d-a8d4861edece" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="e11c92f0-0b90-4f81-bc7f-8b3144284d02" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="f4742bb1-1f35-4e57-8eca-670c6d4a5818" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="7cd6a394-7bac-4c9d-8292-e9af3779ce6d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="3a6b045d-b7a9-4a06-a321-6ce4ece7ce5a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="91a0623a-98e9-4609-8a50-81c25873a4c0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="bb69c623-2840-4122-84d9-b0e88ee54e9e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {showConfirmDelete === customer.id ? <div className="flex space-x-1" data-unique-id="2c45383b-5097-456a-9be9-aed2ecf67a80" data-file-name="components/customer-management.tsx">
                      <button onClick={() => deleteCustomer(customer.id)} className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 flex items-center space-x-1" title="Confirm delete" data-unique-id="f5d1cb6e-010a-42db-af99-90eaa2378ea0" data-file-name="components/customer-management.tsx">
                        <Check className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600 font-medium" data-unique-id="9c8de14e-d692-4413-8c0f-dbd0b9f869fe" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6897451d-bef4-4de5-b7aa-e18ed5005a91" data-file-name="components/customer-management.tsx">Confirm</span></span>
                      </button>
                      <button onClick={() => setShowConfirmDelete(null)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" title="Cancel" data-unique-id="02d730dd-7d28-402c-b7cf-eeb6b1671199" data-file-name="components/customer-management.tsx">
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div> : <>
                      <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit customer" data-unique-id="a87c2df2-55bd-4624-b71b-ada054b616a8" data-file-name="components/customer-management.tsx">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => confirmDelete(customer.id)} className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 transition-colors flex items-center space-x-1" title="Delete customer data" data-unique-id="38146b00-ce5e-4dd4-a5cd-563f85ba6a8e" data-file-name="components/customer-management.tsx">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 inline" data-unique-id="30bf1afd-cdd8-4cd5-8017-4506028f8388" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9c2a0987-3314-47a2-8bbd-9255eaaa91b9" data-file-name="components/customer-management.tsx">Remove</span></span>
                      </button>
                    </>}
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="14288b3d-dfc7-4053-b796-ab6fddef210e" data-file-name="components/customer-management.tsx">
          <div data-unique-id="3bd25c58-6392-4f77-8534-c5dccfaa6633" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="edaa8acc-eb71-4573-8113-7881e17ffd50" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="0fa34de5-54d0-45f0-9687-fe82cb4ae3fc" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="ba33d6da-4061-474c-bf88-c610503042cb" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="84c22cb9-8453-4995-b672-960c929b1d02" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a07e0a46-b9ae-4940-99eb-63afdfed12f8" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="fcc89ca5-0780-4d2e-8df0-ba30d249bec3" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="78531ae7-f5e3-4619-9dc9-d47559ebd8a7" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}