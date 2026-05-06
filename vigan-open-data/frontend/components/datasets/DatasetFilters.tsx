'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const FORMATS = ['CSV', 'GeoJSON', 'XLSX', 'PDF', 'JSON', 'SHP']
const CATEGORIES = [
  { label: 'Tourism',       value: 'tourism' },
  { label: 'Disaster Risk', value: 'drrm' },
  { label: 'Health',        value: 'health' },
  { label: 'Planning',      value: 'planning' },
  { label: 'Business',      value: 'business' },
  { label: 'Budget',        value: 'budget' },
  { label: 'Environment',   value: 'environment' },
]
const SORT_OPTIONS = [
  { label: 'Newest',           value: 'metadata_modified desc' },
  { label: 'Most Relevant',    value: 'score desc' },
  { label: 'Title A→Z',        value: 'title_string asc' },
  { label: 'Title Z→A',        value: 'title_string desc' },
]
const DEPARTMENTS = [
  { label: 'City Planning & Dev.',   value: 'city-planning' },
  { label: 'Tourism Office',         value: 'tourism-office' },
  { label: 'DRRMO',                  value: 'drrmo' },
  { label: 'City Health Office',     value: 'city-health' },
  { label: 'Business Permits',       value: 'business-permits' },
  { label: 'City Budget',            value: 'city-budget' },
  { label: 'CENRO',                  value: 'cenro' },
]

export default function DatasetFilters() {
  const router     = useRouter()
  const params     = useSearchParams()
  const currentOrg = params.get('organization') || ''
  const currentTag = params.get('tags') || ''
  const currentFmt = params.get('format') || ''
  const currentSort = params.get('sort') || 'metadata_modified desc'

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/datasets?${p.toString()}`)
  }

  function clearAll() { router.push('/datasets') }

  const hasFilters = !!(currentOrg || currentTag || currentFmt)

  return (
    <aside className="space-y-6" aria-label="Dataset filters">

      {/* Sort */}
      <div>
        <label htmlFor="sort-select" className="block text-xs font-bold text-vigan-text uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => update('sort', e.target.value)}
          className="w-full text-sm border-2 border-vigan-border rounded-lg px-3 py-2 bg-white text-vigan-text focus:border-vigan-secondary focus:outline-none transition-colors"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Department filter */}
      <div>
        <p className="text-xs font-bold text-vigan-text uppercase tracking-wider mb-3">Department</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio" name="org" value=""
              checked={!currentOrg}
              onChange={() => update('organization', '')}
              className="accent-vigan-primary"
            />
            <span className={cn('text-sm', !currentOrg ? 'font-semibold text-vigan-primary' : 'text-vigan-muted group-hover:text-vigan-text')}>
              All Departments
            </span>
          </label>
          {DEPARTMENTS.map((dept) => (
            <label key={dept.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio" name="org" value={dept.value}
                checked={currentOrg === dept.value}
                onChange={() => update('organization', dept.value)}
                className="accent-vigan-primary"
              />
              <span className={cn('text-sm', currentOrg === dept.value ? 'font-semibold text-vigan-primary' : 'text-vigan-muted group-hover:text-vigan-text')}>
                {dept.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Format filter */}
      <div>
        <p className="text-xs font-bold text-vigan-text uppercase tracking-wider mb-3">Format</p>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => update('format', currentFmt === fmt.toLowerCase() ? '' : fmt.toLowerCase())}
              className={cn(
                'text-xs font-bold px-3 py-1 rounded-full border-2 transition-all',
                currentFmt === fmt.toLowerCase()
                  ? 'bg-vigan-primary text-white border-vigan-primary'
                  : 'bg-white text-vigan-muted border-vigan-border hover:border-vigan-primary hover:text-vigan-primary'
              )}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Category / Tag filter */}
      <div>
        <p className="text-xs font-bold text-vigan-text uppercase tracking-wider mb-3">Category</p>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentTag === cat.value}
                onChange={() => update('tags', currentTag === cat.value ? '' : cat.value)}
                className="accent-vigan-primary rounded"
              />
              <span className={cn('text-sm', currentTag === cat.value ? 'font-semibold text-vigan-primary' : 'text-vigan-muted group-hover:text-vigan-text')}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          <X size={13} aria-hidden="true" />
          Clear all filters
        </button>
      )}
    </aside>
  )
}
