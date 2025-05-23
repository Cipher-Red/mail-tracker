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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="05b59815-f58c-49d0-a169-db0fad4aec60" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="52326e8f-1202-421e-9347-a8b2a5e7615c" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="6dba3543-2cf0-4f8d-be5a-9ebb860d3a07" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="1e6a6c92-47c5-42d2-8eb8-5312bcc106bd" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="8fdbf6aa-3ac0-45fa-8d14-8bab5f3535df" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="c09ffcd8-7a78-4a3e-b923-2a7f386b89f5" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 flex flex-wrap items-center gap-4" data-unique-id="9533c92e-c30b-4550-bd62-0826c519de14" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="relative flex-grow" data-unique-id="28451f57-7e45-4ffb-b7ea-3ca74bb8d4ab" data-file-name="components/customer-management.tsx">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="914e3908-bb86-402f-ae89-8d6de43d6afc" data-file-name="components/customer-management.tsx" />
        </div>
        
        {/* Tag filter dropdown */}
        <div className="relative" data-unique-id="a0f39c78-9c97-445b-83e7-cf8f71399824" data-file-name="components/customer-management.tsx">
          <button className="px-4 py-2 border border-border rounded-md flex items-center space-x-2 bg-white hover:bg-accent/10" onClick={() => document.getElementById('tagDropdown')?.classList.toggle('hidden')} data-unique-id="88a91a5c-4b5a-4852-9692-a03885295e36" data-file-name="components/customer-management.tsx">
            <Filter className="h-4 w-4" />
            <span data-unique-id="789f9fb6-96b2-4d92-81eb-5b4ba2ea2a9f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{filterTag || 'Filter by Tag'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          <div id="tagDropdown" className="hidden absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-border" data-unique-id="0dba2235-3f8c-411b-ad5a-78cbd9534d8c" data-file-name="components/customer-management.tsx">
            <div className="p-2" data-unique-id="be79caf1-2c6c-44ff-bb74-6cb7e37ca5b9" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              <button className={`w-full text-left px-3 py-2 rounded-md ${!filterTag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(null);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="fecc40be-4978-4903-8abd-9e9e76556308" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="1ea7354b-31d7-4678-b97f-04de0402f62a" data-file-name="components/customer-management.tsx">
                All Tags
              </span></button>
              {availableTags.map(tag => <button key={tag} className={`w-full text-left px-3 py-2 rounded-md ${filterTag === tag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(tag);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="e7771817-4076-426c-a57a-1ab62afaa639" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {tag}
                </button>)}
            </div>
          </div>
        </div>
        
        {/* Export button */}
        <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="0740d3d6-95a4-4049-b577-e749316500d9" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="e5fd85e4-b1e9-41cd-9235-8e9779f24f80" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="2b45fb60-a8a4-4428-bdce-05182eb7fd9b" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="e1ff73ec-7461-4f2e-a8b0-7224356263d3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="23a325c8-5ef9-41cc-98bd-9f54cec9fb7e" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="726f9500-6fbf-4a73-92b7-1cda7f51401d" data-file-name="components/customer-management.tsx">
            <div data-unique-id="f5f627e3-5f7a-4d4b-b3b7-04ad3b09f28f" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="606468d3-2c6b-4158-97d2-0b19fe4aac17" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9e26d457-2a7b-4ac2-b7e5-6ab8165fdc43" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="41211b99-b154-47d8-b851-b6d66c1bc7b0" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="b132aab7-18c9-4f4e-a976-a299eedcaccc" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="594257df-84a6-499a-b7b5-9aa7b05fcdf3" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="54297ce8-4ded-4fe0-aa9e-1655068c973c" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="d95ba97c-ddf6-45fc-9c49-a37b852f38c6" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="21ff0202-2edc-41fd-94f9-7cb1fc71aa72" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="2384b937-1943-459f-8269-8b31118660c5" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="10f82219-6a33-4ca5-9f24-a6a221f4b1a6" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="b4f66492-292a-48c4-86ee-6644cd17ba03" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="36f5c00d-9d50-46bc-8933-53983f0d8072" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="959ddc10-dd22-4714-9e5b-bb4cbf4d138c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="c2e90e83-a69e-48b4-aef0-1ed9ed18d0a1" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="b99bc9d3-e552-437f-88d6-e078aef40b91" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="a3f060a0-3d3e-4da6-ba77-0e18a37367af" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="7c59f6c1-7d43-4e38-9394-8b32e95fff84" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="eb04a9ba-3d90-492f-ae0e-4ce4eef5572f" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="73e89a33-3682-44c1-ac2c-121ce4693769" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="88c663cb-10db-45ec-9804-9003738419c5" data-file-name="components/customer-management.tsx">
              <div data-unique-id="f8846b34-3fcf-47c9-83b2-63c04352dcfd" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="9dcdb741-6f5e-490b-b0d7-41a9814dec55" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="49bf33a2-2621-423a-970a-7af36e100d75" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="48008a4a-4b15-408c-8e32-630c512b2bf0" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="d1f8430d-ed70-4c7c-a106-7c76a0daf7ac" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="06a77397-f477-4f7f-a239-aba826b22eab" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="616bd0a6-2158-46ab-916d-f46576445d0f" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="237511d5-6a95-425f-a0c6-a1567b2b7924" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="b36a65db-7fb1-4635-8bac-00478b552394" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="060373f2-1b05-42c4-a7da-621160ba4ce4" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="21f40168-7b20-4813-80d4-6ab7451cbc54" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="948ac430-b0b3-4ccb-a97d-8f649d423b49" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="b1d03c9d-c521-4a6d-aed1-54256ba798cf" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="921da65b-c37b-4479-a4fa-14d24e6ac67e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="84398dd9-7ff3-497b-ae1b-63f0f402a0a6" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="2315118c-7fa5-4912-ad9f-62cd230e9987" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="6846a82c-8fc4-4c13-b5f8-f7740929102b" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="179a28e8-3a52-4889-863c-63fd2df3a2d9" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9e1181e8-abe7-4ce4-99ed-17ee12d68759" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="a72de1f4-508a-46d2-b793-5c6eb188e636" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="83a93e67-33e3-4695-bc3d-d387475195d4" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="c2725035-9e51-4b89-9548-4783449162f4" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="48249159-cdb8-4d5e-aee4-80f53b5ecfc3" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="620b43b6-fe60-467e-9aa1-a9d3856daae8" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="2bcfe19b-b0e1-4a9d-883c-6b64adbfcfae" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b2037c12-37df-47b9-89ba-f4787c717f16" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="8fdc6ac9-0b9e-4724-8c48-9b091eb1adb5" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="46845fbc-9c67-410b-88fb-3e271d535fd6" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="c8a80f59-2541-49c7-a816-367e1b960470" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="457e8504-e0f4-455c-9082-08dd975e3113" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="058f4b9e-7328-4c9c-a509-840677010d1b" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a17f9bb0-a849-4e7c-83a1-890b12030c5a" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="13bb7d10-b331-4757-9a7a-ac6d86db7108" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="784ccf01-375f-4236-85f8-270195cd7368" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto" data-unique-id="fe579e00-06cd-413e-9d77-0426ac986d4a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground" data-unique-id="36ee3c2c-8832-4ad1-b5d7-dcd2c8c3720f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="40b13a26-2a49-4c98-b590-8551256336d6" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="a65f699b-3d6f-48b8-8347-82cd24413d53" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="e4568ec9-44d4-4e9f-84c9-b3ae1dbaebc8" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="97af296a-37bf-4c20-8536-028a22506401" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="839a9374-0f00-4623-a8c9-e00e876ea2fb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="28398efd-6a29-4954-a7b1-7747372f41db" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="f9d1a7ed-1d7e-4663-885a-b9af02b8c81c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="28438e6b-a8c1-48fd-8541-e6c3adb53bb8" data-file-name="components/customer-management.tsx">
                  <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit" data-unique-id="b5affbca-8642-4778-bf7c-1c1c4937d4f0" data-file-name="components/customer-management.tsx">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteCustomer(customer.id)} className="p-1 rounded-md hover:bg-accent/20" title="Delete" data-unique-id="727a1b3f-5552-46f8-987e-ce6b08cf7d36" data-file-name="components/customer-management.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="b6d2bd9c-9858-42e9-806d-aa6fab5769b9" data-file-name="components/customer-management.tsx">
          <div data-unique-id="b46cbedc-0d15-4e7b-85a7-a212ec99532c" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="4ccd71d2-b281-4fec-8bf6-a4ccae07039c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="44e02d0d-3563-4232-b781-73f5d6e225d0" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="2840e0de-c6a6-44b7-98b3-69415711264d" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="2cd9dc7b-51fb-4cda-906e-79f9a5f79e29" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b9bc719d-3783-4de7-8464-63765308268d" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="8f626ca3-72e7-473a-8e9d-15fa7912da2f" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="ed622b19-a285-45a8-933a-1fc7741828c5" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}