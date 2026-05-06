'use client'
import { useEffect, useRef, useState } from 'react'
import type { CKANSiteStats } from '@/types/ckan'

interface Props { stats: CKANSiteStats }

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target === 0) return
    let start: number | null = null
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(easeOut(progress) * target))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return value
}

function StatCard({ icon, label, value, suffix }: {
  icon: string; label: string; value: number; suffix?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const count = useCountUp(value, 1800, active)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 px-5 py-4 bg-white/5 rounded-xl border border-white/8 hover:bg-white/8 transition-colors"
    >
      <span className="text-3xl flex-shrink-0" aria-hidden="true">{icon}</span>
      <div>
        <p className="font-display font-extrabold text-3xl text-vigan-gold leading-none">
          {count.toLocaleString()}{suffix}
        </p>
        <p className="text-white/60 text-xs mt-0.5 tracking-wide">{label}</p>
      </div>
    </div>
  )
}

const STAT_CARDS = [
  { icon: '📦', label: 'Published Datasets',  key: 'datasetCount',      suffix: '' },
  { icon: '🏛️', label: 'City Departments',    key: 'organizationCount', suffix: '' },
  { icon: '⬇️', label: 'Total Downloads',     key: 'downloads',         suffix: 'K' },
  { icon: '🔖', label: 'Data Categories',     key: 'tagCount',          suffix: '' },
]

export default function StatsCounter({ stats }: Props) {
  const values: Record<string, number> = {
    datasetCount:      stats.datasetCount,
    organizationCount: stats.organizationCount,
    downloads:         12,            // Placeholder — wire real analytics later
    tagCount:          stats.tagCount,
  }

  return (
    <section
      className="border-b-[3px] border-vigan-gold"
      style={{ background: '#044034' }}
      aria-label="Portal statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={values[card.key] ?? 0}
            suffix={card.suffix}
          />
        ))}
      </div>
    </section>
  )
}
