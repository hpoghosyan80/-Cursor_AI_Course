import { currentProject, type TeamMember } from '@/data/teamData'

export interface ProjectOverviewProps {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
}

const statusStyles = {
  'on-track': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'at-risk': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ProjectOverview({
  totalTasks,
  completedTasks,
  overdueTasks,
}: ProjectOverviewProps) {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <section
      aria-labelledby="project-overview-heading"
      data-testid="project-overview"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="project-overview-heading"
              className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl"
            >
              {currentProject.name}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[currentProject.status]}`}
            >
              {currentProject.status.replace('-', ' ')}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {currentProject.description}
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Due {formatDate(currentProject.dueDate)}
          </p>
        </div>

        <div className="flex gap-6 sm:text-right">
          <div>
            <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {progress}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Complete</p>
          </div>
          {overdueTasks > 0 && (
            <div>
              <p className="text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400">
                {overdueTasks}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Overdue</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>
            {completedTasks} of {totalTasks} tasks done
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Project progress"
          className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}

export interface TeamMemberAvatarsProps {
  members: TeamMember[]
  maxVisible?: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function TeamMemberAvatars({ members, maxVisible = 5 }: TeamMemberAvatarsProps) {
  const visible = members.slice(0, maxVisible)
  const overflow = members.length - maxVisible
  const onlineCount = members.filter((m) => m.isOnline).length

  return (
    <section
      aria-labelledby="team-members-heading"
      data-testid="team-members"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="team-members-heading"
          className="text-sm font-semibold text-slate-900 dark:text-white"
        >
          Team
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {onlineCount} online
        </span>
      </div>

      <ul className="space-y-3" role="list">
        {visible.map((member) => (
          <li key={member.id} className="flex items-center gap-3">
            <div className="relative shrink-0">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt=""
                  className="size-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white"
                >
                  {getInitials(member.name)}
                </span>
              )}
              <span
                aria-label={member.isOnline ? 'Online' : 'Offline'}
                className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                  member.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {member.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {member.role}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {overflow > 0 && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          +{overflow} more members
        </p>
      )}
    </section>
  )
}
