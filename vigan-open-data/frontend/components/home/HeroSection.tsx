'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Landmark, Wallet, Heart, Leaf, Bus, Building2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const TOPICS: { label: string; topic: string; Icon: LucideIcon; color: string }[] = [
  { label: 'Tourism',     topic: 'tourism',     Icon: Landmark,  color: 'text-emerald-600' },
  { label: 'Budget',      topic: 'budget',      Icon: Wallet,    color: 'text-amber-500'   },
  { label: 'Health',      topic: 'health',      Icon: Heart,     color: 'text-rose-500'    },
  { label: 'Environment', topic: 'environment', Icon: Leaf,      color: 'text-green-600'   },
  { label: 'Transport',   topic: 'transport',   Icon: Bus,       color: 'text-blue-500'    },
  { label: 'Planning',    topic: 'planning',    Icon: Building2, color: 'text-violet-500'  },
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
    <section className="relative bg-white border-b border-gray-100 overflow-hidden" aria-label="Portal hero">

      {/* Animated emerald waves — layer 1 (slowest, darkest) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 flex w-[200%]" style={{ animation: 'waveFlow 22s linear infinite' }}>
          <svg viewBox="0 0 1440 110" className="w-1/2 flex-shrink-0" preserveAspectRatio="none">
            <path d="M0 60 C240 20,480 100,720 60 C960 20,1200 100,1440 60 L1440 110 L0 110 Z" fill="#065F46" fillOpacity="0.07"/>
          </svg>
          <svg viewBox="0 0 1440 110" className="w-1/2 flex-shrink-0" preserveAspectRatio="none">
            <path d="M0 60 C240 20,480 100,720 60 C960 20,1200 100,1440 60 L1440 110 L0 110 Z" fill="#065F46" fillOpacity="0.07"/>
          </svg>
        </div>
      </div>

      {/* Animated emerald waves — layer 2 (medium speed) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 flex w-[200%]" style={{ animation: 'waveFlow 14s linear infinite' }}>
          <svg viewBox="0 0 1440 90" className="w-1/2 flex-shrink-0" preserveAspectRatio="none">
            <path d="M0 45 C360 5,720 85,1080 45 C1260 25,1380 65,1440 45 L1440 90 L0 90 Z" fill="#047857" fillOpacity="0.07"/>
          </svg>
          <svg viewBox="0 0 1440 90" className="w-1/2 flex-shrink-0" preserveAspectRatio="none">
            <path d="M0 45 C360 5,720 85,1080 45 C1260 25,1380 65,1440 45 L1440 90 L0 90 Z" fill="#047857" fillOpacity="0.07"/>
          </svg>
        </div>
      </div>

      {/* Animated emerald waves — layer 3 (fastest, lightest) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 flex w-[200%]" style={{ animation: 'waveFlow 9s linear infinite' }}>
          <svg viewBox="0 0 1440 80" className="w-1/2 flex-shrink-0" preserveAspectRatio="none">
            <path d="M0 40 C180 10,360 70,540 40 C720 10,900 70,1080 40 C1260 10,1380 60,1440 40 L1440 80 L0 80 Z" fill="#10B981" fillOpacity="0.06"/>
          </svg>
          <svg viewBox="0 0 1440 80" className="w-1/2 flex-shrink-0" preserveAspectRatio="none">
            <path d="M0 40 C180 10,360 70,540 40 C720 10,900 70,1080 40 C1260 10,1380 60,1440 40 L1440 80 L0 80 Z" fill="#10B981" fillOpacity="0.06"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">

        {/* Eyebrow */}
        <p className="text-gray-400 text-sm mb-8">
          Official Open Data Portal · Vigan City, Ilocos Sur
        </p>

        {/* Heading — data.gov.sg style split */}
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-5 tracking-tight">
          <span className="text-gray-900">Vigan City&apos;s</span>
          <br />
          <span className="text-gray-400 font-bold">open data portal</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Discover, explore, and download government datasets — making data
          open, accessible, and useful for everyone.
        </p>

        {/* Pill search bar */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-10"
          role="search"
          aria-label="Search datasets"
        >
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Try keywords like: "Tourism", "Budget", "Health"'
            className="w-full py-4 pl-12 pr-36 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vigan-primary/30 focus:border-vigan-primary text-base shadow-sm transition-colors"
            autoComplete="off"
            aria-label="Search datasets"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-vigan-primary text-white text-sm font-semibold rounded-full hover:bg-vigan-accent transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category pills with icons */}
        <div
          className="flex flex-wrap justify-center gap-2.5"
          aria-label="Browse by topic"
        >
          {TOPICS.map(({ label, topic, Icon, color }) => (
            <Link
              key={topic}
              href={`/datasets?topics=${encodeURIComponent(topic)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-vigan-primary hover:text-vigan-primary shadow-sm transition-colors"
            >
              <Icon size={15} className={color} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
