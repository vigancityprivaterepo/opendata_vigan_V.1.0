import { ckanAPI } from '@/lib/ckan'
import HeroSection from '@/components/home/HeroSection'
import StatsCounter from '@/components/home/StatsCounter'
import FeaturedDatasets from '@/components/home/FeaturedDatasets'
import DepartmentGrid from '@/components/home/DepartmentGrid'
import AgencyDashboard from '@/components/home/AgencyDashboard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Gracefully handle CKAN being offline (dev mode without Docker)
  const [statsRes, featuredRes, orgsRes] = await Promise.allSettled([
    ckanAPI.getSiteStats(),
    ckanAPI.getFeaturedDatasets(6),
    ckanAPI.getOrganizations(),
  ])

  const stats = statsRes.status === 'fulfilled' ? statsRes.value : { datasetCount: 0, organizationCount: 0, groupCount: 0, downloads: 0 }
  const featuredDs = featuredRes.status === 'fulfilled' ? featuredRes.value : []
  const orgs = orgsRes.status === 'fulfilled' ? orgsRes.value : []

  return (
    <>
      <HeroSection />
      <StatsCounter stats={stats} />
      <FeaturedDatasets datasets={featuredDs} />
      <AgencyDashboard
        organizations={orgs}
        title="Agency Publishing Snapshot"
        description="See which Vigan offices are actively publishing and how the catalog is distributed across agencies."
        ctaHref="/organizations"
        ctaLabel="Explore publishers"
      />
      <DepartmentGrid organizations={orgs} />

      <section className="bg-vigan-deepDk text-white" aria-label="Developer API access">
        <div className="grid w-full grid-cols-1 items-center gap-12 px-12 py-16 max-[991px]:px-6 max-[768px]:px-5 md:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display mb-4 text-3xl font-extrabold leading-tight md:text-4xl">
              Build with Vigan&apos;s Open Data API
            </h2>
            <p className="mb-7 text-base leading-relaxed text-emerald-100/70">
              All datasets are accessible via the CKAN REST API. No authentication
              required for public data; start building civic apps and dashboards in minutes.
            </p>
            <div className="mb-8 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-emerald-200/80">
              <span>No auth required</span>
              <span>Open License</span>
              <span>JSON &amp; CSV</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/api-docs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-vigan-deepDk transition-all hover:bg-gray-100 hover:shadow-glow-emerald"
              >
                Read API Docs
                <ArrowRight size={15} />
              </Link>
              <a
                href="/api/3/action/package_list"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Try the API
              </a>
            </div>
          </div>

          <div className="code-window">
            <div className="code-window-bar">
              <span className="block h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="block h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="block h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 font-mono text-xs text-gray-500">terminal</span>
            </div>
            <div className="overflow-x-auto p-6">
              <pre className="font-mono text-sm leading-relaxed">
                <span className="select-none text-gray-500">$ </span>
                <span className="text-white">curl </span>
                <span className="break-all text-emerald-300">
                  &quot;https://data.vigancity.gov.ph/api/3/action/package_search?q=tourism&amp;rows=5&quot;
                </span>
                {'\n\n'}
                <span className="text-gray-500">{'{'}</span>
                {'\n'}
                {'  '}
                <span className="text-emerald-300">&quot;success&quot;</span>
                <span className="text-gray-500">: </span>
                <span className="text-purple-400">true</span>
                <span className="text-gray-500">,</span>
                {'\n'}
                {'  '}
                <span className="text-emerald-300">&quot;result&quot;</span>
                <span className="text-gray-500">: {'{'}</span>
                {'\n'}
                {'    '}
                <span className="text-emerald-300">&quot;count&quot;</span>
                <span className="text-gray-500">: </span>
                <span className="text-orange-400">4</span>
                <span className="text-gray-500">,</span>
                {'\n'}
                {'    '}
                <span className="text-emerald-300">&quot;results&quot;</span>
                <span className="text-gray-500">: [...]</span>
                {'\n'}
                {'  '}
                <span className="text-gray-500">{'}'}</span>
                {'\n'}
                <span className="text-gray-500">{'}'}</span>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
