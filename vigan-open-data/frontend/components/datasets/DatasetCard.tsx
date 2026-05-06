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
      <article className="bg-white border border-gray-200 rounded-lg p-5 flex gap-5 items-start hover:shadow-md hover:border-vigan-primary transition-all duration-200">
        <div className="hidden sm:flex w-10 h-10 rounded-lg bg-emerald-50 items-center justify-center flex-shrink-0 text-xl mt-0.5">
          <FileText size={18} className="text-vigan-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
            <h3 className="font-display font-semibold text-lg text-gray-900 leading-snug">
              <Link href={`/datasets/${dataset.name}`} className="hover:text-vigan-primary transition-colors">
                {dataset.title || dataset.name}
              </Link>
            </h3>
            {format && (
              <span className={cn('format-badge flex-shrink-0 bg-emerald-50 text-vigan-primary px-2.5 py-1 rounded-md text-[10px]')}>
                {format}
              </span>
            )}
          </div>
          {dataset.organization && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
              <Building2 size={12} aria-hidden="true" />
              {dataset.organization.title}
            </p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {truncate(dataset.notes, 180)}
          </p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{dataset.num_resources} resource{dataset.num_resources !== 1 ? 's' : ''}</span>
              <span>· Updated {formatDate(dataset.metadata_modified)}</span>
              {dataset.tags?.slice(0, 3).map((tag) => (
                <span key={tag.id} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                  {tag.display_name}
                </span>
              ))}
            </div>
            <Link href={`/datasets/${dataset.name}`} className="text-sm font-medium text-vigan-primary hover:underline">
              View Dataset →
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Grid view (default)
  return (
    <article
      className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3 hover:shadow-md hover:border-vigan-primary transition-all duration-200"
      aria-label={dataset.title || dataset.name}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          {dataset.organization?.title || 'Vigan City Government'}
        </p>
        {format && (
          <span className={cn('format-badge flex-shrink-0 bg-emerald-50 text-vigan-primary px-2 py-0.5 rounded-md')}>
            {format}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-lg text-gray-900 leading-snug flex-1">
        <Link href={`/datasets/${dataset.name}`} className="hover:text-vigan-primary transition-colors">
          {dataset.title || dataset.name}
        </Link>
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed flex-1">
        {truncate(dataset.notes, 120)}
      </p>

      {/* Tags */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {dataset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-[11px] bg-gray-100 text-gray-700 rounded-md font-medium"
            >
              {tag.display_name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <FileText size={14} aria-hidden="true" />
          {dataset.num_resources} resource{dataset.num_resources !== 1 ? 's' : ''}
        </span>
        <Link
          href={`/datasets/${dataset.name}`}
          className="text-sm font-medium text-vigan-primary hover:underline"
        >
          View Dataset →
        </Link>
      </div>
    </article>
  )
}
