import { ckanAPI } from '@/lib/ckan'
import HeroSection from '@/components/home/HeroSection'
import StatsCounter from '@/components/home/StatsCounter'
import FeaturedDatasets from '@/components/home/FeaturedDatasets'
import DepartmentGrid from '@/components/home/DepartmentGrid'
import Link from 'next/link'
import { ArrowRight, Code2, Zap, Shield } from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const [stats, featuredDs, orgs] = await Promise.all([
    ckanAPI.getSiteStats(),
    ckanAPI.getFeaturedDatasets(6),
    ckanAPI.getOrganizations(),
  ])

  return (
    <>
      <HeroSection />
      <StatsCounter stats={stats} />
      <FeaturedDatasets datasets={featuredDs} />
      <DepartmentGrid organizations={orgs} />

      {/* ── Developer CTA Section ─────────────────────────────────────────── */}
      <section className="bg-vigan-primaryDk text-white" aria-label="Developer API access">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — copy */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4">
                For Developers
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Build with Vigan&rsquo;s Open Data API
              </h2>
              <p className="text-emerald-100/70 text-base leading-relaxed mb-7">
                All datasets are accessible via the CKAN REST API. No authentication
                required for public data — start building civic apps and dashboards in minutes.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-emerald-200/80 mb-8">
                <span className="flex items-center gap-1.5"><Zap size={13} /> No auth required</span>
                <span className="flex items-center gap-1.5"><Shield size={13} /> Open License</span>
                <span className="flex items-center gap-1.5"><Code2 size={13} /> JSON &amp; CSV</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/api-docs"
                  className="inline-flex items-center gap-2 bg-white text-vigan-primaryDk font-semibold px-5 py-2.5 rounded hover:bg-gray-100 transition-colors"
                >
                  Read API Docs
                  <ArrowRight size={15} />
                </Link>
                <a
                  href="/api/3/action/package_list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-5 py-2.5 rounded hover:border-white hover:bg-white/10 transition-colors"
                >
                  Try the API
                </a>
              </div>
            </div>

            {/* Right — Code window */}
            <div className="code-window">
              <div className="code-window-bar">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 block" />
                <span className="ml-3 text-gray-500 text-xs font-mono">terminal</span>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <span className="text-gray-500 select-none">$ </span>
                  <span className="text-white">curl </span>
                  <span className="text-emerald-300 break-all">
                    &quot;https://data.vigan.gov.ph/api/3/action/package_search?q=tourism&amp;rows=5&quot;
                  </span>
                  {'\n\n'}
                  <span className="text-gray-500">{'{'}</span>{'\n'}
                  {'  '}<span className="text-emerald-300">&quot;success&quot;</span>
                  <span className="text-gray-500">: </span>
                  <span className="text-purple-400">true</span>
                  <span className="text-gray-500">,</span>{'\n'}
                  {'  '}<span className="text-emerald-300">&quot;result&quot;</span>
                  <span className="text-gray-500">: {'{'}</span>{'\n'}
                  {'    '}<span className="text-emerald-300">&quot;count&quot;</span>
                  <span className="text-gray-500">: </span>
                  <span className="text-orange-400">4</span>
                  <span className="text-gray-500">,</span>{'\n'}
                  {'    '}<span className="text-emerald-300">&quot;results&quot;</span>
                  <span className="text-gray-500">: [...]</span>{'\n'}
                  {'  '}<span className="text-gray-500">{'}'}</span>{'\n'}
                  <span className="text-gray-500">{'}'}</span>
                </pre>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
