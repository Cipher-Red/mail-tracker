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
      return <div className="flex items-center gap-1" data-unique-id="c2220db6-97ef-469b-ab26-69ff7bd8890e" data-file-name="components/data-table.tsx">
          <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="5b26abf4-0bae-45de-a785-5de492487d66" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value}
          </a>
          <button onClick={copyOrderNumber} className="p-1 rounded-full hover:bg-accent/20 text-muted-foreground" title="Copy order number" data-unique-id="36f96b6c-47e9-4a27-92d4-c0d8eec61b36" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
    }) => <div data-unique-id="4ed0a97f-efa9-4602-887e-fb0015481550" data-file-name="components/data-table.tsx">
            <div data-unique-id="6b68c6cf-5bc5-4662-8ec9-0e9af6ff1872" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
            <div data-unique-id="6edfb716-dec6-4ed2-8736-73f717e944f5" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="7e963941-d4bb-4364-8623-6b6b62c530d0" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
      return <div className="space-y-1" data-unique-id="40a824dd-c4dd-420f-9402-0334265f1978" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="d2b07128-4171-4b38-a344-25a426b8d5be" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full" data-unique-id="7e2b5430-dc4b-4795-bde0-0a2881571d1b" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="2d76a394-4ae1-4f61-b875-605fac2fa7da" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="fd97a617-6461-4b85-a295-b5d8ef5d916e" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="d5d1fc97-e55d-4a85-9210-f712b4fb6e06" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" data-unique-id="c8706cfa-6f45-4cf4-88e0-64bea705ee18" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="5059348f-325e-478d-a9db-215996c00f4c" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="0ea5bac8-a71d-4fac-8f1b-197dc80286fe" data-file-name="components/data-table.tsx">
          <thead className="bg-muted" data-unique-id="a0b5ce76-e0bf-4b62-af10-b137a5b5b646" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="9e5b02f7-5129-4709-b53a-81104026d2c0" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" data-unique-id="46e5e4ca-ebd5-4f88-af3d-6ae0ffcdcdbe" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="a8f79155-5b5d-42f5-81dc-ff60147bce1f" data-file-name="components/data-table.tsx">
                      <span data-unique-id="f79125ea-381e-4a95-a377-0d09a3c5818d" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="fdfd743e-4c33-4470-ad1f-4a50d9f09ae6" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-border" data-unique-id="13937882-09b1-4232-8835-e77772691adb" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className={`hover:bg-accent/5 ${onRowClick ? 'cursor-pointer' : ''}`} key={row.id} onClick={() => onRowClick && onRowClick(row.original)} data-unique-id="b4867e10-c01f-49f3-b6ef-e88fdbe60add" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 whitespace-normal text-sm" data-unique-id="5ed695ae-9340-4cfb-9123-b5dd1fc00771" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-white" data-unique-id="b5083fdd-fccd-412b-8e04-a4904458a177" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="7064949f-f02f-4ca8-af17-54fa9017a459" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="f8668407-8252-46fd-90e7-45706fceab3d" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="cdffa339-527e-4f4e-ac4b-65805eca83c9" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="cee07190-0dc2-41f1-8f45-271f78567806" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="c391750c-9e5c-49d5-9379-6bcab7b10cdc" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="bd427fc0-5c67-4b9d-a0b1-c93b0863996d" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="d2c23597-4d7d-4cd0-8ac9-bdb6f4aa1969" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="0836621e-7ce2-42cb-b04a-53527f34ee0a" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="9a8f0d90-7158-466c-8d2e-7ce2940ff655" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="fb3a1700-069d-42b8-b96a-cbc5109e9d5e" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="3f31a387-54b2-454e-886a-7bad87bd1e51" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="4d011edc-0fcc-4978-9fc0-22372e5332d9" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="123ed1d4-05d6-4baf-a8d5-65967536b1f3" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="bdbb42d3-2681-4a66-9e46-8b9c7a5fb86a" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="685786c1-497d-47e0-851c-ff43452f5787" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="670bbb06-ab75-48b4-8707-b0144dfb0cfb" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="100a616b-0845-47ac-ae11-577e5b6103c2" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="892c2072-056c-4537-b9fd-45ac080a8c96" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="6939f90f-2f52-4a26-8b12-37c56ac57aae" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="bfc9145b-ff38-4693-98fc-61fc24029654" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="9d9ac6f3-18c2-4e64-babe-cb328c284f96" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="02bc73b2-4c9b-4a52-a77b-682f59473a87" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="a6463614-79f0-4c75-8b66-a3099276f2f1" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="a608002b-3d29-40d8-a085-27378ad4110f" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="3ba473fe-1fca-4929-983d-6f9da79c5dba" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="08429cfb-7f86-40b0-81e0-e79d58278b5b" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="c2abd894-7d25-42dd-9487-70092086a94e" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="cee2ea11-e253-4aae-9753-87f3a95655a2" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="243f98fc-2121-4533-9157-5788f1eec7c4" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}