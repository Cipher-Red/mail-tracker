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
    }) => <div className="font-medium text-primary" data-unique-id="66c58c10-ba8d-4553-9ae0-7570d6ae570c" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
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
    }) => <div data-unique-id="ab193066-0bf0-44fd-9c67-78fd0f653c2f" data-file-name="components/data-table.tsx">
          <div data-unique-id="effc0894-2363-4506-b6f4-10016585d977" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
          <div data-unique-id="f475117a-fc82-4061-9f1f-249426086431" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="23886a43-4245-4523-bc39-2633f836b06a" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
        </div>
  }, {
    Header: 'Phone',
    accessor: 'shipToPhone',
    Cell: ({
      value
    }: {
      value: string;
    }) => <div className="font-mono" data-unique-id="d083f93b-331f-491a-9ce8-32e7726b525d" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
  }, {
    Header: 'Order Total',
    accessor: 'orderTotal',
    Cell: ({
      value
    }: {
      value: number;
    }) => <div className="font-medium" data-unique-id="f8a867d9-4f74-4c97-b481-7731844bfd5a" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="31122722-54b3-44e1-b046-d1b811aca7f5" data-file-name="components/data-table.tsx">$</span>{value.toFixed(2)}</div>
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
    }) => <div className="space-y-1" data-unique-id="1c6c0bb7-fb4e-40fd-84e8-a8eac2dfc2a2" data-file-name="components/data-table.tsx" data-dynamic-text="true">
          {value.map((num, idx) => <div key={idx} className="text-sm font-mono" data-unique-id="76d7f5a2-c1ad-47e8-98b2-e838d8e246d4" data-file-name="components/data-table.tsx">
              <a href={`https://www.fedex.com/fedextrack/?trknbr=${num}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" data-unique-id="41ce29b7-7cad-4c6d-be3f-e8e2b4508288" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
    }) => <div className="inline-flex px-2 py-1 rounded-full bg-accent/20 text-xs" data-unique-id="f5866598-c9a3-4c2c-bf76-1c4c56c20d9f" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
  }, {
    Header: 'Order Summary',
    accessor: 'orderSummary',
    Cell: ({
      value
    }: {
      value: string;
    }) => <div className="max-w-[200px] truncate" title={value} data-unique-id="5c3fa674-263a-4fa1-8cfb-bc08c639007f" data-file-name="components/data-table.tsx" data-dynamic-text="true">{value}</div>
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
  return <div className="w-full" data-unique-id="bd99ec5b-0bf8-4665-ad46-36b516f0dd09" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="6fe33bfe-660a-4743-ab1a-9611797c0622" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="eb323ea0-71fd-4454-9381-33edad089a42" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="fc0d0285-fa57-4281-83cb-bed45db99573" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" data-unique-id="4f2e04d8-91e4-4b17-a9d5-47bf1a68c88e" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="8da137fc-cd51-49d8-a8de-3004e37a1314" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="69a63669-31ca-4342-8d3c-6eb35feaadc9" data-file-name="components/data-table.tsx">
          <thead className="bg-muted" data-unique-id="a4d686b8-d3f3-4e0a-ba58-5dce1a839d1b" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="335baf8f-7f31-4ab8-9ea8-07c2d903ac85" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" data-unique-id="7cc34200-48e8-4a4b-b63e-e70e0018a5a6" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="a666af9f-ecc5-4307-a2f4-ecafaa44d938" data-file-name="components/data-table.tsx">
                      <span data-unique-id="39528f64-7c54-48fe-80bf-0f1a78e8f834" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="2cd300a8-3a67-4eed-9b59-27297490ff98" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-border" data-unique-id="9464ad0d-603b-4b5f-8d32-e0294bfb6ce9" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className="hover:bg-accent/5" key={row.id} data-unique-id="1789fa0a-03b8-4fd2-b1ab-df5f094c6996" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 whitespace-normal text-sm" data-unique-id="93fd4449-89e5-441b-8b0e-08d66fce6d7c" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-white" data-unique-id="6fb2ea23-1c59-4147-87d3-a77159c92ac6" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="10bbefd8-08ea-4123-ab63-4e80757fefb0" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="4101f94a-061e-4741-9021-a458aaa78a7d" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="0dfab69a-877b-4dc6-829a-69944afe1a4d" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="b36e0911-1035-4483-94d7-ba2272a2c05c" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="d6303a5f-3da0-4562-b27a-943faa2b0fda" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="4ee2b575-3f10-4ede-8419-2040b5aa90f9" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="1f38a87a-008a-4b73-a3db-8347c37f003d" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="00137b65-0311-4ecf-93b9-4684d8f9f51b" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e19133e7-2fd7-4051-9f2f-de83bdf6a200" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="702ea1bd-e8f5-41ea-9da7-b300179e4a98" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="4481f84b-f0cb-4b86-9d19-2b2090112bff" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="d6bcc0f6-966c-4cea-a9c5-d43b9ca0111e" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="d591da8c-5f0b-4d8c-b728-5aeb0ef7d121" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="a4cf16a5-079c-41af-99c2-ad190175bd1d" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="785fa8ad-ce81-40ae-86e0-5b55bd83fff3" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="43d4d028-3ce3-4e10-ac56-97832356bc0f" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="2018264c-574f-4958-ba5e-c5b10a1a021d" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="c1c01ea8-c13d-4053-806d-7696d218a6e6" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="fa86c84a-82cb-40d8-9068-095ef660c222" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="42c20128-5b06-46a3-96e3-48130f2e834b" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="f0b3930d-0de1-4455-a87d-386a7dc55752" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="c00152cc-ae3c-4d9a-a587-f12e2eb2f9cb" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="ee96b0d8-56dd-407f-a5e4-128579fd05f6" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="4e68be28-fe17-4236-b00b-13164edbd974" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="1cdc9b26-9036-4516-b631-a95cc0c68ef5" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="7b7d6d45-89c0-4466-8478-97bbd31f2e92" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="e27cc8a8-e2ca-4d9f-9801-7b563749b893" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="aba4ae3d-5059-4856-ae1b-830f3a992a80" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="3d9e4c22-a50f-4eac-8fb4-92768a51f073" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}