import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { sidebarNavItems } from '@/data/sampleTasks'

const dashboardUser = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan',
}

const settingsSidebarItems = sidebarNavItems.map((item) => ({
  ...item,
  isActive: item.id === 'settings',
}))

export function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account preferences"
      user={dashboardUser}
      sidebarItems={settingsSidebarItems}
      onSettingsClick={() => {}}
    >
      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <SettingsPanel
          onSave={(tab, data) => console.log(`Saved ${tab}:`, data)}
        />
      </div>
    </DashboardLayout>
  )
}
