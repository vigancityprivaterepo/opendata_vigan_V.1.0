import Link from 'next/link'
import { FileText, Building2, Clock, ExternalLink } from 'lucide-react'
import type { CKANDataset } from '@/types/ckan'
import { truncate, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  dataset: CKANDataset
  view?: 'grid' | 'list'
}

// Format → color mapping
const FORMAT_COLORS: Record<string, { bg: string; text: string }> = {
  CSV:     { bg: 'bg-green-100',  text: 'text-green-700'  },
  XLSX:    { bg: 'bg-emerald-100',text: 'text-emerald-700'},
  JSON:    { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  GEOJSON: { bg: 'bg-teal-100',   text: 'text-teal-700'   },
  PDF:     { bg: 'bg-red-100',    text: 'text-red-700'    },
  SHP:     { bg: 'bg-purple-100', text: 'text-purple-700' },
  DEFAULT: { bg: 'bg-gray-100',   text: 'text-gray-600'   },
}

function getFormatStyle(fmt: string | null) {
  if (!fmt) return FORMAT_COLORS.DEFAULT
  return FORMAT_COLORS[fmt.toUpperCase()] ?? FORMAT_COLORS.DEFAULT
}

// ─── LIST VIEW ──────────────────────────────────────────────────────────────
function DatasetListItem({ dataset }: { dataset: CKANDataset }) {
  const primaryResource = dataset.resources?.[0]
  const format = primaryResource?.format || null
  const fmtStyle = getFormatStyle(format)

  return (
    <article className="group bg-white border border-gray-200 rounded p-5 flex gap-4 items-start hover:border-vigan-primary transition-colors duration-150">
      {/* Icon */}
      <div className="hidden sm:flex w-10 h-10 rounded-lg bg-vigan-light items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-vigan-primary/10 transition-colors">
        <FileText size={18} className="text-vigan-primary" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
          <h3 className="font-semibold text-base text-gray-900 leading-snug group-hover:text-vigan-primary transition-colors">
            <Link href={`/datasets/${dataset.name}`} className="hover:underline underline-offset-2">
              {dataset.title || dataset.name}
            </Link>
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {format && (
              <span className={cn('format-badge', fmtStyle.bg, fmtStyle.text)}>
                {format}
              </span>
            )}
            {dataset.num_resources > 1 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                +{dataset.num_resources - 1} more
              </span>
            )}
          </div>
        </div>

        {/* Org */}
        {dataset.organization && (
          <p className="text-xs text-vigan-muted flex items-center gap-1 mb-2">
            <Building2 size={11} aria-hidden="true" />
            {dataset.organization.title}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
          {truncate(dataset.notes, 200)}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {dataset.tags?.slice(0, 3).map((tag) => (
              <span key={tag.id} className="chip">
                {tag.display_name}
              </span>
            ))}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              Updated {formatDate(dataset.metadata_modified)}
            </span>
          </div>
          <Link
            href={`/datasets/${dataset.name}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-vigan-primary hover:text-vigan-accent transition-colors"
          >
            View <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─── GRID VIEW ──────────────────────────────────────────────────────────────
function DatasetGridItem({ dataset }: { dataset: CKANDataset }) {
  const primaryResource = dataset.resources?.[0]
  const format = primaryResource?.format || null
  const fmtStyle = getFormatStyle(format)

  return (
    <article
      className="group bg-white border border-gray-200 rounded p-5 flex flex-col hover:border-vigan-primary transition-colors duration-150"
      aria-label={dataset.title || dataset.name}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight flex-1">
          {dataset.organization?.title || 'Vigan City Government'}
        </p>
        {format && (
          <span className={cn('format-badge flex-shrink-0', fmtStyle.bg, fmtStyle.text)}>
            {format}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-base text-gray-900 leading-snug mb-2 group-hover:text-vigan-primary transition-colors">
        <Link href={`/datasets/${dataset.name}`} className="hover:underline underline-offset-2">
          {dataset.title || dataset.name}
        </Link>
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-4">
        {truncate(dataset.notes, 130)}
      </p>

      {/* Tags */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {dataset.tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className="chip text-[10px]">
              {tag.display_name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <FileText size={12} aria-hidden="true" />
          {dataset.num_resources} resource{dataset.num_resources !== 1 ? 's' : ''}
        </span>
        <Link
          href={`/datasets/${dataset.name}`}
          className="text-xs font-semibold text-vigan-primary hover:text-vigan-accent transition-colors inline-flex items-center gap-1"
        >
          View Dataset →
        </Link>
      </div>
    </article>
  )
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────
export default function DatasetCard({ dataset, view = 'grid' }: Props) {
  if (view === 'list') return <DatasetListItem dataset={dataset} />
  return <DatasetGridItem dataset={dataset} />
}
