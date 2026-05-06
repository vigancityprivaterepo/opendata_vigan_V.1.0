import { ckanAPI } from '@/lib/ckan'
import Link from 'next/link'
import { DEPARTMENTS } from '@/lib/utils'
import { Building2, Database } from 'lucide-react'

export const revalidate = 3600 // 1 hr

export default async function OrganizationsPage() {
  const orgs = await ckanAPI.getOrganizations()

  return (
    <div className="bg-vigan-gray-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-vigan-primary text-white border-b-4 border-vigan-gold pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-vigan-gold bg-vigan-gold/12 border border-vigan-gold/25 rounded-full px-4 py-1 mb-6">
            Data Publishers
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">City Departments</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Browse datasets by the originating City Government office or department. Each organization is responsible for maintaining their published data assets.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs.map((org) => {
            const meta = DEPARTMENTS[org.name] ?? {
              icon: '🏢', short: org.name.toUpperCase().slice(0, 4), color: '#065F46'
            }

            return (
              <div key={org.id} className="bg-white rounded-xl shadow-md hover:shadow-lg border border-vigan-border/50 hover:border-vigan-primary transition-all p-6 group flex flex-col h-full">
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-vigan-bg border border-vigan-border flex items-center justify-center text-3xl group-hover:scale-105 transition-transform flex-shrink-0">
                    {meta.icon}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-vigan-text leading-tight group-hover:text-vigan-primary transition-colors">
                      {org.title}
                    </h2>
                    <p className="text-sm font-semibold text-vigan-muted mt-1">{meta.short}</p>
                  </div>
                </div>

                <p className="text-sm text-vigan-text/80 mb-6 flex-1 line-clamp-3">
                  {org.description || 'Official data publisher for the City Government of Vigan.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-vigan-gray-100 mt-auto">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-vigan-accent px-3 py-1 bg-vigan-light rounded-lg">
                    <Database size={14} />
                    {org.package_count || 0} Datasets
                  </div>
                  <Link 
                    href={`/datasets?organization=${org.name}`}
                    className="text-sm font-semibold text-vigan-primary hover:text-vigan-accent transition-colors flex items-center gap-1"
                  >
                    View Catalog →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {orgs.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-vigan-border text-vigan-muted">
            <Building2 size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-vigan-text">No departments found</h3>
            <p className="mt-2">The catalog has not been populated with organizations yet.</p>
          </div>
        )}
      </div>

    </div>
  )
}
