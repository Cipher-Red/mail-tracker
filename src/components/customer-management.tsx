'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Users, X, Edit, Trash2, Check, Download, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
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
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Customer>('addedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

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
    const savedCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
    setCustomers(savedCustomers);

    // Extract all unique tags from customers
    const tags = savedCustomers.flatMap(customer => customer.tags || []);
    setAvailableTags([...new Set(tags)]);
  }, []);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    if (customers.length > 0) {
      setLocalStorage('emailCustomers', customers);

      // Update available tags
      const tags = customers.flatMap(customer => customer.tags || []);
      setAvailableTags([...new Set(tags)]);
    }
  }, [customers]);

  // Filter and sort customers based on search query, tag filter, and sort settings
  const filteredCustomers = customers.filter(customer => {
    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = customer.name.toLowerCase().includes(searchLower) || customer.email.toLowerCase().includes(searchLower) || customer.company && customer.company.toLowerCase().includes(searchLower) || customer.notes && customer.notes.toLowerCase().includes(searchLower);

    // Apply tag filter
    const matchesTag = !filterTag || customer.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
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
  const saveCustomer = () => {
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomers = customers.map(customer => customer.id === editingCustomer.id ? {
        ...formData,
        id: customer.id
      } : customer);
      setCustomers(updatedCustomers);
      setEditingCustomer(null);
    } else {
      // Add new customer with generated id
      const newCustomer: Customer = {
        ...formData,
        id: Date.now().toString()
      };
      setCustomers([...customers, newCustomer]);
    }

    // Reset form
    setFormData(newCustomerTemplate);
    setIsAddingCustomer(false);
    setShowAdvancedFields(false);
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

  // Delete a customer
  const deleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
      // Also remove from selected list if present
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    }
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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="8fb2f407-6204-4ce8-ae76-5f9648ebfe9e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="ac49db31-d63e-422a-b27b-62f348bf13ba" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="e3a33553-0df6-4de3-99c1-ba873483cc98" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="d3545cec-48b7-44c5-9a49-9f625f4103ac" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="77e48884-a339-47b2-99a0-e7c7b29c18bd" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="29e55ccd-7277-4eef-9310-66473ac2927f" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 flex flex-wrap items-center gap-4" data-unique-id="c35ddba4-24f3-42d9-a703-9add5f67cae3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="relative flex-grow" data-unique-id="63bf1ea3-b3c2-4715-9a39-d52d9f6d5364" data-file-name="components/customer-management.tsx">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="f9399acd-f600-4303-bad2-992637430ebb" data-file-name="components/customer-management.tsx" />
        </div>
        
        {/* Tag filter dropdown */}
        <div className="relative" data-unique-id="fa65833c-f379-47c7-a1ae-5f25a552d00a" data-file-name="components/customer-management.tsx">
          <button className="px-4 py-2 border border-border rounded-md flex items-center space-x-2 bg-white hover:bg-accent/10" onClick={() => document.getElementById('tagDropdown')?.classList.toggle('hidden')} data-unique-id="95fa89e9-567f-45cc-abcf-a9cd81d686e1" data-file-name="components/customer-management.tsx">
            <Filter className="h-4 w-4" />
            <span data-unique-id="0fef91be-ccf8-4543-bde4-ab1bfe0b1a20" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{filterTag || 'Filter by Tag'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          <div id="tagDropdown" className="hidden absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-border" data-unique-id="090ff9c3-f38f-40f8-970e-0a622fdedf4e" data-file-name="components/customer-management.tsx">
            <div className="p-2" data-unique-id="6859adac-0ae2-43e3-9398-10d77694ab31" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              <button className={`w-full text-left px-3 py-2 rounded-md ${!filterTag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(null);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="6d923d49-01d4-4273-b3a7-b997f3faeed0" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5d9b5066-5978-4340-bc6e-81b8c8bc8760" data-file-name="components/customer-management.tsx">
                All Tags
              </span></button>
              {availableTags.map(tag => <button key={tag} className={`w-full text-left px-3 py-2 rounded-md ${filterTag === tag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(tag);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="42a31c24-cc0b-46b4-be49-4cef55356119" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {tag}
                </button>)}
            </div>
          </div>
        </div>
        
        {/* Export button */}
        <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="8821856e-8484-4ff9-8637-ce65353bfab8" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <Download className="h-4 w-4 inline mr-2" />
          {selectedCustomers.length > 0 ? `Export (${selectedCustomers.length})` : 'Export All'}
        </button>
      </div>
      
      {/* Add/Edit customer form */}
      {isAddingCustomer && <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="1e9d6a81-25a2-48b7-b4da-6c83dda7ca09" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="3320843d-06a8-4b38-86af-062eab316152" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="3d979fe0-d52d-4f18-a167-288582dfeb7a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="72c5a7f3-ee31-459e-9a07-8d201412b00e" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="51af1735-c1a1-4848-9f15-95662050988a" data-file-name="components/customer-management.tsx">
            <div data-unique-id="2da23d97-40e1-4108-812f-528c5dbd6090" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="e5a2f709-34d0-4588-b06b-a3b461b6b7ab" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9a0f3570-60e1-443a-814a-057cadaf3a08" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="62cf687e-2ceb-426e-b04c-4b255ccb311b" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="d9dca0ae-059e-433f-b0bf-14dcce1e36ea" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="d8716fdc-e19f-4889-aff1-f6db73e73d03" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8a3e1bdc-d937-452b-a51a-3eb414037b23" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="cc926ea5-8c38-4b9e-9c9b-8f49eb282225" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="2d814b92-438e-4f24-8abe-940843eaac61" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="f460a634-570d-46f8-a8b3-77c612017abe" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8cad3d85-fe6f-4483-bfc8-3a7de753767e" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="57d3dbae-a8f5-4c60-ab05-efd54863fd5d" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="f160641a-756e-49eb-a743-134c46fa23ac" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="c82caea6-8866-423e-a294-4b253ff3cd59" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a1bc6126-98ed-4d2c-88f0-4635fcb28797" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="29ea2937-0bec-42c7-a74b-9d27f2ab0f71" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="b8a370f3-2526-4dac-9f9b-201dfc357edd" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="9dc48ed4-afef-46d1-9528-954f6b484610" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="b526c7f2-4c06-4298-8340-5eecf171737b" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="92e414cb-15f8-46c9-80b6-19d1e755d305" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="46885f05-b48c-46cd-a512-942ccc9618d6" data-file-name="components/customer-management.tsx">
              <div data-unique-id="81d55ace-e640-4754-9bb1-5fd3fe0b8f05" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="161bb95d-8857-476d-bb8d-e5dc19da576b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="06bb5323-5ebc-47a7-9ba5-05698cad6f32" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="bf7e16cc-5243-42f5-bace-dda2e42a335f" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="1f44bb7b-9317-4ed2-97d1-41f7577e28b0" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="a5d308d3-3ecc-44ee-a43f-97a93ba791f9" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="692acf9c-9d4a-4688-9cff-380b2563e544" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="2c6981e5-9b99-4571-a515-203c81f8b543" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="1ba760ab-c5e7-4e26-a36e-b51c796546d5" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="cad5e747-b367-4ffc-8562-6f3de53e4124" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="bcc43fc8-2f7d-4e48-8a92-8e892a218107" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="c331bf94-a72c-4c7e-b7a0-4ed01f81aa79" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="5eec9e09-727a-46eb-98e9-352714fe7ed5" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="ba61763a-eaed-43d0-9ef7-cb2f03b9d12a" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="97e61280-0655-4cfb-8fed-87cb623e99d2" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="8adec7d1-d6d8-49ed-9f95-0ef342612a51" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="7e1f6af4-2355-4646-a97b-8617c1d9a376" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="ece728ec-2987-4be6-863b-a4cdb56f0443" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="efb6d891-d488-4433-b9fa-b4dda0c04b2b" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="e9b681c2-2ff2-4653-a826-4738c0a39962" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="f404cde3-8ba8-4464-a50c-0b10c1a369ec" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="6b86bf49-205f-4032-b30e-c9a0ece3079a" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="1ce3d4b5-c04a-49d1-bc7e-e75f16a64e3f" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="8f2fb354-17b0-442b-8e22-5efea9cd249c" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="24ae34be-ebb1-4238-a949-f4d2879ef5b2" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="05ce8363-9a8a-4f6a-b8d6-d56dfca5c7ab" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="227bbdaa-cecb-44f5-8427-2ffecd0c3ed4" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ec85ef2c-5f60-4b58-bdb3-4cfab4f8f0f2" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="c7906a05-27c4-4d5f-a3a0-2d5ab74f7b28" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="863c3b9d-6f13-4aa1-9161-d543a93bfa47" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="e60d3d4c-dd61-4d8f-b034-39fd26389567" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="028fcbbc-9197-43da-bc57-e7fda75ebdb8" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="6920572e-314f-43b6-bcec-a55ba04c0010" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1395a474-8382-48cf-afc1-8c5b0327c4da" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto" data-unique-id="90d98f16-c230-4823-8c38-8d5607050273" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground" data-unique-id="5e0f1c81-0547-47d5-9c08-81cadde56eac" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="36904397-58db-4f4f-b549-6bbc4fc23916" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="72fae305-6220-474f-8553-ae008161a3b2" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="43a7c46d-7471-4d1d-9371-b5eee44062d1" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="6abbe804-b0d3-4f34-9be5-3286627338e6" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="293d1aee-9fc8-408c-8ef5-6c452cb82368" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="302d5354-26f0-4b2a-b2e7-6a423183e3ec" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="6fe52a46-2cb7-4e7e-98dc-42c225020c9c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="4f7b2424-476d-4fa5-88a5-660e96804c79" data-file-name="components/customer-management.tsx">
                  <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit" data-unique-id="2b0dee0a-38bd-4865-904e-d93a6c40c2ef" data-file-name="components/customer-management.tsx">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteCustomer(customer.id)} className="p-1 rounded-md hover:bg-accent/20" title="Delete" data-unique-id="ad8ab53e-b86c-443f-a541-4ad56c4677cd" data-file-name="components/customer-management.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="ee6e1615-a630-411a-a99a-f7da9376c917" data-file-name="components/customer-management.tsx">
          <div data-unique-id="3ee6e8fd-cb6a-4119-9555-35ea900cbf53" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="087d0bde-75a4-4ab1-80f9-890f951acfe8" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="dae842c2-35a6-444a-8284-e1c042bbd061" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="09aab5c3-7f34-4de0-be69-8db655e28ad4" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="84fc66e6-9310-4f52-8339-b4ecefca2efe" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="0c70ccbe-ebfc-4c8b-b61a-935b76254e4e" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="2d9b74ef-9ba2-4f6c-82bd-33a9e2aa2d76" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="7621abf7-d72f-456f-a628-fa448d02e8a8" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}