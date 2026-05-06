import { Code2, Terminal, Database, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'API Documentation',
}

export default function APIDocsPage() {
  const codeString = `
// Example: Fetch 5 Tourist Spots via CKAN Action API
fetch('https://data.vigan.gov.ph/api/3/action/package_search?q=tourism&rows=5')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(data.result.results);
    }
  });`.trim()

  return (
    <div className="bg-white min-h-screen pb-20">

      {/* Header */}
      <div className="bg-vigan-primaryDk text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4 text-emerald-300">
            <Terminal size={24} />
            <span className="font-mono font-bold tracking-widest text-sm">DEVELOPER HUB</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">REST API Documentation</h1>
          <p className="text-white/70 text-sm font-mono">
            Base URL: <span className="bg-white/10 px-2 py-1 rounded text-white">/api/3/action/</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-sm max-w-none text-gray-700">

          <h2 className="flex items-center gap-2"><Database className="text-vigan-primary" /> Powered by CKAN</h2>
          <p>
            The Vigan City Open Data Portal is built on <a href="https://ckan.org" target="_blank" rel="noopener noreferrer">CKAN</a>, 
            the world's leading open-source data portal platform. All data hosted on this portal is accessible 
            via the robust CKAN Action API.
          </p>
          <p>
            You can use the API to search for datasets, retrieve metadata, or directly query data within resources 
            (if they are ingested into the DataStore).
          </p>

          <h3 className="mt-10 border-b border-gray-200 pb-2">1. Searching for Datasets</h3>
          <p>Use the <code>package_search</code> endpoint to find datasets matching a query or filter.</p>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 my-4 font-mono text-sm overflow-x-auto">
            <span className="text-gray-500"># GET /api/3/action/package_search</span><br/>
            <span className="text-vigan-primary">curl</span> "https://data.vigan.gov.ph/api/3/action/package_search?q=budget&rows=10"
          </div>

          <h3 className="mt-10 border-b border-gray-200 pb-2">2. Fetching Dataset Details</h3>
          <p>Use <code>package_show</code> to get the complete metadata for a specific dataset, including the URLs to download its resources.</p>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 my-4 font-mono text-sm overflow-x-auto">
            <span className="text-gray-500"># GET /api/3/action/package_show</span><br/>
            <span className="text-vigan-primary">curl</span> "https://data.vigan.gov.ph/api/3/action/package_show?id=annual-budget-2026"
          </div>

          <h3 className="mt-10 border-b border-gray-200 pb-2">3. Example Integration (JavaScript)</h3>
          <div className="bg-[#1e1e1e] rounded-lg p-5 my-4 overflow-x-auto shadow-lg">
            <pre className="text-[#d4d4d4] font-mono text-sm m-0"><code>{codeString}</code></pre>
          </div>

          <div className="bg-emerald-50 border-l-4 border-vigan-secondary p-5 mt-10 rounded-r-lg">
            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-2 m-0">
              <BookOpen size={18} className="text-vigan-secondary" />
              Full CKAN API Reference
            </h4>
            <p className="text-sm m-0 text-gray-600">
              This portal implements the standard CKAN v3 API. For comprehensive documentation on all available endpoints, parameters, and response structures, please refer to the official <a href="https://docs.ckan.org/en/2.10/api/" target="_blank" rel="noopener noreferrer" className="text-vigan-primary font-semibold hover:underline">CKAN API Documentation</a>.
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
