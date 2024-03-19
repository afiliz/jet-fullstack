"use client";

import React, { HTMLProps, useEffect } from "react";
import { 
  useReactTable,
  flexRender, 
  getCoreRowModel,
  getSortedRowModel, 
  createColumnHelper
} from "@tanstack/react-table";
import Results from "./components/results";
import { Jet } from "../../lib/types";
import { Rankings } from "../../lib/types";

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
  const [rankings, setRankings] = React.useState<Rankings>([]);

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
      header: 'Select',
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
    // sets title, sorting logic, and accessor for non checkbox columns
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
  
  // compares jets based on drop-down value
  // returns JSON of rankings
  // Note: sometimes ChatGPT does not provide a JSON in a string format,
  // causing an error. Usually reruning the function via the button will work.
  const compare = async () => {
    let comparison = document.getElementById("comparison");
    var comparer;
    if (comparison) {
      comparer = (comparison as HTMLInputElement).value;
    }
    else {
      comparer = "top speed (knots)"; //default if can't get from drop-down
    }

    const selected = table
      .getSelectedRowModel()
      .rows.map(row => row.original);

    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jets: selected, comparison: comparer }),
    });
    
    // get data as a json, where content is a string
    // convert back to json and pass to results component
    const data = await response.json();
    setRankings(JSON.parse(data.choices[0].message.content));
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-32 p-24 bg-gray-50'>
      <h1 className='text-4xl font-bold'>
        AI-Powered Jet Comparison Tool
      </h1>
      <div>
        <h3 className='text-xl font-medium'>Top 10 Charter Jets</h3>
        <table className='w-[600px] border-collapse overflow-hidden shadow-md rounded-lg mt-3'>
          <thead className='p-4 bg-slate-200'>
            {/* Go through each header (in the 1 header group), render based on sorting logic */}
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan} className='text-left p-3'>
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
            {/* Renders cells for each row */}
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id} className='even: bg-slate-100 odd:bg-white'>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} className='p-2'>
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
        <div className='mt-6 flex flex-col items-center justify-center'>
          <p className='text-m mb-3'>
            Ask OpenAI GPT to Compare Selected Jets By
          </p>
          <div className='flex gap-5 items-center'>
            <div>
              <select id="comparison" className='rounded-lg p-4'>
                <option value="top speed (knots)">Top Speed (Knots)</option>
                <option value="fuel efficiency">Fuel Efficiency</option>
                <option value="maximum seats">Maximum Seats</option>
              </select>
            </div>
            <div>
              <button
                className="rounded-lg p-3 bg-black text-white hover:bg-gray-800"
                onClick={compare}
              >
                Compare Selected Jets
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Results 
          rankings={rankings}
        />
      </div>
    </main>
  );
}