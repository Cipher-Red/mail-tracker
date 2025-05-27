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
      return <div className="flex items-center gap-1" data-unique-id="b838bdab-be0d-41e1-830f-577eeb71027b" data-file-name="components/data-table.tsx">
          <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="2ff272dd-84d9-4231-9592-8b7dec81c065" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value}
          </a>
          <button onClick={copyOrderNumber} className="p-1 rounded-full hover:bg-accent/20 text-muted-foreground" title="Copy order number" data-unique-id="e1597163-c1c3-4fd2-b7d0-393b7c1fc519" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
    }) => <div data-unique-id="93196977-9632-4aa8-a457-a25bf280a420" data-file-name="components/data-table.tsx">
            <div data-unique-id="f6fe0620-1205-425e-82b1-45cf6d0f2d96" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
            <div data-unique-id="6465f4b7-fc46-4513-a548-8cd11ece323b" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="956a99e0-8996-429a-9f82-a88aee2e260b" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
      return <div className="space-y-1" data-unique-id="6bda03b1-136c-4f58-a2ec-ee807ccfb77f" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="d3a647c7-2e4e-4c72-bf72-299c1cd30dfd" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full overflow-x-auto rounded-md border border-border shadow-md" data-unique-id="62184460-6c56-423d-995b-914a29b68e6a" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="c495715d-a6c2-439f-a9ca-2f63809d4368" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="5744a41c-ee8b-4fbc-8356-6c36c4ea14e5" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="561d7188-c377-4796-be48-9a2b4b5e6002" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all duration-200" data-unique-id="560df849-ec2f-4f6b-81f0-324776e6cb0d" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="ac5dc202-cab7-423f-ac52-bd037d6214be" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="05b481d6-f804-4b89-946e-e5512a0e3c49" data-file-name="components/data-table.tsx">
          <thead className="bg-muted text-muted-foreground" data-unique-id="abb65c67-a9e0-4207-ab86-69c9b64b7f4e" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="a6e5f32f-bff7-484f-97e1-b98679458192" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap" data-unique-id="49915ba6-2488-45c9-8673-c4c661dbefe6" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="3110c28a-ccc7-4627-bf23-d0095bc02199" data-file-name="components/data-table.tsx">
                      <span data-unique-id="a18c4cb6-2dea-4e78-b3bc-7fbed0d78332" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="cb8b7612-b278-4791-bd3e-e6b21a59cafd" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-border dark:text-foreground" data-unique-id="b596b28e-cdbd-44ff-a775-a7e31558cad7" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className={`hover:bg-accent/5 ${onRowClick ? 'cursor-pointer' : ''}`} key={row.id} onClick={() => onRowClick && onRowClick(row.original)} data-unique-id="7fe35e14-719c-40d8-bfeb-a2acf93e3872" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-3 py-2 text-sm truncate max-w-[200px]" data-unique-id="e192da5b-cf4b-4128-9f02-8e482141d336" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border" data-unique-id="5c72e3cf-7dca-4906-adf8-43c173d06eaf" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="23ebc239-d44d-4dd5-958e-029f1fc9f11d" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="e8a9e4af-cab1-428a-b126-4cf2963fc2f5" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="f4e46244-4fb0-486f-84bb-fe93f9efe036" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-card disabled:opacity-50" data-unique-id="34fd110b-abf9-4763-90a3-01982b5dfc48" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="6d243912-c288-4c6e-9db8-5b9a1e43559f" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="b88e0ab0-c934-478a-b394-e4d4636e32ed" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="eaeb0163-27ea-4587-9e35-b1c957a434dd" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="da19123a-cd66-4ada-91ca-db3d2ee23f8e" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="04ac76b1-ed4e-47ac-9a4f-2307f22a99ca" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="aff43fcf-e7a4-41e7-a1f4-e8ad69df8960" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="9994ec45-382c-4ab1-b1f1-2d3c39c77a2b" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="e318dcb9-0c65-45c4-9e82-79321afd583a" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-card rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="541852c5-ac5a-4655-8897-58f777e0a8ef" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="a8f5c5d4-30c3-4ecb-8f23-ccb7d2cc9d78" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ff19eeec-7335-49c2-a4de-c61f338fe6c2" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="99b93bce-f60b-4965-aaf4-b39c008331ac" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="ba00e401-b56a-4073-aaf4-6e2935db09ce" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="3ebd0978-80a0-4933-a709-60e7704a565e" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="fbc1fd9b-99a0-4127-b7ac-509ac65f3b96" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="4fdd1f27-4dcc-47c7-ad81-7d3b5ba371d9" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="f60e1b91-5448-4d07-be2e-2b009abd09d7" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="fdbfa7bd-db79-465f-9afb-281b19748da5" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="573b8336-2b05-47cd-8803-94bda6895f66" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="5af1a779-00f5-4dce-8a3d-de14cb2c5643" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="d9bc320f-43f6-4bf5-84c1-c692905c50e5" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e331b243-7f29-409a-94d3-5f0ebf374293" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="063f4181-832b-43fd-9ca1-05634ff01180" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="9c6cbc72-0d6e-4e04-91c8-7b92d6410db8" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e3eec001-17e7-499b-a594-76a079cbc3c8" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}