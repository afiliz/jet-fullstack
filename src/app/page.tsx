"use client";

import Image from "next/image";
import React, { HTMLAttributes, HTMLProps, useEffect } from "react";
import fakedata from "../mock_data.json";
import { 
  useReactTable,
  flexRender, 
  getCoreRowModel,
  getSortedRowModel, 
  createColumnHelper
} from "@tanstack/react-table";
import { Jet, Jets } from "../../lib/types";

// component for checkbox for each row
function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  // use ref to access checkbox input DOM, and update state through table fns
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}

export default function Home() {
  const [data, setData] = React.useState<Jet[]>([]);
  const columnHelper = createColumnHelper<Jet>();
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    fetch('/api/jets')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  // set format for each column, including title and how to access data
  const columns = [
    // creates checkbox for each row, enabling row selection via table fns
    columnHelper.display( {
      id: 'selection',
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor('wingspan', {
      header: 'Wingspan',
      cell: info => info.getValue(),
      sortingFn: 'basic',
      sortDescFirst: true,
    }),
    columnHelper.accessor('engines', {
      header: 'Engines',
      cell: info => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor('year', {
      header: 'Year',
      cell: info => info.getValue(),
      enableSorting: false,
    })
  ]


  // set columns, data, and properties of table (sorting, row selection)
  const table = useReactTable({
    columns: columns,
    data: data,
    initialState: {
      sorting: [
        { id: 'wingspan', desc: true }
      ]
    },
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>testing 1 2 3</div>
      <table>
        <thead>
          {/* display headers. currently only 1 header group */}
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                // check if column is sortable. if so, allow clicking to toggle sort desc -> asc -> as is 
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {/* render column with custom markup via flexRender */}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ▲',
                          desc: ' ▼',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        <button
          className="border rounded p-2 mb-2"
          onClick={() =>
            console.info(
              'table.getSelectedRowModel().flatRows',
              table.getSelectedRowModel().flatRows
            )
          }
        >
          Log table.getSelectedRowModel().flatRows
        </button>
      </div>
      <div>
        <label>Row Selection State:</label>
        <pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre>
      </div>
    </main>
  );


}
