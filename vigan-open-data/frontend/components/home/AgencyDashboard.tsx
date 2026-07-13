import Link from 'next/link'
import Image from 'next/image'
import type { CKANOrganization } from '@/types/ckan'
import { ArrowRight } from 'lucide-react'
import { DEPARTMENTS } from '@/lib/utils'

interface Props {
  organizations: CKANOrganization[]
  title?: string
  description?: string
  ctaHref?: string
  ctaLabel?: string
}

export default function AgencyDashboard({
  organizations,
  title = 'Agency Publishing Snapshot',
  description = 'See which Vigan offices are actively publishing and how the catalog is distributed across agencies.',
  ctaHref = '/organizations',
  ctaLabel = 'All agencies',
}: Props) {
  if (!organizations.length) return null

  const sorted = [...organizations].sort(
    (a, b) => (b.package_count ?? 0) - (a.package_count ?? 0)
  )
  const topOrganizations = sorted.slice(0, 4)
  const totalDatasets = organizations.reduce((sum, org) => sum + (org.package_count ?? 0), 0)
  const publishersWithDatasets = organizations.filter((org) => (org.package_count ?? 0) > 0).length
  const topPublisher = sorted[0]
  const averageDatasets = organizations.length ? totalDatasets / organizations.length : 0
  const maxPackages = Math.max(...sorted.map((org) => org.package_count ?? 0), 1)

  return (
    <section className="bg-vigan-surface border-t border-vigan-border/50" aria-label={title}>
      <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-vigan-mid uppercase tracking-widest mb-2">
              Transparency &amp; Accountability
            </p>
            <h2 className="section-heading-accent text-2xl md:text-3xl font-display font-bold text-gray-900">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">{description}</p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase
                       bg-vigan-primary text-white
                       px-4 py-1.5 rounded-full
                       hover:bg-vigan-accent
                       active:scale-95 transition-all duration-150 shadow-sm"
          >
            {ctaLabel}
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-vigan-border bg-white shadow-card p-5 hover:shadow-card-hover hover:-translate-y-px transition-all duration-200">
            <div className="mb-3 flex items-center gap-2 text-vigan-primary">
              <Image
                src="/coverage.png"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
                aria-hidden="true"
              />
              <span className="text-xs font-bold uppercase tracking-wider">Coverage</span>
            </div>
            <p className="text-3xl font-display font-extrabold text-gray-900">{publishersWithDatasets}</p>
            <p className="mt-1 text-sm text-gray-500">Agencies currently publishing datasets</p>
          </div>
          <div className="rounded-2xl border border-vigan-border bg-white shadow-card p-5 hover:shadow-card-hover hover:-translate-y-px transition-all duration-200">
            <div className="mb-3 flex items-center gap-2 text-vigan-goldAccent">
              <Image
                src="/catalogue.png"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
                aria-hidden="true"
              />
              <span className="text-xs font-bold uppercase tracking-wider">Catalog Volume</span>
            </div>
            <p className="text-3xl font-display font-extrabold text-gray-900">{totalDatasets}</p>
            <p className="mt-1 text-sm text-gray-500">Datasets tracked across all listed agencies</p>
          </div>
          <div className="rounded-2xl border border-vigan-border bg-white shadow-card p-5 hover:shadow-card-hover hover:-translate-y-px transition-all duration-200">
            <div className="mb-3 flex items-center gap-2 text-vigan-primary">
              <Image
                src="/publisher.png"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
                aria-hidden="true"
              />
              <span className="text-xs font-bold uppercase tracking-wider">Top Publisher</span>
            </div>
            <p className="text-lg font-display font-bold text-gray-900">{topPublisher?.title || 'N/A'}</p>
            <p className="mt-1 text-sm text-gray-500">
              {(topPublisher?.package_count ?? 0).toLocaleString()} dataset(s), average {averageDatasets.toFixed(1)} per agency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {topOrganizations.map((org) => {
            const packageCount = org.package_count ?? 0
            const shortLabel = DEPARTMENTS[org.name]?.short || org.name.toUpperCase().slice(0, 4)
            return (
              <div key={org.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-vigan-mid">
                      {shortLabel}
                    </p>
                    <h3 className="mt-1 text-base font-semibold leading-tight text-gray-900">
                      {org.title}
                    </h3>
                  </div>
                  <div className="rounded-xl bg-vigan-surface border border-vigan-border p-2">
                    <Image
                      src="/analysis.png"
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-600">Publishing activity</span>
                    <span className="text-gray-500">{packageCount} dataset{packageCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-vigan-primary"
                      style={{ width: `${Math.max((packageCount / maxPackages) * 100, packageCount > 0 ? 12 : 0)}%` }}
                    />
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
                  {org.description || 'Official public data publisher for the City Government of Vigan.'}
                </p>

                <Link
                  href={`/datasets?organization=${org.name}`}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase
                             bg-vigan-primary text-white
                             px-3 py-1 rounded-full
                             hover:bg-vigan-accent
                             active:scale-95 transition-all duration-150 shadow-sm"
                >
                  View datasets
                  <ArrowRight size={11} />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
