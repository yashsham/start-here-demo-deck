import type { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  emptyMessage = "No matching records found.",
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border/80 bg-card ${className}`}>
      <table className="w-full min-w-[700px] text-left text-xs">
        <thead className="bg-secondary/70 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-3.5 py-3 first:pl-5 last:pr-5 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className="transition-colors hover:bg-secondary/30"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-3.5 py-3 first:pl-5 last:pr-5 ${col.className ?? ""}`}
                  >
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? "—")
                      : "—"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-8 text-center text-xs text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
