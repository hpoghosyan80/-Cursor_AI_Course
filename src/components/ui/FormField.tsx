import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'

interface FormFieldProps {
  label: string
  htmlFor: string
  description?: string
  children: ReactNode
}

export function FormField({ label, htmlFor, description, children }: FormFieldProps) {
  const descriptionId = description ? `${htmlFor}-desc` : undefined

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-900 dark:text-white"
      >
        {label}
      </label>
      {description && (
        <p id={descriptionId} className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
}

export function TextInput({ label, description, id, className = '', ...props }: TextInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FormField label={label} htmlFor={inputId} description={description}>
      <input id={inputId} className={`${inputClassName} ${className}`} {...props} />
    </FormField>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  description?: string
}

export function TextArea({ label, description, id, className = '', ...props }: TextAreaProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FormField label={label} htmlFor={inputId} description={description}>
      <textarea
        id={inputId}
        className={`${inputClassName} min-h-[6rem] resize-y ${className}`}
        {...props}
      />
    </FormField>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  description?: string
  options: { value: string; label: string }[]
}

export function SelectField({
  label,
  description,
  options,
  id,
  className = '',
  ...props
}: SelectFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FormField label={label} htmlFor={inputId} description={description}>
      <select id={inputId} className={`${inputClassName} ${className}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}
