'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { CKANResource } from '@/types/ckan'
import { getResourceDownloadURL } from '@/lib/utils'

interface Props {
  resource: CKANResource
}

export default function CSVPreview({ resource }: Props) {
  const [rows, setRows] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!resource.url) {
      setError('No URL available')
      setLoading(false)
      return
    }

    const url = getResourceDownloadURL(resource.url)

    Papa.parse(url, {
      download: true,
      header: false,
      preview: 11,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data as string[][]
        if (data.length > 0) {
          setHeaders(data[0])
          setRows(data.slice(1, 11))
        }
        setLoading(false)
      },
      error: (err) => {
        setError(err.message || 'Failed to load CSV')
        setLoading(false)
      },
    })
  }, [resource.url])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-vigan-muted">
        <Loader2 size={18} className="animate-spin text-vigan-primary" aria-hidden="true" />
        <span className="text-sm">Loading preview...</span>
      </div>
    )
  }

  if (error || rows.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-10 text-red-700">
        <AlertCircle size={18} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">Preview unavailable</p>
          <p className="mt-0.5 text-xs text-red-500">
            {error || 'No data found in this resource.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-3 text-xs text-vigan-muted">
        Showing first {rows.length} rows of <strong>{resource.name || 'this resource'}</strong>
      </p>
      <div className="scrollbar-thin overflow-x-auto rounded-lg border border-vigan-border">
        <table className="min-w-max w-full text-xs">
          <thead>
            <tr className="bg-vigan-primary text-white">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap border-r border-vigan-accent/30 px-3 py-2.5 text-left font-semibold last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-vigan-bg'}>
                {headers.map((_, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="max-w-[200px] truncate whitespace-nowrap border-r border-vigan-border/50 px-3 py-2 text-vigan-text last:border-r-0"
                  >
                    {row[columnIndex] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-vigan-muted">
        Preview limited to 10 rows. Download the full file below.
      </p>
    </div>
  )
}
