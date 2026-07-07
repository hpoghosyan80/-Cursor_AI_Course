export interface TeamMember {
  id: string
  name: string
  role: string
  avatarUrl?: string
  isOnline: boolean
}

export interface ProjectInfo {
  id: string
  name: string
  description: string
  dueDate: string
  status: 'on-track' | 'at-risk' | 'completed'
}

export type ActivityType =
  | 'task_created'
  | 'task_completed'
  | 'task_updated'
  | 'task_deleted'
  | 'comment'
  | 'member_joined'

export interface Activity {
  id: string
  type: ActivityType
  userId: string
  userName: string
  message: string
  timestamp: string
  taskTitle?: string
}

export const currentProject: ProjectInfo = {
  id: 'proj-1',
  name: 'Q3 Product Launch',
  description:
    'Cross-functional initiative to ship the new collaboration dashboard, mobile app updates, and onboarding improvements.',
  dueDate: '2026-09-30',
  status: 'on-track',
}

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Jordan Lee',
    role: 'Project Lead',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan',
    isOnline: true,
  },
  {
    id: 'tm-2',
    name: 'Alex Rivera',
    role: 'Designer',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
    isOnline: true,
  },
  {
    id: 'tm-3',
    name: 'Morgan Chen',
    role: 'Engineer',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Morgan',
    isOnline: false,
  },
  {
    id: 'tm-4',
    name: 'Sam Okonkwo',
    role: 'QA Lead',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sam',
    isOnline: true,
  },
  {
    id: 'tm-5',
    name: 'Taylor Brooks',
    role: 'Product Manager',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Taylor',
    isOnline: false,
  },
]

export const seedActivities: Activity[] = [
  {
    id: 'act-seed-1',
    type: 'member_joined',
    userId: 'tm-4',
    userName: 'Sam Okonkwo',
    message: 'joined the project',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'act-seed-2',
    type: 'comment',
    userId: 'tm-2',
    userName: 'Alex Rivera',
    message: 'shared updated mockups in Figma',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'act-seed-3',
    type: 'task_completed',
    userId: 'tm-3',
    userName: 'Morgan Chen',
    message: 'completed a task',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    taskTitle: 'API integration review',
  },
]

export const statusChartColors: Record<string, string> = {
  'To do': 'bg-slate-400',
  'In progress': 'bg-indigo-500',
  'In review': 'bg-amber-500',
  Done: 'bg-emerald-500',
}
