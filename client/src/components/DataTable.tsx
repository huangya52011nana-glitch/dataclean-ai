interface Props {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export default function DataTable({ headers, rows, totalRows }: Props) {
  if (!headers.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">📊 数据预览</h3>
        <span className="text-sm text-gray-400">
          {totalRows > 100 ? `显示前 100 行，共 ${totalRows} 行` : `共 ${totalRows} 行`}
        </span>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
