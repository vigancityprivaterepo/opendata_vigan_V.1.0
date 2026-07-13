'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

/* Topic category tiles */
/* Custom SVG icons per category with civic-specific symbols */
const TOPICS = [
  {
    label: 'Tourism',
    tag: 'tourism',
    bg: 'bg-amber-50 hover:bg-amber-100',
    ring: 'hover:ring-amber-400',
    text: 'text-amber-700',
    icon: (
      /* Church heritage tower inspired by Bantay Bell Tower */
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2L10 5H8v2h1v1H7v1h1v1H6l-1 11h14L18 10h-2V9h1V8h-2V7h1V5h-2L12 2zm0 2.5L13.5 7h-3L12 4.5zM10 9h4v1h-4V9zm-2 2h8l.75 9H7.25L8 11z"/>
      </svg>
    ),
  },
  {
    label: 'Budget',
    tag: 'budget',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    ring: 'hover:ring-emerald-400',
    text: 'text-emerald-700',
    icon: (
      /* Philippine Peso coin */
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07C9.24 16.57 8 15.4 8 14h2c0 .55.89 1 2 1s2-.45 2-1c0-.62-.55-.9-2.13-1.36C9.64 12.05 8 11.29 8 10c0-1.4 1.24-2.57 3-2.93V6h2v1.07c1.76.36 3 1.53 3 2.93h-2c0-.55-.89-1-2-1s-2 .45-2 1c0 .62.55.9 2.13 1.36 2.23.57 3.87 1.33 3.87 2.64 0 1.4-1.24 2.57-3 2.93z"/>
      </svg>
    ),
  },
  {
    label: 'Health',
    tag: 'health',
    bg: 'bg-rose-50 hover:bg-rose-100',
    ring: 'hover:ring-rose-400',
    text: 'text-rose-600',
    icon: (
      /* Medical cross */
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
      </svg>
    ),
  },
  {
    label: 'Environment',
    tag: 'environment',
    bg: 'bg-green-50 hover:bg-green-100',
    ring: 'hover:ring-green-400',
    text: 'text-green-700',
    icon: (
      /* Leaf and tree symbol */
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 1-1 2-2 3-2 0 0-7 1-8 8-.5 3 1 5 1 5s-3-1-3-5c0-3 1-6 4-8 1-.5 5-1 8-1-2-1-5-2-9-2-5 0-9 2-11 6l2 1C5 9 9 7 17 8z"/>
      </svg>
    ),
  },
  {
    label: 'Business',
    tag: 'business',
    bg: 'bg-blue-50 hover:bg-blue-100',
    ring: 'hover:ring-blue-400',
    text: 'text-blue-700',
    icon: (
      /* Briefcase for permits and commerce */
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M10 4h4a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v3h-7v-1h-2v1H4V9a2 2 0 0 1 2-2h2V6a2 2 0 0 1 2-2zm4 3V6h-4v1h4zm6 7v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4h7v1h2v-1h7z"/>
      </svg>
    ),
  },
  {
    label: 'Planning',
    tag: 'planning',
    bg: 'bg-violet-50 hover:bg-violet-100',
    ring: 'hover:ring-violet-400',
    text: 'text-violet-700',
    icon: (
      /* City planning and public works */
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
      </svg>
    ),
  },
]

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/datasets?q=${encodeURIComponent(q)}` : '/datasets')
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #022C22 0%, #044034 50%, #065F46 100%)' }}
      aria-label="Portal hero"
    >
      {/* Geometric pattern overlay inspired by public data portals */}
      <div className="absolute inset-0 hero-pattern pointer-events-none" aria-hidden="true" />

      {/* Subtle radial glow for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Heritage silhouette based on Bantay Bell Tower */}
      <div className="absolute right-0 bottom-0 w-80 h-80 pointer-events-none opacity-[0.07] hidden lg:block" aria-hidden="true">
        <svg viewBox="0 0 200 260" fill="#A7F3D0" xmlns="http://www.w3.org/2000/svg">
          {/* Bell tower silhouette */}
          <rect x="70" y="200" width="60" height="60" />
          <rect x="60" y="180" width="80" height="25" />
          <rect x="75" y="140" width="50" height="44" />
          <rect x="65" y="125" width="70" height="18" />
          <rect x="80" y="85" width="40" height="44" />
          <rect x="70" y="72" width="60" height="16" />
          <rect x="88" y="40" width="24" height="35" />
          <rect x="82" y="30" width="36" height="14" />
          <rect x="94" y="5" width="12" height="28" />
          {/* Arches */}
          <ellipse cx="100" cy="140" rx="18" ry="22" fill="#022C22" />
          <ellipse cx="100" cy="85" rx="12" ry="15" fill="#022C22" />
          {/* Windows */}
          <rect x="88" y="155" width="10" height="14" fill="#022C22" />
          <rect x="102" y="155" width="10" height="14" fill="#022C22" />
        </svg>
      </div>

      {/* Hero content */}
      <div className="relative z-10 w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-20 md:py-28 text-center">
        {/* Partner logos */}
        <div className="mb-10 flex items-center justify-center gap-5 sm:gap-8">
          <Image
            src="/heritage.png"
            alt="Heritage logo"
            width={96}
            height={96}
            className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            priority
          />
          <Image
            src="/logo.png"
            alt="City Government of Vigan logo"
            width={112}
            height={112}
            className="h-20 w-20 object-contain sm:h-24 sm:w-24"
            priority
          />
          <Image
            src="/vigan_seven_wonders.png"
            alt="Vigan Seven Wonders logo"
            width={96}
            height={96}
            className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            priority
          />
        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-5 tracking-tight">
          <span className="text-white">Vigan City&apos;s</span>
          <br />
          <span className="text-emerald-400">Open Data Portal</span>
        </h1>

        {/* Subtitle */}
        <p className="text-emerald-100/75 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          Discover, explore, and download official government datasets for a more open,
          accessible, and useful civic web experience.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-10"
          role="search"
          aria-label="Search datasets"
        >
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Try: "Tourism", "Budget", "Health", "Environment"'
            className="w-full py-4 pl-14 pr-40 bg-white rounded-full text-gray-900
                       placeholder-gray-400 text-base shadow-xl
                       focus:outline-none focus:ring-4 focus:ring-emerald-400/30
                       transition-all duration-200"
            autoComplete="off"
            aria-label="Search datasets"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-7
                       bg-vigan-primary text-white text-sm font-bold
                       rounded-full hover:bg-vigan-accent
                       transition-all duration-200 hover:shadow-glow-emerald"
          >
            Search
          </button>
        </form>

        {/* Category tiles */}
        <div
          className="flex flex-wrap justify-center gap-2.5"
          aria-label="Browse by topic"
        >
          {TOPICS.map(({ label, tag, bg, ring, text, icon }) => (
            <Link
              key={tag}
              href={`/datasets?tags=${encodeURIComponent(tag)}`}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5',
                'rounded-full text-sm font-semibold',
                'border border-white/10 backdrop-blur-sm',
                'ring-1 ring-transparent transition-all duration-200',
                'hover:-translate-y-0.5 hover:shadow-lg',
                bg, ring, text
              )}
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16">
          <path d="M0 30 C360 60,720 0,1080 30 C1260 45,1380 15,1440 30 L1440 60 L0 60 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}

/* Helper for conditional class merging */
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
