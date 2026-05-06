import Link from 'next/link'
import type { CKANDataset } from '@/types/ckan'
import DatasetCard from '@/components/datasets/DatasetCard'

interface Props { datasets: CKANDataset[] }

export default function FeaturedDatasets({ datasets }: Props) {
  return (
    <section className="bg-white" aria-label="Featured datasets">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">

        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Featured Datasets</h2>
          </div>
          <Link href="/datasets" className="text-sm font-semibold text-vigan-primary hover:underline transition-colors">
            View all datasets →
          </Link>
        </div>

        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-lg font-medium">No datasets published yet.</p>
            <p className="text-sm mt-1">
              <a href="/user/login" className="text-vigan-primary hover:underline">Log in</a> to publish the first dataset.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
