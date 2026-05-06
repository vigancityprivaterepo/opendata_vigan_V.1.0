import { Suspense } from 'react'
import { ckanAPI } from '@/lib/ckan'
import DatasetFilters from '@/components/datasets/DatasetFilters'
import DatasetCard from '@/components/datasets/DatasetCard'
import { Database, Search } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DatasetsPage({ searchParams }: PageProps) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const org = typeof searchParams.organization === 'string' ? searchParams.organization : undefined
  const tags = typeof searchParams.tags === 'string' ? searchParams.tags : undefined
  const fmt = typeof searchParams.format === 'string' ? searchParams.format : undefined
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined
  
  const fq = fmt ? `res_format:${fmt.toUpperCase()}` : undefined

  let result;
  try {
    result = await ckanAPI.getDatasets({ q, organization: org, tags, fq, sort, rows: 24 })
  } catch (e) {
    console.error(e)
    result = { count: 0, results: [] }
  }

  const { count, results } = result

  return (
    <div className="bg-white min-h-screen">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-vigan-primary mb-6">Datasets</h1>

          <form className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search data catalogue..."
              className="w-full py-3.5 pl-12 pr-4 bg-white border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-vigan-primary focus:border-transparent shadow-sm transition-all"
            />
            {org  && <input type="hidden" name="organization" value={org} />}
            {tags && <input type="hidden" name="tags" value={tags} />}
            {fmt  && <input type="hidden" name="format" value={fmt} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
          </form>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-24">
              <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <DatasetFilters />
              </Suspense>
            </div>
          </div>

          {/* Main Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                {count === 0
                  ? 'No results found'
                  : <><span className="font-bold text-gray-900">{count.toLocaleString()}</span> dataset{count !== 1 ? 's' : ''} found</>
                }
              </p>
            </div>

            {results.length > 0 ? (
              <div className="flex flex-col gap-4">
                {results.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} view="list" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No datasets match your filters</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  Try adjusting your search terms or clearing some of the filters in the sidebar.
                </p>
                <Link href="/datasets" className="text-sm font-medium text-vigan-primary hover:underline">
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
