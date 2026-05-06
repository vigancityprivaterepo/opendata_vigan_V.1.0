import Link from 'next/link'
import { FileText, Building2, Download } from 'lucide-react'
import type { CKANDataset } from '@/types/ckan'
import { truncate, formatDate, getFormatColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  dataset: CKANDataset
  view?: 'grid' | 'list'
}

export default function DatasetCard({ dataset, view = 'grid' }: Props) {
  const primaryResource = dataset.resources?.[0]
  const format = primaryResource?.format || null

  if (view === 'list') {
    return (
      <article className="card border-l-4 border-l-vigan-primary p-5 flex gap-5 items-start">
        <div className="hidden sm:flex w-10 h-10 rounded-lg bg-vigan-bg items-center justify-center flex-shrink-0 text-xl mt-0.5">
          <FileText size={18} className="text-vigan-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
            <h3 className="font-display font-bold text-base text-vigan-text leading-snug">
              <Link href={`/datasets/${dataset.name}`} className="hover:text-vigan-primary transition-colors">
                {dataset.title || dataset.name}
              </Link>
            </h3>
            {format && (
              <span className={cn('format-badge flex-shrink-0', getFormatColor(format))}>
                {format}
              </span>
            )}
          </div>
          {dataset.organization && (
            <p className="text-xs text-vigan-muted flex items-center gap-1 mb-1.5">
              <Building2 size={11} aria-hidden="true" />
              {dataset.organization.title}
            </p>
          )}
          <p className="text-sm text-vigan-muted leading-relaxed mb-3">
            {truncate(dataset.notes, 180)}
          </p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-xs text-vigan-muted">
              <span>{dataset.num_resources} resource{dataset.num_resources !== 1 ? 's' : ''}</span>
              <span>· Updated {formatDate(dataset.metadata_modified)}</span>
              {dataset.tags?.slice(0, 3).map((tag) => (
                <span key={tag.id} className="px-2 py-0.5 bg-vigan-light text-vigan-primary rounded-full font-medium">
                  {tag.display_name}
                </span>
              ))}
            </div>
            <Link href={`/datasets/${dataset.name}`} className="btn-outline text-xs px-3 py-1.5">
              View Dataset
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Grid view (default)
  return (
    <article
      className="card border-l-4 border-l-vigan-primary p-5 flex flex-col gap-3"
      aria-label={dataset.title || dataset.name}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold text-vigan-muted uppercase tracking-wider">
          {dataset.organization?.title || 'Vigan City Government'}
        </p>
        {format && (
          <span className={cn('format-badge flex-shrink-0', getFormatColor(format))}>
            {format}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-base text-vigan-text leading-snug flex-1">
        <Link href={`/datasets/${dataset.name}`} className="hover:text-vigan-primary transition-colors">
          {dataset.title || dataset.name}
        </Link>
      </h3>

      {/* Description */}
      <p className="text-sm text-vigan-muted leading-relaxed flex-1">
        {truncate(dataset.notes, 120)}
      </p>

      {/* Tags */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {dataset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 text-[11px] bg-vigan-light text-vigan-primary rounded-full font-medium"
            >
              {tag.display_name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-vigan-light mt-auto">
        <span className="flex items-center gap-1 text-xs text-vigan-muted">
          <FileText size={12} aria-hidden="true" />
          {dataset.num_resources} resource{dataset.num_resources !== 1 ? 's' : ''}
        </span>
        <Link
          href={`/datasets/${dataset.name}`}
          className="text-xs font-semibold text-white bg-vigan-primary px-3 py-1.5 rounded-lg hover:bg-vigan-accent transition-colors"
        >
          View Dataset
        </Link>
      </div>
    </article>
  )
}
