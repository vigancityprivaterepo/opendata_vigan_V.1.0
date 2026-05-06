'use client'
import { useEffect, useRef, useState } from 'react'
import type { CKANResource } from '@/types/ckan'
import Papa from 'papaparse'
import { Loader2, AlertCircle } from 'lucide-react'

interface Props { resource: CKANResource }

export default function CSVPreview({ resource }: Props) {
  const [rows, setRows]     = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!resource.url) { setError('No URL available'); setLoading(false); return }

    const url =
      resource.url.startsWith('http')
        ? resource.url
        : `${process.env.NEXT_PUBLIC_CKAN_URL || ''}${resource.url}`

    Papa.parse(url, {
      download: true,
      header: false,
      preview: 11, // header row + 10 data rows
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
        <span className="text-sm">Loading preview…</span>
      </div>
    )
  }

  if (error || rows.length === 0) {
    return (
      <div className="flex items-center gap-3 py-10 px-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <AlertCircle size={18} aria-hidden="true" />
        <div>
          <p className="font-semibold text-sm">Preview unavailable</p>
          <p className="text-xs text-red-500 mt-0.5">{error || 'No data found in this resource.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-vigan-muted mb-3">
        Showing first {rows.length} rows of <strong>{resource.name || 'this resource'}</strong>
      </p>
      <div className="overflow-x-auto rounded-lg border border-vigan-border scrollbar-thin">
        <table className="w-full text-xs min-w-max">
          <thead>
            <tr className="bg-vigan-primary text-white">
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2.5 text-left font-semibold whitespace-nowrap border-r border-vigan-accent/30 last:border-r-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-vigan-bg'}>
                {headers.map((_, ci) => (
                  <td key={ci} className="px-3 py-2 text-vigan-text border-r border-vigan-border/50 last:border-r-0 whitespace-nowrap max-w-[200px] truncate">
                    {row[ci] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-vigan-muted mt-2">
        Preview limited to 10 rows. Download the full file below.
      </p>
    </div>
  )
}
