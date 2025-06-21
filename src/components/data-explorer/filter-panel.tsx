'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDataExplorerStore } from '@/lib/data-explorer-store';
import { FilterX, Search, Filter, ChevronDown, ChevronUp, Check, BarChart3 } from 'lucide-react';
export default function FilterPanel() {
  const store = useDataExplorerStore();

  // Safely destructure with fallbacks
  const {
    applyFilter,
    clearFilters,
    filterCriteria = {},
    allItems = [],
    filteredItems = [],
    categories = [],
    statusOptions = [],
    priceRanges = []
  } = store || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState('');
  const [team, setTeam] = useState('');
  const [owner, setOwner] = useState('');
  const [pushPull, setPushPull] = useState('');
  const [type, setType] = useState('');
  const [progress, setProgress] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    customer: true,
    team: true,
    owner: false,
    pushPull: true,
    type: false,
    progress: false
  });

  // Initialize local state from store on mount
  useEffect(() => {
    setSearchTerm(filterCriteria.search || '');
    setCustomer(filterCriteria.customer || '');
    setTeam(filterCriteria.team || '');
    setOwner(filterCriteria.owner || '');
    setPushPull(filterCriteria.pushPull || '');
    setType(filterCriteria.type || '');
    setProgress(filterCriteria.progress || '');
  }, [filterCriteria]);
  const handleSearch = () => {
    applyFilter({
      search: searchTerm
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const handleFilterChange = (filterType: string, value: string) => {
    if (!applyFilter) return;
    const newFilter = {
      ...filterCriteria
    };
    switch (filterType) {
      case 'category':
        setCustomer(value);
        newFilter.category = value;
        break;
      case 'status':
        setTeam(value);
        newFilter.status = value;
        break;
      case 'priceRange':
        setOwner(value);
        newFilter.priceRange = value;
        break;
      case 'search':
        setSearchTerm(value);
        newFilter.search = value;
        break;
    }
    applyFilter(newFilter);
  };
  const handleClearFilters = () => {
    setSearchTerm('');
    setCustomer('');
    setTeam('');
    setOwner('');
    setPushPull('');
    setType('');
    setProgress('');
    clearFilters();
  };
  // Get unique values from items for filters
  const uniqueCategories = Array.from(new Set(allItems.map(item => item.team || item.whAction))).filter(Boolean);
  const uniqueStatuses = Array.from(new Set(allItems.map(item => item.progress || 'In Progress'))).filter(Boolean);

  // Create summary data
  const summary = {
    totalEntries: filteredItems.length,
    pushCount: 0,
    pullCount: 0,
    teamSummary: {},
    progressSummary: {}
  };
  const renderFilterSection = (title: string, key: keyof typeof expandedSections, options: string[], currentValue: string, filterType: string) => <div className="mb-4 border-t border-border pt-3" data-unique-id="b6d8b829-c38d-49f8-b7e5-61f3c8ebe2df" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
      <button onClick={() => toggleSection(key)} className="flex items-center justify-between w-full text-left mb-2" data-unique-id="c5b3c35f-67d3-4e05-8565-b1bdf2a06703" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
        <span className="font-medium" data-unique-id="095a556a-ef73-47d1-a076-41a12d6c3d8f" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{title}</span>
        {expandedSections[key] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expandedSections[key] && <motion.div initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: 'auto'
    }} exit={{
      opacity: 0,
      height: 0
    }} className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="efbcbe6c-3e59-43e5-a223-722e44809900" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <div onClick={() => handleFilterChange(filterType, '')} className={`flex items-center cursor-pointer p-2 rounded-md hover:bg-accent/50 ${!currentValue ? 'bg-primary/10 text-primary' : ''}`} data-unique-id="414ae78a-aad1-42f5-9bd2-a231230f90ac" data-file-name="components/data-explorer/filter-panel.tsx">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!currentValue ? 'border-primary' : 'border-muted-foreground'}`} data-unique-id="fb0d1aeb-eb19-421a-a1fe-88ddb03dcd92" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
              {!currentValue && <Check className="h-3 w-3 text-primary" />}
            </div>
            <span className="ml-2" data-unique-id="75fba9c5-472a-45cd-941a-7b97cf6c21f2" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7231ed0f-2798-4e81-8414-31f3b5af5b17" data-file-name="components/data-explorer/filter-panel.tsx">All </span>{title}</span>
          </div>

          {options.map(option => <div key={option} onClick={() => handleFilterChange(filterType, option)} className={`flex items-center cursor-pointer p-2 rounded-md hover:bg-accent/50 ${currentValue === option ? 'bg-primary/10 text-primary' : ''}`} data-unique-id="b213e453-e33e-4f66-bc06-6344883e595a" data-file-name="components/data-explorer/filter-panel.tsx">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${currentValue === option ? 'border-primary' : 'border-muted-foreground'}`} data-unique-id="d358cbcb-d294-4459-8f67-bc9a63fa0d64" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
                {currentValue === option && <Check className="h-3 w-3 text-primary" />}
              </div>
              <span className="ml-2" data-unique-id="16bb39a4-25f8-4b58-8502-2827cd93281f" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{option}</span>
            </div>)}
        </motion.div>}
    </div>;
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="bg-card p-4 rounded-lg shadow-md border border-border" data-unique-id="5366d582-e6e8-465c-ab56-8b54e88d2678" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-4" data-unique-id="483045aa-9a3c-4751-a6b7-91e1f906a9a6" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
        <h2 className="text-lg font-medium flex items-center" data-unique-id="303c0d6b-7f07-44cb-b6dd-26f0e0a9961e" data-file-name="components/data-explorer/filter-panel.tsx">
          <Filter className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="52b8ed66-c629-4dde-ac21-8ce6794382c3" data-file-name="components/data-explorer/filter-panel.tsx">
          Filters
        </span></h2>
        {Object.keys(filterCriteria).length > 0 && <button onClick={handleClearFilters} className="text-xs flex items-center text-muted-foreground hover:text-primary" data-unique-id="e910ecf5-b1b4-4ca4-a1ff-533784abe8c3" data-file-name="components/data-explorer/filter-panel.tsx">
            <FilterX className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="a97ac608-e236-4873-b437-bcf9f71db99f" data-file-name="components/data-explorer/filter-panel.tsx">
            Clear All
          </span></button>}
      </div>

      {/* Summary Stats */}
      <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200" data-unique-id="8a8c8ddd-a056-484f-976e-e6cd21466c4b" data-file-name="components/data-explorer/filter-panel.tsx">
        <div className="flex items-center mb-2" data-unique-id="0741fa42-8a48-44de-84da-745902a42f9e" data-file-name="components/data-explorer/filter-panel.tsx">
          <BarChart3 className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800" data-unique-id="320e183a-efd1-49e7-b0e0-e68278764d06" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="0ba4c341-f70d-4529-b769-195941af0f11" data-file-name="components/data-explorer/filter-panel.tsx">Quick Stats</span></span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs" data-unique-id="63350ab3-defd-4a65-858a-33c2fac63f5b" data-file-name="components/data-explorer/filter-panel.tsx">
          <div className="text-blue-700" data-unique-id="1ce885c3-5130-41a3-92ac-3842d6081a5b" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="e66d11b4-0d98-4952-8780-09e5effa11ed" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{summary.totalEntries}</span><span className="editable-text" data-unique-id="8d3c47b0-560d-4714-a1cd-47c44531fa64" data-file-name="components/data-explorer/filter-panel.tsx"> Total
          </span></div>
          <div className="text-green-700" data-unique-id="7a57c6d4-5641-45d0-a5c7-05c5cd211f78" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="b28345ef-77d8-483e-a426-85b4d02176ba" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{uniqueCategories.length}</span><span className="editable-text" data-unique-id="4ca5774f-eb93-4924-8d07-711f2009892e" data-file-name="components/data-explorer/filter-panel.tsx"> Categories
          </span></div>
          <div className="text-purple-700" data-unique-id="47b151f7-f80f-4b4c-aeaa-7b13b45c148e" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="98deb707-4e09-4d2b-b6ae-2f03d0f7382e" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{uniqueStatuses.length}</span><span className="editable-text" data-unique-id="23d499b0-d1ab-4584-8667-8474ceb33039" data-file-name="components/data-explorer/filter-panel.tsx"> Status Types
          </span></div>
          <div className="text-orange-700" data-unique-id="3f615daf-4379-4599-884e-0a53a94787fd" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="4dd652f6-4915-45e9-8aba-097e93163e73" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{allItems.length}</span><span className="editable-text" data-unique-id="1d711126-52f5-492f-92d2-8d82626621e8" data-file-name="components/data-explorer/filter-panel.tsx"> Items
          </span></div>
        </div>
      </div>
      
      {/* Search Input */}
      <div className="mb-4" data-unique-id="34fb20ce-6070-4724-965b-1619a5d69e20" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="ed0f65ec-ee58-4b8a-aa54-8cdb4b6ae73a" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="f5b96021-ec1b-4517-9fd2-51ada138e7f7" data-file-name="components/data-explorer/filter-panel.tsx">Search</span></label>
        <div className="relative" data-unique-id="6d065ecc-c5fd-4a76-a6a6-a9041a2e4313" data-file-name="components/data-explorer/filter-panel.tsx">
          <input type="text" value={searchTerm} onChange={e => {
          setSearchTerm(e.target.value);
          handleFilterChange('search', e.target.value);
        }} placeholder="Search items..." className="w-full px-3 py-2 border border-border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="7692964f-3721-43de-babf-5353231792d1" data-file-name="components/data-explorer/filter-panel.tsx" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4" data-unique-id="50a81c22-16b3-4080-b67b-d1aef14f5392" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="483e0195-042d-4ef8-b8cf-522e1ab370ca" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="8ac16f0b-627a-402f-832e-31c8424b1f7c" data-file-name="components/data-explorer/filter-panel.tsx">Category</span></label>
        <select value={customer} onChange={e => handleFilterChange('category', e.target.value)} className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="82e0fbf8-89f3-4190-8692-564a00596caa" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <option value="" data-unique-id="8946856f-0c85-4bdc-9cad-cc1f22496df8" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="748492e0-8223-41a1-8cee-22c55bd400ac" data-file-name="components/data-explorer/filter-panel.tsx">All Categories</span></option>
          {uniqueCategories.map(category => <option key={category} value={category} data-unique-id="ae8f7feb-b208-453c-a85b-86f4e4fa2833" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{category}</option>)}
        </select>
      </div>

      {/* Status Filter */}
      <div className="mb-4" data-unique-id="0fc43085-451f-4006-92d0-13f998bf3df1" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="4a532d47-c6aa-49a1-8dda-c80f8e7af969" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="f8b43c5b-275c-4144-8ead-f0e892f19061" data-file-name="components/data-explorer/filter-panel.tsx">Status</span></label>
        <select value={team} onChange={e => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="aee0103a-8916-46ed-accf-3f50b6f2edbf" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <option value="" data-unique-id="10fb0d9d-4e3a-4591-bec9-89587dee50db" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="288273cd-95e8-4340-b16d-af9638172af0" data-file-name="components/data-explorer/filter-panel.tsx">All Status</span></option>
          {uniqueStatuses.map(status => <option key={status} value={status} data-unique-id="ce8762b1-0334-4b1d-98c6-c282f536dd82" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{status}</option>)}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4" data-unique-id="5fdb0852-c18a-4857-baba-4b66123e67c0" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="ec7bc8d1-e8e6-4699-9dc5-71e47513ca1c" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="a731e8bf-2a94-4b9f-8093-e0718d70dfb3" data-file-name="components/data-explorer/filter-panel.tsx">Price Range</span></label>
        <select value={owner} onChange={e => handleFilterChange('priceRange', e.target.value)} className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="9e3ff922-856c-47db-8e48-60f59127aef6" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <option value="" data-unique-id="7d97e161-f817-4ae0-ac3f-3b6524bed112" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="6ffbbfe7-e207-474c-8bee-871bd1c1beca" data-file-name="components/data-explorer/filter-panel.tsx">All Prices</span></option>
          {priceRanges.map(range => <option key={range.value} value={range.value} data-unique-id="46cc7610-99f2-45d8-a9b2-1e677b5481ae" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{range.label}</option>)}
        </select>
      </div>
      
      <div className="pt-3 border-t border-border" data-unique-id="ab121db8-dd31-430b-8b3f-8f676a077545" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
        <p className="text-xs text-muted-foreground" data-unique-id="9c8e7bd7-0dd6-4701-bb14-a56b6ebd113e" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          {Object.keys(filterCriteria).length === 0 ? "No filters applied" : `${Object.keys(filterCriteria).length} filter${Object.keys(filterCriteria).length > 1 ? 's' : ''} applied`}
        </p>
        {Object.keys(filterCriteria).length > 0 && <button onClick={handleClearFilters} className="mt-2 text-xs text-primary hover:underline" data-unique-id="01701a15-6655-44de-8958-32b43ed4b1db" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="4146be32-6410-4429-af56-a1709fe9b3e7" data-file-name="components/data-explorer/filter-panel.tsx">
            Clear All Filters
          </span></button>}
      </div>
    </motion.div>;
}