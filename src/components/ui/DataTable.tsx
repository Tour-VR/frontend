import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  emptyMessage: string;
}

/** Tabela padrao das listagens do painel. Mostra `emptyMessage` quando nao ha linhas. */
export function DataTable<T>({ columns, rows, getRowId, emptyMessage }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-gray-700">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
