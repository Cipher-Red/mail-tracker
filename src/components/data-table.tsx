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
    accessor: 'customerOrderNumber'
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
    }) => <div data-unique-id="43a28d68-0062-4e2f-a5b0-d33a99884fd6" data-file-name="components/data-table.tsx">
          <div data-unique-id="b5dc11d8-a3d1-4334-b920-c3a46f6e82b8" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
          <div data-unique-id="1a9de0b2-d400-46bd-895f-2490878e8280" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="17cb545f-749d-4af3-9e2c-806a55313c45" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
      value
    }: {
      value: string[];
    }) => <div className="space-y-1" data-unique-id="c8d29cac-4f33-4131-ac3a-a6cec9f43a15" data-file-name="components/data-table.tsx" data-dynamic-text="true">
          {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="3138a029-08d9-43e3-9067-7331c827e85f" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {num.length > 15 ? `${num.slice(0, 15)}...` : num}
            </div>)}
        </div>
  }, {
    Header: 'Source',
    accessor: 'orderSource'
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
  return <div className="w-full" data-unique-id="4f3e6888-4ef1-465c-bb49-5645435ac2dd" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="a0c3cb23-fecd-4725-9366-6ce263aa90d3" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="f12ba614-997e-462d-bcdd-6d53e3414ea0" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="b607c159-be4a-477e-8c7a-013aa59e7b90" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" data-unique-id="2cef8783-49ce-4dea-a713-c3faf281a33e" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="72d0fb4e-cb32-4f84-be7b-b3ce492a3ebb" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="2ccef488-97d0-4355-b68b-4e65fd8571c5" data-file-name="components/data-table.tsx">
          <thead className="bg-muted" data-unique-id="f4206be4-d0b4-4a2f-8e5c-42b051f8718a" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="749b9774-df6d-4110-b888-5806767a3b14" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" data-unique-id="3e9ee5a1-9dd2-4a64-92a1-c91ed3d2a343" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="1f256fae-cb00-468e-9042-7a57711da8fc" data-file-name="components/data-table.tsx">
                      <span data-unique-id="bc0836f1-ef2d-4e90-a406-42eaf25aa8b7" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="f0738828-aad1-42cb-9e4b-cfea996240ac" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-border" data-unique-id="391dbf58-c99c-4335-a33a-e1151f235d2e" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className="hover:bg-accent/5" key={row.id} data-unique-id="86813ac6-bc4a-45ff-b3d9-9e17220cb2b8" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 whitespace-normal text-sm" data-unique-id="c96ab752-ab8e-4d63-ae37-682771ac8426" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-white" data-unique-id="31951797-e507-4120-90b6-2bda9569b068" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="5432e194-cd3c-463e-b78c-e3b35ea4614d" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="b312c340-9b8e-45dc-80f1-404f5dbab145" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e825ce5d-9134-4715-b318-f1a1d1b22b5e" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="6a5f8ada-617a-4b3d-81e3-6c90e0ee89a9" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="c3151306-eb15-4ab8-805c-8a7188b645c7" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="1537f649-410b-4c99-a24c-5713833b5684" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="e77aacb3-3c2e-41dc-89fa-c48e2600d50e" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="15ddb9f7-1bd9-4ab2-87d6-c553fba994db" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="993fe7e4-1a49-469f-861f-bbe8de2b8f2d" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="081fb7e2-3c70-46b0-a563-370b7573f6fa" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="62a8c9d4-89c7-4ec4-8f06-30adb9641a06" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="8c06d46c-7482-403a-8ac9-6e6b6c435cc4" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="2d697b45-7d32-4f72-8216-f2b89f4cf6f5" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="358f49ac-8c2b-4d69-8a96-e245becc6769" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="41f5d502-aea9-4069-8eb9-c3c5a6c01105" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="98974c12-07da-471f-bd84-cf7f76c43b49" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="ff5f9f7c-38e9-442a-b950-be34fd1c24d2" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="0364f618-3582-45bb-bc80-1ec534124ce1" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="53b2e4bf-8d18-4dbb-b9b0-bc7ba391b10d" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="70e1d43b-d891-4ba2-95bd-7c22852e0014" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="2b706a4c-7643-4e86-b538-7c1ee4456c33" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="858b50e9-7255-4919-9c72-48401bbe15ed" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e6559117-3b07-4108-8aa4-faccd15c2e89" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="bc747146-00d0-41dc-a191-3434f2a4bea3" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="d6176582-2a42-47e7-9769-6d2f59e694bd" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="3aba658f-adcb-49f2-b908-9b060d38b0fd" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="e42858d0-fb0f-4394-8054-b118fa0bc69c" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="906052b3-0ce7-4cee-ba31-d273a98a557f" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="2fb23c7a-c94b-4aca-8ba5-9ab19daec1e5" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}