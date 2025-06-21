'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTable, useSortBy, useFilters, usePagination, useGlobalFilter } from 'react-table';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { CleanedOrderData } from './order-data-processor';
interface DataTableProps {
  data: CleanedOrderData[];
  onRowClick?: (row: CleanedOrderData) => void;
  actionColumn?: (row: CleanedOrderData) => React.ReactNode;
  renderCell?: (key: string, value: any, row: CleanedOrderData) => React.ReactNode | null;
}
export default function DataTable({
  data,
  onRowClick,
  actionColumn,
  renderCell
}: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const columns = useMemo(() => [{
    Header: 'Order #',
    accessor: 'customerOrderNumber',
    width: 150,
    Cell: ({
      value,
      row
    }: {
      value: string;
      row: any;
    }) => {
      // Updated ShipStation link format
      const orderLink = `https://ship.shipstation.com/orders/all-orders-search-result?quickSearch=${value}`;

      // Handle copy to clipboard
      const copyOrderNumber = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(value).then(() => {
            toast.success(`Order #${value} copied to clipboard!`, {
              duration: 2000
            });
            setCopiedValue(value);
            setTimeout(() => setCopiedValue(null), 2000);
          }).catch(err => {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy order number');
          });
        }
      };
      return <div className="flex items-center gap-1" data-unique-id="8e72d679-674f-48fd-bec4-1146978e70a5" data-file-name="components/data-table.tsx">
          <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="97ebcf74-ac90-4a1a-bf02-8e1bc66bd6e9" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value}
          </a>
          <button onClick={copyOrderNumber} className="p-1 rounded-full hover:bg-accent/20 text-muted-foreground" title="Copy order number" data-unique-id="213266ed-e1cf-4022-925c-f793d06995c1" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {copiedValue === value ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>;
    }
  }, {
    Header: 'Customer',
    accessor: 'shipToName'
  }, {
    Header: 'Email',
    accessor: 'shipToEmail',
    Cell: ({
      value
    }: {
      value: string;
    }) => value || 'Not provided'
  }, {
    Header: 'Address',
    accessor: 'shipToLine1',
    Cell: ({
      row
    }: {
      row: any;
    }) => <div data-unique-id="f5f83550-1976-41fd-a6bd-77b7ad9adf38" data-file-name="components/data-table.tsx">
            <div data-unique-id="d81ab46d-66c7-4742-b162-2782b5621f5f" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
            <div data-unique-id="36a6fdbf-795f-4f41-9de3-0c2e671c3970" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="04f51c71-9e43-465f-9021-33c385b7cf40" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
          </div>
  }, {
    Header: 'Phone',
    accessor: 'shipToPhone'
  }, {
    Header: 'Order Total',
    accessor: 'orderTotal',
    Cell: ({
      value
    }: {
      value: number;
    }) => `$${value.toFixed(2)}`
  }, {
    Header: 'Ship Date',
    accessor: 'actualShipDate',
    Cell: ({
      value
    }: {
      value: string;
    }) => new Date(value).toLocaleDateString()
  }, {
    Header: 'Tracking #',
    accessor: 'trackingNumbers',
    Cell: ({
      value,
      row
    }: {
      value: string[];
      row: {
        original: CleanedOrderData;
      };
    }) => {
      if (renderCell) {
        const customRendering = renderCell('trackingNumbers', value, row.original);
        if (customRendering !== null) {
          return customRendering;
        }
      }
      return <div className="space-y-1" data-unique-id="f183b9b7-e023-4850-b444-c9308c4f03cb" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="2511bd21-92a5-4055-9c60-1679bf1e9f5c" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {num.length > 15 ? `${num.slice(0, 15)}...` : num}
              </div>)}
          </div>;
    }
  }, {
    Header: 'Source',
    accessor: 'orderSource'
  }, actionColumn && {
    Header: 'Actions',
    id: 'actions',
    Cell: ({
      row
    }: {
      row: any;
    }) => actionColumn(row.original)
  }].filter(Boolean), [actionColumn, renderCell]);
  // Get stored page state from localStorage or use default
  const getStoredPageState = () => {
    if (typeof window === 'undefined') return {
      pageIndex: 0,
      pageSize: 10
    };
    try {
      let storedState = null;
      // Safe access to localStorage
      if (typeof window !== 'undefined') {
        storedState = localStorage.getItem('dataTablePageState');
      }
      return storedState ? JSON.parse(storedState) : {
        pageIndex: 0,
        pageSize: 10
      };
    } catch (error) {
      console.error('Error reading page state from localStorage:', error);
      return {
        pageIndex: 0,
        pageSize: 10
      };
    }
  };
  const initialState = getStoredPageState();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter: setTableGlobalFilter,
    state: {
      pageIndex,
      pageSize
    }
  } = useTable({
    columns,
    data,
    initialState
  }, useFilters, useGlobalFilter, useSortBy, usePagination);

  // Save page state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dataTablePageState', JSON.stringify({
          pageIndex,
          pageSize
        }));
      } catch (error) {
        console.error('Error saving page state to localStorage:', error);
      }
    }
  }, [pageIndex, pageSize]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    setGlobalFilter(value);
    setTableGlobalFilter(value);
  };
  return <div className="w-full overflow-x-auto rounded-md border border-border shadow-md" data-unique-id="ce8afb58-626f-44e4-ac5a-c205938e11f7" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="532d8245-7095-4883-8c4a-ff24f92f9037" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="b2fbf956-ffb4-4753-b26a-f93b6af0f43a" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="31855bdd-fa30-4aea-80f5-54350f055c1a" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all duration-200" data-unique-id="2571cc19-519e-4640-97e5-bc4332b6f16c" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="6e6719bc-f576-4d25-a8a0-f4cc266dd856" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="beebe8a3-c5a8-4611-acf2-ebd6f8c80000" data-file-name="components/data-table.tsx">
          <thead className="bg-muted text-muted-foreground" data-unique-id="2f8807dc-52ea-4602-838e-62decbea31bc" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="478d43ac-9f9a-403b-ad51-dff4655b2b88" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap" data-unique-id="a44bca8e-e315-44df-a232-8b6bb60015ff" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="ed7c6b3d-6e19-4f5f-b556-e33eb0ffabec" data-file-name="components/data-table.tsx">
                      <span data-unique-id="cc5810f0-d05f-4ad0-a352-27dabbb00a14" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="bbf84234-b539-4fb3-91ff-1b7480a6906f" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-border dark:text-foreground" data-unique-id="e676807d-33af-4cd6-8cc6-022eb793cb91" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className={`hover:bg-accent/5 ${onRowClick ? 'cursor-pointer' : ''}`} key={row.id} onClick={() => onRowClick && onRowClick(row.original)} data-unique-id="e79b1eda-562b-4b32-816a-7aa36d143aa3" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-3 py-2 text-sm truncate max-w-[200px]" data-unique-id="55307d30-1f41-419e-9588-8f834eb9a632" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border" data-unique-id="4dc5d03b-d029-4a8b-adc3-5d66d7ee002a" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="073658c5-71c4-4ca2-9f33-16f357362330" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="24052bec-e6f1-4cd1-9596-d07d4c7c1a46" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="b69b8151-b28e-4a66-84c7-84c9dcde5ff2" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="0cd21f08-9625-4b74-b913-19989bab2496" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="23a310a5-b6ee-4c15-a14f-723ba0c90d42" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="ab44c9c3-b032-4c7e-b4ad-81493a1d1bf9" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="90afd79a-8f00-4d22-9038-ade59c7bf108" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="9dfa8d8a-475a-4051-9749-da67c5534ea8" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="d748ee3a-9a3d-4de4-a04d-2bd4a0f29319" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="6f58a8ee-ede9-4523-89b5-3668e2b9a515" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="eab19743-e8d2-4e7c-a83d-825ea5fddf2b" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="0e109109-3eeb-4a2e-a9b8-916d2066bea0" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-card rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="e7f2108d-243f-45a3-b156-c21dacc7c081" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="7450e17d-d56b-4d9a-978e-fc4872681100" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="54eced56-a58b-4128-91af-6e3936d37de9" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="5a099d53-3b69-4e3d-b98c-2cc64b668938" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="bbfbbca5-4fd3-4ff0-8aea-c15481cd7bb1" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="62b28ee1-337d-4996-8135-29268f935e7b" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="d53fa516-632a-479a-ac0c-39c24ecbffeb" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="409f3f27-0ed3-4dc7-a7fa-aec966a5fda6" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="24818768-0572-4e11-ac7d-bacd11362d46" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="534ca722-3968-4c59-9007-d36d5fe6373a" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="cc03af65-97e3-44b5-948e-46e64bd72cfe" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="ac9046c3-d0e8-4679-898a-84fe9d104d3b" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="8acf3a85-4218-4282-b03d-06a8b3d5fb73" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="bc23e5fe-2984-48a6-bd07-9ab32329e335" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="04ef1b47-963d-451c-a29d-bf164baf211f" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="40400f1e-a2b7-479c-aa19-733bf7ca77c5" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="2b46cd4b-94c2-4c65-aae9-a2a8b86c3e15" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}