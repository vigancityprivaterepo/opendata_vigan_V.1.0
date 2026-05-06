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
      <section className="bg-gradient-to-br from-vigan-primaryDk to-vigan-primary border-t-4 border-vigan-gold relative overflow-hidden" aria-label="Developer API access">
        {/* Mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{ backgroundImage: 'radial-gradient(circle at right top, #F59E0B 0%, transparent 40%), radial-gradient(circle at left bottom, #10B981 0%, transparent 40%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <div className="text-white">
              <span className="section-eyebrow !border-white/20 !text-vigan-gold !bg-black/20">For Developers</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Build with Vigan's Open Data</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                All datasets are accessible via the CKAN REST API. No authentication required 
                for public data — start building civic tech, dashboards, and research apps in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/api-docs" className="btn-amber">Read API Docs</Link>
                <a href="/api/3/action/package_list" target="_blank" rel="noopener noreferrer" className="btn-ghost">Try the API</a>
              </div>
            </div>

            {/* Code example window */}
            <div className="bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs text-white/40 font-mono">Terminal</span>
              </div>
              <div className="p-5 overflow-x-auto scrollbar-thin">
                <pre className="font-mono text-[13px] leading-relaxed text-emerald-400">
                  <span className="text-white/40 select-none">$ </span>
                  <span className="text-yellow-300">curl</span>
                  <span className="text-emerald-300"> "https://data.vigan.gov.ph/api/3/action/package_search?q=tourism&rows=5"</span>
                  {'\n\n'}
                  <span className="text-white/60">{"{"}</span>
                  {'\n'}  <span className="text-blue-300">"help"</span><span className="text-white/60">: "...",</span>
                  {'\n'}  <span className="text-blue-300">"success"</span><span className="text-white/60">: </span><span className="text-purple-400">true</span><span className="text-white/60">,</span>
                  {'\n'}  <span className="text-blue-300">"result"</span><span className="text-white/60">: {"{"}</span>
                  {'\n'}    <span className="text-blue-300">"count"</span><span className="text-white/60">: </span><span className="text-orange-400">4</span><span className="text-white/60">,</span>
                  {'\n'}    <span className="text-blue-300">"results"</span><span className="text-white/60">: [ ... ]</span>
                  {'\n'}  <span className="text-white/60">{"}"}</span>
                  {'\n'}<span className="text-white/60">{"}"}</span>
                </pre>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
