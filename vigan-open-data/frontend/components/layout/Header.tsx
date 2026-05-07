'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogIn, Search, ChevronDown, Globe, Lock, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/datasets',      label: 'Datasets' },
  { href: '/organizations', label: 'Agencies' },
  { href: '/api-docs',      label: 'API' },
  { href: '/about',         label: 'About' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [identifyOpen, setIdentifyOpen] = useState(false)

  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/datasets?q=${encodeURIComponent(q)}` : '/datasets')
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-50">

      {/* ── Top government identity bar ──────────────────────────────────── */}
      <div className="bg-[#F0F0F0] border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-3">
          <div className="flex gap-0.5">
            <span className="w-3 h-4 bg-[#EF3340] rounded-sm block" />
            <span className="w-3 h-4 bg-white border border-gray-300 rounded-sm block" />
          </div>
          <span className="text-xs text-gray-600">
            An Official Website of the{' '}
            <strong className="font-semibold text-gray-800">City Government of Vigan</strong>
          </span>
          <button
            onClick={() => setIdentifyOpen(v => !v)}
            className="topbar-link ml-auto hidden sm:flex items-center gap-1"
            aria-expanded={identifyOpen}
            aria-controls="gov-identify-panel"
          >
            How to identify
            <ChevronDown
              size={10}
              className={cn('transition-transform duration-200', identifyOpen ? 'rotate-180' : '')}
            />
          </button>
        </div>

        {/* ── Identify panel ──────────────────────────────────────────────── */}
        <div
          id="gov-identify-panel"
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-300 bg-white',
            identifyOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-8">

            <div className="flex gap-4 items-start">
              <Globe size={22} className="text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Official website links end with <span className="font-black">.gov.ph</span>
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Government agencies communicate via <strong>.gov.ph</strong> websites (e.g.{' '}
                  <span className="font-medium text-gray-700">vigan.gov.ph</span>).{' '}
                  Look for this domain before sharing any information.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Lock size={22} className="text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Secure websites use HTTPS
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Look for a <strong>lock (🔒)</strong> or <strong>https://</strong> as an added precaution.
                  Share sensitive information only on official, secure websites.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <ShieldAlert size={22} className="text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Scam alert
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Government officers will never ask you to send money or share your personal
                  details over the phone or social media.{' '}
                  <strong className="text-gray-700">When unsure, verify through official channels.</strong>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Main navbar ──────────────────────────────────────────────────── */}
      <nav
        className={cn(
          'bg-white border-b border-gray-200 transition-all duration-300',
          scrolled ? 'shadow-sm' : ''
        )}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="Vigan Open Data Home">
            <Image
              src="/logo.png"
              alt="Vigan City Seal"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full flex-shrink-0 shadow-sm object-contain"
              priority
            />
            <div className="flex flex-col leading-none">
              <span className="font-body text-gray-900 font-bold text-base tracking-tight">
                data<span className="text-vigan-primary">.vigan</span>.gov.ph
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase hidden sm:block">
                Open Data Portal
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-stretch gap-1 ml-8 h-full" role="list">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <li key={link.href} className="flex items-stretch">
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center px-4 text-sm font-medium transition-all duration-200 border-b-2 -mb-px',
                      active
                        ? 'text-vigan-primary border-vigan-primary'
                        : 'text-gray-600 border-transparent hover:text-vigan-primary hover:border-vigan-border'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Search toggle (hidden on home since hero has search) */}
            {!isHome && (
              <button
                onClick={() => setSearchOpen(v => !v)}
                className={cn(
                  'hidden md:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200',
                  searchOpen
                    ? 'bg-vigan-light text-vigan-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-vigan-primary'
                )}
                aria-label="Toggle search"
                aria-expanded={searchOpen}
              >
                <Search size={16} />
                <span>Search</span>
              </button>
            )}

            {/* Admin login — links to CKAN backend */}
            <a
              href={`${process.env.NEXT_PUBLIC_CKAN_URL || 'http://localhost:5001'}/user/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-white bg-vigan-primary hover:bg-vigan-accent px-3.5 py-2 rounded transition-colors duration-150 flex-shrink-0"
              aria-label="Admin Login"
            >
              <LogIn size={14} aria-hidden="true" />
              Log in
            </a>

            {/* Mobile hamburger */}
            <button
              id="vigan-nav-toggle"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-controls="vigan-mobile-menu"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Dropdown search bar (non-home pages) ──────────────────────── */}
        {searchOpen && (
          <div className="hidden md:block border-t border-gray-100 bg-gray-50 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search datasets, topics, agencies…"
                  className="w-full py-2.5 pl-10 pr-28 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-vigan-primary/40 focus:border-vigan-primary transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-vigan-primary text-white text-sm font-medium rounded hover:bg-vigan-accent transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Mobile menu ─────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div id="vigan-mobile-menu" className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
            {/* Mobile search */}
            <div className="px-4 pt-4 pb-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search datasets…"
                  className="w-full py-2.5 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vigan-primary/40"
                />
              </form>
            </div>

            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-vigan-light text-vigan-primary font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <hr className="border-gray-200 my-1" />
              <a
                href={`${process.env.NEXT_PUBLIC_CKAN_URL || 'http://localhost:5001'}/user/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold text-white bg-vigan-primary hover:bg-vigan-accent transition-colors"
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
