import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import type { CKANResource } from '@/types/ckan'
import {
  formatFileSize,
  getCKANResourcePageURL,
  getTrackedResourceDownloadURL,
} from '@/lib/utils'

interface Props {
  datasetName: string
  resources: CKANResource[]
}

function getPreviewLabel(format: string): string {
  const normalized = format.toUpperCase()
  if (normalized === 'CSV' || normalized === 'XLSX' || normalized === 'XLS') return 'Portal preview'
  if (normalized === 'GEOJSON') return 'Portal map preview'
  if (normalized === 'PDF') return 'Portal PDF preview'
  return 'Portal resource preview'
}

export default function ResourceSection({ datasetName, resources }: Props) {
  if (!resources.length) return null

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
        <p className="mt-1 text-sm text-gray-500">
          Download files directly or use CKAN-native viewers where available.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {resources.map((resource) => {
          const format = (resource.format || 'file').toUpperCase()

          return (
            <div key={resource.id} className="px-5 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {resource.name || 'Untitled resource'}
                    </h3>
                    <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                      {format}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {getPreviewLabel(format)}
                    {resource.size ? ` · ${formatFileSize(resource.size)}` : ''}
                  </p>
                  {resource.description && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{resource.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <a
                    href={getTrackedResourceDownloadURL(resource.id, resource.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-vigan-primary hover:text-vigan-primary"
                  >
                    <FileText size={13} />
                    Download
                  </a>
                  <Link
                    href={getCKANResourcePageURL(datasetName, resource.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-vigan-border bg-vigan-surface px-3 py-2 text-xs font-medium text-vigan-primary transition-colors hover:border-vigan-primary hover:bg-vigan-light"
                  >
                    <ExternalLink size={13} />
                    Open Preview
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
