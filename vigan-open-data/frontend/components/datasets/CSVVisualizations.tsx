'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { BarChart3, AlertCircle, Loader2 } from 'lucide-react'
import type { CKANResource } from '@/types/ckan'
import { getResourceDownloadURL } from '@/lib/utils'

interface Props {
  resource: CKANResource
}

interface ChartPoint {
  label: string
  value: number
}

interface VizData {
  rowCount: number
  numericField: string | null
  categoryField: string | null
  maxValue: number
  minValue: number
  avgValue: number
  categoryCounts: ChartPoint[]
  topValues: ChartPoint[]
}

function DonutChart({ points }: { points: ChartPoint[] }) {
  if (!points.length) return null

  const palette = ['#065F46', '#0F766E', '#14B8A6', '#F59E0B', '#DC2626', '#7C3AED']
  const total = points.reduce((sum, point) => sum + point.value, 0)
  const radius = 58
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900">Composition overview</h4>
        <p className="text-xs text-gray-500">Relative share of the largest categories</p>
      </div>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <svg viewBox="0 0 180 180" className="h-44 w-44 flex-shrink-0">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="22" />
          {points.map((point, index) => {
            const dash = (point.value / total) * circumference
            const segment = (
              <circle
                key={point.label}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={palette[index % palette.length]}
                strokeWidth="22"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 90 90)"
              />
            )
            offset += dash
            return segment
          })}
          <circle cx="90" cy="90" r="38" fill="white" />
          <text x="90" y="84" textAnchor="middle" className="fill-gray-400 text-[10px] font-semibold uppercase tracking-wider">
            Total
          </text>
          <text x="90" y="102" textAnchor="middle" className="fill-gray-900 text-xl font-bold">
            {total}
          </text>
        </svg>

        <div className="w-full space-y-2">
          {points.map((point, index) => (
            <div key={`legend-${point.label}`} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: palette[index % palette.length] }}
                />
                <span className="font-medium text-gray-700">{truncateLabel(point.label, 24)}</span>
              </div>
              <span className="text-gray-500">{((point.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function parseNumber(value: unknown): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const normalized = String(value).replace(/,/g, '').trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function truncateLabel(label: string, max = 18): string {
  return label.length > max ? `${label.slice(0, max - 1)}...` : label
}

function buildVisualizationData(rows: Record<string, string>[]): VizData | null {
  if (!rows.length) return null

  const headers = Object.keys(rows[0] ?? {})
  if (!headers.length) return null

  let categoryField: string | null = null
  let numericField: string | null = null

  for (const header of headers) {
    const values = rows.map((row) => (row[header] ?? '').trim()).filter(Boolean)
    const unique = new Set(values)
    const numericValues = values
      .map((value) => parseNumber(value))
      .filter((value): value is number => value !== null)

    if (!categoryField && unique.size >= 2 && unique.size <= 12 && numericValues.length < values.length * 0.6) {
      categoryField = header
    }

    if (!numericField && numericValues.length >= Math.max(3, Math.floor(rows.length * 0.6))) {
      numericField = header
    }
  }

  const numericValues = numericField
    ? rows
        .map((row) => parseNumber(row[numericField!]))
        .filter((value): value is number => value !== null)
    : []

  const categoryCounts =
    categoryField
      ? Array.from(
          rows.reduce((map, row) => {
            const key = (row[categoryField!] ?? '').trim() || 'Unspecified'
            map.set(key, (map.get(key) ?? 0) + 1)
            return map
          }, new Map<string, number>())
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([label, value]) => ({ label, value }))
      : []

  const labelField =
    headers.find((header) => header !== numericField && header !== categoryField) ||
    categoryField ||
    headers[0]

  const topValues =
    numericField && labelField
      ? rows
          .map((row) => ({
            label: (row[labelField] ?? '').trim() || 'Unnamed',
            value: parseNumber(row[numericField!]),
          }))
          .filter((item): item is ChartPoint => item.value !== null)
          .sort((a, b) => b.value - a.value)
          .slice(0, 6)
      : []

  const maxValue = numericValues.length ? Math.max(...numericValues) : 0
  const minValue = numericValues.length ? Math.min(...numericValues) : 0
  const avgValue = numericValues.length
    ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
    : 0

  return {
    rowCount: rows.length,
    numericField,
    categoryField,
    maxValue,
    minValue,
    avgValue,
    categoryCounts,
    topValues,
  }
}

function HorizontalBars({
  title,
  subtitle,
  points,
  accentClass,
}: {
  title: string
  subtitle: string
  points: ChartPoint[]
  accentClass: string
}) {
  if (!points.length) return null

  const max = Math.max(...points.map((point) => point.value), 1)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="space-y-3">
        {points.map((point) => (
          <div key={`${title}-${point.label}`} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-gray-700">{truncateLabel(point.label)}</span>
              <span className="text-gray-500">{point.value.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${accentClass}`}
                style={{ width: `${Math.max((point.value / max) * 100, 8)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CSVVisualizations({ resource }: Props) {
  const [data, setData] = useState<VizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!resource.url) {
      setError('No URL available')
      setLoading(false)
      return
    }

    Papa.parse<Record<string, string>>(getResourceDownloadURL(resource.url), {
      download: true,
      header: true,
      preview: 100,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data.filter((row) =>
          Object.values(row).some((value) => String(value ?? '').trim() !== '')
        )
        const vizData = buildVisualizationData(rows)

        if (!vizData || (!vizData.categoryCounts.length && !vizData.topValues.length)) {
          setError('Not enough structured data to build sample charts.')
          setLoading(false)
          return
        }

        setData(vizData)
        setLoading(false)
      },
      error: (parseError) => {
        setError(parseError.message || 'Failed to load visualization data')
        setLoading(false)
      },
    })
  }, [resource.url])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-vigan-muted">
        <Loader2 size={18} className="animate-spin text-vigan-primary" aria-hidden="true" />
        <span className="text-sm">Loading visualizations...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-amber-800">
        <AlertCircle size={18} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">Visualization unavailable</p>
          <p className="mt-0.5 text-xs text-amber-700">{error || 'No chartable data found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Sample size
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.rowCount}</p>
          <p className="text-xs text-gray-500">Rows used for the sample charts</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Highest value
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.maxValue ? data.maxValue.toLocaleString() : 'N/A'}
          </p>
          <p className="text-xs text-gray-500">{data.numericField || 'No numeric field detected'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Average value
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.avgValue ? data.avgValue.toFixed(1) : 'N/A'}
          </p>
          <p className="text-xs text-gray-500">{data.numericField || 'No numeric field detected'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <HorizontalBars
          title="Category distribution"
          subtitle={data.categoryField ? `Grouped by ${data.categoryField}` : 'Categorical breakdown'}
          points={data.categoryCounts}
          accentClass="bg-vigan-primary"
        />
        <HorizontalBars
          title="Top numeric values"
          subtitle={data.numericField ? `Ranked by ${data.numericField}` : 'Numeric ranking'}
          points={data.topValues}
          accentClass="bg-emerald-500"
        />
      </div>

      <DonutChart points={data.categoryCounts.slice(0, 5)} />

      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <BarChart3 size={14} className="text-vigan-primary" />
          Sample visualizations
        </div>
        <p className="mt-1">
          These charts are generated from the first 100 rows of the uploaded CSV and are meant as
          quick previews, not official analytics.
        </p>
      </div>
    </div>
  )
}
