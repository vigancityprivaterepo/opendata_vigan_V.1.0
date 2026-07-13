import Link from 'next/link'
import type { CKANOrganization } from '@/types/ckan'
import { DEPARTMENTS, getCKANImageURL } from '@/lib/utils'
import { ArrowRight, Building2 } from 'lucide-react'

interface Props { organizations: CKANOrganization[] }

/** Pick a deterministic gradient pair from the org name */
const GRADIENTS = [
  ['from-emerald-500', 'to-teal-600'],
  ['from-teal-500',    'to-cyan-600'],
  ['from-green-500',   'to-emerald-600'],
  ['from-cyan-500',    'to-teal-600'],
  ['from-emerald-600', 'to-green-700'],
  ['from-teal-600',    'to-emerald-700'],
  ['from-green-600',   'to-teal-700'],
]

function gradientFor(name: string) {
  const idx = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % GRADIENTS.length
  const [from, to] = GRADIENTS[idx]
  return `bg-gradient-to-br ${from} ${to}`
}

export default function DepartmentGrid({ organizations }: Props) {
  if (!organizations || organizations.length === 0) return null

  return (
    <section className="bg-white border-t border-gray-100" aria-label="Browse by agency">
      <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-16">

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold text-vigan-mid uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Building2 size={11} aria-hidden="true" />
              Publishing Agencies
            </p>
            <h2 className="section-heading-accent text-2xl md:text-3xl font-display font-bold text-gray-900">
              Browse by Agency
            </h2>
          </div>
          <Link
            href="/organizations"
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase
                       bg-vigan-primary text-white
                       px-4 py-1.5 rounded-full
                       hover:bg-vigan-accent
                       active:scale-95 transition-all duration-150 shadow-sm"
          >
            All agencies
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {organizations.map(org => {
            const meta    = DEPARTMENTS[org.name] ?? {}
            const imageUrl = getCKANImageURL(org.image_display_url || org.image_url)
            const initials = (org.title || org.name)
              .split(/\s+/)
              .map(w => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
            const grad = gradientFor(org.name)
            const count = org.package_count ?? 0

            return (
              <Link
                key={org.id}
                href={`/datasets?organization=${org.name}`}
                className="group flex flex-col items-center text-center p-4
                           bg-white border border-gray-200 rounded-2xl
                           hover:border-vigan-primary/40 hover:bg-vigan-surface
                           hover:shadow-lg hover:-translate-y-1
                           transition-all duration-200"
                aria-label={`${org.title} — ${count} dataset${count !== 1 ? 's' : ''}`}
              >
                {/* Logo / avatar */}
                <div className={`w-14 h-14 rounded-2xl mb-3 flex-shrink-0 overflow-hidden shadow-md
                                 flex items-center justify-center
                                 ring-2 ring-white ring-offset-1
                                 group-hover:scale-105 transition-transform duration-200
                                 ${imageUrl ? 'bg-gray-100' : grad}`}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-extrabold text-white tracking-wide drop-shadow-sm">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Name */}
                <span className="text-[11px] font-bold text-gray-700 group-hover:text-vigan-primary
                                 mb-2 leading-tight line-clamp-2 min-h-[2rem] transition-colors uppercase tracking-wide">
                  {meta.short || org.title}
                </span>

                {/* Dataset count — solid pill badge */}
                <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full
                                  ${count > 0
                                    ? 'bg-vigan-primary text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-400'}`}>
                  {count} dataset{count !== 1 ? 's' : ''}
                </span>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
