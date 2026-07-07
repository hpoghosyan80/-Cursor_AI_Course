import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'

export interface NavMenuItem {
  label: string
  href: string
  isActive?: boolean
}

export interface NavUser {
  name: string
  email?: string
  avatarUrl?: string
}

export interface NavbarProps {
  logo?: ReactNode
  logoText?: string
  menuItems?: NavMenuItem[]
  user?: NavUser
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function useScrollScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}

function useDismissOnEscape(isOpen: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onDismiss])
}

interface UserAvatarProps {
  user: NavUser
  size?: 'sm' | 'md'
}

function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClass = size === 'sm' ? 'size-8 text-xs' : 'size-9 text-sm'

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`rounded-full object-cover ring-2 ring-slate-700 ${sizeClass}`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white ring-2 ring-slate-700 ${sizeClass}`}
    >
      {getInitials(user.name)}
    </span>
  )
}

interface SearchBarProps {
  id: string
  placeholder: string
  onSearch?: (query: string) => void
  className?: string
}

function SearchBar({ id, placeholder, onSearch, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
    </form>
  )
}

interface UserDropdownProps {
  user: NavUser
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
}

function UserDropdown({
  user,
  isOpen,
  onToggle,
  onClose,
  onProfileClick,
  onSettingsClick,
  onLogout,
}: UserDropdownProps) {
  const menuId = useId()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useDismissOnEscape(isOpen, onClose)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg p-1 transition-colors duration-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={onToggle}
      >
        <UserAvatar user={user} />
        <span className="hidden max-w-[8rem] truncate text-sm font-medium text-slate-200 lg:inline">
          {user.name}
        </span>
        <svg
          aria-hidden="true"
          className={`hidden size-4 text-slate-400 transition-transform duration-200 lg:block ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id={menuId}
        role="menu"
        aria-label="User menu"
        className={`absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl transition-all duration-200 ease-out ${
          isOpen
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="border-b border-slate-800 px-4 py-3">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          {user.email && (
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          )}
        </div>
        <ul className="py-1">
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => {
                onProfileClick?.()
                onClose()
              }}
            >
              Profile
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              onClick={() => {
                onSettingsClick?.()
                onClose()
              }}
            >
              Settings
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-400 transition-colors hover:bg-slate-800 hover:text-rose-300"
              onClick={() => {
                onLogout?.()
                onClose()
              }}
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

const defaultMenuItems: NavMenuItem[] = [
  { label: 'Home', href: '#', isActive: true },
  { label: 'Explore', href: '#' },
  { label: 'Shop', href: '#' },
  { label: 'About', href: '#' },
]

export function Navbar({
  logo,
  logoText = 'Nova',
  menuItems = defaultMenuItems,
  user,
  searchPlaceholder = 'Search products, people…',
  onSearch,
  onProfileClick,
  onSettingsClick,
  onLogout,
  className = '',
}: NavbarProps) {
  const scrolled = useScrollScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const mobileMenuId = useId()
  const desktopSearchId = useId()
  const mobileSearchId = useId()

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const closeDropdown = useCallback(() => setDropdownOpen(false), [])

  useDismissOnEscape(mobileOpen, closeMobile)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ease-out ${
        scrolled
          ? 'border-slate-800/80 bg-slate-950/95 shadow-lg shadow-black/20 backdrop-blur-md'
          : 'border-transparent bg-slate-950/70 backdrop-blur-sm'
      } ${className}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8 lg:gap-6">
        {/* Logo */}
        <a
          href="#"
          className="flex shrink-0 items-center gap-2 transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          aria-label={`${logoText} home`}
        >
          {logo ?? (
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white"
            >
              {logoText.charAt(0)}
            </span>
          )}
          <span className="text-lg font-semibold tracking-tight text-white">
            {logoText}
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.isActive ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                item.isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop search */}
        <SearchBar
          id={desktopSearchId}
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          className="mx-auto hidden max-w-xs flex-1 md:block lg:max-w-sm"
        />

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <div className="hidden md:block">
              <UserDropdown
                user={user}
                isOpen={dropdownOpen}
                onToggle={() => setDropdownOpen((prev) => !prev)}
                onClose={closeDropdown}
                onProfileClick={onProfileClick}
                onSettingsClick={onSettingsClick}
                onLogout={onLogout}
              />
            </div>
          )}

          {/* Hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 transition-colors duration-200 hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg
              aria-hidden="true"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id={mobileMenuId}
        className={`overflow-hidden border-t border-slate-800 transition-all duration-300 ease-out md:hidden ${
          mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="space-y-4 px-4 py-4 sm:px-6">
          <SearchBar
            id={mobileSearchId}
            placeholder={searchPlaceholder}
            onSearch={(query) => {
              onSearch?.(query)
              closeMobile()
            }}
          />

          <nav aria-label="Mobile navigation">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.isActive ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      item.isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    onClick={closeMobile}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {user && (
            <div className="border-t border-slate-800 pt-4">
              <div className="mb-3 flex items-center gap-3 px-3">
                <UserAvatar user={user} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <ul className="space-y-1">
                {[
                  { label: 'Profile', action: onProfileClick },
                  { label: 'Settings', action: onSettingsClick },
                  {
                    label: 'Log out',
                    action: onLogout,
                    className: 'text-rose-400 hover:text-rose-300',
                  },
                ].map(({ label, action, className: itemClassName }) => (
                  <li key={label}>
                    <button
                      type="button"
                      className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${itemClassName ?? ''}`}
                      onClick={() => {
                        action?.()
                        closeMobile()
                      }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
