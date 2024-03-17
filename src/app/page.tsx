"use client";

import Image from "next/image";
import * as React from "react";
import fakedata from "../mock_data.json";
import { useTable } from "react-table";

export default function Home() {
  console.log(fakedata);
  const data = React.useMemo(() => fakedata, []);
  const columns = React.useMemo(() => [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Wingspan",
      accessor: "wingspan",
    },
    {
      Header: "Engines",
      accessor: "engines",
    },
    {
      Header: "Year",
      accessor: "year",
    },
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = 
    useTable({ columns, data });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>testing 1 2 3</div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
