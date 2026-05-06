import Link from 'next/link'
import type { CKANOrganization } from '@/types/ckan'
import { DEPARTMENTS } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface Props { organizations: CKANOrganization[] }

export default function DepartmentGrid({ organizations }: Props) {
  return (
    <section className="bg-white" aria-label="Browse by department">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <h2 className="section-title">Browse by Department</h2>
          <Link href="/organizations" className="text-sm font-semibold text-vigan-accent hover:text-vigan-primary transition-colors">
            All Departments →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {organizations.map((org) => {
            const meta = DEPARTMENTS[org.name] ?? {
              icon: '🏢', short: org.name.toUpperCase().slice(0, 4), label: org.title, color: '#065F46'
            }
            return (
              <Link
                key={org.id}
                href={`/datasets?organization=${org.name}`}
                className="group flex flex-col items-center gap-2.5 p-4 bg-vigan-bg border border-vigan-border rounded-xl text-center hover:bg-vigan-primary hover:border-vigan-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-vigan-md"
                aria-label={`${org.title} — ${org.package_count ?? 0} datasets`}
              >
                <span className="text-3xl" aria-hidden="true">{meta.icon}</span>
                <span className="text-xs font-bold text-vigan-text group-hover:text-white tracking-wide">
                  {meta.short}
                </span>
                <span className="text-[11px] text-vigan-muted group-hover:text-white/70 leading-tight">
                  {org.title}
                </span>
                {org.package_count !== undefined && (
                  <span className="text-[11px] font-semibold text-vigan-accent group-hover:text-vigan-light">
                    {org.package_count} dataset{org.package_count !== 1 ? 's' : ''}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Category pills */}
        <div className="mt-12">
          <h3 className="text-center font-display text-xl font-bold text-vigan-text mb-6">
            Browse by Category
          </h3>
          <div className="flex flex-wrap justify-center gap-3" role="list">
            {[
              { label: 'Tourism',       icon: '🏺', tag: 'tourism' },
              { label: 'Disaster Risk', icon: '🛡️', tag: 'drrm' },
              { label: 'Health',        icon: '🏥', tag: 'health' },
              { label: 'City Planning', icon: '🏛️', tag: 'planning' },
              { label: 'Business',      icon: '📋', tag: 'business' },
              { label: 'Budget',        icon: '💰', tag: 'budget' },
              { label: 'Environment',   icon: '🌿', tag: 'environment' },
              { label: 'GIS / Maps',    icon: '🗺️', tag: 'geojson' },
            ].map((cat) => (
              <Link
                key={cat.tag}
                href={`/datasets?tags=${cat.tag}`}
                role="listitem"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-vigan-border rounded-full text-sm font-semibold text-vigan-text hover:bg-vigan-primary hover:border-vigan-primary hover:text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
