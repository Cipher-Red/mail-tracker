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
      return <div className="flex items-center gap-1" data-unique-id="b98a3559-9e7d-4d69-a3c6-5c812bfb5d56" data-file-name="components/data-table.tsx">
          <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="2da08262-3e15-4198-a969-e244182634db" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value}
          </a>
          <button onClick={copyOrderNumber} className="p-1 rounded-full hover:bg-accent/20 text-muted-foreground" title="Copy order number" data-unique-id="05e2a521-e366-4634-abbd-7a321bfea2df" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
    }) => <div data-unique-id="307115f8-4cb4-436c-8d16-214ad55a086f" data-file-name="components/data-table.tsx">
            <div data-unique-id="18c3f4c9-cba0-415f-a5ac-cc3cd2758f44" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
            <div data-unique-id="f5f7f728-63bc-4ee8-96ad-e2ab72f34ff6" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="43eff3e1-9342-42a5-9aaa-c8f776338e92" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
      return <div className="space-y-1" data-unique-id="b8a4256f-1b19-41e1-969e-8b5d308a33a0" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="cb71f042-67fb-4797-8ce9-73c8bb8920a8" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full overflow-x-auto rounded-md border border-border shadow-md" data-unique-id="2dc364c4-fcd3-4fb9-b4ba-0913b874c229" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="62b09fff-1e05-4128-8e98-637c65ebbd68" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="3fbc1dcf-fd0a-4cab-8639-3d5d1c4363b1" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="5da88654-73d6-40dd-808b-993933d04902" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all duration-200" data-unique-id="68e85e40-9093-4c6f-a6a6-36329ae5090a" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="3d048ddb-853e-4dd8-b13e-47aaa346218c" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="c26989ca-0915-4caa-a3a9-9cd2ee1a1580" data-file-name="components/data-table.tsx">
          <thead className="bg-muted text-muted-foreground" data-unique-id="0c7ce6ff-823a-449e-bd66-288698e2b23e" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="ed6b5517-4049-47ad-9433-95a876443faa" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap" data-unique-id="8e434a01-d6f6-4d8d-99a0-b968790d41c8" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="4eeed72a-1882-4393-81cc-452c2dc1d55d" data-file-name="components/data-table.tsx">
                      <span data-unique-id="19097aa3-abb9-4887-9aaa-24182eed8691" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="c589a402-b349-43e4-a6f6-d291c2210ceb" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-border dark:text-foreground" data-unique-id="f231c546-2854-4a67-be07-2958c846fc69" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className={`hover:bg-accent/5 ${onRowClick ? 'cursor-pointer' : ''}`} key={row.id} onClick={() => onRowClick && onRowClick(row.original)} data-unique-id="62c76e41-739c-4d12-b9b2-732a3e744cb9" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-3 py-2 text-sm truncate max-w-[200px]" data-unique-id="c4096e69-abf6-4235-ad9d-df099f4ecd4a" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border" data-unique-id="43528094-8ea2-4a01-8528-0f009f13c071" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="4202d7b3-df3b-450f-be88-7779cb2aace7" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="dbfb3abc-0481-4476-bfea-8c883ca26fc0" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="d6af86a0-b023-4c1e-bcac-10e070729bf2" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="6bb2408d-9437-463c-ba8a-cb67c33711f0" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="ac2e5b1c-2aac-47ed-b053-917f8938a083" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="efbb86e2-68ff-43ec-b1e3-558323afb30a" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="09ce6afd-ce9a-458b-8620-1fd471d3868f" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="2425236b-ca24-491e-b175-f7905c2cc1a0" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="7f2a37e8-f68f-47c9-af94-ebce196c822a" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="4f6488f7-7dcc-40fc-b517-ae7e7ad47a25" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="9e4c6f0b-356d-40ec-ae7f-2f26375e6b6e" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="f5de2b40-550e-46c4-a634-7d8fb87c29ce" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-card rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="6c98548d-a689-4cf6-a8e1-ee3993e9b6fd" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="32a852b4-5b82-4d49-b044-829b9a62c9c8" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="18b098a3-34c9-4a73-aa0e-01097ed418c6" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="416c4663-6b9b-4266-8d22-efab53a73009" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="0dc45e4f-9ea0-4f89-a00e-bbdf3a0b72f4" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="4de2cba4-4b70-463b-be1c-82b7ef69c189" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="4127ec4a-47bd-464f-a2a1-0c3f6d4e437f" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="4de6274c-2aec-4ef3-98ba-1e325cf5cdc8" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="f0b65fc7-aaad-4005-a66a-2abdba5200de" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="d0fa8a79-d234-473e-9888-6b1f0db77090" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="a288ffef-2506-47ff-99ff-7f9d8f6e2398" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="febd5dda-09c7-41a0-82a3-e6c7ca479883" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="e6cbdb27-e9ae-48c5-b9c7-d8c45c47f3f2" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="0e5191bf-d0fa-4dc0-b8ce-1f5dd914d574" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="79217882-88eb-40ce-a682-e68cf0cf6c1e" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="ac977c55-3f7a-4913-a4b2-ca7e038d6e7f" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="f16ec681-fb84-47b9-8f94-9b54463411f2" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}