import { ckanAPI } from '@/lib/ckan'
import HeroSection from '@/components/home/HeroSection'
import StatsCounter from '@/components/home/StatsCounter'
import FeaturedDatasets from '@/components/home/FeaturedDatasets'
import DepartmentGrid from '@/components/home/DepartmentGrid'
import Link from 'next/link'

export const revalidate = 60 // ISR: Regenerate page every 60s

export default async function HomePage() {
  // Fetch data in parallel
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

      {/* Developer CTA Section */}
      <section className="bg-vigan-primaryDk text-white py-20" aria-label="Developer API access">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 text-emerald-100 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
                For Developers
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Build with Vigan's Open Data</h2>
              <p className="text-emerald-100 text-lg leading-relaxed mb-8">
                All datasets are accessible via the CKAN REST API. No authentication required 
                for public data — start building civic tech, dashboards, and research apps in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/api-docs" className="bg-white text-vigan-primaryDk font-medium px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
                  Read API Docs
                </Link>
                <a href="/api/3/action/package_list" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-white/40 text-white font-medium px-6 py-3 rounded-md hover:bg-white/10 transition-colors">
                  Try the API
                </a>
              </div>
            </div>

            {/* Code example window */}
            <div className="bg-black/40 rounded-lg overflow-hidden shadow-2xl border border-white/10">
              <div className="flex items-center px-4 py-3 bg-black/30 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-emerald-300">
                  <span className="text-gray-500 select-none">$ </span>
                  <span className="text-white">curl</span>
                  <span className="text-emerald-300"> "https://data.vigan.gov.ph/api/3/action/package_search?q=tourism&rows=5"</span>
                  {'\n\n'}
                  <span className="text-gray-400">{"{"}</span>
                  {'\n'}  <span className="text-emerald-200">"help"</span><span className="text-gray-400">: "...",</span>
                  {'\n'}  <span className="text-emerald-200">"success"</span><span className="text-gray-400">: </span><span className="text-purple-400">true</span><span className="text-gray-400">,</span>
                  {'\n'}  <span className="text-emerald-200">"result"</span><span className="text-gray-400">: {"{"}</span>
                  {'\n'}    <span className="text-emerald-200">"count"</span><span className="text-gray-400">: </span><span className="text-orange-400">4</span><span className="text-gray-400">,</span>
                  {'\n'}    <span className="text-emerald-200">"results"</span><span className="text-gray-400">: [ ... ]</span>
                  {'\n'}  <span className="text-gray-400">{"}"}</span>
                  {'\n'}<span className="text-gray-400">{"}"}</span>
                </pre>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
