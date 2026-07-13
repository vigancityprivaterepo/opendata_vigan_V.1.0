'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Globe, Lock, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'


const NAV_LINKS: Array<{ href: string; label: string; ckan?: boolean }> = [
  { href: '/datasets', label: 'Datasets' },
  { href: '/organizations', label: 'Organizations' },
  { href: '/api-docs', label: 'API' },
  { href: '/about', label: 'About Us' },
  { href: '/login-access?next=/api/ckan-proxy/user/login', label: 'Log In' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [identifyOpen, setIdentifyOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#F0F0F0] border-b border-gray-300">
        <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-1.5 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="City Government of Vigan seal"
            width={22}
            height={22}
            className="h-5 w-5 object-contain flex-shrink-0"
            priority
          />
          <span className="text-xs text-gray-600">
            An Official Website of the{' '}
            <strong className="font-semibold text-gray-800">City Government of Vigan</strong>
          </span>
          <button
            onClick={() => setIdentifyOpen((v) => !v)}
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

        <div
          id="gov-identify-panel"
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-300 bg-white',
            identifyOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
          )}
        >
          <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <Globe size={22} className="text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Official website links end with <span className="font-black">.gov.ph</span>
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Government agencies communicate via <strong>.gov.ph</strong> websites (e.g.{' '}
                  <span className="font-medium text-gray-700">vigancity.gov.ph</span>). Look for this
                  domain before sharing any information.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Lock size={22} className="text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Secure websites use HTTPS</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Look for a <strong>lock (🔒)</strong> or <strong>https://</strong> as an added
                  precaution. Share sensitive information only on official, secure websites.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <ShieldAlert size={22} className="text-gray-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Scam alert</p>
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

      <nav
        className={cn(
          'bg-white border-b border-gray-200 transition-all duration-300',
          scrolled ? 'shadow-sm' : ''
        )}
        aria-label="Main navigation"
      >
        <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 h-16 flex items-center gap-4">
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
                data<span className="text-vigan-primary">.vigancity</span>.gov.ph
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase hidden sm:block">
                Open Data Portal
              </span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-8 ml-auto" role="list">
            {NAV_LINKS.map((link) => {
              const activeHref = link.ckan ? new URL(link.href, 'http://local').pathname : link.href
              const active = pathname === activeHref || (activeHref !== '/' && pathname.startsWith(activeHref))
              return (
                <li key={link.href} className="flex items-center">
                  {link.ckan ? (
                    <a
                      href={link.href}
                      className={cn(
                        'border-b-2 border-transparent py-1 text-[0.95rem] font-semibold uppercase tracking-[0.01em] transition-colors',
                        active
                          ? 'text-vigan-primary border-vigan-primary'
                          : 'text-emerald-700 hover:text-vigan-primary hover:border-vigan-primary/50'
                      )}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        'border-b-2 border-transparent py-1 text-[0.95rem] font-semibold uppercase tracking-[0.01em] transition-colors',
                        active
                          ? 'text-vigan-primary border-vigan-primary'
                          : 'text-emerald-700 hover:text-vigan-primary hover:border-vigan-primary/50'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <button
              id="vigan-nav-toggle"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-controls="vigan-mobile-menu"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="vigan-mobile-menu" className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
            <div className="px-12 max-[991px]:px-6 max-[768px]:px-5 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const activeHref = link.ckan ? new URL(link.href, 'http://local').pathname : link.href
              const active = pathname === activeHref || (activeHref !== '/' && pathname.startsWith(activeHref))
                return link.ckan ? (
                  <a
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
                  </a>
                ) : (
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
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
