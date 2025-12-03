// Table.js
import React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import Pagination from "./Pagination";

const Table = ({ columns, data, loading, pagination, columnVisibility }) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="table-outer">
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        <table className="default-table manage-job-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  header.isPlaceholder ? null : (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  No data found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {pagination && <Pagination {...pagination} />}
      </>
    )}
  </div>
  
  );
};


export default Table;