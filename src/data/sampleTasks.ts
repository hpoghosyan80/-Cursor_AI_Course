export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export interface TaskAssignee {
  name: string
  avatarUrl?: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  assignee?: TaskAssignee
  tags: string[]
}

export interface DashboardStat {
  id: string
  label: string
  value: number | string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface SidebarNavItem {
  id: string
  label: string
  href: string
  icon: string
  isActive?: boolean
  badge?: number
}

export const dashboardStats: DashboardStat[] = [
  {
    id: 'total',
    label: 'Total tasks',
    value: 24,
    change: '+3 this week',
    trend: 'up',
  },
  {
    id: 'in-progress',
    label: 'In progress',
    value: 8,
    change: '2 due today',
    trend: 'neutral',
  },
  {
    id: 'completed',
    label: 'Completed',
    value: 12,
    change: '+5 vs last week',
    trend: 'up',
  },
  {
    id: 'overdue',
    label: 'Overdue',
    value: 2,
    change: 'Needs attention',
    trend: 'down',
  },
]

export const sidebarNavItems: SidebarNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '#', icon: 'grid', isActive: true },
  { id: 'tasks', label: 'My Tasks', href: '#tasks', icon: 'check', badge: 8 },
  { id: 'projects', label: 'Projects', href: '#projects', icon: 'folder' },
  { id: 'calendar', label: 'Calendar', href: '#calendar', icon: 'calendar' },
  { id: 'team', label: 'Team', href: '#team', icon: 'users' },
  { id: 'settings', label: 'Settings', href: '#settings', icon: 'settings' },
]

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Redesign onboarding flow',
    description:
      'Update the first-run experience with clearer steps and progress indicators for new users.',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-07-10',
    assignee: {
      name: 'Alex Rivera',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
    },
    tags: ['Design', 'UX'],
  },
  {
    id: '2',
    title: 'Fix authentication timeout bug',
    description:
      'Sessions expire unexpectedly after 15 minutes. Investigate token refresh logic.',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-07-08',
    assignee: {
      name: 'Jordan Lee',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan',
    },
    tags: ['Bug', 'Backend'],
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all v2 endpoints with request/response examples and error codes.',
    priority: 'medium',
    status: 'review',
    dueDate: '2026-07-12',
    assignee: {
      name: 'Morgan Chen',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Morgan',
    },
    tags: ['Docs'],
  },
  {
    id: '4',
    title: 'Set up CI pipeline',
    description: 'Configure GitHub Actions for lint, test, and deploy on merge to main.',
    priority: 'medium',
    status: 'done',
    dueDate: '2026-07-05',
    tags: ['DevOps'],
  },
  {
    id: '5',
    title: 'User research interviews',
    description: 'Schedule and conduct 5 interviews with power users about task workflows.',
    priority: 'low',
    status: 'todo',
    dueDate: '2026-07-15',
    assignee: {
      name: 'Sam Okonkwo',
    },
    tags: ['Research'],
  },
  {
    id: '6',
    title: 'Performance audit',
    description: 'Run Lighthouse audits and address critical performance bottlenecks.',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2026-07-09',
    tags: ['Performance', 'Frontend'],
  },
]
