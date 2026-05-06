// ─────────────────────────────────────────────────────────────────────────────
// lib/utils.ts — Shared utility functions
// ─────────────────────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx'

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

/** Map a CKAN resource format string to a CSS color class */
export function getFormatColor(format: string | null | undefined): string {
  const f = (format || '').toUpperCase()
  if (f === 'CSV')     return 'bg-green-100 text-green-800'
  if (f === 'GEOJSON') return 'bg-blue-100 text-blue-800'
  if (f === 'JSON')    return 'bg-yellow-100 text-yellow-800'
  if (f === 'PDF')     return 'bg-red-100 text-red-800'
  if (f === 'XLSX' || f === 'XLS') return 'bg-emerald-100 text-emerald-800'
  if (f === 'SHP')     return 'bg-purple-100 text-purple-800'
  return 'bg-gray-100 text-gray-700'
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
  // Resource URLs may be relative CKAN paths
  if (resourceUrl.startsWith('http')) return resourceUrl
  const base = process.env.NEXT_PUBLIC_CKAN_URL || 'http://localhost:5000'
  return `${base}${resourceUrl}`
}
