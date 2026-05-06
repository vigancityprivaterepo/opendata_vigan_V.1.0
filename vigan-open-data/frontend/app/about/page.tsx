import { ShieldCheck, Target, Globe } from 'lucide-react'

export const metadata = {
  title: 'About the Portal',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-vigan-primaryDk text-white border-b-4 border-vigan-gold pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">About Vigan Open Data</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Empowering citizens, researchers, and developers with accessible government data to drive innovation and transparency in our Heritage City.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-vigan-light rounded-full flex items-center justify-center text-vigan-primary mb-4">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-vigan-text">Transparency</h3>
            <p className="text-sm text-vigan-muted">Making government operations and data freely visible to the public.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-vigan-light rounded-full flex items-center justify-center text-vigan-primary mb-4">
              <Target size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-vigan-text">Civic Innovation</h3>
            <p className="text-sm text-vigan-muted">Providing raw materials for civic tech solutions and research.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-vigan-light rounded-full flex items-center justify-center text-vigan-primary mb-4">
              <Globe size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-vigan-text">Accessibility</h3>
            <p className="text-sm text-vigan-muted">Centralized repository adhering to open data formats and standards.</p>
          </div>
        </div>

        <div className="prose prose-vigan max-w-none text-vigan-text/90">
          <h2>Our Mission</h2>
          <p>
            The City Government of Vigan recognizes that data is a valuable public asset. The Open Data Portal is established 
            to proactively release non-sensitive, public datasets to our constituents. This initiative aligns with the national 
            government's push for Freedom of Information (FOI) and digital transformation.
          </p>
          
          <h2>What kind of data is here?</h2>
          <p>
            You will find datasets published by various departments of the Vigan City Government, including:
          </p>
          <ul>
            <li><strong>Tourism:</strong> Visitor statistics, heritage sites, accredited establishments.</li>
            <li><strong>Finance & Budget:</strong> Annual budget allocations, procurement data.</li>
            <li><strong>Health:</strong> Public health facility locators, epidemiology summaries.</li>
            <li><strong>City Planning:</strong> Land use plans, zoning maps (GeoJSON/Shapefiles).</li>
            <li><strong>DRRMO:</strong> Hazard maps, emergency response assets.</li>
          </ul>

          <div className="bg-vigan-gray-50 p-6 rounded-xl border border-vigan-border/50 mt-10">
            <h3 className="mt-0 text-vigan-primary">Open Source Infrastructure</h3>
            <p className="mb-0 text-sm">
              This portal is proudly built using open-source technologies, primarily the <strong>Comprehensive Knowledge Archive Network (CKAN)</strong> platform for robust data cataloging and a modern <strong>Next.js</strong> frontend for a fast, accessible citizen experience.
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}
