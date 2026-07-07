import { useCallback, useState } from 'react'
import { Container, UserProfile } from '@/components'
import { sampleProfiles } from '@/data/sampleProfiles'

export function UserProfileDemoPage() {
  const [following, setFollowing] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      sampleProfiles.map((profile) => [
        profile.id,
        profile.initiallyFollowing ?? false,
      ]),
    ),
  )
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleFollow = useCallback((profileId: string) => {
    setLoading((prev) => ({ ...prev, [profileId]: true }))
    setTimeout(() => {
      setFollowing((prev) => ({ ...prev, [profileId]: !prev[profileId] }))
      setLoading((prev) => ({ ...prev, [profileId]: false }))
    }, 600)
  }, [])

  return (
    <main className="flex-1 py-8 sm:py-12">
      <Container size="md">
        <header className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            Component demo
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            UserProfile showcase
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Explore different profile variants — verified accounts, your own profile,
            follow states, avatar fallbacks, minimal layouts, and large stat counts.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
          {sampleProfiles.map((profile) => (
            <section
              key={profile.id}
              aria-labelledby={`demo-${profile.id}-heading`}
              className="flex flex-col gap-3"
            >
              <div>
                <h2
                  id={`demo-${profile.id}-heading`}
                  className="text-sm font-semibold uppercase tracking-wide text-slate-300"
                >
                  {profile.label}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{profile.description}</p>
              </div>

              <UserProfile
                user={profile.user}
                stats={profile.stats}
                isOwnProfile={profile.isOwnProfile}
                isFollowing={following[profile.id]}
                isFollowLoading={loading[profile.id]}
                onFollow={() => handleFollow(profile.id)}
                onMessage={() =>
                  alert(`Opening message thread with @${profile.user.username}…`)
                }
                onEditProfile={() => alert('Opening edit profile…')}
              />
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
