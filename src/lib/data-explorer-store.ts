'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';

// Define the action entry interface based on our data structure
interface ActionEntry {
  id: string;
  date: string;
  orderId: string;
  parts: string;
  sku: string;
  trackingNumber: string;
  pushPull: 'Push' | 'Pull';
  agentName: string;
  whAction: string;
  notes: string;
  urgent: boolean;
  createdAt: string;
}

// Define the Item interface for the store
interface Item {
  id: string;
  date: string;
  orderId: string;
  parts: string;
  sku: string;
  trackingNumber: string;
  pushPull: 'Push' | 'Pull';
  agentName: string;
  whAction: string;
  notes: string;
  urgent: boolean;
  createdAt: string;
  // Legacy fields for backward compatibility
  customer?: string;
  team?: string;
  owner?: string;
  progress?: string;
  type?: string;
}

// Define filter criteria type
interface FilterCriteria {
  search?: string;
  customer?: string;
  team?: string;
  owner?: string;
  pushPull?: string;
  type?: string;
  progress?: string;
  category?: string;
  status?: string;
  priceRange?: string;
}

// Define summary statistics
interface SummaryData {
  totalEntries: number;
  pushCount: number;
  pullCount: number;
  teamSummary: Record<string, { push: number; pull: number }>;
  progressSummary: Record<string, number>;
}

// Define the store state
interface DataExplorerState {
  allItems: Item[];
  filteredItems: Item[];
  selectedItem: Item | null;
  filterCriteria: FilterCriteria;
  categories: string[];
  statusOptions: string[];
  priceRanges: { label: string; value: string }[];
  
  // Actions
  setSelectedItem: (item: Item | null) => void;
  applyFilter: (filter: FilterCriteria) => void;
  clearFilters: () => void;
  resetStore: () => void;
  getSummary: () => SummaryData;
  importFromExcel: (data: any[]) => void;
}

// Sample data for the application
const generateSampleItems = (): Item[] => {
  const agentNames = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Chen', 'David Wilson'];
  const whActions = ['Order Processing', 'Inventory Check', 'Shipping Prep', 'Quality Control', 'Returns Processing'];
  const partsList = ['Brake Pads', 'Oil Filter', 'Air Filter', 'Spark Plugs', 'Timing Belt'];
  const skuList = ['BP-001', 'OF-234', 'AF-567', 'SP-890', 'TB-123'];
  
  const sampleNotes = [
    'Customer requested expedited shipping for urgent repair',
    'Technical consultation provided for installation guidance',
    'Quality concern addressed with replacement part sent',
    'Follow-up call scheduled for next week',
    'Installation instructions emailed to customer',
    'Warranty claim processed successfully',
    'Customer satisfaction survey completed',
    'Product feedback collected for improvement'
  ];
  
  return Array.from({ length: 50 }, (_, i) => {
    // Create date within the last year
    const dateOffset = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - dateOffset);
    
    return {
      id: uuidv4(),
      date: date.toISOString().split('T')[0],
      orderId: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
      parts: partsList[Math.floor(Math.random() * partsList.length)],
      sku: skuList[Math.floor(Math.random() * skuList.length)],
      trackingNumber: `TRK${Math.floor(Math.random() * 900000000) + 100000000}`,
      pushPull: Math.random() > 0.5 ? 'Push' : 'Pull',
      agentName: agentNames[Math.floor(Math.random() * agentNames.length)],
      whAction: whActions[Math.floor(Math.random() * whActions.length)],
      notes: sampleNotes[Math.floor(Math.random() * sampleNotes.length)],
      urgent: Math.random() > 0.7,
      createdAt: date.toISOString()
    };
  });
};

// Initialize the store with persisted state using Zustand
export const useDataExplorerStore = create<DataExplorerState>()(
  persist(
    (set, get) => ({
      allItems: generateSampleItems(),
      filteredItems: generateSampleItems(),
      selectedItem: null,
      filterCriteria: {},
      
      // Extract unique categories from items
      categories: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports'],
      
      // Status options for filtering
      statusOptions: ['Available', 'Limited', 'Out of stock'],
      
      // Price range options for filtering
      priceRanges: [
        { label: 'Under $50', value: 'under-50' },
        { label: '$50 - $100', value: '50-100' },
        { label: '$100 - $200', value: '100-200' },
        { label: '$200 - $300', value: '200-300' },
        { label: 'Over $300', value: 'over-300' },
      ],
      
      // Set the selected item
      setSelectedItem: (item) => set({ selectedItem: item }),
      
      // Apply filter to items
      applyFilter: (newFilter) => {
        // Get current state
        const { allItems, filterCriteria } = get();
        
        // Merge new filter with existing criteria
        const updatedFilter = { ...filterCriteria, ...newFilter };
        
        // Filter items based on criteria
        const filtered = allItems.filter(item => {
          // Text search filter
          if (updatedFilter.search && 
              !item.customer.toLowerCase().includes(updatedFilter.search.toLowerCase()) &&
              !item.notes.toLowerCase().includes(updatedFilter.search.toLowerCase())) {
            return false;
          }
          
          // Team filter (using team instead of category)
          if (updatedFilter.category && item.team !== updatedFilter.category) {
            return false;
          }
          
          // Progress filter (using progress instead of status)
          if (updatedFilter.status && item.progress !== updatedFilter.status) {
            return false;
          }
          
          // Type filter (using type instead of priceRange)
          if (updatedFilter.priceRange && item.type !== updatedFilter.priceRange) {
            return false;
          }
          
          return true;
        });
        
        // Update state with filtered items and filter criteria
        set({ 
          filteredItems: filtered,
          filterCriteria: updatedFilter
        });
      },
      
      // Clear all filters
      clearFilters: () => {
        set({
          filteredItems: get().allItems,
          filterCriteria: {}
        });
      },
      
      // Reset the entire store to initial state
      resetStore: () => {
        const initialItems = generateSampleItems();
        set({
          allItems: initialItems,
          filteredItems: initialItems,
          selectedItem: null,
          filterCriteria: {}
        });
      },
      
      // Get summary statistics
      getSummary: () => {
        const { filteredItems } = get();
        const totalEntries = filteredItems.length;
        const pushCount = 0; // Not applicable for items
        const pullCount = 0; // Not applicable for items
        const teamSummary: Record<string, { push: number; pull: number }> = {};
        const progressSummary: Record<string, number> = {};
        
        // Group by agent for summary
        filteredItems.forEach(item => {
          if (!teamSummary[item.agentName]) {
            teamSummary[item.agentName] = { push: 0, pull: 0 };
          }
          if (item.pushPull === 'Push') {
            teamSummary[item.agentName].push += 1;
          } else {
            teamSummary[item.agentName].pull += 1;
          }
          
          // WH Action summary
          progressSummary[item.whAction] = (progressSummary[item.whAction] || 0) + 1;
        });
        
        return {
          totalEntries,
          pushCount,
          pullCount,
          teamSummary,
          progressSummary
        };
      },
      
      // Import data from Excel
      importFromExcel: (data: any[]) => {
        // Convert Excel data to Item format
        const newItems: Item[] = data.map((row, index) => ({
          id: `excel-${Date.now()}-${index}`,
          date: row.Date || row.date || new Date().toISOString().split('T')[0],
          orderId: row['Order ID'] || row.orderId || `ORD-${index + 1}`,
          parts: row.Parts || row.parts || '',
          sku: row.SKU || row.sku || '',
          trackingNumber: row['Tracking number'] || row.trackingNumber || '',
          pushPull: (row['Push & Pull'] || row.pushPull || 'Push') as 'Push' | 'Pull',
          agentName: row['Agent name'] || row.agentName || '',
          whAction: row['WH action'] || row.whAction || '',
          notes: row.Notes || row.notes || '',
          urgent: Boolean(row.URGENT || row.urgent || false),
          createdAt: new Date().toISOString()
        }));
        
        // Add to existing items
        const { allItems } = get();
        const updatedItems = [...allItems, ...newItems];
        
        set({
          allItems: updatedItems,
          filteredItems: updatedItems
        });
      }
    }),
    {
      name: 'data-explorer-storage',
      partialize: (state) => ({
        // Only persist these properties
        filterCriteria: state.filterCriteria,
        selectedItem: state.selectedItem
      })
    }
  )
);
