import { ReactNode } from 'react';

interface TableColumn {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => ReactNode;
  width?: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  rowActions?: (row: any) => ReactNode;
  emptyMessage?: string;
  striped?: boolean;
  hover?: boolean;
}

export function Table({
  columns,
  data,
  rowActions,
  emptyMessage = 'No data available',
  striped = true,
  hover = true,
}: TableProps) {
  if (data.length === 0) {
    return (
      <div className="card flex items-center justify-center py-12">
        <p className="text-slate-500 text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-slate-200 -mx-1 sm:mx-0">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="table-cell font-semibold text-left text-slate-700"
                style={{ width: col.width, minWidth: '80px' }}
              >
                {col.header}
              </th>
            ))}
            {rowActions && <th className="table-cell font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`border-b border-slate-200 ${
                striped && rowIdx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
              } ${hover ? 'hover:bg-slate-100' : ''} transition-colors`}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="table-cell break-words">
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
              {rowActions && (
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-2 flex-wrap">
                    {rowActions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
