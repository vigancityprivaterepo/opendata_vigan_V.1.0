'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Code2, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/datasets',      label: 'Datasets' },
  { href: '/organizations', label: 'Agencies' },
  { href: '/api-docs',      label: 'API' },
  { href: '/about',         label: 'Help' },
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

      {/* ── SGDS-style top bar ─────────────────────────────────────────────── */}
      <div className="bg-[#F0F0F0] text-gray-700 text-xs border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-2">
          <span className="text-vigan-secondary">🏛️</span>
          <span>
            An Official Website of the{' '}
            <strong className="font-semibold">City Government of Vigan</strong>
          </span>
          <span className="ml-auto text-gray-500 text-[11px] hidden sm:block hover:underline cursor-pointer">How to identify us</span>
        </div>
      </div>

      {/* ── Main navbar ──────────────────────────────────────────────────── */}
      <nav
        className={cn(
          'bg-white transition-shadow duration-300 border-b border-gray-200',
          scrolled ? 'shadow-sm' : ''
        )}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="Vigan Open Data Home">
            <div className="flex flex-col leading-tight">
              <span className="font-display text-gray-900 font-bold text-xl tracking-tight">data.vigan.gov.ph</span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6 ml-10" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-vigan-primary',
                    pathname.startsWith(link.href)
                      ? 'text-vigan-primary border-b-2 border-vigan-primary pb-5 pt-5'
                      : 'text-gray-600'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Admin login */}
          <a
            href="/user/login"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-vigan-primary hover:text-vigan-accent transition-all ml-auto flex-shrink-0"
            aria-label="Admin Login"
          >
            <LogIn size={16} aria-hidden="true" />
            Log in
          </a>

          {/* Mobile hamburger */}
          <button
            id="vigan-nav-toggle"
            className="md:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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
          <div id="vigan-mobile-menu" className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'bg-emerald-50 text-vigan-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-gray-200 my-1" />
              <a
                href="/user/login"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-vigan-primary hover:bg-gray-50 transition-colors"
              >
                <LogIn size={16} aria-hidden="true" />
                Log in
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
