import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({ size = 'md', overlay = false, className }: LoadingSpinnerProps) {
  const spinner = (
    <svg
      className={cn('animate-spin text-primary', sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}
