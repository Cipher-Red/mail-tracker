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
          const localCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
          const filteredLocalCustomers = localCustomers.filter(c => c.id !== id);
          setLocalStorage('emailCustomers', filteredLocalCustomers);
        }
      } catch (localError) {
        console.warn('Could not update localStorage:', localError);
      }

      // Clear any pending confirmation
      setShowConfirmDelete(null);

      // Show success toast with customer name
      toast.success(`"${customerName}" has been successfully removed`, {
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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="96042f84-6536-4daa-b2f6-218a00880b3a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      <Toaster position="top-center" />
      <Toaster position="top-center" />
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="9fab54cd-4dbd-4a1b-9094-80be5d5bdd7a" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="85cc5c82-1c88-45b4-ab60-3856a13b82a5" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="d8460587-4065-4457-8d23-c4c42cf65848" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="3c760b6e-4634-42bf-ac43-b12970da4503" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="fed7f1b1-5a6f-4bb6-af91-dff00fe53473" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Customer statistics overview */}
      <CustomerStats customers={customers} />
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4" data-unique-id="0020ad7b-701d-47b7-8c7c-37911375bb29" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap items-center gap-4" data-unique-id="3b72c071-e846-4517-bb70-1a3582442a89" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="relative flex-grow" data-unique-id="e44b257b-0b37-4068-85b0-e1bbeee4d150" data-file-name="components/customer-management.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="42272827-a7e6-4051-9efe-9d81186c8da5" data-file-name="components/customer-management.tsx" />
          </div>
          
          <button onClick={() => setVisibleFilters(!visibleFilters)} className={`px-4 py-2 border ${visibleFilters ? 'border-primary bg-primary/5' : 'border-border'} rounded-md flex items-center space-x-2 hover:bg-accent/10 transition-colors`} data-unique-id="f126ce2c-c877-4a62-aab6-7abc448fa0f5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Filter className={`h-4 w-4 ${visibleFilters ? 'text-primary' : ''}`} />
            <span data-unique-id="4db8a6f4-3987-4842-94d1-9a57f69326c8" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{visibleFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {visibleFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* Export button */}
          <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="e9c3d479-d8d3-4459-9977-640774ca87d0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-lg border border-border" data-unique-id="9413d802-8bdb-4777-8bbe-67d1f32202f3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {/* Tag filter */}
            <div data-unique-id="d71793aa-c7fc-4290-b7d8-d3b41ac57ce3" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="eb0cde42-7f01-441b-ace8-b84c18889f87" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1152f775-32a3-4d73-862c-d5fc62f37c9e" data-file-name="components/customer-management.tsx">Filter by Tag</span></label>
              <div className="relative" data-unique-id="896db636-ece0-454d-816e-c781de79dcc7" data-file-name="components/customer-management.tsx">
                <select value={filterTag || ''} onChange={e => setFilterTag(e.target.value === '' ? null : e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="da99a8c1-82a2-4b7d-be77-34bfed95b2c8" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="a12602a4-f5db-4ba1-a30d-c853c8c4dd88" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c08110bd-ff20-45f9-a982-527a444634f4" data-file-name="components/customer-management.tsx">All Tags</span></option>
                  {availableTags.map(tag => <option key={tag} value={tag} data-unique-id="d5c8f21b-8085-4f23-9c66-25a8b4b54dba" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            
            {/* Date filter */}
            <div data-unique-id="7b09021b-108c-4da3-870c-dbf877b3acca" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2 flex items-center" data-unique-id="bb33f4d7-a950-49ac-b618-b5faad4c4c38" data-file-name="components/customer-management.tsx">
                <Calendar className="h-4 w-4 mr-1" data-unique-id="c0723593-8384-47da-9149-eca4d2b4105e" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="779d5333-2ceb-4f21-9c74-94f82ea76f64" data-file-name="components/customer-management.tsx">
                Filter by Date
              </span></label>
              <div className="relative" data-unique-id="87d05655-0005-4690-bc80-e8317b39652f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="006a7827-ecc4-48e5-927e-6bcecd3dfa19" data-file-name="components/customer-management.tsx" />
                {dateFilter && <button onClick={() => setDateFilter('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear date filter" data-unique-id="359a4b0d-5cc9-4c89-82c1-6c088c64938f" data-file-name="components/customer-management.tsx">
                    <X className="h-4 w-4" />
                  </button>}
              </div>
            </div>
            
            {/* Status filter */}
            <div data-unique-id="0d7a62a4-8f61-471c-8bfa-3c735da7b616" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="87e15e55-a1f8-4338-b498-63a035385bd6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="774451a2-f51e-4846-8940-f8620f45a916" data-file-name="components/customer-management.tsx">Customer Status</span></label>
              <div className="relative" data-unique-id="4b97a1a0-a9b4-4468-a510-95a347a6891d" data-file-name="components/customer-management.tsx">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="9664d9a1-b9f6-442f-b02b-0d2afaa7b641" data-file-name="components/customer-management.tsx">
                  <option value="" data-unique-id="a4cd6ef9-44f7-4065-bcd2-5a92e9180258" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8e9dfd8a-db00-4273-86ee-80bd0d30bf90" data-file-name="components/customer-management.tsx">All Customers</span></option>
                  <option value="withEmail" data-unique-id="bea8e48b-908a-4d8d-81f9-759e66cf93d3" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="09982fac-b4a5-464e-bcbe-3b67f6c9229c" data-file-name="components/customer-management.tsx">With Email</span></option>
                  <option value="withPhone" data-unique-id="72b7e899-8138-4ac6-b56f-3ee2803344f0" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="05ccdc25-f7ec-45fb-b1fb-df74d3da600d" data-file-name="components/customer-management.tsx">With Phone</span></option>
                  <option value="withNotes" data-unique-id="c31d170b-0c3c-4616-af44-9133bc6dbe81" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="dd3773fb-193f-461e-af6c-e3d90a2c226e" data-file-name="components/customer-management.tsx">With Notes</span></option>
                  <option value="withoutNotes" data-unique-id="3d135381-850c-4ffa-870e-734427cd45ea" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="ce74c25b-f704-417f-830d-bbca0f842159" data-file-name="components/customer-management.tsx">Without Notes</span></option>
                  <option value="recentlyAdded" data-unique-id="9dadc548-50c0-4022-bc90-0719f933c112" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="2197e39a-40fd-4039-8ff6-11213409d17c" data-file-name="components/customer-management.tsx">Recently Added (7 days)</span></option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </motion.div>}
        
        {/* Active filters display */}
        {(searchQuery || filterTag || dateFilter || statusFilter) && <div className="flex flex-wrap gap-2 mt-2" data-unique-id="f97caf85-f8d0-43e7-be61-ba2e8791b919" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {searchQuery && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="5de5eb3a-d35a-4918-8644-4c9c4ac5f5e9" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Search className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="4f3d3be5-b1ac-4470-abec-14aa65ca25d4" data-file-name="components/customer-management.tsx">
                Search: </span>{searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary/70" data-unique-id="838d3c3b-7963-4c7e-aab5-6330b629da91" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {filterTag && <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="973a4d8d-8e4f-4586-a46d-b14ed94bcbf3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Filter className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="0f212050-713c-4272-ad4e-83d88780e5e7" data-file-name="components/customer-management.tsx">
                Tag: </span>{filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-blue-500" data-unique-id="07bab377-d8b1-4b33-b219-687a508c7c8b" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {dateFilter && <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="084c2591-3192-401b-b971-452764ea8c81" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Calendar className="h-3 w-3 mr-1" data-unique-id="d615a5da-2260-4216-b527-7bbc41e553ad" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="d2891220-baf4-488c-af5f-4d02f27c907d" data-file-name="components/customer-management.tsx">
                Date: </span>{new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="ml-1 hover:text-green-500" data-unique-id="3e058bd4-6f8c-4565-bda2-db55e5ec32d7" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {statusFilter && <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="41543328-4c71-4e4c-9555-e046878cd611" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {statusFilter === 'withEmail' && <Mail className="h-3 w-3 mr-1" />}
                {statusFilter === 'withPhone' && <Phone className="h-3 w-3 mr-1" />}
                {statusFilter === 'withNotes' || statusFilter === 'withoutNotes' ? <Edit className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="5511a9d5-9566-49c3-8a43-4dbcff301613" data-file-name="components/customer-management.tsx">
                Status: </span>{statusFilter === 'withEmail' ? 'With Email' : statusFilter === 'withPhone' ? 'With Phone' : statusFilter === 'withNotes' ? 'With Notes' : statusFilter === 'withoutNotes' ? 'Without Notes' : 'Recently Added'}
                <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-amber-500" data-unique-id="66fbed92-5ab3-4cb5-8d6b-dea2a4d7f484" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            <button onClick={() => {
          setSearchQuery('');
          setFilterTag(null);
          setDateFilter('');
          setStatusFilter('');
        }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center hover:bg-gray-200" data-unique-id="38b3985c-8ab0-474c-af10-2f588043b1f4" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a90889c6-aca4-427e-8adb-3c2628941043" data-file-name="components/customer-management.tsx">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="5aef919b-65f7-41ff-ab17-26c9ec18ccc6" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="f71ba3fc-03e0-4c73-933e-ef12e88f2927" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="cd758d82-4ce2-49ff-bf0a-84650b6046ea" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="3fcf0831-2a94-46ec-b42a-dc7c2634cb60" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="2fbb673c-44ef-49c4-b919-e75d50f19ecb" data-file-name="components/customer-management.tsx">
            <div data-unique-id="a161fe1d-f776-499b-80a1-aa34db69d437" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="f9ab1811-c0f3-4cad-8e22-12c6e031e24e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="74a7608f-bea1-4d91-81c6-e116aca1e817" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="6d5041ea-17fa-4cfb-8c03-20b3aa03d4b4" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="b97dfc0b-baff-4adb-a189-b4d961f73408" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="5dbca124-cdc2-4761-807b-e757b1ffd99e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="42505a98-9859-4f10-9252-d0bbf1913a7e" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="f2c13fe7-c5a6-46a5-a93f-86da2ae481ab" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="c766e430-defb-4bab-a954-1ec19f5e8e82" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="3d6357d5-3cf4-4dff-adc1-f71da69f33ba" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="bcc5ee11-3125-4410-b537-6eed060b9c8d" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="12f1790e-5802-45fe-82af-a7a869bb01a6" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="ad2f0042-d6fc-470c-bc8e-1f7750b124bc" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="56f0c2ce-7c24-4f60-99bf-92a3b4404b47" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="136b20ff-8846-4c46-b6a1-9aa4dafd11ae" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="1ebd04f3-6531-4415-badf-bf48412f6979" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="0ea93339-7549-410a-ad0c-01382c362e44" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="20b58d8b-7f38-49b8-bcbf-27695eddfbda" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="9457b351-9ed1-4a4d-ae49-05ba831d1265" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="a6333aba-62a2-4d60-9edf-83caf2ef84eb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="e506ed79-bd74-4c8a-92d9-7e9c206618b7" data-file-name="components/customer-management.tsx">
              <div data-unique-id="5eaa5e7a-00b4-4f69-a931-171ec6e5fe3a" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="26e1429f-4245-4693-939f-7d267246528a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1808b34e-19d2-4d33-8c84-778131c59d6f" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="1ce71a1b-683a-4d22-b772-55409308c64e" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="09baaba1-10c7-429f-9258-6717338ab7ec" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="b297346f-f253-4a98-afe4-192046e11bfc" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="7af9ebde-6e3a-4b04-8039-6fae6a2cf2e9" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="0893d55f-1005-4474-a942-3578ee630c16" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="ff31e380-0497-45f4-b5a0-dc075e697cdc" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="4011e701-71bb-48f1-80c6-2e4c77ec6b03" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="833c07aa-f794-4868-88af-1769533122eb" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="fbf3f8e2-9b83-48cf-ab07-988b505eb817" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="613394b8-8edb-493f-a52a-28e4e6f60896" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="29002f45-47fa-483d-9f36-a25f328eaf29" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="2dc953f2-cb46-4ca9-9e69-7a1dbc8634c1" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="217ceba9-f20c-423e-8630-8e6e93b118d6" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="46d0222f-a608-4a20-af00-f0ad88307165" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="e1ebee41-d806-42d8-bb58-c4c64c9c2fc0" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a45e34a2-2f5f-4db4-9681-aac15cd535e8" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="9b4c185d-9766-4922-8ca1-1871633a1a9d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="63c08cd7-069a-48be-83ac-ff211b9de9df" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="0a5702d5-02a7-4bbc-95a0-7ef5c1b54fb2" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="0a591c4c-b554-4755-a488-fb8907f4e40f" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="fbf263a2-f8fd-4189-9e38-1ab589adee17" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="a94d8404-0c55-4214-aeec-d32337de253b" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4a976ead-4f54-4edf-a6d5-86bfc562549e" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="965cbbec-515f-4ed8-a613-167629ca1ceb" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="160a8e4c-c8b1-48fc-a2c6-6502ad70ba7c" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="389df187-39bb-48ea-bbea-4e7bb5d69cbb" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="734712ca-540b-4762-989c-4da0ff91ed66" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="05be377c-aa65-4cd2-8c0b-23de2e00a3aa" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a140067c-8bf9-41ba-8216-ab76d7946a7a" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="5f0e0005-35ae-4ced-9265-9100cecd978d" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="42f2b3b2-76e7-4afd-9bb0-60e38f2a7eb6" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="w-full" data-unique-id="5058c27a-3ac8-45fd-aebd-e5570c0d9417" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground" data-unique-id="4b62789b-41c9-4ac2-b5f8-b571bd531df5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="251762d7-1b9d-43e7-b606-51992c95b1f6" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="a5d5f94f-3a36-42c2-9a93-410dc357b222" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="d71a633f-a06c-4832-8d42-f598e5809763" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="b3c17887-1503-4997-a915-cd88e82836bf" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="9e7c952b-9213-4ad6-9bf8-982a60de7c08" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="f3aa8fe3-3e74-4c87-b129-d8c55bae6152" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="e0d10f33-fa38-4ec3-adba-eae13b882923" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="880202f0-02ee-4b7a-8e02-67c739971302" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {showConfirmDelete === customer.id ? <div className="flex space-x-1" data-unique-id="86450304-89d4-4ddf-bf6e-0651ed881f56" data-file-name="components/customer-management.tsx">
                      <button onClick={() => deleteCustomer(customer.id)} className="p-1.5 bg-red-50 rounded-md hover:bg-red-100 flex items-center space-x-1" title="Confirm delete" data-unique-id="e6982f58-f1e4-41a6-94ec-49303c46113e" data-file-name="components/customer-management.tsx">
                        <Check className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600" data-unique-id="684f7aed-cfb8-4e57-97f8-a3c0d674f0e4" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="cf60821c-5d33-4c29-b453-6d9f30f37537" data-file-name="components/customer-management.tsx">Confirm</span></span>
                      </button>
                      <button onClick={() => setShowConfirmDelete(null)} className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100" title="Cancel" data-unique-id="8e04fe17-0e3a-4b2b-a0cf-9a098e39984b" data-file-name="components/customer-management.tsx">
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div> : <>
                      <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit customer" data-unique-id="0ddb9fc0-0737-42dd-a1f3-fc6e71956d58" data-file-name="components/customer-management.tsx">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => confirmDelete(customer.id)} className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 transition-colors flex items-center space-x-1" title="Delete customer data" data-unique-id="d35886da-ce36-4817-b475-0f755f0aca64" data-file-name="components/customer-management.tsx">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 hidden sm:inline" data-unique-id="dff89af4-b492-48d0-88c3-3a499014f72c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="dca7e43c-dee1-4d4d-b99e-43485f44c352" data-file-name="components/customer-management.tsx">Delete</span></span>
                      </button>
                    </>}
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="d89b7cc0-819b-492f-a24e-21118f708bd9" data-file-name="components/customer-management.tsx">
          <div data-unique-id="0fcad583-7786-4e22-8ad8-ba670fab87b2" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="c7faa566-8086-4c31-8547-2445e65c105c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="1c8fd5e0-ec03-448a-a209-b252cebab494" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="69abe262-f201-4b4a-bc97-a5b3bbdc5310" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="d0bee66b-428c-404c-a580-be68ddf1cc07" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8f715e43-1466-42f5-9955-a839b3fad509" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="94532000-5699-46f1-84e3-97868f46f3e7" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="7fa61164-ba29-472a-ae7b-ad74f6a95b76" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}