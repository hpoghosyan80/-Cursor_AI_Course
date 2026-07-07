import { Button } from '@/components/ui/Button'

export interface QuickActionsProps {
  onNewTask: () => void
  onInviteMember?: () => void
  onAddNote?: () => void
  onViewReports?: () => void
}

const actions = [
  { id: 'new-task', label: 'New task', icon: '✚', primary: true },
  { id: 'invite', label: 'Invite member', icon: '👤', primary: false },
  { id: 'note', label: 'Add note', icon: '📝', primary: false },
  { id: 'reports', label: 'View reports', icon: '📊', primary: false },
] as const

export function QuickActions({
  onNewTask,
  onInviteMember,
  onAddNote,
  onViewReports,
}: QuickActionsProps) {
  const handlers: Record<string, () => void> = {
    'new-task': onNewTask,
    invite: onInviteMember ?? (() => {}),
    note: onAddNote ?? (() => {}),
    reports: onViewReports ?? (() => {}),
  }

  return (
    <section
      aria-labelledby="quick-actions-heading"
      data-testid="quick-actions"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
    >
      <h2
        id="quick-actions-heading"
        className="mb-4 text-sm font-semibold text-slate-900 dark:text-white"
      >
        Quick actions
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) =>
          action.primary ? (
            <Button
              key={action.id}
              data-testid={`quick-action-${action.id}`}
              className="col-span-2 flex items-center justify-center gap-2 sm:col-span-1 lg:col-span-2 xl:col-span-1"
              onClick={handlers[action.id]}
            >
              <span aria-hidden="true">{action.icon}</span>
              {action.label}
            </Button>
          ) : (
            <button
              key={action.id}
              type="button"
              data-testid={`quick-action-${action.id}`}
              onClick={handlers[action.id]}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <span aria-hidden="true">{action.icon}</span>
              {action.label}
            </button>
          ),
        )}
      </div>
    </section>
  )
}
