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
  }} className="bg-card rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl" data-unique-id="31d40c56-0285-4a45-863c-82f2a2df7c85" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      <Toaster position="top-center" />
      <Toaster position="top-center" />
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="9a25193a-c89c-44aa-bf14-c8587bd36c8a" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="18c0ddc8-3bf6-414d-b3e0-0254af5ca6bf" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="f70ef62c-25c2-4c3a-ab8c-24461267569f" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="4b4669f3-3679-41d3-8268-da0f7250a814" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="9756f4d7-3061-474a-9b38-8860392772cb" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Customer statistics overview */}
      <CustomerStats customers={customers} />
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4" data-unique-id="f610d787-dc8c-4e65-83df-c907aa94c1af" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap items-center gap-4" data-unique-id="4603338f-d35e-42ed-acd8-2a8399703408" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="relative flex-grow" data-unique-id="fb092881-ec10-41df-b6a3-b64b8d84dbab" data-file-name="components/customer-management.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="06d1b194-3eed-4d04-9a62-715e451d51c5" data-file-name="components/customer-management.tsx" />
          </div>
          
          <button onClick={() => setVisibleFilters(!visibleFilters)} className={`px-4 py-2 border ${visibleFilters ? 'border-primary bg-primary/5' : 'border-border'} rounded-md flex items-center space-x-2 hover:bg-accent/10 transition-colors`} data-unique-id="c5131a77-feab-4b57-9d60-41640860a233" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Filter className={`h-4 w-4 ${visibleFilters ? 'text-primary' : ''}`} />
            <span data-unique-id="46159e52-7fea-4d4b-a6cb-7684b06aaeb5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{visibleFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {visibleFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* Export button */}
          <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="5b039966-58af-40fb-989b-c34677db73bf" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-lg border border-border" data-unique-id="1c466ad3-6077-4ba9-b658-eac58b864bbb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {/* Tag filter */}
            <div data-unique-id="cd0286b7-22ac-4e22-a480-7ed8863f7365" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="60feecac-11e8-4443-96ce-31de0004beb7" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="62764a91-9471-4075-8b2c-9fdf8c422d99" data-file-name="components/customer-management.tsx">Filter by Tag</span></label>
              <div className="relative" data-unique-id="a255b181-8ae0-404c-9cdc-bb82d7d4abcb" data-file-name="components/customer-management.tsx">
                <select value={filterTag || ''} onChange={e => setFilterTag(e.target.value === '' ? null : e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="2ecb90c0-99a0-4003-b352-a07e972fe0d3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="41537fcd-d2a6-4e4d-92a6-f21883779c5e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="fd7bdc6f-774a-49e8-86da-1d3d40898377" data-file-name="components/customer-management.tsx">All Tags</span></option>
                  {availableTags.map(tag => <option key={tag} value={tag} data-unique-id="8f4bd83f-4970-4efd-9e31-c08e5914016c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            
            {/* Date filter */}
            <div data-unique-id="1f49b146-6213-45f6-bad8-6145faf4d5f1" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2 flex items-center" data-unique-id="2625e792-dfac-463d-9f8f-e5354ca3b406" data-file-name="components/customer-management.tsx">
                <Calendar className="h-4 w-4 mr-1" data-unique-id="1089ea92-e7bf-4b07-bc0a-cc787f685fd0" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="b37b66d7-329f-4439-81a8-68ef6035ab84" data-file-name="components/customer-management.tsx">
                Filter by Date
              </span></label>
              <div className="relative" data-unique-id="d57df9ad-9cc5-445a-a1cd-5ec21b30365f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="f732cd99-7d38-45e0-b158-62f010ae8805" data-file-name="components/customer-management.tsx" />
                {dateFilter && <button onClick={() => setDateFilter('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear date filter" data-unique-id="a9fa2a02-ef5e-430b-9a33-040dfb3734ee" data-file-name="components/customer-management.tsx">
                    <X className="h-4 w-4" />
                  </button>}
              </div>
            </div>
            
            {/* Status filter */}
            <div data-unique-id="30686954-c801-48c7-9035-e94b331930f3" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="920cdf4b-670b-4153-a5df-ff68fbeaf127" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c266c308-7d4f-4de1-b8f6-6d48b2df216a" data-file-name="components/customer-management.tsx">Customer Status</span></label>
              <div className="relative" data-unique-id="0cf02724-11d4-45fa-b3cb-13de1db3c97b" data-file-name="components/customer-management.tsx">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="39544463-7a27-4384-9cd9-0122f3da724b" data-file-name="components/customer-management.tsx">
                  <option value="" data-unique-id="439c1640-314e-4fd3-9f47-08c47db47ea9" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c25e692d-82c3-4f49-82b2-62a979db625a" data-file-name="components/customer-management.tsx">All Customers</span></option>
                  <option value="withEmail" data-unique-id="140ccb94-6681-484b-96f3-d054a0d8ab0a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a425af4b-8a2b-4169-b468-a87962de42e0" data-file-name="components/customer-management.tsx">With Email</span></option>
                  <option value="withPhone" data-unique-id="44824434-7559-477a-ae7f-3d92be1afac6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="702506d7-a597-41eb-a1ca-4c3f54f6a658" data-file-name="components/customer-management.tsx">With Phone</span></option>
                  <option value="withNotes" data-unique-id="630c2ba7-f166-4850-b03f-8f3377e3ffa1" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c037ccdb-6baf-48f4-8f57-524e7a4aed08" data-file-name="components/customer-management.tsx">With Notes</span></option>
                  <option value="withoutNotes" data-unique-id="f66e0ec4-7d03-45e9-86f0-6d7cb4e4291f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="3e399912-77ce-45ef-b95a-22d5dfb08ba5" data-file-name="components/customer-management.tsx">Without Notes</span></option>
                  <option value="recentlyAdded" data-unique-id="745ace38-914c-44f3-9a0b-0ab865a9ab76" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8238d739-7d7b-4feb-b717-ba85314ab06f" data-file-name="components/customer-management.tsx">Recently Added (7 days)</span></option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </motion.div>}
        
        {/* Active filters display */}
        {(searchQuery || filterTag || dateFilter || statusFilter) && <div className="flex flex-wrap gap-2 mt-2" data-unique-id="352b2b23-d466-4396-96e5-196e7ddb3e80" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {searchQuery && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="42c4500d-845f-4482-b386-4f74859b2fa2" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Search className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="8cca59e4-33b8-4a5b-bf72-816a8062773f" data-file-name="components/customer-management.tsx">
                Search: </span>{searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary/70" data-unique-id="a0e728c3-1f31-4052-991a-8e20473b4d13" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {filterTag && <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="63939098-cec1-47b2-ba28-66760e14eddb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Filter className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="33d56040-ef5c-4549-9daf-958a641f3899" data-file-name="components/customer-management.tsx">
                Tag: </span>{filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-blue-500" data-unique-id="5f7e23f3-7c96-49cc-b842-d8d703d1e0b8" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {dateFilter && <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="f64c8f20-9e8a-4ae3-9ac9-1a3ecd767231" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Calendar className="h-3 w-3 mr-1" data-unique-id="0e35492e-70bd-4e09-b746-f7674768123a" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="7d40e963-ac5f-4519-9b4c-e92e1d502503" data-file-name="components/customer-management.tsx">
                Date: </span>{new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="ml-1 hover:text-green-500" data-unique-id="7ef39b25-01d3-4475-9ce6-493d8e4d45b8" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {statusFilter && <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="eaf2239d-c53a-470a-977e-cf4859bdf858" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {statusFilter === 'withEmail' && <Mail className="h-3 w-3 mr-1" />}
                {statusFilter === 'withPhone' && <Phone className="h-3 w-3 mr-1" />}
                {statusFilter === 'withNotes' || statusFilter === 'withoutNotes' ? <Edit className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="81adeded-1d78-4537-81c6-8048cefbef1a" data-file-name="components/customer-management.tsx">
                Status: </span>{statusFilter === 'withEmail' ? 'With Email' : statusFilter === 'withPhone' ? 'With Phone' : statusFilter === 'withNotes' ? 'With Notes' : statusFilter === 'withoutNotes' ? 'Without Notes' : 'Recently Added'}
                <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-amber-500" data-unique-id="31a704c1-9d25-4a45-a717-43bd162da3a7" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            <button onClick={() => {
          setSearchQuery('');
          setFilterTag(null);
          setDateFilter('');
          setStatusFilter('');
        }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center hover:bg-gray-200" data-unique-id="596070a8-2e56-42c5-9f30-a7deb30b2917" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="f76a6adf-6670-4e5f-9d33-e0972c7e270a" data-file-name="components/customer-management.tsx">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="21d5217a-3205-4e54-90b3-c73c73327510" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="2b82723a-a4ba-4cac-8b6b-265c28c6feef" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="6097d741-d710-4dbc-856b-520bbbf0be52" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="8f743390-ae56-4f94-a271-6129e052e08f" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="f7865eb2-fa25-4902-8260-4a7410891585" data-file-name="components/customer-management.tsx">
            <div data-unique-id="e591f2e8-d7db-43d2-bd21-aa27891cd0c2" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="13426cb8-fd9f-46a0-8a15-0bcdd57276fb" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9f7408b2-075d-4376-a746-1f58754a3f05" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="50ce0ce9-305d-4f82-a6cd-9cf7458d607a" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="16915de7-fd35-4f90-a3b9-50463ad1e0fe" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="17015afb-f079-4c46-8c01-4e5b8045be15" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5793e152-4af0-4d61-bd84-653f8fd326c1" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="4a4790d4-b594-4a80-b16e-dbf151ae71d3" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="ab2ea83a-bb88-48d8-bf6e-074c7a8a2769" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="82823be9-0914-4c7d-bfc6-f32fe3959c64" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="144ae673-2c85-4362-b02b-281709f7176e" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="cd484375-3bd3-405c-8bd8-8d9440da021a" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="b6ad5ccb-6e0c-4c4a-9adb-c7bbf0967087" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="dac9f8a2-ce5a-4686-8691-4360728e7a6d" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="979aac60-9223-43a5-80e2-b7b351bad26b" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="debd5f34-7d71-4520-9c03-177a34860872" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="b3046770-4cc3-48ca-b5c5-ec0c3f81ac7f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="78b5155b-3583-43de-b20e-4c7322d116c3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="652a8aaa-0a04-43ea-855c-779683f43464" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="ba1ff433-ff62-487d-90b2-50a8c041eabc" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="b467a4cb-b1d3-4e95-9935-0125e5ad18d3" data-file-name="components/customer-management.tsx">
              <div data-unique-id="37145bce-e20f-495e-9b8a-3c58282eacb8" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="06324f7f-e006-45fc-abb5-a5cc44d1d1d6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5aa8d425-e545-4d80-97fa-615ca05d4090" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="a91dd477-fd88-4127-bde4-6df44fec1eed" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="b4a8202f-d388-4407-92de-2c1da716f47a" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="76f13a78-2f52-4b5f-bd5d-ef3bbe10f912" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b6038ec3-5081-4134-b0ef-883b28581b21" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="26ff5361-cdd3-48f6-8df8-808b1ab3f6d3" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="393b0770-cd39-48c2-bf0d-4a3ac1332d33" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="97ea5b4c-cab2-4cc1-83c1-090bf9f75d49" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="045c1365-a16a-4f7f-ba8d-905f8316f701" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="59dd4e2d-c543-42aa-ad5e-b6992a45c58e" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="298e129d-82a9-46a9-ad24-a0c7680f7f60" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="bf916753-ff3f-4059-bc6f-32f096b955fd" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="84dc1c41-155c-463d-8cae-a4aab47b077e" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="cb4501a9-7218-4f8c-85f4-8c757178424d" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="900e4660-8720-4daf-a647-e3529ab63496" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="76076c82-eb69-4231-ace1-cfd702b3e65a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e18c3893-b037-462f-9d45-9a07f53ae660" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="e18f8d77-44b5-49da-84a0-e8360734a933" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="5f052b9d-33b3-4bd0-8a0b-86596b191445" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="20e096f2-6231-421c-aa61-e0dcf40bc2d7" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="8ce55805-62c1-4135-93db-c716fe784603" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="ed408329-9c4e-4cfe-9c21-d148118fb784" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="1e59af1d-79d0-4f1d-b868-8e2e93c0f9b9" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ac6842b2-aa47-4d18-be2f-2c0ec422619f" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="323272cd-2cc2-4d57-98cf-32bbbbf5fd35" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4b77b744-7ff8-4d49-9da7-dadd7044197f" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="c699a7be-a55f-40b3-bd0a-207387b92504" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9485796e-462e-4933-8d79-158dc2031f81" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="960c7ad1-7d90-4c1e-98a3-853679479634" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4a19d066-6f9a-4bff-8a0c-02c2acb21875" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="67de0e0a-66a1-4de8-bd81-613914fcbf16" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="bec5dfc4-c43c-4747-a774-0e8ae6c1de02" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="w-full max-h-[70vh] overflow-y-auto" data-unique-id="edc484d5-3bd0-43c5-a03d-c33a36adc5fa" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground bg-card" data-unique-id="9a4f04a4-18d9-4cb8-9d7e-cddd08fc3d67" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="b8746329-4707-4bc6-9a2e-32d78ae2c580" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="8f4fadda-de48-466e-a098-9c7b3d0a2ffd" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="3600244c-9166-45c7-b3bc-c9d2ce0c345d" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="6a8d9243-c544-4ab8-8973-095b373d00c0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="0548cff5-9002-4934-a190-23ef1b412b96" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="6d257b35-463a-42af-84ba-eafff692379c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="1069a405-c29a-4a24-81be-c7e39af9d222" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="1782be08-0f1a-44fe-8e50-4cbf02d8a73e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {showConfirmDelete === customer.id ? <div className="flex space-x-1" data-unique-id="84b91e5c-1253-4ed1-8494-169ced2ba237" data-file-name="components/customer-management.tsx">
                      <button onClick={() => deleteCustomer(customer.id)} className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 flex items-center space-x-1" title="Confirm delete" data-unique-id="a2ed8a9b-0a72-4aba-9fbb-60113f8bcbf9" data-file-name="components/customer-management.tsx">
                        <Check className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600 font-medium" data-unique-id="cc0ab2d6-1b23-4c34-b485-e4c8696d9d3f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b25181f9-2619-448d-bcfb-11be93d3bfd6" data-file-name="components/customer-management.tsx">Confirm</span></span>
                      </button>
                      <button onClick={() => setShowConfirmDelete(null)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" title="Cancel" data-unique-id="50168478-17d4-406f-abf2-dbf9ed53d2a7" data-file-name="components/customer-management.tsx">
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div> : <>
                      <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit customer" data-unique-id="07e1b71f-c5c2-4f72-9d43-96d7a09b69be" data-file-name="components/customer-management.tsx">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => confirmDelete(customer.id)} className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 transition-colors flex items-center space-x-1" title="Delete customer data" data-unique-id="d776a6d3-1e6a-411c-8569-e3474546dc6e" data-file-name="components/customer-management.tsx">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 inline" data-unique-id="e738b57c-9e62-4b3a-a86b-69829802ca36" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="17da2eb7-975c-4350-bcb1-5ea5ccccccfe" data-file-name="components/customer-management.tsx">Remove</span></span>
                      </button>
                    </>}
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="dbf9f51f-7084-4d68-baad-b6c8dc6b8aa7" data-file-name="components/customer-management.tsx">
          <div data-unique-id="2abe52b9-338a-4833-bb3b-f5253844afd3" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="ae38d0c6-95b3-4755-b644-5b93c61a26c9" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="e2e44004-71aa-402e-8e76-29fc2a70cf36" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="fa2009da-6890-447c-9a9d-fd26c67ee876" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="01d84a3f-7d1d-465d-8414-89897fa38e56" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="86b06f28-9735-4181-a622-ca688c73ea14" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="81fdffc1-032d-4af1-b874-7f3ab61d0c04" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="b67e01ca-8865-468a-b4ae-bbec105a5a8e" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}