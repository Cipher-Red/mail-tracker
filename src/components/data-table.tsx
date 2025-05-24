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
    }) => <div data-unique-id="832d808f-5359-4ded-8c03-afc73ae3b1c6" data-file-name="components/data-table.tsx">
          <div data-unique-id="1f3cc76c-b85d-47de-8a6b-38192aeecaff" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
          <div data-unique-id="c72ed216-3e15-4706-b09e-10ec3facc364" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="705177b6-814a-46c9-89b8-f26f4ad11e29" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
    }) => <div className="space-y-1" data-unique-id="3810b689-c3d9-40a5-8d3e-dca16234bae6" data-file-name="components/data-table.tsx" data-dynamic-text="true">
          {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="90dee560-2858-4db2-848e-ec536f80e023" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full" data-unique-id="695734ae-a2fd-480b-8c46-2aa87e0d0a98" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="42abf6ac-2422-49ba-ae3b-43b7d8397ee0" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="491fdd62-ba6a-471c-b875-bdc957b3015c" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="ac631e4a-0bdd-4e11-936c-77abe37ccc0b" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" data-unique-id="19adfb57-aa65-4538-91c4-2cc196940c1d" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="be2214e6-625d-4364-8326-67ec1a4d2d25" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="fc242243-a5b7-4f13-a971-4f373f78e866" data-file-name="components/data-table.tsx">
          <thead className="bg-muted" data-unique-id="8cd08241-1139-45b1-b924-67e82ab7c2f9" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="e186a919-5872-44da-ad67-0fe88a87454e" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" data-unique-id="f5939c33-2bf6-48ec-8c32-c643c723ba36" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="07ecfec1-bd7b-467c-bf14-ce58ce6dd909" data-file-name="components/data-table.tsx">
                      <span data-unique-id="bd02ecc4-88f6-45a8-8280-765e48a2fdb9" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="4eec9343-240a-4a99-8166-61c25c9371ed" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-border" data-unique-id="08d55438-af89-450c-bf5d-d4feb27d9c7f" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className="hover:bg-accent/5" key={row.id} data-unique-id="1bc534ee-4e26-43f2-8914-b77406c3a1e7" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 whitespace-normal text-sm" data-unique-id="5f2bc10b-46a3-423f-a779-5270c1efffbe" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-white" data-unique-id="71986ff1-d521-43f8-b905-8ca620f82373" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="fc39b8b3-dc75-4ce5-9f4c-820f3d2ae7b8" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="3c5e7bcf-b8c6-4655-a0a5-0b04eac27bef" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="76aaca68-f5f1-46cf-91fe-f10d7cd4570f" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="14c0f2aa-41d8-4760-818c-475b66225f30" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="a41b8b07-eb7e-43cd-937d-b4a56ed49c13" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="1e36554f-f7d8-4b20-a96e-cdf932eef319" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="e5155bc8-3fac-47a8-b34e-1011428d215d" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="926973e3-2f10-4585-aee8-bceae50f8ef8" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="daff42ac-1fb8-4c0a-9466-4d6ef5177511" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="fb1385ef-4fcf-496b-b547-9d6b0fdc829a" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="9e9d3ce9-1219-4ffb-bb36-ac3dacf14098" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="91ac5eda-2450-4f12-84bc-7184ba3c22ec" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="27b71332-1a08-4db7-b59b-2b88340af827" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="a7254f31-515a-43de-8ff7-3e19e2801a7d" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ae27b846-5ccd-48b8-9d81-270016462bea" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="25b83158-99c5-4a82-b045-4cc758050b26" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="c615c005-2664-446f-b9d6-781a12e0ddfb" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="cd181dba-b2ec-4960-8e80-ccac0d4f7c16" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="c785eafb-223b-44ca-a78b-93817a7b66ad" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="b271b9d0-ffee-466c-ae42-cb599e7d835a" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="078cbb1a-470d-47f4-84b2-892ff308239e" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="6397c8de-70c7-4263-8a51-f0c2c07fbcb3" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="49b1323f-772f-4214-87cd-780a4508738a" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="28783648-926c-48b9-8fa6-1410c3b8e2da" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="ee1b8007-ccd5-4c78-889e-0dad9283fd16" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="5b00c83d-0c2e-4a75-a71e-d9ad62eefc98" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="40f3d3e0-33ca-42e7-a6c0-fc7cdcac3b62" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="c6a28a06-e5ce-4ed7-aea7-cb7d028811a1" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="1b55eafc-6f81-47d7-85ea-9ae93059b106" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}