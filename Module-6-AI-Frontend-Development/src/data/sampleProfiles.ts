import type { UserProfileStats, UserProfileUser } from '@/components'

export interface SampleProfile {
  id: string
  label: string
  description: string
  user: UserProfileUser
  stats: UserProfileStats
  isOwnProfile?: boolean
  initiallyFollowing?: boolean
}

export const sampleProfiles: SampleProfile[] = [
  {
    id: 'verified-creator',
    label: 'Verified creator',
    description:
      'Full profile with avatar, verified badge, bio, location, and website link.',
    user: {
      id: '1',
      name: 'Alex Rivera',
      username: 'alexrivera',
      bio: 'Designer & developer building thoughtful digital experiences. Coffee enthusiast. Always learning.',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
      isVerified: true,
      location: 'San Francisco, CA',
      website: 'https://alexrivera.dev',
    },
    stats: { posts: 142, followers: 12_400, following: 891 },
  },
  {
    id: 'own-profile',
    label: 'Your profile',
    description: 'When viewing your own profile, the Edit profile action is shown instead of Follow.',
    user: {
      id: '2',
      name: 'Jordan Lee',
      username: 'jordanlee',
      bio: 'Full-stack engineer. Open source contributor. Building in public.',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan',
      location: 'New York, NY',
    },
    stats: { posts: 58, followers: 2_103, following: 412 },
    isOwnProfile: true,
  },
  {
    id: 'already-following',
    label: 'Already following',
    description: 'Demonstrates the Following state with follow toggle interaction.',
    user: {
      id: '3',
      name: 'Morgan Chen',
      username: 'morganchen',
      bio: 'Product manager turning ideas into shipped features. Weekend trail runner.',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Morgan',
      location: 'Austin, TX',
    },
    stats: { posts: 312, followers: 8_750, following: 1_204 },
    initiallyFollowing: true,
  },
  {
    id: 'no-avatar',
    label: 'No avatar image',
    description: 'Falls back to initials on a gradient background when no avatar URL is provided.',
    user: {
      id: '4',
      name: 'Sam Okonkwo',
      username: 'samok',
      bio: 'Data scientist exploring ML for climate tech. Speaker. Mentor.',
      location: 'London, UK',
      website: 'https://samok.dev',
    },
    stats: { posts: 89, followers: 4_320, following: 567 },
  },
  {
    id: 'minimal-profile',
    label: 'Minimal profile',
    description: 'Only name and username — no bio, location, or website.',
    user: {
      id: '5',
      name: 'Taylor Brooks',
      username: 'taylorb',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Taylor',
    },
    stats: { posts: 3, followers: 42, following: 18 },
  },
  {
    id: 'high-reach',
    label: 'High reach account',
    description: 'Large follower counts formatted as 1.2M, 890K, etc.',
    user: {
      id: '6',
      name: 'Nova Studios',
      username: 'novastudios',
      bio: 'Award-winning creative studio. Brand, film, and digital campaigns for global clients.',
      avatarUrl: 'https://api.dicebear.com/9.x/identicon/svg?seed=Nova',
      isVerified: true,
      location: 'Los Angeles, CA',
      website: 'https://novastudios.com',
    },
    stats: { posts: 1_847, followers: 1_200_000, following: 214 },
  },
]
