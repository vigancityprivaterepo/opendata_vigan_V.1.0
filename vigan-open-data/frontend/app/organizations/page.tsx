import { ckanAPI } from '@/lib/ckan'
import Link from 'next/link'
import { DEPARTMENTS } from '@/lib/utils'
import { Building2, Database } from 'lucide-react'

export const revalidate = 3600

export default async function OrganizationsPage() {
  const orgs = await ckanAPI.getOrganizations()

  return (
    <div className="bg-white min-h-screen pb-20">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-vigan-primary mb-2">Agencies</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Browse datasets published by each City Government office or department.
          </p>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orgs.map((org) => {
            const meta = DEPARTMENTS[org.name] ?? {
              icon: '🏢', short: org.name.toUpperCase().slice(0, 4), color: '#065F46'
            }

            return (
              <div key={org.id} className="bg-white rounded-lg border border-gray-200 hover:border-vigan-primary hover:shadow-md transition-all p-6 flex flex-col">

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-vigan-border flex items-center justify-center text-2xl flex-shrink-0">
                    {meta.icon}
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-gray-900 leading-tight">
                      {org.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">{meta.short}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-3">
                  {org.description || 'Official data publisher for the City Government of Vigan.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-vigan-primary">
                    <Database size={14} />
                    {org.package_count || 0} Datasets
                  </div>
                  <Link
                    href={`/datasets?organization=${org.name}`}
                    className="text-sm font-medium text-vigan-primary hover:underline transition-colors"
                  >
                    View Catalog →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {orgs.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200 text-gray-500">
            <Building2 size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-gray-900">No agencies found</h3>
            <p className="mt-2 text-sm">The catalog has not been populated with organizations yet.</p>
          </div>
        )}
      </div>

    </div>
  )
}
