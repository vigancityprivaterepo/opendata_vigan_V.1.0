import { Suspense } from 'react'
import { ckanAPI } from '@/lib/ckan'
import DatasetFilters from '@/components/datasets/DatasetFilters'
import DatasetCard from '@/components/datasets/DatasetCard'
import { Database, Search } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic' // Re-evaluate search params fresh on request

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DatasetsPage({ searchParams }: PageProps) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const org = typeof searchParams.organization === 'string' ? searchParams.organization : undefined
  const tags = typeof searchParams.tags === 'string' ? searchParams.tags : undefined
  const fmt = typeof searchParams.format === 'string' ? searchParams.format : undefined
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined
  
  // Format filter hack for CKAN queries
  const fq = fmt ? `res_format:${fmt.toUpperCase()}` : undefined

  // Fetch data based on filters
  let result;
  try {
    result = await ckanAPI.getDatasets({
      q,
      organization: org,
      tags,
      fq,
      sort,
      rows: 24, // max per page
    })
  } catch (e) {
    console.error(e)
    result = { count: 0, results: [] }
  }

  const { count, results } = result

  return (
    <div className="bg-vigan-gray-50 min-h-screen">
      
      {/* Search Header */}
      <div className="bg-vigan-primaryDk pt-10 pb-20 border-b-4 border-vigan-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-6">Explore Datasets</h1>
          
          <form className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vigan-muted group-focus-within:text-vigan-secondary transition-colors" size={20} />
            <input 
              type="search" 
              name="q"
              defaultValue={q}
              placeholder="Search data catalogue..." 
              className="w-full py-4 pl-12 pr-4 rounded-xl shadow-lg border-2 border-transparent focus:border-vigan-secondary focus:outline-none transition-all text-vigan-text font-body text-lg"
            />
            {/* Preserve other filters on search */}
            {org && <input type="hidden" name="organization" value={org} />}
            {tags && <input type="hidden" name="tags" value={tags} />}
            {fmt && <input type="hidden" name="format" value={fmt} />}
            {sort && <input type="hidden" name="sort" value={sort} />}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 border border-vigan-border/50">
              <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <DatasetFilters />
              </Suspense>
            </div>
          </div>
          
          {/* Main Results */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 border border-vigan-border/50 min-h-[500px]">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-vigan-gray-100">
                <h2 className="text-xl font-display font-bold text-vigan-text">
                  {count === 0 ? 'No results found' : `${count.toLocaleString()} Dataset${count !== 1 ? 's' : ''} Found`}
                </h2>
                
                {/* View Toggles could go here (grid vs list), hardcoded to list for now for detail */}
              </div>

              {results.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {results.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} view="list" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-vigan-gray-100 text-vigan-muted rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                  <h3 className="text-lg font-bold text-vigan-text mb-2">No datasets match your filters</h3>
                  <p className="text-vigan-muted text-sm max-w-sm mx-auto mb-6">
                    Try adjusting your search terms or clearing some of the filters in the sidebar.
                  </p>
                  <Link href="/datasets" className="btn-outline">Clear All Filters</Link>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
