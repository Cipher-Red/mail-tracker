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
    }) => <div data-unique-id="c8098dfa-e71e-4ce8-8f8e-403b2cafce5c" data-file-name="components/data-table.tsx">
          <div data-unique-id="966d28b0-5ed8-41a3-9f24-a186eb16ea5e" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
          <div data-unique-id="f078a9a3-bf90-4bfb-b7eb-112a018d8500" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="7e385510-f5ca-4c2f-af35-5b9291cffcac" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
    }) => <div className="space-y-1" data-unique-id="666c5ad3-99a0-4582-b760-37f9362a8159" data-file-name="components/data-table.tsx" data-dynamic-text="true">
          {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="db2726a9-2f17-463a-966b-32287472ab9a" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full" data-unique-id="c85be963-0419-4f36-aa08-69fbb01072f0" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="3ccb1d18-876b-4441-be1b-59bb2b0badef" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="c04a38f0-b7fd-4432-9c3a-9c7aaddc1650" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="0e147429-d5b8-4f9c-8083-408bebe6ca12" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" data-unique-id="3631a42e-4cdf-48e6-86f6-641fa7882c06" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="519fdfcc-a4e2-49b3-bcba-e5030a0db00f" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="e4875237-ff56-4b77-ac31-5e8943c49156" data-file-name="components/data-table.tsx">
          <thead className="bg-muted" data-unique-id="c5ad3ef2-139a-4dc2-a12d-ec9644494cc3" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="4f0154a9-d97a-423d-b113-d1f467b91ebd" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" data-unique-id="713e07f7-0e2b-4944-bc01-fb1f98ee95a2" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="6c5c4e37-227f-4ef0-a2e2-6d4799f3ec9e" data-file-name="components/data-table.tsx">
                      <span data-unique-id="2cfd9812-2773-4727-9b30-8a1ec129785e" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="e8186155-0679-4da4-9e16-22384495bdb6" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-border" data-unique-id="1bd4f0ce-6a4f-4069-9c82-47cdb4130b0a" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className="hover:bg-accent/5" key={row.id} data-unique-id="19ab3aaf-e875-4a4c-8003-8386c6027a06" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 whitespace-normal text-sm" data-unique-id="ea3e7d0b-8880-4dc2-afe1-7d43a7858d5a" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-white" data-unique-id="4bd523d7-9e4a-429c-8783-c40c3a0b17c7" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="2538b6a5-0d7e-4b6d-a97e-2937981dacf3" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="eed19d98-ebee-4010-8773-e3943168a91e" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="4d361140-438b-4460-9c48-6dea132a4f10" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="56e9f564-6936-4d15-9a09-2b65d5d70d50" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="674979c2-8ca6-478f-8df7-21d0e75c2f9e" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="2f95f76f-d002-42d5-b137-c9b4eeea08c8" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="a9d84396-470f-459c-a8fd-cb8c872631d5" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="7bd74bde-3102-4395-8f85-53906bab4ca7" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="b02efc69-fa64-47aa-a9a5-d1d14de2cc27" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="8359e860-c3bb-4588-880c-29a75488182b" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="2ec011aa-3610-4308-b52a-a67437abcc6c" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="25ecfbf2-f379-4d5a-a0b3-ede569511567" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="826eb1d9-e67b-453e-aa09-b7c3db2800ea" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="97bc9e81-faa2-43cb-b821-99989ec75aae" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f7d7bc55-6867-4ed4-9453-77fd69d5810e" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="9c1d36a5-35af-457a-99c6-6167f9343ab1" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="1e1fc15a-250a-45b2-8fbc-fa1610c84995" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="b567766a-a4b1-4d20-b21c-99a26bed6598" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="77adcdd0-08b5-4e59-afaf-91e41cd81889" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="a98da8aa-efa0-43e5-ac64-1caee4d9f60c" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="8eca8e88-5123-4cb8-84cb-d81fddb9feb0" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="e51fad6d-d7f7-4fbe-8437-77f782557546" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="7a0ea6e3-295e-4484-b0e7-9b06c113e9bb" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="1b976ecd-0e4b-4f63-9951-2cf014ce4001" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="404fadd8-c12c-4aba-af2a-fa8e25fe5326" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="87efe2a7-f5aa-4069-85b8-dfb381f9eaab" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="1bb96275-6bd8-4941-9ede-2a6be1995cd4" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="76914654-f7ec-4315-9f66-a13638e598c3" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="e4c584c2-f496-4d0e-a14d-c270e4c4c69e" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}