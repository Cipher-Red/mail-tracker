'use client';

import { useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters, usePagination, useGlobalFilter } from 'react-table';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
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
  const columns = useMemo(() => [{
    Header: 'Order #',
    accessor: 'customerOrderNumber'
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
    }) => <div data-unique-id="ad41ab4d-307f-4f05-a861-0b35e8953377" data-file-name="components/data-table.tsx">
            <div data-unique-id="06db4a79-6453-45be-9e32-81b8902ca1e2" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToLine1}</div>
            <div data-unique-id="c9432f25-7075-4a7d-9014-8cd29e973d23" data-file-name="components/data-table.tsx" data-dynamic-text="true">{row.original.shipToCity}<span className="editable-text" data-unique-id="0b39ea83-37d1-449c-90e6-5b6a920dae1b" data-file-name="components/data-table.tsx">, </span>{row.original.shipToStateProvince} {row.original.shipToPostalCode}</div>
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
      return <div className="space-y-1" data-unique-id="7a30a99a-b0d8-4c3f-ac2e-b91e1cd81ef0" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {value.map((num, idx) => <div key={idx} className="text-sm" data-unique-id="4aed2339-a91b-45b4-8047-0d1a8cd3c1d6" data-file-name="components/data-table.tsx" data-dynamic-text="true">
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
  return <div className="w-full" data-unique-id="19ed2554-0638-4f7e-83e8-21dde7db0a72" data-file-name="components/data-table.tsx" data-dynamic-text="true">
      {/* Search input */}
      <div className="p-4 border-b border-border" data-unique-id="8037fa03-6ccb-4f13-bf26-ea9f79741641" data-file-name="components/data-table.tsx">
        <div className="relative max-w-md" data-unique-id="1aebb994-83b7-4cd1-a616-931d60d583a5" data-file-name="components/data-table.tsx">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-unique-id="2194a06e-7969-463a-822f-db9a3e32cb6b" data-file-name="components/data-table.tsx">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input type="text" value={globalFilter || ''} onChange={handleSearchChange} placeholder="Search orders..." className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" data-unique-id="47387ca9-2ea5-4cf1-8dbd-a7985b77cefd" data-file-name="components/data-table.tsx" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-unique-id="d3b4b8d2-f9f3-4988-a8ab-854ae368b080" data-file-name="components/data-table.tsx">
        <table {...getTableProps()} className="min-w-full divide-y divide-border" data-unique-id="bc6fd2d0-61bd-49f4-b751-773203c48dd7" data-file-name="components/data-table.tsx">
          <thead className="bg-muted" data-unique-id="0c1c0051-6f64-4d96-9640-baac712de3d2" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {headerGroups.map(headerGroup => <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} data-unique-id="f5d5e624-3427-44a9-a6da-b9ba8eadc5d5" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                {headerGroup.headers.map(column => <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" data-unique-id="a6551539-7a06-4474-9c73-0b3748435210" data-file-name="components/data-table.tsx">
                    <div className="flex items-center space-x-1" data-unique-id="d0536c74-07c9-43bf-b414-5ef391a1fc1d" data-file-name="components/data-table.tsx">
                      <span data-unique-id="eaa153b2-b312-4137-bbda-9ebdbfa302dd" data-file-name="components/data-table.tsx" data-dynamic-text="true">{column.render('Header')}</span>
                      <span data-unique-id="2edc22bb-5423-42a9-934a-d08f0be7bdcc" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                        {column.isSorted ? column.isSortedDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" /> : null}
                      </span>
                    </div>
                  </th>)}
              </tr>)}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-border" data-unique-id="db61c492-2e80-4dde-8c35-ef99ed0c8e46" data-file-name="components/data-table.tsx" data-dynamic-text="true">
            {page.map(row => {
            prepareRow(row);
            return <tr {...row.getRowProps()} className={`hover:bg-accent/5 ${onRowClick ? 'cursor-pointer' : ''}`} key={row.id} onClick={() => onRowClick && onRowClick(row.original)} data-unique-id="a057bb12-d995-4446-b644-1195f8e37c0c" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                  {row.cells.map(cell => <td key={cell.column.id} {...cell.getCellProps()} className="px-6 py-4 whitespace-normal text-sm" data-unique-id="b45c268a-fe1e-422c-aaa4-51a12701a9ed" data-file-name="components/data-table.tsx" data-dynamic-text="true">
                      {cell.render('Cell')}
                    </td>)}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border bg-white" data-unique-id="553c477b-0d60-4fe4-a7b2-8fa44aeaa634" data-file-name="components/data-table.tsx">
        <div className="flex-1 flex justify-between sm:hidden" data-unique-id="c5511dc3-f672-45ec-a3c7-781b42195ade" data-file-name="components/data-table.tsx">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="db788a2d-a4b8-4f1f-b55e-7057ccb072d5" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="6861907a-74fb-4f63-838c-0b083baaa648" data-file-name="components/data-table.tsx">
            Previous
          </span></button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md bg-white disabled:opacity-50" data-unique-id="acfaa665-02e0-45e7-9776-dad93628fd58" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="8a4cd523-2119-41b4-b7e9-59da56ce6870" data-file-name="components/data-table.tsx">
            Next
          </span></button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" data-unique-id="5579f786-733c-40f3-a915-f906b3f8ed00" data-file-name="components/data-table.tsx">
          <div className="flex gap-x-2 items-baseline" data-unique-id="a6361a15-a96d-4c69-85fc-5fefad7740f0" data-file-name="components/data-table.tsx">
            <span className="text-sm text-gray-700" data-unique-id="08d81402-b98c-4cbf-9466-c6b45fa892cb" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="4b39571f-604a-47d3-a80a-bf3ebd434bae" data-file-name="components/data-table.tsx">
              Page </span><span className="font-medium" data-unique-id="d22ba947-e64c-42b1-93c6-0cbbff812988" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageIndex + 1}</span><span className="editable-text" data-unique-id="e38055c8-d87f-4d27-a4f7-5c60bed8c372" data-file-name="components/data-table.tsx"> of </span><span className="font-medium" data-unique-id="6b29c7a0-7c3e-496e-8def-16bc8faa4bf2" data-file-name="components/data-table.tsx" data-dynamic-text="true">{pageOptions.length}</span>
            </span>
            <select value={pageSize} onChange={e => {
            setPageSize(Number(e.target.value));
          }} className="mt-1 block w-full py-2 px-3 border border-border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" data-unique-id="4a2494ac-25b0-4ff5-9981-101088b90eaf" data-file-name="components/data-table.tsx" data-dynamic-text="true">
              {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize} data-unique-id="09327944-ff20-4927-aea2-774951516338" data-file-name="components/data-table.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="700fc3d5-ab28-4be5-bd09-ebb5f772f3f7" data-file-name="components/data-table.tsx">
                  Show </span>{pageSize}
                </option>)}
            </select>
          </div>
          <div data-unique-id="1dde2fb6-5bc4-4479-b8a9-ea49534fe78e" data-file-name="components/data-table.tsx">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-unique-id="fad3c293-e621-449c-864c-66391f066c74" data-file-name="components/data-table.tsx">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="1fba9a17-1a13-4eb8-b502-82a6b1c40983" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="b47f09ec-889e-4b39-b12c-e1796bef4d53" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="28572c27-cca8-4fcf-ad0d-5f1d6119115c" data-file-name="components/data-table.tsx">First</span></span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="0d7b89ae-06c0-4682-a122-b107a1bf963c" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="bae3ed35-133e-4e83-bebb-3224fcc57b72" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="a030e827-00b0-46fc-819b-247cdff7f76b" data-file-name="components/data-table.tsx">Previous</span></span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="02f91bdb-269d-4285-952e-871d91ad57c3" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="4b4cdba1-6d20-4102-bd20-b93a13d20f83" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="200fc15d-040f-4b17-961f-0cbec8fd84da" data-file-name="components/data-table.tsx">Next</span></span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-white text-sm font-medium hover:bg-accent/5 disabled:opacity-50" data-unique-id="511ce3fe-ad98-4e31-aede-dd422e22ca4d" data-file-name="components/data-table.tsx">
                <span className="sr-only" data-unique-id="c8660ee8-205e-49cc-8c09-6f318cada200" data-file-name="components/data-table.tsx"><span className="editable-text" data-unique-id="3fdf8b48-bdb9-4486-95f0-c3b1d7f52e5c" data-file-name="components/data-table.tsx">Last</span></span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>;
}