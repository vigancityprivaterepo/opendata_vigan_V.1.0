import Link from 'next/link'
import type { CKANDataset } from '@/types/ckan'
import DatasetCard from '@/components/datasets/DatasetCard'

interface Props { datasets: CKANDataset[] }

export default function FeaturedDatasets({ datasets }: Props) {
  return (
    <section className="bg-vigan-bg" aria-label="Featured datasets">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="section-title">Featured Datasets</h2>
          </div>
          <Link href="/datasets" className="text-sm font-semibold text-vigan-accent hover:text-vigan-primary transition-colors">
            View All Datasets →
          </Link>
        </div>

        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-vigan-muted">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-lg font-medium">No datasets published yet.</p>
            <p className="text-sm mt-1">
              <a href="/user/login" className="text-vigan-accent hover:underline">Log in</a> to publish the first dataset.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
