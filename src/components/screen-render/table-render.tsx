/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react"; 
import { useFakeApi } from "@/hooks/use-get-screen-render";
import { ComponentSchema } from "@/types/screen.types";

export default function TableRenderer({ schema }: { schema: ComponentSchema }) {
  const columns = schema.props?.columns ?? [];
  const pageSize = schema.dataSource?.pagination?.pageSize ?? 10;

  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const { data, isLoading } = useFakeApi({
    url: schema.dataSource?.url || "/fake/orders",
    pageIndex,
    pageSize,
    sorting,
  });

  const toggleSort = (id: string) => {
    const current = sorting.find((s) => s.id === id);
    if (!current) setSorting([{ id, desc: false }]);
    else if (!current.desc) setSorting([{ id, desc: true }]);
    else setSorting([]);
    setPageIndex(0);
  };

  return (
    <div className="rounded border p-4">
      {isLoading && <div>Loading...</div>}

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th
                key={col.accessor}
                className="cursor-pointer border-b px-2 py-1 text-left"
                onClick={() => toggleSort(col.accessor)}
              >
                {col.header}
                {sorting[0]?.id === col.accessor
                  ? sorting[0].desc
                    ? " 🔽"
                    : " 🔼"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.rows?.map((row: any) => (
            <tr key={row.id} className="border-b">
              {columns.map((col: any) => (
                <td key={col.accessor} className="px-2 py-1">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex items-center gap-3">
        <button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          className="rounded bg-gray-100 px-3 py-1"
        >
          Prev
        </button>
        <span>
          Page {pageIndex + 1} / {Math.ceil((data?.total ?? 0) / pageSize) || 1}
        </span>
        <button
          onClick={() => setPageIndex((p) => p + 1)}
          className="rounded bg-gray-100 px-3 py-1"
        >
          Next
        </button>
      </div>
    </div>
  );
}
