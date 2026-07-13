'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
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

const STAT_ICONS = {
  datasetCount: '/published_datasets.png',
  organizationCount: '/agencies.png',
  groupCount: '/categories.png',
  downloads: '/download.png',
}

interface StatItemProps {
  label: string
  value: number
  compact?: boolean
  iconKey: keyof typeof STAT_ICONS
}

function formatStatValue(value: number, compact?: boolean) {
  if (!compact) return value.toLocaleString()
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: value >= 10000 ? 0 : 1,
  }).format(value)
}

function StatItem({ label, value, compact, iconKey }: StatItemProps) {
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
    <div
      ref={ref}
      className="group flex flex-col items-center text-center px-6 py-8
                 transition-all duration-300
                 hover:bg-vigan-surface"
    >
      {/* Icon badge */}
      <div className="w-14 h-14 rounded-2xl bg-vigan-surface border border-vigan-border
                      flex items-center justify-center mb-4
                      group-hover:bg-vigan-primary group-hover:border-vigan-primary
                      transition-all duration-300 shadow-sm">
        <Image
          src={STAT_ICONS[iconKey]}
          alt=""
          width={28}
          height={28}
          className="w-7 h-7 object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Number */}
      <p className="stat-number text-vigan-deepDk mb-1 group-hover:text-vigan-primary transition-colors">
        {formatStatValue(count, compact)}
      </p>

      {/* Label */}
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  )
}

const STATS: { label: string; key: string; compact?: boolean; iconKey: keyof typeof STAT_ICONS }[] = [
  { label: 'Published Datasets', key: 'datasetCount',      iconKey: 'datasetCount'      },
  { label: 'City Agencies',      key: 'organizationCount', iconKey: 'organizationCount' },
  { label: 'Data Categories',    key: 'groupCount',        iconKey: 'groupCount'        },
  { label: 'Total Downloads',    key: 'downloads',         compact: true, iconKey: 'downloads' },
]

export default function StatsCounter({ stats }: Props) {
  const values: Record<string, number> = {
    datasetCount:      stats.datasetCount,
    organizationCount: stats.organizationCount,
    groupCount:        stats.groupCount,
    downloads:         stats.downloads,
  }

  return (
    <section aria-label="Portal statistics">
      {/* Emerald gradient top-bar */}
      <div className="emerald-top-bar" />
      <div className="bg-white border-b border-gray-100">
        <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(stat => (
              <StatItem
                key={stat.key}
                label={stat.label}
                value={values[stat.key] ?? 0}
                compact={stat.compact}
                iconKey={stat.iconKey}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
