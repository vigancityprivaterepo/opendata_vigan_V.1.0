import Link from 'next/link'
import type { CKANDataset } from '@/types/ckan'
import DatasetCard from '@/components/datasets/DatasetCard'
import { ArrowRight } from 'lucide-react'

interface Props { datasets: CKANDataset[] }

export default function FeaturedDatasets({ datasets }: Props) {
  return (
    <section className="bg-white border-t border-gray-100" aria-label="Featured datasets">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-2">
              Recently Updated
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Featured Datasets
            </h2>
          </div>
          <Link
            href="/datasets"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-vigan-primary hover:text-vigan-accent transition-colors"
          >
            View all datasets
            <ArrowRight size={15} />
          </Link>
        </div>

        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map(dataset => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 border border-dashed border-gray-200 rounded bg-gray-50">
            <p className="text-gray-500 mb-2 font-medium">No datasets published yet</p>
            <a href="/user/login" className="text-sm text-vigan-primary hover:underline">
              Log in to publish the first dataset.
            </a>
          </div>
        )}

      </div>
    </section>
  )
}
