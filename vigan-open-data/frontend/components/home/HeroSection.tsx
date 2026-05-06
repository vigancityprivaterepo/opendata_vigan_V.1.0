'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Database, Code2 } from 'lucide-react'

const POPULAR_TAGS = ['Tourism', 'Budget', 'Health', 'DRRM', 'GeoJSON', 'Barangay', 'Environment']

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
      className="relative overflow-hidden text-center"
      style={{
        background: 'linear-gradient(135deg, #044034 0%, #065F46 55%, #0A8060 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(3rem, 6vw, 5rem)',
      }}
      aria-label="Portal hero"
    >
      {/* Mesh overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 50%),' +
            'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.07) 0%, transparent 50%),' +
            'radial-gradient(circle at 60% 80%, rgba(16,185,129,0.05) 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Eyebrow */}
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-vigan-gold bg-vigan-gold/12 border border-vigan-gold/25 rounded-full px-4 py-1 mb-6 animate-fade-in">
          🏛️ UNESCO World Heritage City
        </span>

        {/* Title */}
        <h1
          className="font-display font-extrabold text-white mb-5 animate-slide-up"
          style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1 }}
        >
          Vigan City{' '}
          <span className="text-vigan-gold relative">
            Open Data
            <span
              className="block absolute left-1/2 -translate-x-1/2 rounded"
              style={{ bottom: '-6px', width: '80px', height: '4px', background: '#F59E0B', opacity: 0.7 }}
              aria-hidden="true"
            />
          </span>{' '}
          Portal
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-lg leading-relaxed max-w-xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Discover, explore, and download official datasets from Vigan City
          government departments. Transparent governance, powered by open data.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="max-w-xl mx-auto mb-5 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
          role="search"
          aria-label="Search datasets"
        >
          <div className="flex items-center bg-white rounded-full shadow-[0_8px_32px_rgba(6,95,70,0.25)] overflow-hidden pl-4 border-2 border-transparent focus-within:border-vigan-secondary transition-all">
            <Search size={18} className="text-vigan-muted flex-shrink-0" aria-hidden="true" />
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search datasets, topics, departments…"
              className="flex-1 py-3.5 px-3 text-vigan-text text-sm bg-transparent outline-none placeholder:text-vigan-muted"
              autoComplete="off"
              aria-label="Search term"
            />
            <button
              type="submit"
              className="py-3.5 px-5 bg-vigan-primary text-white font-semibold text-sm hover:bg-vigan-accent transition-colors flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular tags */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
          aria-label="Popular topics"
        >
          <span className="text-white/55 text-xs self-center">Popular:</span>
          {POPULAR_TAGS.map((tag) => (
            <a
              key={tag}
              href={`/datasets?tags=${encodeURIComponent(tag.toLowerCase())}`}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/85 hover:bg-white/20 hover:text-white transition-all"
            >
              {tag}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex justify-center gap-4 flex-wrap animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <a href="/datasets" className="btn-amber">
            <Database size={16} aria-hidden="true" />
            Browse All Datasets
          </a>
          <a href="/api/3/action/package_list" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Code2 size={16} aria-hidden="true" />
            Access API
          </a>
        </div>

      </div>
    </section>
  )
}
