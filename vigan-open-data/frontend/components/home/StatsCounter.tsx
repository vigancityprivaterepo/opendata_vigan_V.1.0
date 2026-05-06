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

function StatCard({ label, value, suffix }: {
  label: string; value: number; suffix?: string
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
      className="flex flex-col items-start px-6 py-5 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <p className="font-display font-bold text-4xl text-vigan-primary leading-none mb-2">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
    </div>
  )
}

const STAT_CARDS = [
  { label: 'Published Datasets',  key: 'datasetCount',      suffix: '' },
  { label: 'Agencies',            key: 'organizationCount', suffix: '' },
  { label: 'Total Downloads',     key: 'downloads',         suffix: 'K' },
  { label: 'Data Categories',     key: 'tagCount',          suffix: '' },
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
      className="bg-vigan-bg py-8 border-b border-gray-200"
      aria-label="Portal statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.key}
            label={card.label}
            value={values[card.key] ?? 0}
            suffix={card.suffix}
          />
        ))}
      </div>
    </section>
  )
}
