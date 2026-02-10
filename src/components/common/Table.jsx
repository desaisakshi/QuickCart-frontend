export default function Table({ columns, data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col}
                  className={`px-6 py-4 text-left font-semibold text-gray-600 ${
                    index === 0 ? 'w-2/5' : index === 1 ? 'w-1/5 text-center' : 'w-2/5 text-right'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, i) => {
              const values = Object.values(row);
              return (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  {values.map((val, j) => (
                    <td
                      key={j}
                      className={`px-6 py-4 ${
                        j === 0
                          ? 'text-gray-800 font-medium text-left'
                          : j === 1
                          ? 'text-center'
                          : 'text-gray-700 text-right'
                      }`}
                    >
                      {j === 1 && val ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {val}
                        </span>
                      ) : (
                        val ?? "-"
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}