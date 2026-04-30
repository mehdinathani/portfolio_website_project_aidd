import type { Experience } from '@/types/api'

interface TimelineItemProps {
  experience: Experience
  isLast?: boolean
}

export default function TimelineItem({ experience, isLast }: TimelineItemProps) {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className="z-10 h-3 w-3 shrink-0 rounded-full bg-blue-600" />
        {!isLast && <div className="mt-1 w-px grow bg-gray-200" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-gray-900">{experience.role}</h3>
          <span className="text-sm text-gray-500">
            {experience.start_date}
            {experience.end_date ? ` — ${experience.end_date}` : ' — Present'}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-blue-600">{experience.company}</p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
          {experience.responsibilities}
        </p>
      </div>
    </div>
  )
}
