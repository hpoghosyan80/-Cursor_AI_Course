import { Container } from '@/components/layout/Container'

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">Profile Demo</span>
        <nav className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#" className="transition-colors hover:text-white">
            Showcase
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Components
          </a>
        </nav>
      </Container>
    </header>
  )
}
