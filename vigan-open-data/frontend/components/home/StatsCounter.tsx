'use client'
import { useEffect, useRef, useState } from 'react'
import type { CKANSiteStats } from '@/types/ckan'

interface Props { stats: CKANSiteStats }

function useCountUp(target: number, duration = 1600, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target === 0) return
    let start: number | null = null
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
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

function StatItem({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const count = useCountUp(value, 1600, active)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="px-6 py-7">
      <p className="text-3xl font-bold text-gray-900 tabular-nums mb-1">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

const STATS = [
  { label: 'Published Datasets', key: 'datasetCount',      suffix: '' },
  { label: 'City Agencies',      key: 'organizationCount', suffix: '' },
  { label: 'Data Categories',    key: 'tagCount',          suffix: '' },
  { label: 'Total Downloads',    key: 'downloads',         suffix: 'K' },
]

export default function StatsCounter({ stats }: Props) {
  const values: Record<string, number> = {
    datasetCount:      stats.datasetCount,
    organizationCount: stats.organizationCount,
    tagCount:          stats.tagCount,
    downloads:         12,
  }

  return (
    <section className="bg-gray-50 border-y border-gray-200" aria-label="Portal statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          {STATS.map(stat => (
            <StatItem
              key={stat.key}
              label={stat.label}
              value={values[stat.key] ?? 0}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
