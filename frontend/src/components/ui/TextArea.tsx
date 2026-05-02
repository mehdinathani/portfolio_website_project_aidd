import { cn } from '@/lib/utils'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  autoResize?: boolean
  maxLength?: number
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, autoResize, maxLength, id, value, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.target as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      }
      props.onInput?.(e)
    }

    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="space-y-1 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          onInput={handleInput}
          {...props}
        />
        <div className="flex justify-between">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {maxLength && (
            <p className="text-xs text-muted-foreground ml-auto">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
