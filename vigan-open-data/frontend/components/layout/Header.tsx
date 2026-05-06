'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Code2, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/datasets',      label: 'Datasets',    icon: '🔍' },
  { href: '/organizations', label: 'Departments', icon: '🏛️' },
  { href: '/api-docs',      label: 'API',         icon: '</>' },
  { href: '/about',         label: 'About',       icon: 'ℹ️' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 z-50">

      {/* ── Heritage top bar ─────────────────────────────────────────────── */}
      <div className="bg-vigan-primaryDk text-white/80 text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-2">
          <span>🇵🇭</span>
          <span>
            Official Open Data Portal ·{' '}
            <strong className="text-white">City Government of Vigan, Ilocos Sur</strong>
            {' '}· UNESCO World Heritage City
          </span>
          <span className="ml-auto text-white/40 text-[11px] hidden sm:block">Est. 1572</span>
        </div>
      </div>

      {/* ── Main navbar ──────────────────────────────────────────────────── */}
      <nav
        className={cn(
          'bg-vigan-primary transition-shadow duration-300',
          scrolled ? 'shadow-[0_4px_24px_rgba(6,95,70,0.4)]' : 'shadow-[0_2px_12px_rgba(6,95,70,0.3)]'
        )}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="Vigan Open Data Home">
            {/* SVG Seal */}
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors">
              🏛️
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-white font-bold text-base">City of Vigan</span>
              <span className="text-vigan-light/80 text-[11px] uppercase tracking-widest font-medium">
                Open Data Portal
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 mx-auto" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    pathname.startsWith(link.href)
                      ? 'bg-vigan-secondary/20 text-vigan-secondary'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span className="text-base" aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Admin login */}
          <a
            href="/user/login"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-white border border-white/40 rounded-lg px-3.5 py-1.5 hover:bg-white/10 hover:border-white transition-all ml-auto flex-shrink-0"
            aria-label="CKAN Admin Login"
          >
            <LogIn size={14} aria-hidden="true" />
            Admin Login
          </a>

          {/* Mobile hamburger */}
          <button
            id="vigan-nav-toggle"
            className="md:hidden ml-auto p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-controls="vigan-mobile-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div id="vigan-mobile-menu" className="md:hidden bg-vigan-primaryDk border-t border-white/10">
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'bg-vigan-secondary/20 text-vigan-secondary'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span className="text-base" aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10 my-1" />
              <a
                href="/user/login"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-vigan-gold hover:bg-white/5 transition-colors"
              >
                <LogIn size={16} aria-hidden="true" />
                Admin Login
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
