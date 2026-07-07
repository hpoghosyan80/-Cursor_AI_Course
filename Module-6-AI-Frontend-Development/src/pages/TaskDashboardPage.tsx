import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatWidget } from '@/components/dashboard/StatWidget'
import { TaskCard } from '@/components/dashboard/TaskCard'
import { TaskFormModal } from '@/components/dashboard/TaskFormModal'
import { ActivityFeed } from '@/components/team/ActivityFeed'
import { ProjectOverview, TeamMemberAvatars } from '@/components/team/ProjectOverview'
import { QuickActions } from '@/components/team/QuickActions'
import { TaskProgressChart } from '@/components/team/TaskProgressChart'
import { useAuth } from '@/context/AuthContext'
import { useTasks } from '@/context/TaskContext'
import { teamMembers } from '@/data/teamData'
import { sidebarNavItems, type DashboardStat, type TaskStatus } from '@/data/sampleTasks'

export function TaskDashboardPage() {
  const { user, logout } = useAuth()
  const { tasks, activities, createTask, updateTaskStatus, deleteTask, addNote } =
    useTasks()
  const navigate = useNavigate()
  const chartRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTasks =
    filter === 'all' ? tasks : tasks.filter((task) => task.status === filter)

  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && new Date(t.dueDate) < new Date(),
  ).length

  const dashboardStats = useMemo<DashboardStat[]>(() => {
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length

    return [
      { id: 'total', label: 'Total tasks', value: tasks.length, trend: 'neutral' },
      {
        id: 'in-progress',
        label: 'In progress',
        value: inProgress,
        change: `${inProgress} active`,
        trend: 'neutral',
      },
      {
        id: 'completed',
        label: 'Completed',
        value: completedTasks,
        change: `${completedTasks} done`,
        trend: 'up',
      },
      {
        id: 'overdue',
        label: 'Overdue',
        value: overdueTasks,
        change: overdueTasks > 0 ? 'Needs attention' : 'All on track',
        trend: overdueTasks > 0 ? 'down' : 'up',
      },
    ]
  }, [tasks, completedTasks, overdueTasks])

  const statusCounts = useMemo(
    () => [
      { label: 'To do', value: tasks.filter((t) => t.status === 'todo').length },
      { label: 'In progress', value: tasks.filter((t) => t.status === 'in-progress').length },
      { label: 'In review', value: tasks.filter((t) => t.status === 'review').length },
      { label: 'Done', value: completedTasks },
    ],
    [tasks, completedTasks],
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const scrollToChart = () => {
    chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!user) return null

  return (
    <DashboardLayout
      title="Team Dashboard"
      subtitle="Q3 Product Launch — collaborate and track progress"
      user={{ name: user.name, email: user.email }}
      sidebarItems={sidebarNavItems}
      onLogout={handleLogout}
    >
      <div
        className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8"
        data-testid="dashboard-page"
      >
        {/* Top row: project overview + quick actions */}
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <ProjectOverview
              totalTasks={tasks.length}
              completedTasks={completedTasks}
              overdueTasks={overdueTasks}
            />
          </div>
          <QuickActions
            onNewTask={() => setIsModalOpen(true)}
            onInviteMember={() => alert('Invite link copied to clipboard!')}
            onAddNote={() => {
              const note = prompt('Add a team note:')
              if (note) addNote(note)
            }}
            onViewReports={scrollToChart}
          />
        </div>

        {/* Stats row */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Key metrics
          </h2>
          <div
            data-testid="stats-grid"
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {dashboardStats.map((stat) => (
              <StatWidget key={stat.id} stat={stat} />
            ))}
          </div>
        </section>

        {/* Team + charts row */}
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <TeamMemberAvatars members={teamMembers} />

          <div ref={chartRef} className="lg:col-span-1">
            <TaskProgressChart statusCounts={statusCounts} />
          </div>

          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </div>

        {/* Recent tasks */}
        <section aria-labelledby="tasks-heading">
          <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="tasks-heading"
                className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl"
              >
                Recent tasks
              </h2>
              <p
                data-testid="task-count"
                className="mt-1 text-sm text-slate-500 dark:text-slate-400"
              >
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}{' '}
                shown
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Filter tasks by status"
                data-testid="task-filter-group"
                className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
              >
                {(
                  [
                    ['all', 'All'],
                    ['todo', 'To do'],
                    ['in-progress', 'In progress'],
                    ['review', 'Review'],
                    ['done', 'Done'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    data-testid={`filter-${value}`}
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                      filter === value
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <Button
                data-testid="new-task-button"
                className="shrink-0"
                onClick={() => setIsModalOpen(true)}
              >
                + New task
              </Button>
            </div>
          </div>

          <div
            data-testid="task-list"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <p
              role="status"
              data-testid="empty-task-list"
              className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
            >
              No tasks match this filter.
            </p>
          )}
        </section>
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTask}
      />
    </DashboardLayout>
  )
}
