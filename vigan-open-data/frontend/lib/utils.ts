// ─────────────────────────────────────────────────────────────────────────────
// lib/utils.ts — Shared utility functions
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx'
import type { CKANResource } from '@/types/ckan'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Truncate text to n characters with ellipsis */
export function truncate(str: string | null | undefined, n: number): string {
  if (!str) return ''
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

/** Format a CKAN ISO date string to a human-readable date */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Unknown'
  try {
    return new Intl.DateTimeFormat('en-PH', {
      year:  'numeric',
      month: 'short',
      day:   'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

/** Format file size in bytes to human-readable string */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return 'Unknown size'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/** Map a CKAN resource format string to a Tailwind CSS color class */
export function getFormatColor(format: string | null | undefined): string {
  const f = (format || '').toUpperCase()
  if (f === 'HTML')   return 'bg-sky-700 text-sky-50'
  if (f === 'JSON')   return 'bg-orange-600 text-orange-50'
  if (f === 'XML')    return 'bg-amber-700 text-amber-50'
  if (f === 'TEXT' || f === 'TXT') return 'bg-slate-600 text-slate-50'
  if (f === 'CSV')    return 'bg-emerald-700 text-emerald-50'
  if (f === 'XLSX' || f === 'XLS') return 'bg-green-700 text-green-50'
  if (f === 'ZIP')    return 'bg-zinc-600 text-zinc-50'
  if (f === 'API')    return 'bg-fuchsia-700 text-fuchsia-50'
  if (f === 'PDF')    return 'bg-rose-700 text-rose-50'
  if (f === 'RDF' || f === 'NQUAD' || f === 'NTRIPLES' || f === 'TURTLE') return 'bg-indigo-700 text-indigo-50'
  if (f === 'GEOJSON' || f === 'SHP') return 'bg-teal-700 text-teal-50'
  return 'bg-gray-600 text-gray-50'
}

/** Get an icon character for a format */
export function getFormatIcon(format: string | null | undefined): string {
  const f = (format || '').toUpperCase()
  if (f === 'CSV')     return '📊'
  if (f === 'GEOJSON' || f === 'SHP') return '🗺️'
  if (f === 'JSON')    return '{ }'
  if (f === 'PDF')     return '📄'
  if (f === 'XLSX' || f === 'XLS') return '📈'
  return '📦'
}

/** Department metadata lookup */
export const DEPARTMENTS: Record<string, {
  label: string; short: string; icon: string; color: string
}> = {
  'city-planning':    { label: 'City Planning & Development',    short: 'CPDO',    icon: '🏛️', color: '#065F46' },
  'tourism-office':  { label: 'Vigan City Tourism Office',      short: 'Tourism', icon: '🏺', color: '#047857' },
  'drrmo':           { label: 'Disaster Risk Reduction & Mgmt', short: 'DRRMO',   icon: '🛡️', color: '#065F46' },
  'city-health':     { label: 'City Health Office',             short: 'CHO',     icon: '🏥', color: '#047857' },
  'business-permits':{ label: 'Business Permits & Licensing',   short: 'BPLO',    icon: '📋', color: '#065F46' },
  'city-budget':     { label: 'City Budget Office',             short: 'CBO',     icon: '💰', color: '#047857' },
  'cenro':           { label: 'City Environment & Natural Res', short: 'CENRO',   icon: '🌿', color: '#065F46' },
}

/** Build a CKAN resource download URL */
export function getResourceDownloadURL(resourceUrl: string): string {
  if (!resourceUrl) return '#'

  if (!resourceUrl.startsWith('http')) {
    return resourceUrl.startsWith('/') ? resourceUrl : `/${resourceUrl}`
  }

  try {
    const parsed = new URL(resourceUrl)
    const isInternalCKAN =
      parsed.hostname === 'ckan' ||
      (parsed.hostname === 'localhost' && (parsed.port === '5000' || parsed.port === '8080'))

    if (isInternalCKAN) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    return resourceUrl
  }

  return resourceUrl
}

export function getTrackedResourceDownloadURL(resourceId: string, resourceUrl: string): string {
  const directUrl = getResourceDownloadURL(resourceUrl)
  const params = new URLSearchParams({ url: directUrl })
  return `/api/download/${resourceId}?${params.toString()}`
}

/** Build the CKAN resource page URL where native views like PDF / GeoJSON live */
export function getCKANResourcePageURL(datasetName: string, resourceId: string): string {
  return `/datasets/${datasetName}/resources/${resourceId}`
}

export function getUniqueResourceFormats(resources: CKANResource[] | null | undefined): string[] {
  if (!resources?.length) return []
  return Array.from(
    new Set(
      resources
        .map((resource) => (resource.format || '').toUpperCase().trim())
        .filter(Boolean)
    )
  ).slice(0, 4)
}

/** Resolve CKAN-hosted image URLs for server and browser rendering */
export function getCKANImageURL(imageUrl: string | null | undefined): string {
  if (!imageUrl) return ''
  if (!imageUrl.startsWith('http')) {
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  }

  try {
    const parsed = new URL(imageUrl)
    const isInternalCKAN =
      parsed.hostname === 'ckan' ||
      (parsed.hostname === 'localhost' && (parsed.port === '5000' || parsed.port === '8080'))

    if (isInternalCKAN) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    return imageUrl
  }

  return imageUrl
}
