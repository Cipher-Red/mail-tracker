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
      return <div className="flex items-center gap-1" data-unique-id="4a674045-2304-4607-ad84-3650ec6250c1" data-file-name="components/data-table.tsx">
          <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="8ffe13db-dd41-41b9-a4fd-953d62f26c45" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value}
          </a>
          <button onClick={copyOrderNumber} className="p-1 rounded-full hover:bg-accent/20 text-muted-foreground" title="Copy order number" data-unique-id="0b559264-9aef-4e3b-9159-9034d2f4d7dd" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
    }) => <div data-unique-id="c122dee8-8513-477f-a1cc-4dba5735ce99" data-file-name="components/data-table.tsx">
            <div data-unique-id="49ade4ba-32d2-416b-9470-e0a4acae7ad4" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
            <div data-unique-id="0c6e75d1-ccfd-470f-be23-f00115098d71" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="a396713a-f31f-49a9-b643-83a148796244" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
      return <div className="space-y-1" data-unique-id="29fbcc56-cdc0-4cd2-8cd6-e67fb9df60ff" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="d6586896-9525-4622-bb9d-afb01f0a4f51" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full overflow-x-auto rounded-md border border-border shadow-md" data-unique-id="b6a8d18c-76e4-4947-bc4a-a2820c85e815" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="0cca6dd5-f34a-4ce6-9836-d0dbeea96b89" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="5f5162b2-2ac1-4185-b0e3-0c361579f8c1" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="2d6afa60-7780-492e-85e0-a4cfe9a315a9" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all duration-200" data-unique-id="ee093cd6-edc5-4185-8ab6-5e46bb36a73c" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="2a06b6f0-07fc-4f4f-b282-ea641aeb2c9e" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="0584958d-41fc-44e6-8a37-e56e15b3c8e6" data-file-name="components/data-table.tsx">
          <thead className="bg-muted text-muted-foreground" data-unique-id="fd7fe26a-981e-4f87-bf1a-4df15fc9f852" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="6b68071f-a815-4967-aad2-9ef9ed75b169" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap" data-unique-id="d52a44ec-53ae-40e1-9532-fa0fe8039746" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="ed57c372-4ebb-4ebc-8108-646f96a64463" data-file-name="components/data-table.tsx">
                      <span data-unique-id="1ee4e620-79a4-46e1-a185-5fd9396043ca" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="b754ea4f-ea62-4e35-a23d-067fd1a8e98b" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-border dark:text-foreground" data-unique-id="5755b85e-6259-44a2-a43f-927a20428d71" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className={`hover:bg-accent/5 ${onRowClick ? 'cursor-pointer' : ''}`} key={row.id} onClick={() => onRowClick && onRowClick(row.original)} data-unique-id="2148b976-659e-45b3-9ce9-13ea4a001fa8" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-3 py-2 text-sm truncate max-w-[200px]" data-unique-id="beb8f92d-2606-4dd5-ad07-ba5ef00a712c" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border" data-unique-id="bea378b8-5da7-46ef-82d0-20deb406fc35" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="bf4fce20-0159-4e6a-8cb0-fdef7aaa32ca" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="81605a32-94f3-4313-8714-71e5e37b04a1" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="b0af8355-7ca9-4130-b3c6-52f3b2afc3da" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="459c36bc-938f-43b4-9a0c-cc1e828b91a7" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e468160d-6876-4fce-9a71-b754799af1f1" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="505efd45-0eb7-450b-9cf6-ef9e3a74bbb5" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="0d30f4da-64c7-4611-8adf-266e451a4e9c" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="210b8e0b-d4ad-4d42-a385-c60b4ba6a751" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="39c437f7-d6ca-48f7-ac32-3c1358692435" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="e6d00504-b06d-44d2-952b-f04269174146" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="73a2ab9f-f7cc-435e-8672-dc400fb5bcc9" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="85f29dad-52a8-4e8e-a2f8-b720c04286a7" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-card rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="8dc4a9a0-7214-40ba-afe3-4e0b53b63e37" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="a44ccb6e-c68f-4055-b8b5-cc24d9eacd68" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="259d62f5-a1bc-4893-88db-740aef3b0a9c" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="40acc907-5205-4970-b129-553654f1a3fd" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="64c16726-624e-4da2-8cee-3ea10ed7a7b4" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="47069d93-3305-42a5-ab6e-fe6cd1c292c8" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="8e938b63-cac6-42ad-b311-1cc7df905e10" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="5aa44893-272d-4442-b279-58cc4fc109a4" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="bac5205c-3926-4334-824a-19be77e622e9" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="1e31cde6-5637-4673-a588-eda2c4c1bdc1" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="85465a8a-4fd3-4a7a-afda-ab82687f9dc0" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="098dffe4-3725-4a15-bf06-098381f37620" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="732bbf63-6dc5-4e22-b68a-700e3a8efbe4" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e6c9cd7f-3b62-4ec1-9206-2c556c94596f" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="60177181-577d-4a4d-ba76-03a6fb9ab5c5" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="ac73f76e-9b5c-45df-96f4-eae0f328434e" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="247ef906-a0f4-49c0-b06c-bc61ce36b7a9" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}