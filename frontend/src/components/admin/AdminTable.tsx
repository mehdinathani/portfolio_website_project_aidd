'use client'

interface Column<T> {
  key: string
  title: string
  render: (item: T) => React.ReactNode
  className?: string
}

interface AdminTableProps<T> {
  columns: Column<T>[]
  data: T[]
  getKey: (item: T) => string
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage?: string
}

export default function AdminTable<T>({
  columns,
  data,
  getKey,
  onEdit,
  onDelete,
  emptyMessage = 'No records found.',
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop table */}
      <table className="hidden min-w-full divide-y divide-gray-200 md:table">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${col.className || ''}`}
              >
                {col.title}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => (
            <tr key={getKey(item)} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-sm text-gray-900 ${col.className || ''}`}>
                  {col.render(item)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right text-sm">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="mr-3 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {data.map((item) => (
          <div key={getKey(item)} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            {columns.map((col) => (
              <div key={col.key} className="mb-2 last:mb-0">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  {col.title}
                </span>
                <div className="mt-1 text-sm text-gray-900">{col.render(item)}</div>
              </div>
            ))}
            {(onEdit || onDelete) && (
              <div className="mt-3 flex gap-4 border-t border-gray-100 pt-3">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
