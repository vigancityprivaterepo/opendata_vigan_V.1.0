import Link from 'next/link'
import type { CKANOrganization } from '@/types/ckan'
import { DEPARTMENTS } from '@/lib/utils'

interface Props { organizations: CKANOrganization[] }

export default function DepartmentGrid({ organizations }: Props) {
  return (
    <section className="bg-white border-t border-gray-100" aria-label="Browse by agency">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Agencies</h2>
          <Link href="/organizations" className="text-sm font-semibold text-vigan-primary hover:underline transition-colors">
            View all agencies →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {organizations.map((org) => {
            const meta = DEPARTMENTS[org.name] ?? {
              short: org.name.toUpperCase().slice(0, 4)
            }
            return (
              <Link
                key={org.id}
                href={`/datasets?organization=${org.name}`}
                className="group flex flex-col p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-vigan-primary hover:shadow-sm transition-all duration-200"
                aria-label={`${org.title} — ${org.package_count ?? 0} datasets`}
              >
                <span className="text-sm font-bold text-gray-900 group-hover:text-vigan-primary mb-1 line-clamp-1">
                  {meta.short}
                </span>
                <span className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[2rem]">
                  {org.title}
                </span>
                {org.package_count !== undefined && (
                  <span className="text-xs font-medium text-vigan-primary mt-auto">
                    {org.package_count} dataset{org.package_count !== 1 ? 's' : ''}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
