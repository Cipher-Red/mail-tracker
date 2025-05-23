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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="a520f048-d154-492a-b402-b3bf63abe13a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="ccad414b-dc01-4828-95d9-78d64b68c6eb" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="0f6c4f54-afe0-4e3c-af91-79e9346d8cf9" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="b9351d7f-6593-410d-b510-272a154d91d3" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="530aaf91-ab42-4b30-ba10-cbd686345704" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="70acdf2e-8cf4-46ba-ae32-7c5d9612bced" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 flex flex-wrap items-center gap-4" data-unique-id="04996748-a350-452f-8124-8dc9452b7211" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="relative flex-grow" data-unique-id="0da8e5cc-1ef0-415f-96d2-cd46533e12c3" data-file-name="components/customer-management.tsx">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="cc947bc6-ec0a-485b-995f-ff819b952f54" data-file-name="components/customer-management.tsx" />
        </div>
        
        {/* Tag filter dropdown */}
        <div className="relative" data-unique-id="5af0651f-91e1-468f-87cd-0c5b087d07c4" data-file-name="components/customer-management.tsx">
          <button className="px-4 py-2 border border-border rounded-md flex items-center space-x-2 bg-white hover:bg-accent/10" onClick={() => document.getElementById('tagDropdown')?.classList.toggle('hidden')} data-unique-id="46e178b9-401f-4cd9-8a68-64709074980a" data-file-name="components/customer-management.tsx">
            <Filter className="h-4 w-4" />
            <span data-unique-id="7d697c75-8d50-4194-886b-3e7a292de40c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{filterTag || 'Filter by Tag'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          <div id="tagDropdown" className="hidden absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-border" data-unique-id="ffc24dff-f883-4579-bec8-2ee09a07f7da" data-file-name="components/customer-management.tsx">
            <div className="p-2" data-unique-id="442abaa5-073b-45c1-9749-8892848a7faf" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              <button className={`w-full text-left px-3 py-2 rounded-md ${!filterTag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(null);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="540b25a9-3aa0-4a40-ac2c-e2345975535f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="086770ab-4cfc-48b0-99a2-334d1fd5f9a1" data-file-name="components/customer-management.tsx">
                All Tags
              </span></button>
              {availableTags.map(tag => <button key={tag} className={`w-full text-left px-3 py-2 rounded-md ${filterTag === tag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(tag);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="1c801580-bd8b-4814-aa70-f77b27891f98" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {tag}
                </button>)}
            </div>
          </div>
        </div>
        
        {/* Export button */}
        <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="eb986e51-a1d5-4ff4-86d6-6c691b28dd55" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="18eba6d0-47b5-44a9-9f78-f609abca0378" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="bcc5d0fa-f7ad-4541-9454-2e2442898592" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="2fd7fee0-48da-478f-a062-b1a1a0a898e5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="5a1833e7-1766-4837-9801-b849bfa35ec7" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="3b9a2230-49dd-4e01-b3cb-25e30ae4d005" data-file-name="components/customer-management.tsx">
            <div data-unique-id="aaba6ccf-e124-40bf-a9a0-ef365db49d69" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="b8ce455a-bfc7-418d-af68-0f8eba3ff4c6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4cce96e2-a545-46f5-8555-259b1fe97442" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="334ec00c-7581-4c6a-bff9-8ce898e86234" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="85b0db21-405e-40ce-a696-fb7248d19764" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="592fc6b0-c5a3-4af5-83b8-309618a5403c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8ffac967-9a50-412d-ba9d-1b4ccf67c899" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="8a32ee58-915c-46f8-ad67-ca40e3c8dfa9" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="671874a1-050d-470e-bcd8-c7bce5acbae5" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="0655fafc-9440-4d75-b33e-3c833183ca5e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="ccf0af8e-0eba-4c6e-9843-ec610bafb720" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="7a0cca83-0082-47aa-8df6-246273f8f96b" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="ec8ff484-12da-4fed-a366-437c74d6444c" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="b23a3a54-dd8f-4209-97e8-eb982ecbc166" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8bead377-1bd7-412a-b73f-0fd2a385c539" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="88a3aa70-1b16-4574-b9bd-30ee442bea32" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="ed3544ab-3e04-4a3d-b4a6-411ae455772a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="37ace20c-38ec-4fb3-a4d5-5c8f191fa6a5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="c3974005-a859-4f00-97ee-f93c73a22428" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="75b86ebe-e4b6-4727-ad2e-bceb09fd77d3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="330fb4c9-4261-42d9-82b5-138f9148d1b7" data-file-name="components/customer-management.tsx">
              <div data-unique-id="f6da8341-59a0-4ed2-a46a-4418a65ff4c0" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="3723d19f-c5d5-4eef-bc42-baaf9abfdfc6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="545ff816-17b6-43a4-8328-568f63bde778" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="55882b6a-72d4-425c-8c50-755eb6344c1a" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="7b9f257b-b54f-4c5f-acc4-4a873902801c" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="527116b3-da39-4a9b-9b49-92ce6b57745e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9a0667d8-2fc1-4908-bd83-153f1c230a93" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="d8193dd4-072a-45a8-aa59-cf21d7498d6a" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="8bb966cd-700f-4439-96b8-bf83bba7d36a" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="02a50eff-178d-4728-bf6e-0fd5ba29138c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e8534c01-339d-421e-961e-7769626e56fa" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="6aacb63b-dc0a-4a0c-8a76-541bb70d5e8a" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="605992de-122f-4f6b-bf91-945c205ffcf3" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="41bb8287-c028-4e81-a9a3-a1e4dd45ef63" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="83a8074b-99e7-4420-bb51-3e48303dc53c" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="ec9649ea-4666-423c-8264-33521ef41408" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="8719142a-8bbe-4b48-ae5d-b5526f2a17e3" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="e9ee0787-b96c-46a5-bfc2-cbce71ff4f5b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6d06defb-e7dd-4b89-a3c1-21ecb5d32a39" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="16c87985-4501-4027-a69e-c87e8c46a327" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="920bc624-e54d-4c00-b74a-8debb018ea08" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="520b93e4-fd00-4b78-910c-00182e8fe952" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="cd6fb958-0572-49d9-b789-a4c423c87da4" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="426edfb4-f15d-4326-aa4f-dfcebbce1eca" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="fdab0b68-1603-4b7d-88f3-a68153d13dcb" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3f1071d9-ec1c-4e74-8cac-d7e2c229cdcc" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="ed7b3e37-920b-4a03-a0cd-0c512e2961fc" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="432b8272-6ace-4138-b0a9-58f74baf0eb3" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="e14535fc-c2f5-4365-a16e-725104a83e04" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="baf5e19f-d920-40bd-aa86-405375b1f0dc" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="9e4bc55d-5088-4877-a5c2-1de7024d9aaf" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c27b3b5c-8aae-4a13-849b-08b141f3e31e" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="72598252-9ce5-4558-a401-7c118948be44" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="aff71d1c-d823-4e75-a9f9-b1a98e320b1e" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto" data-unique-id="9e1deb5f-337f-4818-9a25-c417bbce85e9" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground" data-unique-id="c5411cc0-1d11-46f3-82d0-671ac4e02fb0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="ca0d9bd1-4b5a-468f-8484-39cb0ad52f84" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="42ecfe51-416f-4e1a-818f-143db68569ea" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="26e13c75-a72d-4fb7-a39b-0b42cb1d3ece" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="2550ea35-08f7-4a14-aaea-86c99cbd638c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="eb55396d-2e97-4f1f-8e40-c925a7cb4fe8" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="afdb9118-fb23-41e3-9b70-2bd3e257b814" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="7a95f98c-15f1-4cab-b023-a4e0b22ec02e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="3b8dcf3f-8d6a-47db-a712-f99eb7f0faab" data-file-name="components/customer-management.tsx">
                  <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit" data-unique-id="fdff5101-18a6-4393-a158-d4e9f369d628" data-file-name="components/customer-management.tsx">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteCustomer(customer.id)} className="p-1 rounded-md hover:bg-accent/20" title="Delete" data-unique-id="c0f2d661-79eb-4e70-a29b-4583860b8b9b" data-file-name="components/customer-management.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="14801369-60d6-4a31-9862-abaa6c81ce22" data-file-name="components/customer-management.tsx">
          <div data-unique-id="a0385e2e-99ff-4377-9b63-50abe73b7315" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="d54b7985-f562-4a84-929e-12df4300d891" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="cdfa3a7e-7e71-4def-bc7a-5ec65337d98e" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="50099745-aaba-4fe2-a069-d7e7f5a7783f" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="2276450e-bb8d-47bd-ac1a-d78b7b7306b8" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="55ce502d-2c3e-4a47-96f7-b54a8a7c0662" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="82fcca0a-b6e8-486b-9f02-8ad03582f01a" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="814d9874-3138-4dd6-9e7f-76e0e715f7c4" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}