import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { DashboardHeader, type DashboardUser } from '@/components/dashboard/DashboardHeader'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useTheme } from '@/hooks/useTheme'
import type { SidebarNavItem } from '@/data/sampleTasks'

export interface DashboardLayoutProps {
  title: string
  subtitle?: string
  user: DashboardUser
  sidebarItems: SidebarNavItem[]
  children: ReactNode
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
}

export function DashboardLayout({
  title,
  subtitle,
  user,
  sidebarItems,
  children,
  onProfileClick,
  onSettingsClick,
  onLogout,
}: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  useEffect(() => {
    if (!sidebarOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="flex min-h-svh bg-slate-50 dark:bg-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <DashboardSidebar
        items={sidebarItems}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(true)}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogout={onLogout}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
