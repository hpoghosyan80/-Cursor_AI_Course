import {
  useCallback,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { Button } from '@/components/ui/Button'
import {
  FormSection,
  SelectField,
  TextArea,
  TextInput,
} from '@/components/ui/FormField'
import { ToggleSwitch } from '@/components/ui/ToggleSwitch'
import { useTheme, type Theme } from '@/hooks/useTheme'

export type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance'

export interface SettingsPanelProps {
  onSave?: (tab: SettingsTab, data: Record<string, unknown>) => void
  className?: string
}

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'appearance', label: 'Appearance' },
]

function SaveButton({
  tab,
  isSaving,
  saved,
}: {
  tab: SettingsTab
  isSaving: boolean
  saved: boolean
}) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving…' : 'Save changes'}
      </Button>
      {saved && (
        <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
          {tab.charAt(0).toUpperCase() + tab.slice(1)} settings saved.
        </p>
      )}
    </div>
  )
}

function ProfileTab({
  onSave,
  isSaving,
  saved,
}: {
  onSave: (data: Record<string, unknown>) => void
  isSaving: boolean
  saved: boolean
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      fullName: form.get('fullName'),
      email: form.get('email'),
      username: form.get('username'),
      bio: form.get('bio'),
      timezone: form.get('timezone'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Personal information"
        description="Update your profile details visible to other team members."
      >
        <TextInput
          name="fullName"
          label="Full name"
          defaultValue="Jordan Lee"
          autoComplete="name"
          required
        />
        <TextInput
          name="email"
          label="Email address"
          type="email"
          defaultValue="jordan@example.com"
          autoComplete="email"
          required
        />
        <TextInput
          name="username"
          label="Username"
          defaultValue="jordanlee"
          description="Used for mentions and your profile URL."
          required
        />
        <TextArea
          name="bio"
          label="Bio"
          defaultValue="Full-stack engineer. Open source contributor."
          description="Brief description for your profile. Max 160 characters."
          maxLength={160}
        />
        <SelectField
          name="timezone"
          label="Timezone"
          defaultValue="America/New_York"
          options={[
            { value: 'America/New_York', label: 'Eastern Time (ET)' },
            { value: 'America/Chicago', label: 'Central Time (CT)' },
            { value: 'America/Denver', label: 'Mountain Time (MT)' },
            { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
            { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
            { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
          ]}
        />
      </FormSection>
      <SaveButton tab="profile" isSaving={isSaving} saved={saved} />
    </form>
  )
}

function NotificationsTab({
  onSave,
  isSaving,
  saved,
}: {
  onSave: (data: Record<string, unknown>) => void
  isSaving: boolean
  saved: boolean
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      emailNotifications: form.get('emailNotifications') === 'on',
      pushNotifications: form.get('pushNotifications') === 'on',
      taskReminders: form.get('taskReminders') === 'on',
      weeklyDigest: form.get('weeklyDigest') === 'on',
      frequency: form.get('frequency'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Notification preferences"
        description="Choose how and when you want to be notified."
      >
        <ToggleSwitch
          name="emailNotifications"
          label="Email notifications"
          description="Receive email updates about task assignments and mentions."
          defaultChecked
        />
        <ToggleSwitch
          name="pushNotifications"
          label="Push notifications"
          description="Get instant browser notifications for urgent updates."
          defaultChecked
        />
        <ToggleSwitch
          name="taskReminders"
          label="Task reminders"
          description="Remind me before tasks are due."
          defaultChecked
        />
        <ToggleSwitch
          name="weeklyDigest"
          label="Weekly digest"
          description="Summary of your team's activity every Monday."
        />
        <SelectField
          name="frequency"
          label="Notification frequency"
          defaultValue="instant"
          options={[
            { value: 'instant', label: 'Instant — as they happen' },
            { value: 'hourly', label: 'Hourly digest' },
            { value: 'daily', label: 'Daily digest' },
            { value: 'none', label: 'None — only critical alerts' },
          ]}
        />
      </FormSection>
      <SaveButton tab="notifications" isSaving={isSaving} saved={saved} />
    </form>
  )
}

function PrivacyTab({
  onSave,
  isSaving,
  saved,
}: {
  onSave: (data: Record<string, unknown>) => void
  isSaving: boolean
  saved: boolean
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      profileVisibility: form.get('profileVisibility'),
      showOnlineStatus: form.get('showOnlineStatus') === 'on',
      allowDirectMessages: form.get('allowDirectMessages') === 'on',
      dataSharing: form.get('dataSharing') === 'on',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Privacy & visibility"
        description="Control who can see your profile and contact you."
      >
        <SelectField
          name="profileVisibility"
          label="Profile visibility"
          defaultValue="team"
          description="Who can view your profile and activity."
          options={[
            { value: 'public', label: 'Public — anyone can view' },
            { value: 'team', label: 'Team — organization members only' },
            { value: 'private', label: 'Private — only you' },
          ]}
        />
        <ToggleSwitch
          name="showOnlineStatus"
          label="Show online status"
          description="Let others see when you're active."
          defaultChecked
        />
        <ToggleSwitch
          name="allowDirectMessages"
          label="Allow direct messages"
          description="Team members can send you private messages."
          defaultChecked
        />
        <ToggleSwitch
          name="dataSharing"
          label="Anonymous usage analytics"
          description="Help improve the product by sharing anonymous usage data."
        />
      </FormSection>
      <SaveButton tab="privacy" isSaving={isSaving} saved={saved} />
    </form>
  )
}

function AppearanceTab({
  onSave,
  isSaving,
  saved,
}: {
  onSave: (data: Record<string, unknown>) => void
  isSaving: boolean
  saved: boolean
}) {
  const { theme, setTheme } = useTheme()
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme-preference') as 'light' | 'dark' | 'system') ?? 'system',
  )

  const handleThemeChange = (value: string) => {
    const pref = value as 'light' | 'dark' | 'system'
    setThemePreference(pref)
    localStorage.setItem('theme-preference', pref)

    if (pref === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    } else {
      setTheme(pref as Theme)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      theme: form.get('theme'),
      compactMode: form.get('compactMode') === 'on',
      reduceMotion: form.get('reduceMotion') === 'on',
      language: form.get('language'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Display & language"
        description="Customize how the application looks and feels."
      >
        <SelectField
          name="theme"
          label="Theme"
          value={themePreference}
          onChange={(event) => handleThemeChange(event.target.value)}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System — match device settings' },
          ]}
        />
        <ToggleSwitch
          name="compactMode"
          label="Compact mode"
          description="Reduce spacing and padding across the interface."
        />
        <ToggleSwitch
          name="reduceMotion"
          label="Reduce motion"
          description="Minimize animations and transitions."
        />
        <SelectField
          name="language"
          label="Language"
          defaultValue="en"
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
            { value: 'ja', label: '日本語' },
          ]}
        />
      </FormSection>

      {/* Theme preview swatches */}
      <div aria-hidden="true" className="flex gap-3">
        <div
          className={`h-16 flex-1 rounded-lg border-2 bg-white transition-all ${theme === 'light' ? 'border-indigo-500' : 'border-slate-200'}`}
        />
        <div
          className={`h-16 flex-1 rounded-lg border-2 bg-slate-950 transition-all ${theme === 'dark' ? 'border-indigo-500' : 'border-slate-700'}`}
        />
      </div>

      <SaveButton tab="appearance" isSaving={isSaving} saved={saved} />
    </form>
  )
}

export function SettingsPanel({ onSave, className = '' }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [savingTab, setSavingTab] = useState<SettingsTab | null>(null)
  const [savedTab, setSavedTab] = useState<SettingsTab | null>(null)
  const tabListRef = useRef<HTMLDivElement>(null)

  const tabPanelId = useId()

  const handleSave = useCallback(
    (tab: SettingsTab, data: Record<string, unknown>) => {
      setSavingTab(tab)
      setSavedTab(null)
      setTimeout(() => {
        onSave?.(tab, data)
        setSavingTab(null)
        setSavedTab(tab)
        setTimeout(() => setSavedTab(null), 3000)
      }, 800)
    },
    [onSave],
  )

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % tabs.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + tabs.length) % tabs.length
    } else {
      return
    }
    event.preventDefault()
    setActiveTab(tabs[nextIndex].id)
    tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus()
  }

  const tabProps = (tab: SettingsTab) => ({
    isSaving: savingTab === tab,
    saved: savedTab === tab,
    onSave: (data: Record<string, unknown>) => handleSave(tab, data),
  })

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Tab navigation */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Settings sections"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 p-2 dark:border-slate-800 lg:w-52 lg:flex-col lg:border-b-0 lg:border-r lg:p-3"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`${tabPanelId}-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 lg:w-full ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`${tabPanelId}-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              tabIndex={0}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              {tab.id === 'profile' && <ProfileTab {...tabProps('profile')} />}
              {tab.id === 'notifications' && (
                <NotificationsTab {...tabProps('notifications')} />
              )}
              {tab.id === 'privacy' && <PrivacyTab {...tabProps('privacy')} />}
              {tab.id === 'appearance' && (
                <AppearanceTab {...tabProps('appearance')} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
