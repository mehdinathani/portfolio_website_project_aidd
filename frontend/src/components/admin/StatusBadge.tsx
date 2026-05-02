'use client'

interface StatusBadgeProps {
  status: string
  onChange?: (newStatus: string) => void
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  reviewed: 'bg-purple-50 text-purple-700 border-purple-200',
  replied: 'bg-green-50 text-green-700 border-green-200',
  archived: 'bg-gray-50 text-gray-600 border-gray-200',
}

const STATUSES = ['new', 'reviewed', 'replied', 'archived']

export default function StatusBadge({ status, onChange }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status.toLowerCase()] || STATUS_COLORS.new

  if (!onChange) {
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    )
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-gray-900">
          {s}
        </option>
      ))}
    </select>
  )
}
