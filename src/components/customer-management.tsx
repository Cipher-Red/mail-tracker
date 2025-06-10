'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Search, UserPlus, Users, X, Edit, Trash2, Check, Download, ChevronDown, ChevronUp, Filter, Calendar, Mail, Phone, Clock, AlertCircle, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { customerService, subscribeToChanges } from '@/lib/supabase-client';
import { Customer } from '@/db/schema';
import toast from 'react-hot-toast';
import CustomerStats from './customer-stats';
import { processCustomerExcel } from '@/lib/excel-customer-processor';
import * as XLSX from 'xlsx';
export type { Customer } from '@/db/schema';
export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Add Toaster for notifications
  const [visibleFilters, setVisibleFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [sortField, setSortField] = useState<keyof Customer>('addedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // New customer template
  const newCustomerTemplate = {
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
    tags: [] as string[],
    lastContact: '',
    notes: ''
  };

  // Form state for adding/editing customers
  const [formData, setFormData] = useState(newCustomerTemplate);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  // Load customers from Supabase on component mount
  useEffect(() => {
    loadCustomers();

    // Set up real-time subscription
    const unsubscribe = subscribeToChanges('customers', payload => {
      console.log('Customer change:', payload);
      loadCustomers(); // Reload data when changes occur
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const customerData = await customerService.getAll();
      setCustomers(customerData);

      // Extract all unique tags from customers
      const tags = customerData.flatMap(customer => customer.tags || []);
      setAvailableTags([...new Set(tags)] as string[]);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

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
  const handleInputChange = (field: string, value: string) => {
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
      toast.error('Name and email are required');
      return;
    }
    try {
      if (editingCustomer) {
        // Update existing customer
        await customerService.update(editingCustomer.id, {
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          address: formData.address || null,
          tags: formData.tags,
          lastContact: formData.lastContact ? new Date(formData.lastContact) : null,
          notes: formData.notes || null
        });
        toast.success('Customer updated successfully');
        setEditingCustomer(null);
      } else {
        // Add new customer
        await customerService.create({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          address: formData.address || null,
          tags: formData.tags,
          lastContact: formData.lastContact ? new Date(formData.lastContact) : null,
          notes: formData.notes || null
        });
        toast.success('Customer added successfully');
      }

      // Reset form and reload data
      setFormData(newCustomerTemplate);
      setIsAddingCustomer(false);
      setShowAdvancedFields(false);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(`Error saving customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      lastContact: customer.lastContact ? new Date(customer.lastContact).toISOString().split('T')[0] : '',
      notes: customer.notes || ''
    });
    setIsAddingCustomer(true);
    setShowAdvancedFields(true);
  };

  // Delete a customer with better UI and error handling
  const deleteCustomer = async (id: number) => {
    try {
      // Show loading state
      const toastId = toast.loading('Removing customer data...');

      // Get customer name for confirmation message
      const customerToDelete = customers.find(c => c.id === id);
      const customerName = customerToDelete?.name || 'Customer';

      // Delete from Supabase
      await customerService.delete(id);

      // Also remove from selected list if present
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));

      // Clear any pending confirmation
      setShowConfirmDelete(null);

      // Show success toast with customer name
      toast.success(`"${customerName}" has been removed`, {
        id: toastId,
        duration: 3000
      });

      // Reload customers
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error(`Error removing customer: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        duration: 4000
      });
      setShowConfirmDelete(null);
    }
  };

  // Function to show delete confirmation
  const confirmDelete = (id: number) => {
    setShowConfirmDelete(id);

    // Auto-hide after a few seconds if not acted upon
    setTimeout(() => {
      setShowConfirmDelete(prev => prev === id ? null : prev);
    }, 8000);
  };

  // Toggle customer selection
  const toggleSelectCustomer = (id: number) => {
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
      toast.error('No customers to export');
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
      toast.success('Customer data exported successfully');
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
        // Import customers to Supabase
        let importedCount = 0;
        let updatedCount = 0;
        for (const customer of result.customers) {
          try {
            // Check if customer exists by email
            const existingCustomers = await customerService.getAll();
            const existingCustomer = existingCustomers.find(c => c.email.toLowerCase() === customer.email.toLowerCase());
            if (existingCustomer) {
              // Update existing customer
              await customerService.update(existingCustomer.id, {
                name: customer.name,
                company: customer.company || null,
                phone: customer.phone || null,
                address: customer.address || null,
                tags: customer.tags || [],
                notes: customer.notes || null
              });
              updatedCount++;
            } else {
              // Create new customer
              await customerService.create({
                name: customer.name,
                email: customer.email,
                company: customer.company || null,
                phone: customer.phone || null,
                address: customer.address || null,
                tags: customer.tags || [],
                notes: customer.notes || null
              });
              importedCount++;
            }
          } catch (customerError) {
            console.error('Error processing customer:', customer.email, customerError);
          }
        }
        toast.success(`Successfully processed ${result.customers.length} customers. ` + `(${importedCount} new, ${updatedCount} updated)`, {
          id: toastId
        });

        // Reload customers
        loadCustomers();
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
  }} className="bg-card rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl" data-unique-id="8b1e21a3-f594-4b0e-b327-de268fee42c3" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
      <Toaster position="top-center" />
      <Toaster position="top-center" />
      {/* Header section */}
      <div className="flex justify-between items-center mb-6" data-unique-id="aaa54e1a-c1e8-494e-a242-545c1cd36a96" data-file-name="components/customer-management.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="b0a4fb32-d0dd-4f2b-9045-143c1879022f" data-file-name="components/customer-management.tsx">
          <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="68a41aae-275a-4fd3-b911-938b970749ed" data-file-name="components/customer-management.tsx"> Customer Management
        </span></h2>
        <button onClick={() => {
        setIsAddingCustomer(true);
        setEditingCustomer(null);
        setFormData(newCustomerTemplate);
        setShowAdvancedFields(false);
      }} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="57e862c5-006b-4375-acfa-1441b9c2e755" data-file-name="components/customer-management.tsx">
          <UserPlus className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1ccba413-fbd8-40e8-a2b8-ea4534c44742" data-file-name="components/customer-management.tsx">
          Add Customer
        </span></button>
      </div>
      
      {/* Customer statistics overview */}
      <CustomerStats customers={customers} />
      
      {/* Excel template info */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-md text-sm" data-unique-id="fd654903-ea82-4ac8-881c-9f6466c3cd87" data-file-name="components/customer-management.tsx">
        <div className="flex items-center" data-unique-id="b74aa871-76b7-4124-af2b-ef7e94bc304c" data-file-name="components/customer-management.tsx">
          <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
          <div data-unique-id="6d5d296c-299d-43b7-aae1-93cdab1fed74" data-file-name="components/customer-management.tsx">
            <p className="font-medium text-blue-800" data-unique-id="9d48ae0a-27de-4c94-a826-6588072e48c7" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="83b537f3-034e-4966-98fa-1fa566e40fee" data-file-name="components/customer-management.tsx">Excel Import Format</span></p>
            <p className="text-blue-600" data-unique-id="c97528e3-cf4b-44b9-aa4f-2343c36d92a8" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="d01e7c30-30b2-4ec3-b36b-94c46be21253" data-file-name="components/customer-management.tsx">Required columns: name, email. Optional: company, phone, address, city, state, postalCode, tags, notes</span></p>
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
      }} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center" data-unique-id="969e002f-b9a6-48a4-bd66-d02abbc3b396" data-file-name="components/customer-management.tsx">
          <Download className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="ae3cefcc-4e89-46fb-90db-1fef1ee84f93" data-file-name="components/customer-management.tsx">
          Download Template
        </span></button>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4" data-unique-id="307c33da-e2fc-45be-bec3-c0a061cbed0c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap items-center gap-4" data-unique-id="87ec7717-ea3b-41c4-8a9e-cccdcadd0766" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="relative flex-grow" data-unique-id="5d019c9c-6013-4737-8d49-875070d8d76a" data-file-name="components/customer-management.tsx">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search customers by name, email, company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="8beb423c-b4c6-4080-b171-9eeffa74b765" data-file-name="components/customer-management.tsx" />
          </div>
          
          <button onClick={() => setVisibleFilters(!visibleFilters)} className={`px-4 py-2 border ${visibleFilters ? 'border-primary bg-primary/5' : 'border-border'} rounded-md flex items-center space-x-2 hover:bg-accent/10 transition-colors`} data-unique-id="301d4849-4b36-4013-ae5a-565eaac5a11d" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            <Filter className={`h-4 w-4 ${visibleFilters ? 'text-primary' : ''}`} />
            <span data-unique-id="c32b3e24-7b2d-43e6-a0b0-7d8c0cc68bae" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{visibleFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {visibleFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* Import/Export buttons */}
          <div className="flex space-x-2" data-unique-id="a07db919-7b94-4203-a03e-3d043a69ac38" data-file-name="components/customer-management.tsx">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" id="excel-import" disabled={isImporting} data-unique-id="d5c62f64-bf8b-46dc-9ab5-5a5741622e0f" data-file-name="components/customer-management.tsx" />
            
            <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="900a71fd-e999-4da9-9596-88091571b04c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {isImporting ? <>
                  <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                  Importing...
                </> : <>
                  <FileSpreadsheet className="h-4 w-4 inline mr-2" />
                  Import Excel
                </>}
            </button>
            
            <button onClick={exportCustomersCSV} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="458bffc1-e1f3-445c-acf9-389538b90f0c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
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
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/5 rounded-lg border border-border" data-unique-id="6890d0b3-5900-464c-9550-97bd49065adf" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {/* Tag filter */}
            <div data-unique-id="1a6b1817-cc34-4812-9df4-699689a14102" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="769ed858-f039-4c9b-9d43-359ca8f6f6b5" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="801bb1de-2401-4918-a539-24bb4b0e8971" data-file-name="components/customer-management.tsx">Filter by Tag</span></label>
              <div className="relative" data-unique-id="a37572e9-cb43-4ee4-a084-0c872708df7a" data-file-name="components/customer-management.tsx">
                <select value={filterTag || ''} onChange={e => setFilterTag(e.target.value === '' ? null : e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="0c636316-430d-4ca4-ba6c-eeba1b07db26" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="6f9f1c4f-a6de-4a0e-b67a-192de02cc5a5" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="b500d4d1-3e23-4465-be70-c427cbe9bb7e" data-file-name="components/customer-management.tsx">All Tags</span></option>
                  {availableTags.map(tag => <option key={tag} value={tag} data-unique-id="f77692a7-9bc9-46eb-ae2f-c433d86cca99" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            
            {/* Date filter */}
            <div data-unique-id="0ead4881-fa46-4820-9af2-e33f77aab92c" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2 flex items-center" data-unique-id="9a78dac6-9d00-4d3e-9159-6ec38dbf367e" data-file-name="components/customer-management.tsx">
                <Calendar className="h-4 w-4 mr-1" data-unique-id="13740512-4f65-4534-b49c-fb898c85ec85" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="fee1da88-f673-4f2c-851a-a1c2bfbf2d1c" data-file-name="components/customer-management.tsx">
                Filter by Date
              </span></label>
              <div className="relative" data-unique-id="6996eb65-03a3-4aad-b80d-a35ffa2b1c47" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="55432f95-680a-484c-8128-84f37466df74" data-file-name="components/customer-management.tsx" />
                {dateFilter && <button onClick={() => setDateFilter('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear date filter" data-unique-id="c34bfcdd-7c60-41ab-96b7-576ed2ae57d4" data-file-name="components/customer-management.tsx">
                    <X className="h-4 w-4" />
                  </button>}
              </div>
            </div>
            
            {/* Status filter */}
            <div data-unique-id="a053f107-4954-404c-bd21-793fe52b8eda" data-file-name="components/customer-management.tsx">
              <label className="block text-sm font-medium mb-2" data-unique-id="d5b99ec8-42ea-4c6d-a3c7-f0a7748e19ae" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="9f4246c7-72c2-4b12-a687-2cc13e22457d" data-file-name="components/customer-management.tsx">Customer Status</span></label>
              <div className="relative" data-unique-id="da8c537a-bcb1-4d47-b4c1-f72524d6ed87" data-file-name="components/customer-management.tsx">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-8" data-unique-id="19770bf9-a0f3-42d2-a1ed-e21795bb0a39" data-file-name="components/customer-management.tsx">
                  <option value="" data-unique-id="2bba6f3b-8166-4c88-bdce-ede20a5efb5b" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="bfe269da-dff5-4f05-a95c-50791fccf08a" data-file-name="components/customer-management.tsx">All Customers</span></option>
                  <option value="withEmail" data-unique-id="4927681d-00fd-4e00-b788-67ce2748ac13" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="a273f242-d2f6-4d61-b7a3-f0968d126a1b" data-file-name="components/customer-management.tsx">With Email</span></option>
                  <option value="withPhone" data-unique-id="2cbe2fd0-cc7b-4adb-b1cc-f7b992aeb2c9" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="3c00485a-8a39-4e33-a10f-daabec5a526c" data-file-name="components/customer-management.tsx">With Phone</span></option>
                  <option value="withNotes" data-unique-id="9d4c0ae9-9522-4c8d-8925-c51093cc8df3" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e7cfada3-5e27-4d9b-8d8b-9c507473efa7" data-file-name="components/customer-management.tsx">With Notes</span></option>
                  <option value="withoutNotes" data-unique-id="f3d5aa5b-cffc-48a5-ab44-a3b6e7d82197" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6d8eae85-fa1a-4b72-8827-91716185636b" data-file-name="components/customer-management.tsx">Without Notes</span></option>
                  <option value="recentlyAdded" data-unique-id="005bc0db-282c-4c39-97c4-b5416b7154a8" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="8dd35c82-f98b-470f-b911-033cd38d2ab6" data-file-name="components/customer-management.tsx">Recently Added (7 days)</span></option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </motion.div>}
        
        {/* Active filters display */}
        {(searchQuery || filterTag || dateFilter || statusFilter) && <div className="flex flex-wrap gap-2 mt-2" data-unique-id="ae5a201e-9274-4b4d-adea-1294d8789b8a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {searchQuery && <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="c8e8134b-787a-4906-aa57-159f305f005f" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Search className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="be45b8c7-9d4b-4573-87e7-eca1dda11c17" data-file-name="components/customer-management.tsx">
                Search: </span>{searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-primary/70" data-unique-id="c4beec58-355f-42b3-8b27-6f75a67c12bc" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {filterTag && <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="0d6a2d06-7042-493e-8a9b-dc801bd419b4" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Filter className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="0aadcc9c-b8eb-42be-bbbb-a6dc8084dcba" data-file-name="components/customer-management.tsx">
                Tag: </span>{filterTag}
                <button onClick={() => setFilterTag(null)} className="ml-1 hover:text-blue-500" data-unique-id="6c0260d4-5cc6-440f-8598-b0477c76bbb8" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {dateFilter && <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="3f53747b-c925-4837-98ee-2a3c5b383b81" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                <Calendar className="h-3 w-3 mr-1" data-unique-id="5deb7ff4-9410-4bd1-892a-31c3bb8e43be" data-file-name="components/customer-management.tsx" /><span className="editable-text" data-unique-id="8c13254c-710c-4663-8a0b-9a959bdee996" data-file-name="components/customer-management.tsx">
                Date: </span>{new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="ml-1 hover:text-green-500" data-unique-id="6e3cd1b9-f595-4624-aeae-d9971a0ddcbf" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            {statusFilter && <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs flex items-center" data-unique-id="d4f30f14-8c50-4160-b551-3936dfd5baa0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {statusFilter === 'withEmail' && <Mail className="h-3 w-3 mr-1" />}
                {statusFilter === 'withPhone' && <Phone className="h-3 w-3 mr-1" />}
                {statusFilter === 'withNotes' || statusFilter === 'withoutNotes' ? <Edit className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="30df1a32-b336-41f8-ab62-b445fdef8b49" data-file-name="components/customer-management.tsx">
                Status: </span>{statusFilter === 'withEmail' ? 'With Email' : statusFilter === 'withPhone' ? 'With Phone' : statusFilter === 'withNotes' ? 'With Notes' : statusFilter === 'withoutNotes' ? 'Without Notes' : 'Recently Added'}
                <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-amber-500" data-unique-id="1c6ed563-4fd5-4d12-8df8-52a644d633c7" data-file-name="components/customer-management.tsx">
                  <X className="h-3 w-3" />
                </button>
              </div>}
            
            <button onClick={() => {
          setSearchQuery('');
          setFilterTag(null);
          setDateFilter('');
          setStatusFilter('');
        }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center hover:bg-gray-200" data-unique-id="d7c7dc8a-3009-48b1-8b88-933d0919787d" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6326a26e-aeea-4beb-8f51-3c74a8be9f14" data-file-name="components/customer-management.tsx">
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
    }} className="mb-6 border border-border rounded-md p-4" data-unique-id="05054e72-8cce-4225-b103-3ec9e07ae3e9" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-4" data-unique-id="bd561192-0ab9-4cb7-a779-9649a78afac3" data-file-name="components/customer-management.tsx">
            <h3 className="font-medium" data-unique-id="c25fb0e8-2a94-4fbf-81cf-5868fffcac7c" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="96e9d1ed-1eb5-4467-b269-67430a96a979" data-file-name="components/customer-management.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="11a1248f-b82e-474d-9824-bc8d7692b702" data-file-name="components/customer-management.tsx">
            <div data-unique-id="77fc1496-12cc-4631-900d-01788730fe74" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerName" className="block text-sm font-medium mb-1" data-unique-id="fc43a989-1565-4679-b98c-721490d854ee" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="30c91d7c-3db7-4646-a8f6-9aba5f7b1411" data-file-name="components/customer-management.tsx">
                Name *
              </span></label>
              <input id="customerName" type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="27876078-2569-4064-9621-e709ed2042c0" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="ab3d63e7-83b8-4cb6-8223-7e925ad54473" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-1" data-unique-id="50709ed9-eb6c-48d8-a4f6-fbaeb14491dc" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="410e4d8b-8e7c-477b-bb1b-cad3d7e8a3cc" data-file-name="components/customer-management.tsx">
                Email Address *
              </span></label>
              <input id="customerEmail" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" required data-unique-id="6b97f3a1-2153-4f63-83b9-c313e4d96f3e" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="c17dacd2-97ba-4823-a74f-5a336826a24b" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-1" data-unique-id="23e9a5d5-51e4-4ee5-8f8c-f5983db37467" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="6406a3d6-8440-4b11-9e43-a46789cb4588" data-file-name="components/customer-management.tsx">
                Company
              </span></label>
              <input id="customerCompany" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="5e957a81-07cb-4c28-ab9a-e808dc88036b" data-file-name="components/customer-management.tsx" />
            </div>
            
            <div data-unique-id="089f9017-167f-4c78-ba53-c8645c4257ce" data-file-name="components/customer-management.tsx">
              <label htmlFor="customerTags" className="block text-sm font-medium mb-1" data-unique-id="7a9e82c5-715e-423c-b201-08f197a372ee" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="3833691b-99d7-46c5-9ca0-59505614654e" data-file-name="components/customer-management.tsx">
                Tags (press Enter to add)
              </span></label>
              <input id="customerTags" type="text" placeholder="Add tags..." onKeyDown={handleTagInput} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="82e4173b-6703-4376-9977-93dc26fa25f3" data-file-name="components/customer-management.tsx" />
              <div className="flex flex-wrap gap-2 mt-2" data-unique-id="82539c06-53e4-4fdb-b3ef-5b46f4625be0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                {formData.tags?.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/30" data-unique-id="b706e101-bac4-4c70-92c4-14b9fa9aebcc" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" data-unique-id="92a2ea9d-f2d1-47ce-b2bb-373b2d2b7d02" data-file-name="components/customer-management.tsx">
                      <X className="h-3 w-3" />
                    </button>
                  </span>)}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setShowAdvancedFields(!showAdvancedFields)} className="text-sm text-primary flex items-center mb-4" data-unique-id="d81ff6b0-1e86-4f8a-944f-300907dc6e64" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
            {showAdvancedFields ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedFields ? 'Hide Advanced Fields' : 'Show Advanced Fields'}
          </button>
          
          {showAdvancedFields && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="2096e3e7-bd9c-4955-9e67-9e138d6477a2" data-file-name="components/customer-management.tsx">
              <div data-unique-id="efb5fbc3-92d5-4bbc-b069-0f424cb70d08" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-1" data-unique-id="23184bf8-7f0d-4e7e-9f77-adbdf7b0b520" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5d5cb241-9417-4b5c-84ca-703b075c1de4" data-file-name="components/customer-management.tsx">
                  Phone Number
                </span></label>
                <input id="customerPhone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="ac296feb-14f5-443b-83d0-2e24cccbd127" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div data-unique-id="27179612-6112-4695-8a4d-13feadcd9fbf" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerLastContact" className="block text-sm font-medium mb-1" data-unique-id="c97675dd-7456-4653-b57e-966cc223cccd" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="51d03ece-18f4-4ab4-a75d-2e3b773753af" data-file-name="components/customer-management.tsx">
                  Last Contact Date
                </span></label>
                <input id="customerLastContact" type="date" value={formData.lastContact ? new Date(formData.lastContact).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('lastContact', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="ebe476b5-b8b6-447d-b08c-47d876f0b44e" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="e21c0baf-90c2-44f1-89e1-a538946d42c2" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerAddress" className="block text-sm font-medium mb-1" data-unique-id="f0889360-6f09-4de7-aedb-e477d34edb78" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4ee4b535-cfee-4ead-8692-e1caf41c6ef7" data-file-name="components/customer-management.tsx">
                  Address
                </span></label>
                <input id="customerAddress" type="text" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="9ccadebd-0c04-46f0-8f3f-8e334cb4ea6a" data-file-name="components/customer-management.tsx" />
              </div>
              
              <div className="col-span-full" data-unique-id="a5524857-5653-448c-9f35-8430a2fe85f1" data-file-name="components/customer-management.tsx">
                <label htmlFor="customerNotes" className="block text-sm font-medium mb-1" data-unique-id="06fcc990-e051-4a13-84d6-2a0b6b490ad7" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="5cb97d24-8825-47b1-8cde-ca41c0d0a81e" data-file-name="components/customer-management.tsx">
                  Notes
                </span></label>
                <textarea id="customerNotes" rows={3} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" data-unique-id="048f3010-d9f0-4ccd-923a-9c6aeb5ad845" data-file-name="components/customer-management.tsx" />
              </div>
            </motion.div>}
          
          <div className="flex justify-end space-x-2" data-unique-id="5970cebd-28f4-441f-9d63-f9239188faf9" data-file-name="components/customer-management.tsx">
            <button onClick={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="f1ab12c0-27b2-4e40-a195-aed9feb5175f" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="27166d1b-c18f-4231-8abb-7c632e2ce361" data-file-name="components/customer-management.tsx">
              Cancel
            </span></button>
            <button onClick={saveCustomer} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" data-unique-id="fe398870-f359-4a5f-8d3a-e36095ca767a" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.div>}
      
      {/* Customer list */}
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="3c861398-7ea6-4727-b2bd-13f40ef768e0" data-file-name="components/customer-management.tsx">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="5ac3d9f9-3c53-4102-9cd7-f45c541f6a78" data-file-name="components/customer-management.tsx">
          <div className="col-span-1" data-unique-id="b4167053-38a1-485e-8041-c102df205718" data-file-name="components/customer-management.tsx">
            <input type="checkbox" checked={selectedCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={() => {
            if (selectedCustomers.length === filteredCustomers.length) {
              setSelectedCustomers([]);
            } else {
              setSelectedCustomers(filteredCustomers.map(c => c.id));
            }
          }} className="rounded border-gray-300" data-unique-id="36479a7b-056a-4af8-876f-8f691918b900" data-file-name="components/customer-management.tsx" />
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('name')} data-unique-id="a3d06821-7032-4597-aba1-0f7bb2c833f1" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="85e2fc23-4a07-441a-92cc-d70df13fbdf2" data-file-name="components/customer-management.tsx">
            Name
            </span>{sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSortChange('email')} data-unique-id="561db388-536b-4923-bf95-77b08d29c6da" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b835f1cd-9868-4571-952d-f13e05968c99" data-file-name="components/customer-management.tsx">
            Email
            </span>{sortField === 'email' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-2" data-unique-id="4d2e8ee7-3b6e-41a4-b31d-dc0acc61d7f3" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="dd751b8e-b735-40b2-b413-a049a1c172a0" data-file-name="components/customer-management.tsx">Company</span></div>
          <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSortChange('addedAt')} data-unique-id="3c058ff7-f3ff-428d-b4c1-82ba5d3eb2f8" data-file-name="components/customer-management.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f36969f3-f461-466a-b475-47f8c9c58a59" data-file-name="components/customer-management.tsx">
            Added Date
            </span>{sortField === 'addedAt' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
          </div>
          <div className="col-span-1" data-unique-id="4844bf7a-57fa-4d5f-b353-efb4c21fc8a6" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="4df70d3a-11f5-418a-8fc2-447b80828e9e" data-file-name="components/customer-management.tsx">Actions</span></div>
        </div>
        
        <div className="w-full max-h-[70vh] overflow-y-auto" data-unique-id="b6284778-daf8-451d-bf0f-9de0e89ea7db" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
          {isLoading ? <div className="p-6 text-center" data-unique-id="c9d701b2-26c8-4234-9303-3976dbeba3c6" data-file-name="components/customer-management.tsx">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground" data-unique-id="a0095a3c-9921-424f-8ab5-026612b0b8aa" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="7e0b1949-4cf0-491f-8b0b-31eb5debff51" data-file-name="components/customer-management.tsx">Loading customers...</span></p>
            </div> : filteredCustomers.length === 0 ? <div className="p-6 text-center text-muted-foreground bg-card" data-unique-id="64912296-3ad4-4f7c-8b51-45570612fa5b" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
              {searchQuery || filterTag ? 'No customers matching your search criteria' : 'No customers yet. Add your first customer!'}
            </div> : filteredCustomers.map(customer => <div key={customer.id} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm ${selectedCustomers.includes(customer.id) ? 'bg-accent/10' : 'hover:bg-accent/5'}`} data-unique-id="4562faec-0a2b-4d26-b190-952c164ae0dd" data-file-name="components/customer-management.tsx">
                <div className="col-span-1" data-unique-id="ffceef26-761f-4926-8195-ab5d49536d20" data-file-name="components/customer-management.tsx">
                  <input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleSelectCustomer(customer.id)} className="rounded border-gray-300" data-unique-id="bdaf3421-a93b-43f5-91d2-bcc81f7d6981" data-file-name="components/customer-management.tsx" />
                </div>
                <div className="col-span-3 font-medium truncate" title={customer.name} data-unique-id="962a6b19-5e80-43ee-a221-d547b02f4acc" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.name}
                </div>
                <div className="col-span-3 truncate" title={customer.email} data-unique-id="f95e6279-fd75-4871-bc7b-91f7ea1ac7e0" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.email}
                </div>
                <div className="col-span-2 truncate" title={customer.company || ''} data-unique-id="bc449171-cc9d-40b7-80e3-cfe7de8d2acf" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {customer.company || '—'}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground" data-unique-id="9cb28625-678a-4524-9af2-14572999c0f7" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {new Date(customer.addedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex space-x-1 justify-end" data-unique-id="fb063f5f-0850-4ef8-aa86-023c5f8131fd" data-file-name="components/customer-management.tsx" data-dynamic-text="true">
                  {showConfirmDelete === customer.id ? <div className="flex space-x-1" data-unique-id="8e3da39f-a443-4e78-9aa5-99e2d0efb036" data-file-name="components/customer-management.tsx">
                      <button onClick={() => deleteCustomer(customer.id)} className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 flex items-center space-x-1" title="Confirm delete" data-unique-id="d810640c-0e6d-45eb-b673-7fccc5aaef46" data-file-name="components/customer-management.tsx">
                        <Check className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-600 font-medium" data-unique-id="26501a70-353d-4ae8-bf4f-81284763b3e1" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="f09dbf04-f316-4679-bec4-716b606d65b6" data-file-name="components/customer-management.tsx">Confirm</span></span>
                      </button>
                      <button onClick={() => setShowConfirmDelete(null)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" title="Cancel" data-unique-id="6d5251fc-6244-4b2e-9921-73d146bed3fc" data-file-name="components/customer-management.tsx">
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div> : <>
                      <button onClick={() => startEdit(customer)} className="p-1 rounded-md hover:bg-accent/20" title="Edit customer" data-unique-id="42ac1bf1-56fe-42ac-8e7d-321932a98218" data-file-name="components/customer-management.tsx">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => confirmDelete(customer.id)} className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 transition-colors flex items-center space-x-1" title="Delete customer data" data-unique-id="6be0fa4a-c62c-4cda-a012-2b9b376f15da" data-file-name="components/customer-management.tsx">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 inline" data-unique-id="20391953-87b6-43f9-8972-04a7ae4d83c4" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="e18962a9-adff-4045-b508-840def4eaaca" data-file-name="components/customer-management.tsx">Remove</span></span>
                      </button>
                    </>}
                </div>
              </div>)}
        </div>
      </div>
      
      {/* Selection actions */}
      {selectedCustomers.length > 0 && <div className="flex items-center justify-between mt-4 p-3 bg-accent/5 rounded-md" data-unique-id="77a53b56-3547-4302-8f46-60cb1b074309" data-file-name="components/customer-management.tsx">
          <div data-unique-id="a7a3af17-6444-41e9-9985-ae1deaa7c4a1" data-file-name="components/customer-management.tsx">
            <span className="font-medium" data-unique-id="b87a585c-b45d-4f20-9694-b74e3bfddb39" data-file-name="components/customer-management.tsx" data-dynamic-text="true">{selectedCustomers.length}</span><span className="editable-text" data-unique-id="53a66486-bbb1-4e7a-ad08-ea4a79e1693e" data-file-name="components/customer-management.tsx"> customers selected
          </span></div>
          <div className="flex space-x-2" data-unique-id="26cec009-4d6a-4608-9269-f2ec0ff91fde" data-file-name="components/customer-management.tsx">
            <button onClick={() => setSelectedCustomers([])} className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent/10" data-unique-id="7c1a1772-9178-41c1-bb1e-a7cf9355050d" data-file-name="components/customer-management.tsx"><span className="editable-text" data-unique-id="cdcf3abc-a37e-40fd-bf9c-9949fe94494b" data-file-name="components/customer-management.tsx">
              Clear Selection
            </span></button>
            <button onClick={exportCustomersCSV} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90" data-unique-id="cb926568-dd33-4edc-baf9-7d94c115f746" data-file-name="components/customer-management.tsx">
              <Download className="h-3 w-3 inline mr-1" /><span className="editable-text" data-unique-id="f2acc5d0-02ea-4459-9286-abc251bc5c19" data-file-name="components/customer-management.tsx">
              Export Selected
            </span></button>
          </div>
        </div>}
    </motion.div>;
}