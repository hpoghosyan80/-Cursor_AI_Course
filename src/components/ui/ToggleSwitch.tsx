import { useId, type InputHTMLAttributes } from 'react'

export interface ToggleSwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export function ToggleSwitch({
  label,
  description,
  id,
  className = '',
  ...props
}: ToggleSwitchProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = description ? `${inputId}-desc` : undefined

  return (
    <div
      className={`flex items-start justify-between gap-4 ${className}`}
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-900 dark:text-white"
        >
          {label}
        </label>
        {description && (
          <p
            id={descriptionId}
            className="mt-0.5 text-sm text-slate-500 dark:text-slate-400"
          >
            {description}
          </p>
        )}
      </div>

      <div className="relative shrink-0">
        <input
          {...props}
          id={inputId}
          type="checkbox"
          role="switch"
          aria-describedby={descriptionId}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="block h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 peer-checked:bg-indigo-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-500 dark:bg-slate-700 dark:peer-checked:bg-indigo-500"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5"
        />
      </div>
    </div>
  )
}
