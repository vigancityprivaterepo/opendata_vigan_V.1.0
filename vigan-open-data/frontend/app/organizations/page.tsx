import { ckanAPI } from '@/lib/ckan'
import Link from 'next/link'
import { DEPARTMENTS } from '@/lib/utils'
import { Building2, Database, ArrowRight } from 'lucide-react'

export const revalidate = 3600

const ORG_COLORS = [
  { bg: 'bg-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { bg: 'bg-amber-500',   light: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700'   },
  { bg: 'bg-sky-600',     light: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700'     },
  { bg: 'bg-violet-600',  light: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700'  },
  { bg: 'bg-rose-600',    light: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700'    },
  { bg: 'bg-teal-600',    light: 'bg-teal-50',    border: 'border-teal-200',    text: 'text-teal-700'    },
  { bg: 'bg-orange-600',  light: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700'  },
]

export default async function OrganizationsPage() {
  const orgs = await ckanAPI.getOrganizations()

  return (
    <div className="bg-vigan-bg min-h-screen pb-20">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-vigan-primary transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">Agencies</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-vigan-text mb-2">
            City Agencies
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Browse datasets published by each office of the City Government of Vigan, Ilocos Sur.
          </p>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {orgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orgs.map((org, i) => {
              const meta    = DEPARTMENTS[org.name] ?? { icon: '🏢', short: org.name.toUpperCase().slice(0, 4) }
              const palette = ORG_COLORS[i % ORG_COLORS.length]
              const initials = (org.title || org.name)
                .split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()

              return (
                <div
                  key={org.id}
                  className="bg-white rounded border border-gray-200 hover:border-vigan-border hover:shadow-card-hover transition-all duration-200 overflow-hidden group"
                >
                  {/* Top accent stripe */}
                  <div className={`h-1.5 ${palette.bg}`} />

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded ${palette.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <span className="text-white text-lg font-black">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-base text-gray-900 leading-tight mb-1 group-hover:text-vigan-primary transition-colors">
                          {org.title}
                        </h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {meta.short}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-5 flex-1 line-clamp-3 leading-relaxed">
                      {org.description || 'Official data publisher for the City Government of Vigan.'}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className={`flex items-center gap-1.5 text-sm font-semibold ${palette.text}`}>
                        <Database size={13} />
                        {org.package_count || 0} Dataset{(org.package_count || 0) !== 1 ? 's' : ''}
                      </div>
                      <Link
                        href={`/datasets?organization=${org.name}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-vigan-primary hover:text-vigan-accent transition-colors group/link"
                      >
                        View Catalog
                        <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded p-16 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Building2 size={36} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No agencies found</h3>
            <p className="text-sm text-gray-500">The catalog has not been populated with organizations yet.</p>
          </div>
        )}
      </div>

    </div>
  )
}

