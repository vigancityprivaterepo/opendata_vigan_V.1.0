import Link from 'next/link'
import type { CKANOrganization } from '@/types/ckan'
import { DEPARTMENTS } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface Props { organizations: CKANOrganization[] }

export default function DepartmentGrid({ organizations }: Props) {
  if (!organizations || organizations.length === 0) return null

  return (
    <section className="bg-gray-50 border-t border-gray-200" aria-label="Browse by agency">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-2">
              City Government
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Browse by Agency
            </h2>
          </div>
          <Link
            href="/organizations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-vigan-primary hover:text-vigan-accent transition-colors"
          >
            All agencies
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {organizations.map(org => {
            const meta = DEPARTMENTS[org.name] ?? {}
            const initials = (org.title || org.name)
              .split(/\s+/)
              .map(w => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()

            return (
              <Link
                key={org.id}
                href={`/datasets?organization=${org.name}`}
                className="group flex flex-col items-center text-center p-4 bg-white border border-gray-200 rounded hover:border-vigan-primary hover:bg-vigan-light transition-colors duration-150"
                aria-label={`${org.title} — ${org.package_count ?? 0} datasets`}
              >
                <div className="w-10 h-10 bg-vigan-primary rounded flex items-center justify-center mb-3 flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-none">{initials}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-vigan-primary mb-1 leading-tight line-clamp-2 min-h-[2rem] transition-colors">
                  {meta.short || org.title}
                </span>
                {org.package_count !== undefined && (
                  <span className="text-[10px] text-gray-400 mt-1">
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
