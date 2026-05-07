import { Suspense } from 'react'
import { ckanAPI } from '@/lib/ckan'
import DatasetFilters from '@/components/datasets/DatasetFilters'
import DatasetCard from '@/components/datasets/DatasetCard'
import { Database, Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DatasetsPage({ searchParams }: PageProps) {
  const q    = typeof searchParams.q            === 'string' ? searchParams.q            : undefined
  const org  = typeof searchParams.organization === 'string' ? searchParams.organization : undefined
  const tags = typeof searchParams.tags         === 'string' ? searchParams.tags         : undefined
  const fmt  = typeof searchParams.format       === 'string' ? searchParams.format       : undefined
  const sort = typeof searchParams.sort         === 'string' ? searchParams.sort         : undefined
  const fq   = fmt ? `res_format:${fmt.toUpperCase()}` : undefined

  let result: { count: number; results: Awaited<ReturnType<typeof ckanAPI.getDatasets>>['results'] }
  try {
    result = await ckanAPI.getDatasets({ q, organization: org, tags, fq, sort, rows: 24 })
  } catch (e) {
    console.error(e)
    result = { count: 0, results: [] }
  }

  const { count, results } = result
  const hasQuery = !!(q || org || tags || fmt)

  return (
    <div className="bg-vigan-bg min-h-screen">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-vigan-primary transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">Datasets</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-vigan-text mb-1">
                Datasets
              </h1>
              <p className="text-gray-500 text-sm">
                Open data published by Vigan City Government agencies
              </p>
            </div>

            {/* Search form */}
            <form className="relative w-full md:max-w-md" role="search">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search data catalogue…"
                className="w-full py-3 pl-11 pr-4 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vigan-primary/40 focus:border-vigan-primary shadow-sm transition-all"
              />
              {org  && <input type="hidden" name="organization" value={org} />}
              {tags && <input type="hidden" name="tags"         value={tags} />}
              {fmt  && <input type="hidden" name="format"       value={fmt} />}
              {sort && <input type="hidden" name="sort"         value={sort} />}
            </form>
          </div>

          {/* Active filter pills */}
          {hasQuery && (
            <div className="flex flex-wrap gap-2 mt-5">
              {q && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-vigan-light text-vigan-primary border border-vigan-border rounded-full px-3 py-1">
                  🔍 &ldquo;{q}&rdquo;
                </span>
              )}
              {org && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
                  🏢 {org.replace(/-/g, ' ')}
                </span>
              )}
              {tags && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-3 py-1">
                  🏷 {tags}
                </span>
              )}
              {fmt && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-3 py-1">
                  📄 {fmt.toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded border border-gray-200 shadow-card p-5 sticky top-[5.5rem]">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <SlidersHorizontal size={15} className="text-vigan-primary" />
                <h2 className="text-sm font-bold text-gray-800">Filters</h2>
              </div>
              <Suspense fallback={
                <div className="space-y-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 skeleton rounded-lg" />
                  ))}
                </div>
              }>
                <DatasetFilters />
              </Suspense>
            </div>
          </div>

          {/* ── Main Results ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3 order-1 lg:order-2">

            {/* Results bar */}
            <div className="flex items-center justify-between mb-5 p-4 bg-white rounded border border-gray-200 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-vigan-light flex items-center justify-center">
                  <Database size={15} className="text-vigan-primary" />
                </div>
                <p className="text-sm text-gray-600">
                  {count === 0
                    ? <span className="font-medium text-gray-700">No results found</span>
                    : <>
                        <span className="font-bold text-gray-900 text-base">{count.toLocaleString()}</span>
                        {' '}dataset{count !== 1 ? 's' : ''} found
                        {hasQuery && <span className="text-gray-400"> · filtered</span>}
                      </>
                  }
                </p>
              </div>
              {hasQuery && (
                <Link
                  href="/datasets"
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear filters
                </Link>
              )}
            </div>

            {/* Dataset list */}
            {results.length > 0 ? (
              <div className="flex flex-col gap-3">
                {results.map((dataset, i) => (
                  <div
                    key={dataset.id}
                    className=""
                    style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
                  >
                    <DatasetCard dataset={dataset} view="list" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Database size={36} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No datasets found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  Try adjusting your search terms or clearing some filters to see more results.
                </p>
                <Link
                  href="/datasets"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-vigan-primary text-white text-sm font-semibold rounded-lg hover:bg-vigan-accent transition-colors"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

