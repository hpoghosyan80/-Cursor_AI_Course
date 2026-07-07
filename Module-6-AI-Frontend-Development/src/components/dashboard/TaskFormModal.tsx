import { useState, type FormEvent } from 'react'
import type { TaskPriority } from '@/data/sampleTasks'
import { Button } from '@/components/ui/Button'

export interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: {
    title: string
    description: string
    priority: TaskPriority
    dueDate: string
  }) => { error?: string }
}

export function TaskFormModal({ isOpen, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError('')

    const result = onSubmit({ title, description, priority, dueDate })
    if (result.error) {
      setError(result.error)
      return
    }

    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    onClose()
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleClose}
      />

      <dialog
        open
        aria-labelledby="task-form-title"
        data-testid="task-form-modal"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h2
          id="task-form-title"
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          Create new task
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              data-testid="task-form-error"
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="task-title"
              className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
            >
              Title
            </label>
            <input
              id="task-title"
              data-testid="task-title-input"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="task-description"
              data-testid="task-description-input"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-priority"
                className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
              >
                Priority
              </label>
              <select
                id="task-priority"
                data-testid="task-priority-select"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-due-date"
                className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
              >
                Due date
              </label>
              <input
                id="task-due-date"
                data-testid="task-due-date-input"
                type="date"
                required
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" data-testid="task-form-submit">
              Create task
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
