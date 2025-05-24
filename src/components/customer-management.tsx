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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="9853eb55-9560-4aa8-a2d0-4224b36eee73" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="2418c030-b633-42ae-98a1-b9f9a4e45a52" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="708d5ffa-5a34-4c10-b29c-981f296f9d7d" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="93a39553-6c6a-4e31-8322-49357e498258" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="4600d1b5-bfa5-4005-b776-c192ea87922a" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="70515702-f863-47b4-8fff-d192d7760c80" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 flex flex-wrap items-center gap-4" data-unique-id="04243a46-6ff4-44a2-b785-6604a6843673" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="relative flex-grow" data-unique-id="ac2f39e1-f084-4966-8c90-68a303cc9c58" data-file-name="components/customer-management.tsx">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="4edfa654-bc17-4711-b950-15dd2fe5a0eb" data-file-name="components/customer-management.tsx" />
        </div>
        
        {/* Tag filter dropdown */}
        <div className="relative" data-unique-id="795964cf-d992-4501-bef7-8828fb0048c0" data-file-name="components/customer-management.tsx">
          <button className="px-4 py-2 border border-border rounded-md flex items-center space-x-2 bg-white hover:bg-accent/10" onClick={() => document.getElementById('tagDropdown')?.classList.toggle('hidden')} data-unique-id="6621007d-b1af-4769-a5c6-5fe6691d2e51" data-file-name="components/customer-management.tsx">
            <Filter className="h-4 w-4" />
            <span data-unique-id="f987188e-0836-4397-88ab-04ed5d782188" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{filterTag || 'Filter by Tag'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          <div id="tagDropdown" className="hidden absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-border" data-unique-id="a1eb5040-cf30-41d9-98c0-de47d994243c" data-file-name="components/customer-management.tsx">
            <div className="p-2" data-unique-id="af209eb8-0597-4aa6-993a-f75daf29fcd0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              <button className={`w-full text-left px-3 py-2 rounded-md ${!filterTag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(null);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="1fe5e6e6-f1ed-4f55-9c83-987136d168b4" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="976fb65f-4c10-4a13-9988-52fcca857501" data-file-name="components/customer-management.tsx">
                All Tags
              </span></button>
              {availableTags.map(tag => <button key={tag} className={`w-full text-left px-3 py-2 rounded-md ${filterTag === tag ? 'bg-accent/20' : 'hover:bg-accent/10'}`} onClick={() => {
              setFilterTag(tag);
              document.getElementById('tagDropdown')?.classList.add('hidden');
            }} data-unique-id="96c2924d-3fdd-4b91-b6ec-be24b6c9375a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {tag}
                </button>)}
            </div>
          </div>
        </div>
        
        {/* Export button */}
        <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="98f1fc71-c54e-4db1-a255-619d218378ac" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="d465568b-ca9e-4864-b4c5-5c6218a4baed" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="de5bcbb5-749f-4c5f-9519-fe8a924b22f1" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="e46af98c-b129-489f-b534-7c3beade3cf7" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="03691397-f66b-4d7b-ae59-827c328419c3" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="2196d4d5-6b53-40ac-9f5f-1d3f42736ff7" data-file-name="components/customer-management.tsx">
            <div data-unique-id="8ed7d7c5-c8d3-4c77-b025-33ad426f2831" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="a1047a08-7c17-4bab-bfd2-542527d075ad" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="077138c6-0c9a-4a51-a5cf-4af3ab86c63b" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="2b458054-0ecf-4890-baf7-cc0d7464844f" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="2c2536f5-2644-4746-80d7-c8f24dcfc3d0" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="a46b6846-0a8f-40d5-9c3e-b6686cb6324f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4b3ffa74-0f88-484f-8a83-c980a50870b3" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required data-unique-id="47eef269-0b5d-44e0-b0ca-e14455935ee3" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="12c3ddfb-5f45-4acc-8394-fe0caed9683d" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="68436222-abad-4905-941e-7445040a4eb2" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="96767efe-8087-4f12-8e69-a536828136d6" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="f5eac114-9599-4551-a854-ee1dbad98a1f" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="4a60950e-1573-4f48-9fb7-3d6681fadb04" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="6a3963ef-9e26-4ccc-8315-ce74a3f9bf38" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="585dceeb-ca02-4257-8b3e-a130ac80a19e" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="cd2c9769-7c26-4e2c-b1db-ae23aeb45f70" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="9d5d5228-8141-4208-bc05-a6248d3bf055" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="8ba7f103-1172-40b2-9a34-f821a7e88ad2" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="578e286c-6888-4bb7-8700-351874e213e2" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="5873afba-ba94-434e-b4e7-eeb396cbd51e" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="63531d4c-e8a7-4d4b-969c-179b5b8a29ae" data-file-name="components/customer-management.tsx">
              <div data-unique-id="41dc3ef3-4874-43ae-a358-790143c3b01d" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="afc1e41c-5d76-4566-90f4-fcea870927d5" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="39aada3f-9625-4096-9ed9-d3fa46d556f9" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="67630ff2-113f-4542-889f-66f8c0433691" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="72e1d592-e4c4-4139-bfb9-c84388960066" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="2e8e426b-5f42-4cd0-8245-d2dd307ae024" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9b56f5a3-2651-45a3-bad3-333b61042f7b" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="ad1c5176-785c-4030-9701-95ec9b5c42ba" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="a5892173-cb0a-4648-98e4-c138e096fdc4" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="6706c7f9-4e1a-468a-9f97-4f5809a96b53" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8428382e-f742-4703-aea0-0662169de49d" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="16e0e20a-1970-4a5a-bd1c-2e7ea2620b19" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="4d0a842b-ef90-4ebe-86ac-6dec5189d452" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="06a323ce-6170-44b6-a3ce-ac12b58381ac" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d92137f6-a54a-4600-92de-8f8678dfa993" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="fb2f03c5-4886-4bb5-9cc3-210eaf59c7c8" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="eee6ce2a-18f1-4781-b761-fc614fda60fc" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="48d75dba-00e1-4e90-972c-512bc44c139e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="144ee4ce-27a3-458c-a110-b224d309fd8c" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="939964a6-28c0-4922-ad14-f1ecabc0a3fb" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="989c4708-4e6c-4582-ab60-5d4cde7d881c" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="e4ad9a8f-b7ae-4d36-94a5-2051dab70fff" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="61f938d8-f1ac-414d-bb33-530e84d346f3" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="f2fe00da-3af6-4561-a5e7-e47913475731" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="318151a5-be1a-43d5-80f6-ca7aa41c316b" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b0f1efeb-5763-4eb1-8624-58f487179ba9" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="01070f96-83d9-4ca7-a950-1e9bc3d3cb16" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="341f0e05-f271-470c-987e-95cb5aa2bd33" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="91256ec5-1775-4b4a-aaf5-d83354f5e09b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="ff395458-d7c4-4ac5-9170-4f9f320ea127" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="6fd1c24a-42ca-4f4d-ab7f-e9603843794f" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d4e63f32-9412-4166-9e1b-dc1556864760" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="a825b8d0-7aa5-4f90-a333-ec5b48a3607e" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="88fd2f0d-fec7-44cf-b2f6-4a4ac42100ea" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto" data-unique-id="cbdb50da-e8fc-4b10-b668-c48e43b7f49c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground" data-unique-id="00f91eb0-fb5b-4d58-b35d-60a2c5c174de" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="6a41cf3d-c787-47e6-b42a-84b06f344459" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="4cffa664-daa9-4804-8f01-b0e0bb407e57" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="dcc92dec-81f4-4573-97da-a8a2d6431b3a" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="c1b151a0-ad9c-4223-9b1e-7afa9b62e99a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="ce64de6f-6e27-49a7-a9bc-df1aa06b6e12" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="0a92b3df-5cac-4317-afc5-82331ecad5af" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="3f8f6164-9144-4eca-bae8-de435b3add26" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="7d02cb3d-87f0-4070-8eef-35602156bcb2" data-file-name="components/customer-management.tsx">
                  <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit" data-unique-id="7b17ee6e-fc5c-4ce4-868f-7ee74a108afd" data-file-name="components/customer-management.tsx">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteCustomer(customer.id)} className="p-1 rounded-md hover:bg-accent/20" title="Delete" data-unique-id="28bf9f3c-8faa-46c5-8946-d55c56cfcd6e" data-file-name="components/customer-management.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="79c763d3-c7b8-4e2b-9292-5e0f2e6a45f1" data-file-name="components/customer-management.tsx">
          <div data-unique-id="ad8ea992-6809-4d9c-9477-3f178a0d0046" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="a1a74329-4a06-4be4-b31b-ed4a8bcc903c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="42a9a8ee-ab2e-4177-a68b-93f91bf18c2f" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="2ace6348-ea32-43a8-952a-4a451b36fec5" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="091b716f-9308-48d0-bde7-b36ec3d6901b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="91a40d0f-c31c-4d66-a191-9ca05ecaf41f" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="0b2e8551-eb1e-409f-b34a-f1b1e799131e" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="9612b771-a1df-4d73-8975-20ff9afaf0f8" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}