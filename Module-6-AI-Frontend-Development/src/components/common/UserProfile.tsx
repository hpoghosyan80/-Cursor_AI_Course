import { useId } from 'react'
import { Button } from '@/components/ui/Button'

export interface UserProfileStats {
  followers: number
  following: number
  posts: number
}

export interface UserProfileUser {
  id: string
  name: string
  username: string
  bio?: string
  avatarUrl?: string
  avatarAlt?: string
  isVerified?: boolean
  location?: string
  website?: string
}

export interface UserProfileProps {
  user: UserProfileUser
  stats: UserProfileStats
  isOwnProfile?: boolean
  isFollowing?: boolean
  isFollowLoading?: boolean
  onFollow?: () => void
  onMessage?: () => void
  onEditProfile?: () => void
  className?: string
}

function formatStatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`
  }
  return value.toLocaleString()
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

interface ProfileAvatarProps {
  name: string
  avatarUrl?: string
  avatarAlt?: string
}

function ProfileAvatar({ name, avatarUrl, avatarAlt }: ProfileAvatarProps) {
  const initials = getInitials(name)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={avatarAlt ?? `${name}'s profile picture`}
        className="size-24 rounded-full object-cover ring-4 ring-slate-800 sm:size-32"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-semibold text-white ring-4 ring-slate-800 sm:size-32 sm:text-3xl"
    >
      {initials}
    </div>
  )
}

interface StatItemProps {
  label: string
  value: number
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <span className="text-lg font-bold tabular-nums text-white sm:text-xl">
        {formatStatCount(value)}
      </span>
      <span className="text-xs text-slate-400 sm:text-sm">{label}</span>
    </div>
  )
}

interface ProfileActionsProps {
  isOwnProfile: boolean
  isFollowing: boolean
  isFollowLoading: boolean
  onFollow?: () => void
  onMessage?: () => void
  onEditProfile?: () => void
}

function ProfileActions({
  isOwnProfile,
  isFollowing,
  isFollowLoading,
  onFollow,
  onMessage,
  onEditProfile,
}: ProfileActionsProps) {
  if (isOwnProfile) {
    return (
      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={onEditProfile}
        aria-label="Edit your profile"
      >
        Edit profile
      </Button>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <Button
        variant={isFollowing ? 'secondary' : 'primary'}
        className="w-full sm:w-auto"
        onClick={onFollow}
        disabled={isFollowLoading}
        aria-pressed={isFollowing}
        aria-label={isFollowing ? `Unfollow user` : `Follow user`}
      >
        {isFollowLoading ? 'Loading…' : isFollowing ? 'Following' : 'Follow'}
      </Button>
      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={onMessage}
        aria-label="Send a message"
      >
        Message
      </Button>
    </div>
  )
}

export function UserProfile({
  user,
  stats,
  isOwnProfile = false,
  isFollowing = false,
  isFollowLoading = false,
  onFollow,
  onMessage,
  onEditProfile,
  className = '',
}: UserProfileProps) {
  const headingId = useId()
  const statsId = useId()

  return (
    <article
      aria-labelledby={headingId}
      className={`overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl ${className}`}
    >
      {/* Cover banner */}
      <div
        aria-hidden="true"
        className="h-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 sm:h-32"
      />

      <div className="px-4 pb-6 sm:px-6">
        {/* Avatar + actions row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-12 sm:-mt-16">
            <ProfileAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              avatarAlt={user.avatarAlt}
            />
          </div>

          <div className="sm:mb-1 sm:pb-1">
            <ProfileActions
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              onFollow={onFollow}
              onMessage={onMessage}
              onEditProfile={onEditProfile}
            />
          </div>
        </div>

        {/* Identity */}
        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              id={headingId}
              className="text-xl font-bold tracking-tight text-white sm:text-2xl"
            >
              {user.name}
            </h1>
            {user.isVerified && (
              <span
                className="inline-flex items-center rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300"
                aria-label="Verified account"
                title="Verified account"
              >
                ✓ Verified
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-slate-400">@{user.username}</p>
        </header>

        {/* Bio & metadata */}
        {(user.bio || user.location || user.website) && (
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            {user.bio && (
              <p className="max-w-prose leading-relaxed">{user.bio}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400">
              {user.location && (
                <span className="inline-flex items-center gap-1">
                  <span aria-hidden="true">📍</span>
                  {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-400 transition-colors hover:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  <span aria-hidden="true">🔗</span>
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <section
          id={statsId}
          aria-label="Profile statistics"
          className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-800 pt-5"
        >
          <StatItem label="Posts" value={stats.posts} />
          <StatItem label="Followers" value={stats.followers} />
          <StatItem label="Following" value={stats.following} />
        </section>
      </div>
    </article>
  )
}
