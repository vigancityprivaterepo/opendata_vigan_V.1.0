'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

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
  { label: 'Newest First',   value: 'metadata_modified desc' },
  { label: 'Most Relevant',  value: 'score desc' },
  { label: 'Title A → Z',    value: 'title_string asc' },
  { label: 'Title Z → A',    value: 'title_string desc' },
]
const DEPARTMENTS = [
  { label: 'City Planning & Dev.',  value: 'city-planning' },
  { label: 'Tourism Office',        value: 'tourism-office' },
  { label: 'DRRMO',                 value: 'drrmo' },
  { label: 'City Health Office',    value: 'city-health' },
  { label: 'Business Permits',      value: 'business-permits' },
  { label: 'City Budget',           value: 'city-budget' },
  { label: 'CENRO',                 value: 'cenro' },
]

// Format pill colors
const FMT_COLORS: Record<string, string> = {
  CSV:     'bg-green-50 text-green-700 border-green-200',
  GEOJSON: 'bg-teal-50 text-teal-700 border-teal-200',
  XLSX:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  PDF:     'bg-red-50 text-red-700 border-red-200',
  JSON:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  SHP:     'bg-purple-50 text-purple-700 border-purple-200',
}

function FilterSection({
  title, children, defaultOpen = true
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full mb-3 group"
        aria-expanded={open}
      >
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider group-hover:text-vigan-primary transition-colors">
          {title}
        </span>
        {open
          ? <ChevronUp size={14} className="text-gray-400" />
          : <ChevronDown size={14} className="text-gray-400" />
        }
      </button>
      {open && <div className="animate-fade-in">{children}</div>}
    </div>
  )
}

export default function DatasetFilters() {
  const router      = useRouter()
  const params      = useSearchParams()
  const currentOrg  = params.get('organization') || ''
  const currentTag  = params.get('tags') || ''
  const currentFmt  = params.get('format') || ''
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
  const filterCount = [currentOrg, currentTag, currentFmt].filter(Boolean).length

  return (
    <aside className="space-y-5" aria-label="Dataset filters">

      {/* Active filter summary */}
      {hasFilters && (
        <div className="flex items-center justify-between p-3 bg-vigan-light rounded-lg border border-vigan-border">
          <span className="text-xs font-semibold text-vigan-primary">
            {filterCount} filter{filterCount > 1 ? 's' : ''} active
          </span>
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            <X size={12} />
            Clear all
          </button>
        </div>
      )}

      {/* Sort */}
      <FilterSection title="Sort By">
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => update('sort', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:border-vigan-primary focus:ring-1 focus:ring-vigan-primary/30 focus:outline-none transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </FilterSection>

      {/* Department */}
      <FilterSection title="Department">
        <div className="space-y-1.5">
          {[{ label: 'All Departments', value: '' }, ...DEPARTMENTS].map((dept) => (
            <label
              key={dept.value}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150',
                currentOrg === dept.value
                  ? 'bg-vigan-light border border-vigan-border'
                  : 'hover:bg-gray-50'
              )}
            >
              <input
                type="radio"
                name="org"
                value={dept.value}
                checked={currentOrg === dept.value}
                onChange={() => update('organization', dept.value)}
                className="accent-vigan-primary w-3.5 h-3.5"
              />
              <span className={cn(
                'text-sm transition-colors',
                currentOrg === dept.value
                  ? 'font-semibold text-vigan-primary'
                  : 'text-gray-600'
              )}>
                {dept.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Format */}
      <FilterSection title="File Format">
        <div className="flex flex-wrap gap-1.5">
          {FORMATS.map((fmt) => {
            const active = currentFmt === fmt.toLowerCase()
            const colors = FMT_COLORS[fmt] ?? 'bg-gray-50 text-gray-600 border-gray-200'
            return (
              <button
                key={fmt}
                onClick={() => update('format', active ? '' : fmt.toLowerCase())}
                className={cn(
                  'text-xs font-bold px-2.5 py-1 rounded-md border transition-all duration-150',
                  active
                    ? colors + ' ring-2 ring-offset-1 ring-vigan-primary/30 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                {fmt}
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" defaultOpen={false}>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150',
                currentTag === cat.value
                  ? 'bg-vigan-light border border-vigan-border'
                  : 'hover:bg-gray-50'
              )}
            >
              <input
                type="checkbox"
                checked={currentTag === cat.value}
                onChange={() => update('tags', currentTag === cat.value ? '' : cat.value)}
                className="accent-vigan-primary w-3.5 h-3.5 rounded"
              />
              <span className={cn(
                'text-sm transition-colors',
                currentTag === cat.value
                  ? 'font-semibold text-vigan-primary'
                  : 'text-gray-600'
              )}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

    </aside>
  )
}
