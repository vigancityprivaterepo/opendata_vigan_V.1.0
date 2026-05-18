import Link from 'next/link'
import APITestConsole from '@/components/api/APITestConsole'
import {
  Database,
  FileJson,
  Server,
  Terminal,
} from 'lucide-react'

export const metadata = {
  title: 'API Documentation',
}

const endpoints = [
  {
    title: 'Dataset Search',
    agency: 'CKAN',
    period: 'Public catalog',
    active: true,
  },
  {
    title: 'Dataset Details',
    agency: 'CKAN',
    period: 'Metadata and resources',
    active: false,
  },
  {
    title: 'Agency List',
    agency: 'CKAN',
    period: 'Organizations',
    active: false,
  },
  {
    title: 'DataStore Search',
    agency: 'CKAN',
    period: 'Tabular resources',
    active: false,
  },
  {
    title: 'Package List',
    agency: 'CKAN',
    period: 'Dataset names',
    active: false,
  },
]

const queryParameters = [
  { name: 'q', type: 'string', description: 'Keyword search, for example tourism or budget.' },
  { name: 'rows', type: 'integer', description: 'Number of results to return. Use 5, 10, 20, or another page size.' },
  { name: 'start', type: 'integer', description: 'Pagination offset for the next set of results.' },
  { name: 'sort', type: 'string', description: 'Sort order such as metadata_modified desc or title asc.' },
  { name: 'fq', type: 'string', description: 'Filter query such as organization:tourism-office.' },
]

const relatedEndpoints = [
  { method: 'GET', path: '/api/3/action/package_search', label: 'Search datasets' },
  { method: 'GET', path: '/api/3/action/package_show?id={dataset_name}', label: 'Fetch dataset details' },
  { method: 'GET', path: '/api/3/action/organization_list?all_fields=true', label: 'List agencies' },
  { method: 'GET', path: '/api/3/action/datastore_search?resource_id={id}', label: 'Query table rows' },
]

export default function APIDocsPage() {
  return (
    <div className="bg-vigan-bg min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-vigan-primary transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">API Documentation</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-4">
                <Terminal size={15} />
                Developer API
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vigan Open Data API
              </h1>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Use the public CKAN Action API to search datasets, inspect metadata,
                list publishing agencies, and query tabular resources from the Vigan
                Open Data Portal.
              </p>
            </div>
            <div className="rounded border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-3">
                Base endpoint
              </p>
              <code className="block rounded border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 break-all">
                http://localhost:8080/api/3/action
              </code>
              <p className="text-xs text-gray-500 leading-relaxed mt-3">
                Public read requests do not require an API key. Use the test console below
                to verify responses against your local Docker stack.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
          <aside className="lg:sticky lg:top-8" aria-label="API endpoint list">
            <div className="space-y-2">
              {endpoints.map((endpoint) => (
                <a
                  key={endpoint.title}
                  href="#dataset-search"
                  className={`block rounded p-4 transition-colors ${
                    endpoint.active
                      ? 'bg-vigan-light border border-vigan-border'
                      : 'bg-transparent hover:bg-white border border-transparent'
                  }`}
                >
                  <h2 className="font-semibold text-gray-900 mb-2">{endpoint.title}</h2>
                  <p className="text-xs text-gray-500 mb-2">API · {endpoint.agency}</p>
                  <p className="text-xs text-gray-500">{endpoint.period}</p>
                </a>
              ))}
            </div>
          </aside>

          <div className="space-y-8">
            <section id="dataset-search" className="bg-white border border-gray-200 rounded p-6 sm:p-8" aria-labelledby="dataset-search-title">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-4">
              <Terminal size={15} />
              GET /api/3/action/package_search
            </div>
            <h2 id="dataset-search-title" className="text-2xl font-bold text-gray-900 mb-4">
              Search public datasets in the Vigan catalog
            </h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-8">
              <li>Search by keyword, agency, tag, format, and metadata fields.</li>
              <li>Use pagination parameters to retrieve larger result sets in batches.</li>
              <li>Each result includes dataset metadata, source agency, resources, and tags.</li>
              <li>Public read requests do not require an API key.</li>
            </ul>

            <div className="mb-9 overflow-x-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Query Parameters</h3>
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50 w-32">Parameter</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50 w-24">Type</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b border-gray-200">
                  {queryParameters.map((parameter) => (
                    <tr key={parameter.name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <code className="font-mono text-sm font-bold text-gray-900">{parameter.name}</code>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <code className="font-mono text-xs text-gray-500">{parameter.type}</code>
                      </td>
                      <td className="py-4 px-4 align-top text-sm text-gray-600 leading-relaxed">
                        {parameter.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-9 overflow-x-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Headers</h3>
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50 w-32">Header</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50 w-24">Type</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b border-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <code className="font-mono text-sm font-bold text-gray-900">Accept</code>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <code className="font-mono text-xs text-gray-500">string</code>
                    </td>
                    <td className="py-4 px-4 align-top text-sm text-gray-600 leading-relaxed">
                      Use <code className="text-gray-900 bg-gray-100 px-1 rounded">application/json</code>. API keys are not required for public read endpoints.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-9 overflow-x-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Related Endpoints</h3>
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50 w-24">Method</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50">Endpoint</th>
                    <th className="py-3 px-4 font-semibold text-gray-900 bg-gray-50 w-1/3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b border-gray-200">
                  {relatedEndpoints.map((endpoint) => (
                    <tr key={endpoint.path} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono text-sm font-bold text-vigan-primary">{endpoint.method}</span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded break-all">{endpoint.path}</code>
                      </td>
                      <td className="py-4 px-4 align-top text-sm font-medium text-gray-900">
                        {endpoint.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/datasets" className="rounded border border-gray-200 p-4 hover:border-vigan-primary hover:bg-vigan-light transition-colors">
                <Database size={18} className="text-vigan-primary mb-3" />
                <p className="text-sm font-semibold text-gray-900">Browse catalog</p>
              </Link>
              <Link href="/organizations" className="rounded border border-gray-200 p-4 hover:border-vigan-primary hover:bg-vigan-light transition-colors group">
                <Server size={18} className="text-vigan-primary mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-gray-900">View agencies</p>
              </Link>
              <a href="https://docs.ckan.org/en/2.10/api/" target="_blank" rel="noopener noreferrer" className="rounded border border-gray-200 p-4 hover:border-vigan-primary hover:bg-vigan-light transition-colors group">
                <FileJson size={18} className="text-vigan-primary mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-gray-900">CKAN reference</p>
              </a>
            </div>

            <div className="mt-12 pt-10 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Test the Endpoint</h3>
              <APITestConsole />
            </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
