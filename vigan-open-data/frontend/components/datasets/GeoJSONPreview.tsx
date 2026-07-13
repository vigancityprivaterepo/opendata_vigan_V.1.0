'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Loader2, MapPinned } from 'lucide-react'
import type { CKANResource } from '@/types/ckan'
import { getResourceDownloadURL } from '@/lib/utils'

interface Props {
  resource: CKANResource
}

interface FeatureSummary {
  featureCount: number
  polygonCount: number
  lineCount: number
  pointCount: number
  bounds: [number, number, number, number] | null
  paths: Array<{ d: string; kind: 'polygon' | 'line' }>
  points: Array<{ x: number; y: number }>
}

type Position = [number, number]

function flattenPositions(coords: unknown): Position[] {
  if (!Array.isArray(coords)) return []
  if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    return [[Number(coords[0]), Number(coords[1])]]
  }
  return coords.flatMap((entry) => flattenPositions(entry))
}

function projectPoint(
  lon: number,
  lat: number,
  bounds: [number, number, number, number],
  width: number,
  height: number,
  padding: number
) {
  const [minLon, minLat, maxLon, maxLat] = bounds
  const safeWidth = Math.max(maxLon - minLon, 0.0001)
  const safeHeight = Math.max(maxLat - minLat, 0.0001)
  const x = padding + ((lon - minLon) / safeWidth) * (width - padding * 2)
  const y = height - padding - ((lat - minLat) / safeHeight) * (height - padding * 2)
  return { x, y }
}

function buildPath(
  coords: unknown,
  bounds: [number, number, number, number],
  width: number,
  height: number,
  padding: number,
  closePath: boolean
) {
  if (!Array.isArray(coords) || !Array.isArray(coords[0])) return ''

  const commands = (coords as unknown[])
    .map((point, index) => {
      if (!Array.isArray(point) || typeof point[0] !== 'number' || typeof point[1] !== 'number') {
        return ''
      }
      const projected = projectPoint(
        Number(point[0]),
        Number(point[1]),
        bounds,
        width,
        height,
        padding
      )
      return `${index === 0 ? 'M' : 'L'} ${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`
    })
    .filter(Boolean)
    .join(' ')

  if (!commands) return ''
  return closePath ? `${commands} Z` : commands
}

function summarizeGeoJSON(input: unknown): FeatureSummary | null {
  if (!input || typeof input !== 'object') return null

  const source = input as {
    type?: string
    geometry?: { type?: string; coordinates?: unknown }
    features?: Array<{ geometry?: { type?: string; coordinates?: unknown } }>
  }

  const features =
    source.type === 'FeatureCollection'
      ? source.features ?? []
      : source.type === 'Feature'
        ? [source]
        : source.geometry
          ? [{ geometry: source.geometry }]
          : []

  if (!features.length) return null

  const allPositions: Position[] = []
  let polygonCount = 0
  let lineCount = 0
  let pointCount = 0

  for (const feature of features) {
    const geometry = feature.geometry
    if (!geometry) continue
    const positions = flattenPositions(geometry.coordinates)
    allPositions.push(...positions)

    if (geometry.type?.includes('Polygon')) polygonCount += 1
    else if (geometry.type?.includes('LineString')) lineCount += 1
    else if (geometry.type?.includes('Point')) pointCount += 1
  }

  if (!allPositions.length) return null

  const lons = allPositions.map(([lon]) => lon)
  const lats = allPositions.map(([, lat]) => lat)
  const bounds: [number, number, number, number] = [
    Math.min(...lons),
    Math.min(...lats),
    Math.max(...lons),
    Math.max(...lats),
  ]

  const width = 560
  const height = 320
  const padding = 24
  const paths: Array<{ d: string; kind: 'polygon' | 'line' }> = []
  const points: Array<{ x: number; y: number }> = []

  for (const feature of features) {
    const geometry = feature.geometry
    if (!geometry) continue

    if (geometry.type === 'Polygon') {
      const ring = Array.isArray(geometry.coordinates) ? geometry.coordinates[0] : null
      const d = buildPath(ring, bounds, width, height, padding, true)
      if (d) paths.push({ d, kind: 'polygon' })
    } else if (geometry.type === 'MultiPolygon') {
      const polygons = Array.isArray(geometry.coordinates) ? geometry.coordinates : []
      for (const polygon of polygons.slice(0, 4)) {
        const outerRing = Array.isArray(polygon) ? polygon[0] : null
        const d = buildPath(outerRing, bounds, width, height, padding, true)
        if (d) paths.push({ d, kind: 'polygon' })
      }
    } else if (geometry.type === 'LineString') {
      const d = buildPath(geometry.coordinates, bounds, width, height, padding, false)
      if (d) paths.push({ d, kind: 'line' })
    } else if (geometry.type === 'MultiLineString') {
      const lines = Array.isArray(geometry.coordinates) ? geometry.coordinates : []
      for (const line of lines.slice(0, 6)) {
        const d = buildPath(line, bounds, width, height, padding, false)
        if (d) paths.push({ d, kind: 'line' })
      }
    } else if (geometry.type === 'Point') {
      const coords = flattenPositions(geometry.coordinates)[0]
      if (coords) points.push(projectPoint(coords[0], coords[1], bounds, width, height, padding))
    } else if (geometry.type === 'MultiPoint') {
      for (const coords of flattenPositions(geometry.coordinates).slice(0, 20)) {
        points.push(projectPoint(coords[0], coords[1], bounds, width, height, padding))
      }
    }
  }

  return {
    featureCount: features.length,
    polygonCount,
    lineCount,
    pointCount,
    bounds,
    paths,
    points,
  }
}

export default function GeoJSONPreview({ resource }: Props) {
  const [summary, setSummary] = useState<FeatureSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!resource.url) {
      setError('No URL available')
      setLoading(false)
      return
    }

    fetch(getResourceDownloadURL(resource.url))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON (${response.status})`)
        }
        return response.json()
      })
      .then((json) => {
        const nextSummary = summarizeGeoJSON(json)
        if (!nextSummary) {
          throw new Error('No mappable GeoJSON features found')
        }
        setSummary(nextSummary)
        setLoading(false)
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message || 'Failed to load GeoJSON preview')
        setLoading(false)
      })
  }, [resource.url])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-14 text-vigan-muted">
        <Loader2 size={18} className="animate-spin text-vigan-primary" aria-hidden="true" />
        <span className="text-sm">Loading map preview...</span>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-10 text-red-700">
        <AlertCircle size={18} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">Map preview unavailable</p>
          <p className="mt-0.5 text-xs text-red-500">{error || 'No map data found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Features</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{summary.featureCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Polygons</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{summary.polygonCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Lines</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{summary.lineCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Points</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{summary.pointCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-[linear-gradient(180deg,#f6fffb_0%,#eef7ff_100%)]">
        <div className="flex items-center gap-2 border-b border-gray-200 bg-white/70 px-4 py-3">
          <MapPinned size={15} className="text-vigan-primary" />
          <span className="text-sm font-semibold text-gray-800">Sample map preview</span>
        </div>
        <div className="p-4">
          <svg viewBox="0 0 560 320" className="h-auto w-full rounded bg-white/70">
            {summary.paths.map((path, index) => (
              <path
                key={`${path.kind}-${index}`}
                d={path.d}
                fill={path.kind === 'polygon' ? 'rgba(6,95,70,0.16)' : 'none'}
                stroke={path.kind === 'polygon' ? '#065F46' : '#0F766E'}
                strokeWidth={path.kind === 'polygon' ? 1.4 : 2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {summary.points.map((point, index) => (
              <circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r="3.5"
                fill="#DC2626"
                opacity="0.85"
              />
            ))}
          </svg>
        </div>
      </div>

      {summary.bounds && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          Bounds: {summary.bounds[0].toFixed(4)}, {summary.bounds[1].toFixed(4)} to {summary.bounds[2].toFixed(4)}, {summary.bounds[3].toFixed(4)}
        </div>
      )}
    </div>
  )
}
