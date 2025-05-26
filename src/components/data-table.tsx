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
      return <div className="flex items-center gap-1" data-unique-id="98df3f57-218b-4a76-82c8-fcdc45854631" data-file-name="components/data-table.tsx">
          <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="8ace7a04-87b6-4494-a917-d9bf113eeddf" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value}
          </a>
          <button onClick={copyOrderNumber} className="p-1 rounded-full hover:bg-accent/20 text-muted-foreground" title="Copy order number" data-unique-id="588576c3-1241-470e-9c62-62cbbc0cdf15" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
    }) => <div data-unique-id="d3b19fbc-79bd-4212-8de5-4235a15fc45e" data-file-name="components/data-table.tsx">
            <div data-unique-id="d47900cb-0875-4ca5-a089-8120cd3f1c49" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
            <div data-unique-id="96b90744-a85e-4b2a-ad35-46a86f5c436f" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="df6c1567-b9c8-490d-beac-be421abbc814" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
      return <div className="space-y-1" data-unique-id="90262431-345c-4823-b58a-d6d9db668eee" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="3a354e9b-3d19-4207-882a-f894bac7e16a" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full overflow-x-auto rounded-md border border-border shadow-md" data-unique-id="4ec4e42c-e591-4923-8931-aeef47c6b312" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="22ef45c6-c20d-4eaa-85f6-1b9c14ed2233" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="0648a88a-34fa-4ac6-9261-a8d49f71ab59" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="c12d5e57-01c4-45da-ad87-0ad457e5452d" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all duration-200" data-unique-id="1d1fd535-5ba3-4b7f-a7d9-f5635ac78487" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="d26ca802-0c9a-42ab-99fd-7211d344c9c7" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="e29d77f7-020f-4062-a64c-07893e962c77" data-file-name="components/data-table.tsx">
          <thead className="bg-muted text-muted-foreground" data-unique-id="b4a077a3-b9f2-4a0b-a47b-1537963cef9e" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="dfd6ec8b-49f2-42cb-8373-852d7713154c" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap" data-unique-id="86ee6bdf-f8a5-48e3-9ef2-343ca1c061db" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="4a2ec6b0-2cce-4e60-95a1-f9c5c20dfb37" data-file-name="components/data-table.tsx">
                      <span data-unique-id="e4cdfe89-9a06-41ab-a2c9-52ce0b4d5d64" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="6b0fc74a-edb1-4c91-a4c4-d4237bb08c00" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-border dark:text-foreground" data-unique-id="afde7320-9ae1-44c9-b565-cc1db8972ce4" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className={`hover:bg-accent/5 ${onRowClick ? 'cursor-pointer' : ''}`} key={row.id} onClick={() => onRowClick && onRowClick(row.original)} data-unique-id="cc333aae-1b0e-4d00-81e3-55585622b87c" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-3 py-2 text-sm truncate max-w-[200px]" data-unique-id="bc8d7424-2181-41d3-a10c-968a5492ae75" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border" data-unique-id="5bbf5498-185b-4f93-8530-a1ecd371917e" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="57ca9a87-f6fe-4ccf-bf33-eba14b87a8fb" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="edb8b980-e552-49b6-950f-b155ca7d6f7c" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="842fe394-3728-4f5c-9923-6124151c3e0d" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="71fb321f-56dd-41b6-939c-44df9a8ea9cb" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="d4deb25d-d548-4680-a09d-73ef7865c9f5" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="76bfcf5c-fc62-435c-b7a8-4ca25c21bb9d" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="eeab50d1-68e6-4b88-8a34-484e29ee39d1" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="e3a5bc99-495f-4188-9c97-d58830892438" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="a39bfecb-85d6-4a40-80ed-5bfa010201e4" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="48dd81bd-ec1b-4951-80d1-1566c6885ff2" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="66d5d531-0ff0-45ce-913c-718584923549" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="9c896c79-90ab-4ef7-9041-b1162569ee06" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-card rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="a7552b28-80b3-4ec0-9ef2-24af0f2a17db" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="b9df4f29-f618-441c-abd9-6dc50cb582f0" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d18cb24d-4adb-44b1-8198-3ccc0c80d986" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="84e39360-42cd-459c-82de-edcb72c590f4" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="dd2499ea-4b1a-4a74-9056-c186728aa2cf" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="05e82014-5a30-44f2-98f5-57d7bd20020b" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="ee8ad3d2-5dc3-4ad0-8121-7dd8aff822b1" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="9c9da372-868a-4e26-ba16-6009b104bf3e" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="ce8e38f2-f35b-4c5c-a5b6-4812179b165a" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="064a3036-1e9e-4027-8f8e-f7969e27b73b" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="6f36e8a1-a698-437c-9b62-5c576f0aab1d" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="cba673d7-6e8d-4b78-8123-b76a217a7893" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="03809b0d-30fe-47aa-9d60-f39bda7e9d23" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="6a4d90d1-9028-44ed-9446-c4690c868317" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="cc634787-e514-48d6-8871-b295b3ada3b6" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="bb55e25e-a5fe-40df-9f85-2c9d51b6b796" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="d07926b4-3c8b-42ec-9126-5174836bd03b" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}