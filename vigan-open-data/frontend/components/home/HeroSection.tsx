'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Landmark, Wallet, Heart, Leaf, Bus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const POPULAR_TAGS: { label: string; topic: string; Icon: LucideIcon }[] = [
  { label: 'Tourism',     topic: 'tourism',     Icon: Landmark },
  { label: 'Budget',      topic: 'budget',      Icon: Wallet   },
  { label: 'Health',      topic: 'health',      Icon: Heart    },
  { label: 'Environment', topic: 'environment', Icon: Leaf     },
  { label: 'Transport',   topic: 'transport',   Icon: Bus      },
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
      className="bg-white text-vigan-text relative py-16 md:py-24"
      aria-label="Portal hero"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        <div className="max-w-3xl w-full">
          {/* Title */}
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-vigan-primary mb-6 leading-tight">
            Vigan City's open data portal
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Vigan's open data platform - making data discoverable, understandable, and usable.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mb-8 w-full"
            role="search"
            aria-label="Search datasets"
          >
            <div className="relative flex items-center w-full max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={24} className="text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search datasets..."
                className="w-full py-4 pl-12 pr-32 bg-white border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-vigan-primary focus:border-transparent shadow-sm"
                autoComplete="off"
                aria-label="Search term"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-vigan-primary text-white font-medium rounded-md hover:bg-vigan-primaryDk transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular tags */}
          <div className="flex flex-wrap justify-center items-center gap-3" aria-label="Popular topics">
            {POPULAR_TAGS.map(({ label, topic, Icon }) => (
              <a
                key={topic}
                href={`/datasets?topics=${encodeURIComponent(topic)}`}
                className="flex items-center gap-1.5 text-sm text-vigan-primary font-medium bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm transition-all hover:border-vigan-primary hover:shadow hover:bg-emerald-50"
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
