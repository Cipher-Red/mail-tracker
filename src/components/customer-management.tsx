'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Search, UserPlus, Users, X, Edit, Trash2, Check, Download, ChevronDown, ChevronUp, Filter, Calendar, Mail, Phone, Clock, AlertCircle } from 'lucide-react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import toast from 'react-hot-toast';
import CustomerStats from './customer-stats';
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
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="bg-card rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl" data-unique-id="db8955c0-12a7-4a27-91f6-e9012e970585" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      <Toaster position="top-center" />
      <Toaster position="top-center" />
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="2e433e3c-a561-4514-99dc-d026d692e7cb" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="b93a7117-bb30-47bb-b570-2116d9140a54" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="627e79f7-19f9-4c32-983f-c73617d1d0bc" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="7ccce47f-9c78-457f-9955-92b5bab7268b" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="906c78e9-d83c-4248-ab70-244ac6a31bab" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Customer statistics overview */}
      <CustomerStats customers={customers} />
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4" data-unique-id="9717d33d-3219-418f-9114-82b7fed1d4e7" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap items-center gap-4" data-unique-id="dd3fd62e-34d7-43bb-95ec-4ef4a7f0698d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="relative flex-grow" data-unique-id="f2c49caf-6891-4994-b0f0-681ec3d2e2e8" data-file-name="components/customer-management.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="9dc7b8fe-dfad-40cf-94b2-d5382289994e" data-file-name="components/customer-management.tsx" />
          </div>
          
          <button onClick={() => setVisibleFilters(!visibleFilters)} className={`px-4 py-2 border ${visibleFilters ? 'border-primary bg-primary/5' : 'border-border'} rounded-md flex items-center space-x-2 hover:bg-accent/10 transition-colors`} data-unique-id="e8538fdb-0a58-403d-ab3e-5febdc1e1e06" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Filter className={`h-4 w-4 ${visibleFilters ? 'text-primary' : ''}`} />
            <span data-unique-id="576a0d32-8fdd-424c-bc46-569ebdbb9c60" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{visibleFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {visibleFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* Export button */}
          <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="020c53d6-3bdc-416a-9c82-d0ff7a5a2a08" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Download className="h-4 w-4 inline mr-2" />
            {selectedCustomers.length > 0 ? `Export (${selectedCustomers.length})` : 'Export All'}
          </button>
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
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-lg border border-border" data-unique-id="324c6c55-9397-43fc-b6ef-78c91cbf9f3d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {/* Tag filter */}
            <div data-unique-id="c4d9e5ef-a058-4345-8928-b07552673509" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="675e619b-dc3a-4152-b7e2-6fb405498e58" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4facd3bb-a36d-4b37-a73a-d6f3e1ad9139" data-file-name="components/customer-management.tsx">Filter by Tag</span></label>
              <div className="relative" data-unique-id="e5b6734a-11c1-4676-b493-580f73b463df" data-file-name="components/customer-management.tsx">
                <select value={filterTag || ''} onChange={e => setFilterTag(e.target.value === '' ? null : e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="c6d263ba-52f6-4649-8466-c5e7b35c036e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="e9868693-7d8e-45f5-8320-02afa8433f10" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8fe239f4-7fa8-4537-a9eb-ded8a89327ea" data-file-name="components/customer-management.tsx">All Tags</span></option>
                  {availableTags.map(tag => <option key={tag} value={tag} data-unique-id="98d8e495-d431-4402-9418-aebbaf1253ab" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            
            {/* Date filter */}
            <div data-unique-id="403046de-0c59-4c12-b5b3-588565d57626" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2 flex items-center" data-unique-id="60343360-5e84-497e-ae97-0e47f7514482" data-file-name="components/customer-management.tsx">
                <Calendar className="h-4 w-4 mr-1" data-unique-id="ffed0b63-e234-480f-ab6e-c1bf2c201b70" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="caa44bf7-495e-49e7-98f4-7972119e777e" data-file-name="components/customer-management.tsx">
                Filter by Date
              </span></label>
              <div className="relative" data-unique-id="715e5e5d-bb88-45a7-9b0d-1cf38cb3c87d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="b3e2a1de-6b47-4fda-b094-140fa5b610a8" data-file-name="components/customer-management.tsx" />
                {dateFilter && <button onClick={() => setDateFilter('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear date filter" data-unique-id="f20a2ed8-0a32-4366-ae16-71cb1b2a6c31" data-file-name="components/customer-management.tsx">
                    <X className="h-4 w-4" />
                  </button>}
              </div>
            </div>
            
            {/* Status filter */}
            <div data-unique-id="6686ce69-7b62-43a7-8e5a-056fca3707bf" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="10b725b9-d7b0-4008-94ad-edeb2a5d782f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="bc2bc954-92d1-4460-ac38-29c83a441968" data-file-name="components/customer-management.tsx">Customer Status</span></label>
              <div className="relative" data-unique-id="6e24b2e6-e721-4db0-bbdf-224fd6f9d55c" data-file-name="components/customer-management.tsx">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="2580f533-6acb-4cc5-9e98-fd8e23110782" data-file-name="components/customer-management.tsx">
                  <option value="" data-unique-id="8821c311-5be2-48f3-9b04-637f5710560c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1a3a240b-bb47-478a-b29b-e5d17b9b69a0" data-file-name="components/customer-management.tsx">All Customers</span></option>
                  <option value="withEmail" data-unique-id="8507814b-9892-475e-b114-42434065b890" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8d1ba61c-7c1e-42ba-b1e8-275978b79723" data-file-name="components/customer-management.tsx">With Email</span></option>
                  <option value="withPhone" data-unique-id="f8a7d677-600d-46dc-be68-50f18049d487" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="14f3216d-ccf6-48b0-992e-42bbca8f0dfc" data-file-name="components/customer-management.tsx">With Phone</span></option>
                  <option value="withNotes" data-unique-id="e8ded4a9-4fa9-418c-b07e-61c6ccf5694f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="2f902e70-8819-4e14-888b-8e5cc403c389" data-file-name="components/customer-management.tsx">With Notes</span></option>
                  <option value="withoutNotes" data-unique-id="353fe643-7fe5-4f2e-9235-557deb873a2f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c299590a-cdac-4d1b-a980-e6685957c947" data-file-name="components/customer-management.tsx">Without Notes</span></option>
                  <option value="recentlyAdded" data-unique-id="7262b6cc-2de8-45d1-8460-e747e21b3fa8" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b713901b-808b-439b-ac3d-e365a0ee23b4" data-file-name="components/customer-management.tsx">Recently Added (7 days)</span></option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </motion.div>}
        
        {/* Active filters display */}
        {(searchQuery || filterTag || dateFilter || statusFilter) && <div className="flex flex-wrap gap-2 mt-2" data-unique-id="0a6d9e6e-1bda-4a4a-bf8e-3bf00c1c748b" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {searchQuery && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="f338d8a0-def7-4978-b495-9cc56d6e0972" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Search className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="aad41634-5c39-43bd-b0e9-d5e38c6b6c7d" data-file-name="components/customer-management.tsx">
                Search: </span>{searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary/70" data-unique-id="fb54e078-4a22-4a80-a407-62aaacba6476" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {filterTag && <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="155f5041-2956-4557-af76-59f7deae7f71" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Filter className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="08aeeb7d-7b81-43cb-88e1-1d7931dd756b" data-file-name="components/customer-management.tsx">
                Tag: </span>{filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-blue-500" data-unique-id="a33710c7-6f8a-4ecd-8651-88957c039117" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {dateFilter && <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="2a7fba65-5d31-4d96-a50f-60a7017610ad" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Calendar className="h-3 w-3 mr-1" data-unique-id="accae535-0c28-41f1-8ce3-7036b5c23c99" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="5233d2d8-1601-48c0-b163-8c564a80192a" data-file-name="components/customer-management.tsx">
                Date: </span>{new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="ml-1 hover:text-green-500" data-unique-id="c4626cde-4789-4954-a4e0-3c5e7fa6b787" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {statusFilter && <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="ffa5d079-ac4a-40b2-8b8d-64ee84cf05ca" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {statusFilter === 'withEmail' && <Mail className="h-3 w-3 mr-1" />}
                {statusFilter === 'withPhone' && <Phone className="h-3 w-3 mr-1" />}
                {statusFilter === 'withNotes' || statusFilter === 'withoutNotes' ? <Edit className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="532cf4f9-3e58-433d-95f9-648ffc0cdbfc" data-file-name="components/customer-management.tsx">
                Status: </span>{statusFilter === 'withEmail' ? 'With Email' : statusFilter === 'withPhone' ? 'With Phone' : statusFilter === 'withNotes' ? 'With Notes' : statusFilter === 'withoutNotes' ? 'Without Notes' : 'Recently Added'}
                <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-amber-500" data-unique-id="c57115ca-b022-4976-b207-0b52d7af3449" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            <button onClick={() => {
          setSearchQuery('');
          setFilterTag(null);
          setDateFilter('');
          setStatusFilter('');
        }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center hover:bg-gray-200" data-unique-id="abc15c19-8032-4eec-9bb0-9bc1478efa8b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6e7cc0ae-bc48-4e09-8235-498ffd44e530" data-file-name="components/customer-management.tsx">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="abd995fb-359c-465f-bb51-9b8d6ab8d0b5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="5fd9f52a-0f22-463e-aa9e-7a2668ac7378" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="324eda51-5075-47fd-8189-f8dffa596a5b" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="64090790-a665-40b6-9f2c-f8c901d548c7" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="29b2bcf7-c17b-414b-baf6-2160be5f8bd4" data-file-name="components/customer-management.tsx">
            <div data-unique-id="ce8a4f8b-8969-4e84-b131-d317f356fc45" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="ce9f301e-1227-435c-81bd-c8620008ffb4" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="91eaddd4-1cbd-4886-b560-b6d006e934ba" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="6489c96b-b360-4b8b-b4a0-8a25f4bce62c" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="3845576f-1290-4be8-91b0-30d71e05963b" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="981863f1-93b6-4104-927b-74ce1986dcfb" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="7f2531f4-468f-4074-9cea-e3715ccd716c" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="ab67140f-79f0-4122-85ca-e2302126fb27" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="becc4162-7c77-48a1-ba43-eb01182cde15" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="2f8d8dfc-1b88-491c-9a16-90770d980e20" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="bac4577f-fc18-43f7-b79a-679250fd2d36" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="9b8a2f9c-48cf-4294-ae49-fde23c9a7ad5" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="264830a2-e505-4603-8430-c1a040f43bfc" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="10e50d39-2b73-414a-9b42-cf2de796ca0d" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="83e5a3df-2ce1-44d2-ab89-7e99195a5bd1" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="f91d06ba-78e8-453c-9ca9-6d2d23490940" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="8c3d8498-3e4e-423b-9de0-18428a232ceb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="f64f2abd-017c-4ea0-a6f5-c20059e2be4f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="d71907f4-9e4a-4e9a-b1d1-6f23a7fa5e51" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="5c4e6a54-191f-4005-b8dd-bd8a85b409d0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="991698fd-2bec-4e75-8025-3a353b867a97" data-file-name="components/customer-management.tsx">
              <div data-unique-id="aef461aa-aa52-472e-9c12-75ad6ad34a93" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="947dfd35-2ceb-4c53-b237-45dc46486e85" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b4a10497-604a-445b-98cf-ca01eb47186b" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="566b325c-6d47-4993-856e-aad6f1b922d5" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="4e7c5839-f06e-41ef-adc7-d9f280626aa7" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="f76ffa1e-ae63-489a-b278-79d5ec005297" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c5038c25-69a5-4465-a3aa-e609585c9d95" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="b57058df-fdd8-4483-8a3b-c6b3cacdbf6f" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="70e26290-06ed-4e4f-be13-8c1a0e69afcb" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="6079099d-fedb-4707-b99d-a74e2563ba8b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="68adba07-4247-45d1-b219-58b81d1e3ff5" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="4292419d-55f3-4917-8269-1f9067af8421" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="98342b8b-4747-4aa8-89c1-03859f1b5cc4" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="9da0da2a-2bfc-48ea-bfce-4ce675ef486b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="cf72dd1c-56b8-4862-88ff-bcc55583eacd" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="5e4b95b4-3ef1-4c8f-80df-d99b1653cb89" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="8ed28375-c277-46d6-a0e7-6ee74d1476de" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="c841144b-37e0-4de9-ad3e-f05e1a996a05" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="2d324242-d5ba-4d97-bc9b-76c09f86c1cc" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="41a74b5e-f589-47bc-9c18-fd8d0e6de3a1" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="df7d6d72-c070-4caa-8104-6216a40b676b" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="18c73ed1-3ede-4406-8731-08048b0f9196" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="cc0e72a5-d0a0-4fba-bf6d-df27844fce25" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="593fa2dc-defe-46a4-babc-a8018e55f589" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="0b1fa10a-68b8-4e7b-a83a-c5698a5cc5b9" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="356b626d-f020-4395-9704-93a72b0e021b" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="27dbc639-915b-4e2d-9235-bb54b920e6a4" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="321c502d-d7c2-4e1e-9b9b-5171f64068cb" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="01b6b71c-1095-4910-b35e-0bd1b5001ecf" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="afa04598-8e8c-457c-b3f3-2f163165e937" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="64d444d1-2f4a-49de-93e3-a01a2d86f9fc" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7f135c56-91e9-42dc-985e-90ef78664051" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="94185375-8720-4cec-b957-d01a2979f642" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8246c305-d15c-4c33-ac0e-30d6fe99b33a" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="w-full max-h-[70vh] overflow-y-auto" data-unique-id="0a1ed94c-2487-47eb-b97c-b978be92711f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground bg-card" data-unique-id="0aeaff91-d8bb-4aec-b8ca-f42674daaa81" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="b57a5cef-e90f-4c94-b2f5-67cda0928120" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="f0822254-4631-48bf-9aaa-2cbb22e00506" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="22e00ba8-d3cc-48d3-a4fb-5121fc2290fa" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="a6d32e55-5961-483b-99b9-55a744c3b6ab" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="832c04f2-2bb2-4113-9705-aafde18d05a1" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="e6165d66-10b3-460d-ab8e-339cc2c752de" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="4c9aabc5-f6f5-4d7c-85d1-c1b09204c241" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="83c12ee6-59b2-4dee-9d18-b966276814e1" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {showConfirmDelete === customer.id ? <div className="flex space-x-1" data-unique-id="abd581de-f8bd-4387-9386-901707ad99a2" data-file-name="components/customer-management.tsx">
                      <button onClick={() => deleteCustomer(customer.id)} className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 flex items-center space-x-1" title="Confirm delete" data-unique-id="09b9bf2d-f53d-4a4d-aa35-28e7c5471653" data-file-name="components/customer-management.tsx">
                        <Check className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600 font-medium" data-unique-id="35de1b94-52e9-4d95-854c-ce4d6d37b869" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="dfcca917-642b-475d-a4b7-fede4de76224" data-file-name="components/customer-management.tsx">Confirm</span></span>
                      </button>
                      <button onClick={() => setShowConfirmDelete(null)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" title="Cancel" data-unique-id="7a688849-60a4-4b01-8148-6db93f3c477b" data-file-name="components/customer-management.tsx">
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div> : <>
                      <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit customer" data-unique-id="10a2c5e6-265e-4cc1-a8f6-2b917dfa1f97" data-file-name="components/customer-management.tsx">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => confirmDelete(customer.id)} className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 transition-colors flex items-center space-x-1" title="Delete customer data" data-unique-id="d1b927cd-d175-40dd-958d-4d90fe279a62" data-file-name="components/customer-management.tsx">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 inline" data-unique-id="bbdcb31e-88d2-4e03-bf59-ace812530e7b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d39f76ae-e81b-4ad1-a1e3-15cf2eb651c3" data-file-name="components/customer-management.tsx">Remove</span></span>
                      </button>
                    </>}
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="dba40c79-efd3-4040-b8f3-b07f040deea6" data-file-name="components/customer-management.tsx">
          <div data-unique-id="990c1194-3249-4904-8d10-4564ce21a0e5" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="36b2800c-dac5-4175-b359-d2343b2a2383" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="87f4a1d6-bc61-41a0-ac1b-4db0ccf47d27" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="5a2e67f1-344f-4258-a850-73bc536803bb" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="705a8f0d-bd9d-43b9-8469-c129764949c6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="cb8f76d0-01bf-4967-905a-29ecc641d615" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="1c08d264-b582-40c2-b6e9-b73ced033c3e" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="81a4e68f-4963-4cbf-ac1a-51c8374cbdda" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}