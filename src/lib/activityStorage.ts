import type { Activity } from '@/data/teamData'
import { seedActivities } from '@/data/teamData'

function activitiesKey(userId: string) {
  return `taskflow-activities-${userId}`
}

export function loadActivities(userId: string): Activity[] {
  try {
    const raw = localStorage.getItem(activitiesKey(userId))
    if (raw) return JSON.parse(raw) as Activity[]
    return [...seedActivities]
  } catch {
    return [...seedActivities]
  }
}

export function saveActivities(userId: string, activities: Activity[]) {
  localStorage.setItem(activitiesKey(userId), JSON.stringify(activities))
}

export function addActivity(
  userId: string,
  activity: Omit<Activity, 'id' | 'timestamp'>,
): Activity[] {
  const activities = loadActivities(userId)
  const entry: Activity = {
    ...activity,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
  const updated = [entry, ...activities].slice(0, 50)
  saveActivities(userId, updated)
  return updated
}
