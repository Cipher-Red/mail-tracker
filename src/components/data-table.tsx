'use client';

import { useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters, usePagination, useGlobalFilter } from 'react-table';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { CleanedOrderData } from './order-data-processor';
interface DataTableProps {
  data: CleanedOrderData[];
}
export default function DataTable({
  data
}: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useMemo(() => [{
    Header: 'Order #',
    accessor: 'customerOrderNumber',
    Cell: ({
      value
    }: {
      value: string;
    }) => <div className="font-medium text-primary" data-unique-id="f0725b73-1e41-4713-8ec1-3acc659e9a05" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
  }, {
    Header: 'Customer',
    accessor: 'shipToName'
  }, {
    Header: 'Address',
    accessor: 'shipToLine1',
    Cell: ({
      row
    }: {
      row: any;
    }) => <div data-unique-id="b9443e01-b7a5-4929-a40e-83402cd19651" data-file-name="components/data-table.tsx">
          <div data-unique-id="f49e8ac9-35a3-408a-90c0-61054e8b58ed" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
          <div data-unique-id="e9010951-188f-4b1f-aa07-21ad427de387" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="65d44e5a-590f-4a03-a64d-7873bd531b49" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
        </div>
  }, {
    Header: 'Phone',
    accessor: 'shipToPhone',
    Cell: ({
      value
    }: {
      value: string;
    }) => <div className="font-mono" data-unique-id="48dc9d5e-389a-4ee4-988f-aff401444278" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
  }, {
    Header: 'Order Total',
    accessor: 'orderTotal',
    Cell: ({
      value
    }: {
      value: number;
    }) => <div className="font-medium" data-unique-id="38faedf7-1439-45cb-9b98-d7cd450e9e7a" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b8ae743e-045c-4d8c-a6a8-7da0ac11c8dc" data-file-name="components/data-table.tsx">$</span>{value.toFixed(2)}</div>
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
      value
    }: {
      value: string[];
    }) => <div className="space-y-1" data-unique-id="e3e31617-33ca-461c-87cd-a8a751111b17" data-file-name="components/data-table.tsx" data-dynamic-text="true">
          {value.map((num, idx) => <div key={idx} className="text-sm font-mono" data-unique-id="f63e30e2-11d0-426e-95cc-724de6126d40" data-file-name="components/data-table.tsx">
              <a href={`https://www.fedex.com/fedextrack/?trknbr=${num}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" data-unique-id="8fe193e5-d1c6-42ef-9c89-5b0c5d3f72d0" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {num.length > 15 ? `${num.slice(0, 15)}...` : num}
              </a>
            </div>)}
        </div>
  }, {
    Header: 'Source',
    accessor: 'orderSource',
    Cell: ({
      value
    }: {
      value: string;
    }) => <div className="inline-flex px-2 py-1 rounded-full bg-accent/20 text-xs" data-unique-id="603dc068-9e31-4616-b5f4-875b1f36e3ce" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
  }, {
    Header: 'Order Summary',
    accessor: 'orderSummary',
    Cell: ({
      value
    }: {
      value: string;
    }) => <div className="max-w-[200px] truncate" title={value} data-unique-id="7b3fa310-af9c-4b77-abd9-b5739d90d65a" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
  }], []);
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
    initialState: {
      pageIndex: 0,
      pageSize: 10
    }
  }, useFilters, useGlobalFilter, useSortBy, usePagination);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    setGlobalFilter(value);
    setTableGlobalFilter(value);
  };
  return <div className="w-full" data-unique-id="236ea615-7d83-4ab8-a550-799192abc5ba" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="b7d7d221-a0ee-492e-8c9c-08e1db9b0cd0" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="5e75d807-b703-45b8-92ce-9737c89aaa09" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="fccde449-92fa-4dc4-90c4-fdcf136d4bbc" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" data-unique-id="2693b963-a9ea-4075-b66d-5fbb079ab4e5" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="916ba87a-429a-419e-9992-c0d48c8ef4fe" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="5969ca79-4cdf-4234-9da9-6fda026c489b" data-file-name="components/data-table.tsx">
          <thead className="bg-muted" data-unique-id="90e8c44f-5e08-4f41-8beb-f1cab593a005" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="f8472d64-c0b8-43e3-951d-12a9cf7cf7b1" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" data-unique-id="d8b1323e-179f-4d0e-8d5b-10823319c023" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="e46ba992-9f4c-4bec-9248-4382bf1dfb58" data-file-name="components/data-table.tsx">
                      <span data-unique-id="d22910ba-27b0-43a1-90e5-b052dc324089" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="6c81ca68-91b2-4343-8531-0972cde98c8e" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-border" data-unique-id="53ea0415-9cc9-4dba-b5f3-7c176f08c03b" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className="hover:bg-accent/5" key={row.id} data-unique-id="f2f65df3-f2ed-40bd-a9ad-d42785a1fc46" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 whitespace-normal text-sm" data-unique-id="e69b7ff3-1aa4-4159-acb3-838d755d6360" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-white" data-unique-id="e1414ce6-f4b8-48bd-b016-11e8a42a7d07" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="44a50b7c-71df-4d4c-8541-01a0df64f989" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="33565f75-ac17-41d7-811e-5748bb228e6e" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="ff3e72e8-825d-494b-bc4c-25969a19591c" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="329a41f1-404f-434b-8550-81823f216c70" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="c94462e4-722a-42a2-a6f7-261474542c29" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="95f68b55-7f44-4041-9b73-bea42b52c7b5" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="0eb70720-82dd-412d-b18d-431cb80f13f7" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="57f76808-4b01-4525-b84c-8bbb4f4c76bd" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="b36d469c-2755-4b47-a086-b1c88e352f98" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="75d026a6-182a-4549-8e2f-412eeac53927" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="f84a0dba-2589-4c49-b6b2-0ab61e11f096" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="809b1054-5115-4b92-9a33-830e83b2f81b" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="154305c3-f540-4047-bc0f-56d04f423dcd" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="f9ed7582-fecb-4049-9303-8bf098d03905" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="47353214-189e-4066-8c8f-c7773399c845" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="0b40fbde-5ad1-41dd-af89-c07dd54780ba" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="5bfd9700-2b5e-4203-b1af-5a70f3bee373" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="73f81671-1b28-40bc-beb4-a274ad301455" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="35756811-3ec2-45d6-baa8-fcf60600074e" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="56ddf21e-971c-4b03-85e7-6fb5033b8939" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="8a698967-ec2d-4a53-b68a-3cc59e43a044" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="66cf7473-55da-408d-9ded-1b252030a9e4" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="d3847efa-20ec-412f-acb2-9fcdf2d3ccc6" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="f761eb9c-c323-416f-a394-2f97d1237817" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="436a259e-8bd6-4b5f-871b-b843f1fa99df" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="ffcf4148-0d2f-4afa-b7b9-99f0606a5ef6" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="87bf7154-aa91-42b3-9d6c-36ec495c717d" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="7dae6342-d53b-41a7-8b01-6fa301885656" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="c6b64498-9c32-4c46-a8eb-2c6776d16cb7" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}