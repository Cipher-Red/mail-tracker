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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="5faf2366-b9db-42ad-a1e0-703ca8bf5477" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="2102699b-d02e-435a-90b2-f7f3bb23ff72" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="7f974334-c6b9-46f4-9dcd-36970b139a93" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="86e84b1d-4fd6-460c-b691-1fed1062c8f6" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="e5509b5c-b8af-4540-94d8-97b180f754c0" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="80d2a518-bab7-43c3-8c8a-7a33e9e57ba7" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 flex flex-wrap items-center gap-4" data-unique-id="2c323630-981e-47b0-b4a3-5d2d96e6f80f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="relative flex-grow" data-unique-id="7e27d3f9-59aa-458e-a874-6e5719afd531" data-file-name="components/customer-management.tsx">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="b00c5fa8-17bf-4da2-a715-619e044e7583" data-file-name="components/customer-management.tsx" />
        </div>
        
        {/* Tag filter dropdown */}
        <div className="relative" data-unique-id="e5d360fd-2a77-411e-8ce9-a85d8d1147cf" data-file-name="components/customer-management.tsx">
          <button className="px-4 py-2 border border-border rounded-md flex items-center space-x-2 bg-white hover:bg-accent/10" onClick={() => document.getElementById('tagDropdown')?.classList.toggle('hidden')} data-unique-id="f95965c9-a859-4c0a-a403-107d21e6c79a" data-file-name="components/customer-management.tsx">
            <Filter className="h-4 w-4" />
            <span data-unique-id="d2d69b09-8ac0-4f43-9ec3-93d4bc527cf5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{filterTag || 'Filter by Tag'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          <div id="tagDropdown" className="hidden absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-border" data-unique-id="38ccacb5-f252-4931-9efc-eaa5e016eb7c" data-file-name="components/customer-management.tsx">
            <div className="p-2" data-unique-id="19c7b9ff-4920-4040-af83-db645e213fbd" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              <button className={`w-full text-left px-3 py-2 rounded-md ${!filterTag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(null);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="73899a59-0a78-4a8d-acf8-61561edc5ad9" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d76b0ba3-9253-4879-bbc5-278c5f6cdfb3" data-file-name="components/customer-management.tsx">
                All Tags
              </span></button>
              {availableTags.map(tag => <button key={tag} className={`w-full text-left px-3 py-2 rounded-md ${filterTag === tag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(tag);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="41a2e18e-12f6-45ce-a478-288142dd7502" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {tag}
                </button>)}
            </div>
          </div>
        </div>
        
        {/* Export button */}
        <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="7671c948-c78e-4d95-b393-39b66e455a5b" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="c532c085-9fc9-4651-84eb-33037afa5a9e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="390199b9-6d38-4d46-8714-a19570d6b757" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="30d1957a-9e8d-4eeb-bcea-93ea9749a22d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="cfd827b9-791f-40bf-bcac-07b63fc51a71" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="a7e0c8c6-005b-4512-b423-b7e91e64c29b" data-file-name="components/customer-management.tsx">
            <div data-unique-id="0633a140-03a7-4a25-a8dc-32f4b236748c" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="c3fc4615-1f5d-41f2-9f69-c863d40a82b8" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e29f30da-6b0b-4b9f-856d-5da391a24068" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="a9d356a5-8b07-4552-9feb-333352ff80db" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="e75d2172-f147-4373-901e-2ca9a06210c5" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="ab22ab80-0d20-4ce3-8fea-8964bc415d0c" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="467af4ca-7831-444c-bdc6-dc28f9202993" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="8e43fe62-ebd9-45be-a620-e40cc95b87dd" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="df20d4ae-ab16-4755-9a01-513dcf3df8c4" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="ddc1ab12-6abc-48f2-8972-36846fa706f7" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6afa361b-f569-4b64-8bda-6fd8773c1a7d" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="3ba99910-55f8-4795-8d3f-1e72dc43ed29" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="8851a6dd-e07b-497c-8f73-d4281778a754" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="45838930-47d6-4866-97f6-f8cd7535ca1b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="f718e3e3-c867-4c25-aa84-42872ca1e3d2" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="1f7f5120-3dc6-49b7-9a86-e151de55b168" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="415c4cf2-b267-4dab-a886-3d0efb927155" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="3bb36446-646a-4f02-b5b1-ed11a6334464" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="256c949a-94e5-44d1-b73a-71798ae42642" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="663b9c21-696f-4b94-bccb-a7cfd477168f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="0a64206f-3b45-4ba0-b768-fa42171bac69" data-file-name="components/customer-management.tsx">
              <div data-unique-id="9ee84550-86a3-4f18-8eba-f60622a35aee" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="b1d4da75-cf97-44c3-baf5-73fbf5b47bde" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a5173b9b-9d30-4d91-b29a-d19c94776a86" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="687e3f4d-7fde-4c62-82b9-7d7c9c4fe67a" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="2cffaa33-5dde-49a8-ae7f-ce5c937c3323" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="9dfcd9df-59e0-4620-96a3-467fedf4bc88" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d59e1bc8-0291-480f-9980-1c34ff9b14b3" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="e521a345-8ec1-4b47-b08f-3a2cd72b7b90" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="a928aca2-91e9-446f-a8fc-6e443007b36e" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="a722e399-78a4-4842-8773-726268cb509e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b10ae5cd-9fb8-4c44-8e80-d7ec98f6b92d" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="e97f1455-d91b-4d76-b5c3-37663637e36c" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="5e785ea2-040b-460f-b181-9ec878c97804" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="0fc96ae5-84a5-4f6a-886b-18939816cd34" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="35e7f426-bbf5-4337-891a-dad60e116b7f" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="5718295e-02d9-4855-8d47-43bfea240946" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="995b36e1-3f8d-45b8-a9cd-02f6c1df860f" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="bb4c7ba8-d4e8-4d45-a76a-5d85e58e1026" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e02737c5-d294-4664-80ae-5b209730dfc4" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="3b2fd2ef-a5e5-49d8-b721-81f558ae14a5" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="0a83e36c-e091-4442-9e1f-188297041250" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="db2d908d-e1a6-462b-9a15-db561017cdb1" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="097aacb8-2cf1-4078-bb8c-22b756d49fe0" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="093391a8-d8e7-40bd-9d05-ff352656f0cd" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="3eb6ddf8-20a6-4b16-8fbc-da79aa05bfa9" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="43a66fac-4d55-4888-ac2c-05df92942c83" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="816041cf-aeae-4ef9-b2d5-7004d04f1083" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d2ab3ab2-ddf7-4b1b-9296-1243001646a4" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="cca14837-3573-4a5d-8ba2-725793963256" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4c42fb89-d7b1-4c4f-a0d0-350ed58a440d" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="4c06b1ee-14bd-4b49-9339-e5629511a59f" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9add9018-d613-4e84-a1c7-48493bdaac3b" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="c31b420e-3d48-4947-bad0-6fa0d1967e86" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="3e57ad36-bf46-4cc2-9475-b596456aaf53" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto" data-unique-id="1ba8a58a-e726-4c48-b8ec-fc3624d56c09" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground" data-unique-id="277f2c05-9c0b-47ec-8302-d05e6177abec" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="bf148575-a161-48f2-821d-87859db9ada2" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="c872c43a-bee2-4f8c-a366-acf67a9e5d98" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="36447d7f-0c27-4040-81e3-866541fcb111" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="e43754eb-9efc-4348-a67d-1b24a069b9a7" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="29993b06-f9b7-4daf-8bcd-0097db26977a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="11e6b571-e4c6-44be-ad5a-d6e18613d093" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="7546aca5-08bf-457b-b7c1-ab7df52ef67a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="569728f0-15c3-4492-8a24-cfba41eb76c0" data-file-name="components/customer-management.tsx">
                  <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit" data-unique-id="b9955aa6-5c58-4f66-8fd4-c838456e85a9" data-file-name="components/customer-management.tsx">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteCustomer(customer.id)} className="p-1 rounded-md hover:bg-accent/20" title="Delete" data-unique-id="9e8a6942-4cc3-41a6-aa87-d57e1492e341" data-file-name="components/customer-management.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="581a67d3-2435-4c5d-ad76-4a6136248585" data-file-name="components/customer-management.tsx">
          <div data-unique-id="11bddab7-14fc-4266-b970-a94488671931" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="40a86cda-f220-4b1f-a39e-756e58cbd7ce" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="d900826a-58fc-4d8f-bfde-ba8eb461121f" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="5293d019-4ad6-4372-b028-5c0304999807" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="7c8919b5-a21b-40b7-b70a-c3bf1d455338" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="0a5304c7-571b-4346-8d70-b56d5daa4ad8" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="5b51078d-8e59-4dfb-83a9-0af0e7db6e27" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="6173305b-5741-4e0d-86ca-4472bf3f00a4" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}