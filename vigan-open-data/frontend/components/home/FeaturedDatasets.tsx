import Link from 'next/link'
import type { CKANDataset } from '@/types/ckan'
import DatasetCard from '@/components/datasets/DatasetCard'
import { ArrowRight } from 'lucide-react'

interface Props { datasets: CKANDataset[] }

export default function FeaturedDatasets({ datasets }: Props) {
  const loginUrl = '/login-access?next=/api/ckan-proxy/user/login'

  return (
    <section className="relative bg-vigan-surface border-t border-vigan-border/50" aria-label="Featured datasets">
      {/* Dot-grid background pattern */}
      <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-16">

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold text-vigan-mid uppercase tracking-widest mb-2">
              Open Government Data
            </p>
            <h2 className="section-heading-accent text-2xl md:text-3xl font-display font-bold text-gray-900">
              Featured Datasets
            </h2>
          </div>
          <Link
            href="/datasets"
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase
                       bg-vigan-primary text-white
                       px-4 py-1.5 rounded-full
                       hover:bg-vigan-accent
                       active:scale-95 transition-all duration-150 shadow-sm"
          >
            View all datasets
            <ArrowRight size={12} />
          </Link>
        </div>

        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {datasets.map(dataset => (
              <DatasetCard key={dataset.id} dataset={dataset} featured />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-vigan-border rounded-2xl bg-white/60">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-vigan-light flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-vigan-primary" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold mb-1">No datasets published yet</p>
            <p className="text-sm text-gray-400 mb-4">Be the first to contribute open government data</p>
            <a href={loginUrl} className="text-sm font-semibold text-vigan-primary hover:text-vigan-accent hover:underline transition-colors">
              Log in to publish the first dataset →
            </a>
          </div>
        )}

      </div>
    </section>
  )
}
