import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'blue' | 'green' | 'purple' | 'orange'
  dot?: boolean
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-input text-foreground',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
}

export function Badge({ className, variant = 'default', dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
