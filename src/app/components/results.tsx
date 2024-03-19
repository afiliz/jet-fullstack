import React from "react";
import { 
  useReactTable,
  flexRender, 
  getCoreRowModel,
  createColumnHelper
} from "@tanstack/react-table";
import { Rank, Rankings } from "../../../lib/types";

// set column definitions
export default function Results( { rankings }: { rankings: Rankings } ) {
  const columnHelper = createColumnHelper<Rank>();

  const columns = [
    columnHelper.accessor('rank', {
      header: 'Rank',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
      sortingFn: 'basic',
      sortDescFirst: true,
    }),
    columnHelper.accessor('value', {
      header: 'Value',
      cell: info => info.getValue(),
      enableSorting: false,
    })
  ]

  // no need for sorting or checkbox fns
  const table = useReactTable({
    columns: columns,
    data: rankings,
    getCoreRowModel: getCoreRowModel(),
  });

  // render table as in page.tsx
  return (
    <div>
      <table className="w-[600px] border-collapse overflow-hidden shadow-md rounded-lg">
        <thead className='p-4 bg-slate-200'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='text-left p-3'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className='even: bg-slate-100 odd:bg-white'>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='p-2'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
