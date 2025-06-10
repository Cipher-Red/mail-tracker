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
  const renderFilterSection = (title: string, key: keyof typeof expandedSections, options: string[], currentValue: string, filterType: string) => <div className="mb-4 border-t border-border pt-3" data-unique-id="624e57d8-30bb-4718-bb8e-266bb31359bb" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
      <button onClick={() => toggleSection(key)} className="flex items-center justify-between w-full text-left mb-2" data-unique-id="e23b41c2-9f79-4a93-ad75-968bc21a5e62" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
        <span className="font-medium" data-unique-id="e97c1b80-9b3c-4444-ad88-19fab27e2f73" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{title}</span>
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
    }} className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="76c11920-fb3e-4d43-97d4-b4cab1fa10f1" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <div onClick={() => handleFilterChange(filterType, '')} className={`flex items-center cursor-pointer p-2 rounded-md hover:bg-accent/50 ${!currentValue ? 'bg-primary/10 text-primary' : ''}`} data-unique-id="cc36a8e3-8fb2-41e6-8399-b1ffcd0756df" data-file-name="components/data-explorer/filter-panel.tsx">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!currentValue ? 'border-primary' : 'border-muted-foreground'}`} data-unique-id="8cdf981d-d37b-4a39-ab65-cab4fe53ba83" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
              {!currentValue && <Check className="h-3 w-3 text-primary" />}
            </div>
            <span className="ml-2" data-unique-id="343d129e-b6f9-463e-9412-6fdffe6fb7be" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b6362c28-8839-44c7-b728-40c59593bf7f" data-file-name="components/data-explorer/filter-panel.tsx">All </span>{title}</span>
          </div>

          {options.map(option => <div key={option} onClick={() => handleFilterChange(filterType, option)} className={`flex items-center cursor-pointer p-2 rounded-md hover:bg-accent/50 ${currentValue === option ? 'bg-primary/10 text-primary' : ''}`} data-unique-id="523dcf3b-6a63-4081-88dd-53dccfa3a655" data-file-name="components/data-explorer/filter-panel.tsx">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${currentValue === option ? 'border-primary' : 'border-muted-foreground'}`} data-unique-id="e80ba7e1-1cc6-45f8-923b-422af0335750" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
                {currentValue === option && <Check className="h-3 w-3 text-primary" />}
              </div>
              <span className="ml-2" data-unique-id="770574c8-29ed-46b2-8fcd-a204aa46ae6b" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{option}</span>
            </div>)}
        </motion.div>}
    </div>;
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="bg-card p-4 rounded-lg shadow-md border border-border" data-unique-id="28263957-51bb-45da-9065-3fd74dc7ef17" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center mb-4" data-unique-id="ec140c85-f382-448d-8a19-56f1ea39c2f4" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
        <h2 className="text-lg font-medium flex items-center" data-unique-id="2762bc74-36a8-4383-ad60-7cd3136c7836" data-file-name="components/data-explorer/filter-panel.tsx">
          <Filter className="h-4 w-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="4f407b06-28fe-4325-8795-619b44444873" data-file-name="components/data-explorer/filter-panel.tsx">
          Filters
        </span></h2>
        {Object.keys(filterCriteria).length > 0 && <button onClick={handleClearFilters} className="text-xs flex items-center text-muted-foreground hover:text-primary" data-unique-id="7c1b4d4d-57fa-4ffe-b7dd-f4bbe48f0838" data-file-name="components/data-explorer/filter-panel.tsx">
            <FilterX className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="5a8ac165-de5b-49ab-b2c6-c026c1c16f6e" data-file-name="components/data-explorer/filter-panel.tsx">
            Clear All
          </span></button>}
      </div>

      {/* Summary Stats */}
      <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200" data-unique-id="cec09fb2-3e55-4b08-8f64-bcc67b834186" data-file-name="components/data-explorer/filter-panel.tsx">
        <div className="flex items-center mb-2" data-unique-id="af59b4cc-6646-494d-86fb-01be6f3bd9d8" data-file-name="components/data-explorer/filter-panel.tsx">
          <BarChart3 className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800" data-unique-id="c7f75cf7-b5f6-4eb4-885f-5faa91c626ad" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="ccf5763d-9f1e-44ad-bcda-69778f56e642" data-file-name="components/data-explorer/filter-panel.tsx">Quick Stats</span></span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs" data-unique-id="d5909456-07f4-46b2-96a8-5a1ef845c1bd" data-file-name="components/data-explorer/filter-panel.tsx">
          <div className="text-blue-700" data-unique-id="27d7a48c-9f76-4276-9d1b-1a7cef978427" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="4597a374-fd82-4783-b575-5be932afcecc" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{summary.totalEntries}</span><span className="editable-text" data-unique-id="73683ded-961d-4ff7-a8bb-201bf9709946" data-file-name="components/data-explorer/filter-panel.tsx"> Total
          </span></div>
          <div className="text-green-700" data-unique-id="5ff94559-7c47-4360-9dfb-2d47104355f7" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="acb2311f-d2b8-457e-8efd-656cafe3ee54" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{uniqueCategories.length}</span><span className="editable-text" data-unique-id="2242710e-5708-4a87-b471-8bdc6402029a" data-file-name="components/data-explorer/filter-panel.tsx"> Categories
          </span></div>
          <div className="text-purple-700" data-unique-id="ae956881-abf2-457d-955c-c97eee849420" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="ed326430-233f-400b-9c75-8501be924cf0" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{uniqueStatuses.length}</span><span className="editable-text" data-unique-id="f2ec1a2e-cffa-432c-9b35-d7f92ed9cb5e" data-file-name="components/data-explorer/filter-panel.tsx"> Status Types
          </span></div>
          <div className="text-orange-700" data-unique-id="cfd22eda-c961-4615-9eeb-2263116144a6" data-file-name="components/data-explorer/filter-panel.tsx">
            <span className="font-medium" data-unique-id="54ffe0f4-9b71-47f8-a5bb-a289d65cbf6b" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{allItems.length}</span><span className="editable-text" data-unique-id="77c923be-5a14-45cf-872c-04ac1e5b6c3a" data-file-name="components/data-explorer/filter-panel.tsx"> Items
          </span></div>
        </div>
      </div>
      
      {/* Search Input */}
      <div className="mb-4" data-unique-id="cc9c53d4-12d1-402c-8f94-e9fac1d874ce" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="112049b3-461e-4fb9-80b5-9fc980036f8d" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="60a292df-75d3-46df-95e4-8e90ff9916b0" data-file-name="components/data-explorer/filter-panel.tsx">Search</span></label>
        <div className="relative" data-unique-id="4a4ecf0d-db32-40b0-8817-1bbfc1fc7aa1" data-file-name="components/data-explorer/filter-panel.tsx">
          <input type="text" value={searchTerm} onChange={e => {
          setSearchTerm(e.target.value);
          handleFilterChange('search', e.target.value);
        }} placeholder="Search items..." className="w-full px-3 py-2 border border-border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="36724ffb-cec1-4ac1-a8b1-f7290ca037db" data-file-name="components/data-explorer/filter-panel.tsx" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4" data-unique-id="b78d77fc-4eb1-42c0-b3b0-524af553e4ce" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="054aafcd-f82c-4902-90e2-262085b5bf52" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="47a5a1ec-e90e-45b4-acdb-110d97b5352c" data-file-name="components/data-explorer/filter-panel.tsx">Category</span></label>
        <select value={customer} onChange={e => handleFilterChange('category', e.target.value)} className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="09a023d8-eddc-41f0-839c-75aadff221b3" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <option value="" data-unique-id="953246b3-1983-4527-89f5-a52a0b59d47e" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="dc813d8a-c294-45a1-8898-4612690ef16c" data-file-name="components/data-explorer/filter-panel.tsx">All Categories</span></option>
          {uniqueCategories.map(category => <option key={category} value={category} data-unique-id="ad5b5aaa-08fa-4827-8198-be5a579a834f" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{category}</option>)}
        </select>
      </div>

      {/* Status Filter */}
      <div className="mb-4" data-unique-id="4a0612e1-5b1c-47db-b82f-d8585a8effe0" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="7e6e9790-7b5c-4fc3-9221-34019cf95290" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="a2719367-14a3-4195-819f-cc28846248ef" data-file-name="components/data-explorer/filter-panel.tsx">Status</span></label>
        <select value={team} onChange={e => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="22a3cfbe-7932-4ee9-8e66-802a828bd69a" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <option value="" data-unique-id="b3b3ca97-fc67-4ef2-8bd6-9e736214ccf4" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="4f37dcc5-f386-4f35-8ae2-59ef5f33234e" data-file-name="components/data-explorer/filter-panel.tsx">All Status</span></option>
          {uniqueStatuses.map(status => <option key={status} value={status} data-unique-id="d3228190-9e43-4d41-9b80-3c1961acb126" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{status}</option>)}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4" data-unique-id="a4f0506d-5577-4a25-bd1b-16a829eea937" data-file-name="components/data-explorer/filter-panel.tsx">
        <label className="block text-sm font-medium mb-1" data-unique-id="8ec1a33f-8156-4346-a7e0-0e8cef763a13" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="a791ad9b-afa2-4950-aee4-52ac5ccf58e0" data-file-name="components/data-explorer/filter-panel.tsx">Price Range</span></label>
        <select value={owner} onChange={e => handleFilterChange('priceRange', e.target.value)} className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="20508e0a-88fd-4859-954d-c2dadccb7ece" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          <option value="" data-unique-id="3d1fd613-4837-48b8-b7b6-08d38dd448dd" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="68e9f17c-821d-4dcc-91fc-ffc54f284f45" data-file-name="components/data-explorer/filter-panel.tsx">All Prices</span></option>
          {priceRanges.map(range => <option key={range.value} value={range.value} data-unique-id="23c85e0b-88ee-4f32-b17d-4067cf33d5cd" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">{range.label}</option>)}
        </select>
      </div>
      
      <div className="pt-3 border-t border-border" data-unique-id="547681ed-2846-456f-a689-ede9368f922c" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
        <p className="text-xs text-muted-foreground" data-unique-id="34c8fa8c-a62a-4cb1-ad6f-617223365d17" data-file-name="components/data-explorer/filter-panel.tsx" data-dynamic-text="true">
          {Object.keys(filterCriteria).length === 0 ? "No filters applied" : `${Object.keys(filterCriteria).length} filter${Object.keys(filterCriteria).length > 1 ? 's' : ''} applied`}
        </p>
        {Object.keys(filterCriteria).length > 0 && <button onClick={handleClearFilters} className="mt-2 text-xs text-primary hover:underline" data-unique-id="726ee9d5-4523-4487-8e2c-79e862de2a48" data-file-name="components/data-explorer/filter-panel.tsx"><span className="editable-text" data-unique-id="1b1bb046-2319-49e3-8391-ec848b4dd7ff" data-file-name="components/data-explorer/filter-panel.tsx">
            Clear All Filters
          </span></button>}
      </div>
    </motion.div>;
}