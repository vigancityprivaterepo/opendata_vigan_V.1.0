import Link from 'next/link'
import APITestConsole from '@/components/api/APITestConsole'
import { getPublicActionAPIBase, getPublicSiteURL } from '@/lib/site'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Database,
  FileJson,
  KeyRound,
  Layers3,
  Server,
  Terminal,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'API Documentation — Vigan City Open Data Portal',
  description: 'Vigan City Open Data Portal API documentation — endpoints, parameters, examples, and a live test console.',
}

const baseEndpoint = getPublicActionAPIBase()
const publicSiteURL = getPublicSiteURL()

const actionApiEndpoints = [
  {
    method: 'GET',
    path: '/api/3/action/package_search',
    description: 'Search the public dataset catalog with keywords, filters, sorting, and pagination.',
    notes: 'Primary endpoint for `/datasets` and catalog integrations.',
  },
  {
    method: 'GET',
    path: '/api/3/action/package_show?id={dataset_name}',
    description: 'Fetch a single dataset including metadata, resources, tags, and organization.',
    notes: 'Use the dataset slug from CKAN, for example `registered-businesses-2025`.',
  },
  {
    method: 'GET',
    path: '/api/3/action/package_list',
    description: 'Return the list of dataset names available in the catalog.',
    notes: 'Useful for sync jobs, validation, and lightweight catalog checks.',
  },
  {
    method: 'GET',
    path: '/api/3/action/organization_list?all_fields=true&include_dataset_count=true',
    description: 'List organizations that publish datasets in the portal.',
    notes: 'Supports agency directory pages and filter UIs.',
  },
  {
    method: 'GET',
    path: '/api/3/action/group_list?all_fields=true&include_dataset_count=true',
    description: 'List CKAN groups used to classify datasets.',
    notes: 'Useful for category navigation and public facet displays.',
  },
  {
    method: 'GET',
    path: '/api/3/action/tag_list?all_fields=true',
    description: 'List public tags used across the portal.',
    notes: 'Useful for topic suggestions and metadata exploration.',
  },
]

const dataStoreEndpoints = [
  {
    method: 'GET',
    path: '/api/3/action/datastore_search?resource_id={resource_id}',
    description: 'Read rows from a tabular resource already loaded into CKAN DataStore.',
  },
  {
    method: 'GET',
    path: '/api/3/action/datastore_search_sql?sql={encoded_sql}',
    description: 'Run SQL against a DataStore resource when SQL access is enabled.',
  },
]

const packageSearchParams = [
  ['q', 'string', 'Free-text keyword search such as `tourism`, `budget`, or `health facilities`.'],
  ['fq', 'string', 'Filter query such as `organization:tourism-office`, `groups:city-planning`, or `res_format:PDF`.'],
  ['rows', 'integer', 'Number of records to return per request.'],
  ['start', 'integer', 'Pagination offset. Use `0`, `10`, `20`, and so on.'],
  ['sort', 'string', 'Sort order such as `metadata_modified desc`, `title_string asc`, or `score desc`.'],
  ['facet', 'boolean', 'Set to `true` to request facet metadata in the response.'],
  ['facet.field', 'string[]', 'Request specific facets such as `organization`, `groups`, `tags`, `res_format`, and `license_id`.'],
]

const datastoreParams = [
  ['resource_id', 'string', 'Required CKAN resource UUID for the DataStore table.'],
  ['limit', 'integer', 'Maximum number of rows to return.'],
  ['offset', 'integer', 'Pagination offset for larger result sets.'],
  ['filters', 'object', 'Field-value filters for exact matching.'],
  ['fields', 'string[]', 'Return only selected columns.'],
  ['sort', 'string', 'Sort by one or more fields, for example `date desc`.'],
]

const queryingNotes = [
  'Use `package_search` when you need catalog metadata, filters, and resources.',
  'Use `package_show` when you already know the dataset slug and need full details.',
  'Use `datastore_search` only for resources with `datastore_active: true`.',
  'For faceted UIs, request `facet=true` and include explicit `facet.field` values.',
  'PDF, GeoJSON, CSV, and raw-file previews still resolve through resource URLs; the Action API returns the metadata needed to locate those files.',
]

const errorCases = [
  ['400', 'Invalid parameters or malformed request.'],
  ['403', 'Action requires permissions or an API key not provided.'],
  ['404', 'Dataset, organization, group, or resource was not found.'],
  ['409', 'Conflict during write operations. Public docs focus on read endpoints only.'],
  ['500', 'Unexpected CKAN or infrastructure error. Retry and inspect the response payload.'],
]

const curlExamples = [
  {
    title: 'Search datasets by keyword',
    code: `curl "${baseEndpoint}/package_search?q=tourism&rows=5&sort=metadata_modified%20desc"`,
  },
  {
    title: 'Filter by organization and request facets',
    code: `curl "${baseEndpoint}/package_search?fq=organization:tourism-office&facet=true&facet.field=organization&facet.field=groups&rows=10"`,
  },
  {
    title: 'Fetch a dataset record',
    code: `curl "${baseEndpoint}/package_show?id=registered-businesses-2025"`,
  },
  {
    title: 'Read DataStore rows',
    code: `curl "${baseEndpoint}/datastore_search?resource_id={resource_uuid}&limit=10"`,
  },
]

const javascriptExamples = [
  {
    title: 'Catalog search with filters',
    code: `const url = new URL('/api/3/action/package_search', window.location.origin)
url.searchParams.set('q', 'tourism')
url.searchParams.set('fq', 'organization:tourism-office')
url.searchParams.set('rows', '10')
url.searchParams.set('sort', 'metadata_modified desc')

const response = await fetch(url)
const payload = await response.json()

if (payload.success) {
  console.log(payload.result.count)
  console.table(payload.result.results.map((item) => ({
    title: item.title,
    slug: item.name,
    organization: item.organization?.title,
  })))
}`,
  },
  {
    title: 'Fetch a DataStore resource',
    code: `const dataUrl = new URL('/api/3/action/datastore_search', window.location.origin)
dataUrl.searchParams.set('resource_id', '{resource_uuid}')
dataUrl.searchParams.set('limit', '25')

const dataResponse = await fetch(dataUrl)
const dataPayload = await dataResponse.json()

if (dataPayload.success) {
  console.log(dataPayload.result.records)
}`,
  },
]

const pythonExamples = [
  {
    title: 'Search public datasets',
    code: `import requests

base = "${baseEndpoint}"
response = requests.get(
    f"{base}/package_search",
    params={
        "q": "budget",
        "rows": 5,
        "sort": "metadata_modified desc",
    },
    timeout=20,
)
payload = response.json()

if payload["success"]:
    for dataset in payload["result"]["results"]:
        print(dataset["name"], dataset["title"])`,
  },
  {
    title: 'Read DataStore rows',
    code: `import requests

base = "${baseEndpoint}"
response = requests.get(
    f"{base}/datastore_search",
    params={
        "resource_id": "{resource_uuid}",
        "limit": 20,
    },
    timeout=20,
)
payload = response.json()

if payload["success"]:
    for row in payload["result"]["records"]:
        print(row)`,
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-700 text-emerald-50',
    POST: 'bg-orange-600 text-orange-50',
    DELETE: 'bg-rose-700 text-rose-50',
  }
  return (
    <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md shadow-sm ring-1 ring-inset ring-white/20 ${colors[method] ?? 'bg-gray-600 text-gray-50'}`}
      style={{ fontFamily: 'ui-monospace, monospace' }}>
      {method}
    </span>
  )
}

function DocsTable({ headings, rows }: { headings: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {headings.map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="align-top hover:bg-gray-50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-sm leading-relaxed text-gray-600">
                  {ci === 0
                    ? <code className="font-bold text-vigan-primary bg-vigan-light px-1.5 py-0.5 rounded text-[11px]">{cell}</code>
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EndpointList({
  title,
  icon,
  items,
}: {
  title: string
  icon: React.ReactNode
  items: Array<{ method: string; path: string; description: string; notes?: string }>
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
        <span className="text-vigan-primary">{icon}</span>
        {title}
      </div>
      {items.map((item) => (
        <div key={item.path}
          className="rounded-xl border border-gray-200 bg-white p-4 hover:border-vigan-primary/30 hover:bg-vigan-surface transition-all duration-150">
          <div className="mb-2.5 flex flex-wrap items-center gap-3">
            <MethodBadge method={item.method} />
            <code className="text-xs text-gray-600 font-mono break-all">{item.path}</code>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
          {item.notes && <p className="mt-2 text-xs leading-relaxed text-gray-400 italic">{item.notes}</p>}
        </div>
      ))}
    </div>
  )
}

function ExampleBlock({ title, code, lang = 'shell' }: { title: string; code: string; lang?: string }) {
  const langColors: Record<string, string> = {
    shell: 'text-yellow-400',
    js: 'text-sky-400',
    py: 'text-emerald-400',
    json: 'text-orange-400',
  }
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-700 bg-[#1a1f2e] px-4 py-3">
        <span className="text-sm font-semibold text-gray-200">{title}</span>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${langColors[lang] ?? 'text-gray-400'}`}>{lang}</span>
      </div>
      <pre className="overflow-x-auto bg-[#0d1117] px-5 py-5 text-xs leading-relaxed text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function DocsAccordion({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5
                          hover:bg-vigan-surface transition-colors duration-150">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-gray-900">
            <ChevronRight size={16} className="transition-transform group-open:rotate-90 text-vigan-primary flex-shrink-0" />
            {title}
          </div>
          {description && <p className="mt-1 text-sm text-gray-500 pl-6">{description}</p>}
        </div>
      </summary>
      <div className="border-t border-gray-100 px-6 py-6">
        {children}
      </div>
    </details>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-vigan-surface pb-20">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #022C22 0%, #044034 50%, #065F46 100%)' }}>
        <div className="hero-pattern absolute inset-0" aria-hidden="true" />
        <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-end pr-10 pointer-events-none select-none opacity-10" aria-hidden="true">
          <Terminal size={280} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="relative w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-14">
          <nav className="mb-8 flex items-center gap-1.5 text-xs text-emerald-200/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">API Documentation</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase
                              text-emerald-300 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full mb-6">
                <Terminal size={13} />
                Vigan City Open Data Portal
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4 leading-tight">
                Vigan City Open Data Portal<br />API Documentation
              </h1>
              <p className="text-base text-emerald-100/80 max-w-2xl leading-relaxed">
                Access catalog metadata, organizations, groups, tags, resources, and DataStore rows
                through the public CKAN API. Move from endpoint discovery to working examples quickly.
              </p>
            </div>

            {/* Base endpoint card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4">
              <p className="text-[11px] font-bold tracking-widest uppercase text-emerald-300">Base Endpoint</p>
              <code className="block break-all rounded-xl border border-white/20 bg-black/30 px-3 py-2.5 text-xs text-emerald-200 font-mono">
                {baseEndpoint}
              </code>
              <div className="space-y-2.5 text-sm text-emerald-100/80">
                <div className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <p>Public read requests do not require an API key.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <p>Responses follow CKAN format: <code className="bg-black/30 px-1 rounded text-xs">success</code>, <code className="bg-black/30 px-1 rounded text-xs">result</code>, <code className="bg-black/30 px-1 rounded text-xs">error</code>.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                  <p>Use the live console below to test against your Docker stack.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-12">
        <div className="space-y-8">

          {/* Overview */}
          <section id="overview" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-vigan-primary">
              <BookOpen size={15} />
              Overview
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {[
                { icon: Database, title: 'Catalog Metadata', desc: 'Search datasets, inspect package metadata, list organizations, groups, and tags.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                { icon: Layers3, title: 'Facet-Driven UIs', desc: 'Request facet counts to build filters for organizations, groups, formats, licenses, and tags.', color: 'bg-teal-50 text-teal-700 border-teal-100' },
                { icon: Server, title: 'DataStore Rows', desc: 'Query structured rows from uploaded tabular resources when DataStore is active.', color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="rounded-2xl border border-gray-200 bg-vigan-surface p-5 hover:shadow-sm transition-shadow">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 mb-2">{title}</h2>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-vigan-border bg-vigan-light/50 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                <KeyRound size={16} className="text-vigan-primary" />
                Authentication and Access
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-vigan-primary mt-1.5 flex-shrink-0" />
                  Public read endpoints documented here are available without authentication.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-vigan-primary mt-1.5 flex-shrink-0" />
                  Write endpoints are intentionally not documented on this public page.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-vigan-primary mt-1.5 flex-shrink-0" />
                  The public portal API is read-only. Dataset, resource, organization, and group create, update, and delete actions are blocked.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  All examples use the configured public portal URL: <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs">{publicSiteURL}</code>.
                </li>
              </ul>
            </div>
          </section>

          {/* Reference sections */}
          <section id="reference" className="space-y-4">
            <DocsAccordion
              title="Endpoints"
              description="Catalog, metadata, organization, group, tag, and DataStore endpoints."
              defaultOpen
            >
              <div className="space-y-8">
                <EndpointList title="Action API Endpoints" icon={<Database size={16} />} items={actionApiEndpoints} />
                <EndpointList title="DataStore Endpoints" icon={<Server size={16} />} items={dataStoreEndpoints} />
              </div>
            </DocsAccordion>

            <DocsAccordion
              title="Querying"
              description="Parameters, filtering rules, and response patterns for catalog and DataStore access."
            >
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-base font-bold text-gray-900">Package Search Parameters</h3>
                  <DocsTable headings={['Parameter', 'Type', 'Description']} rows={packageSearchParams} />
                </div>
                <div>
                  <h3 className="mb-4 text-base font-bold text-gray-900">DataStore Parameters</h3>
                  <DocsTable headings={['Parameter', 'Type', 'Description']} rows={datastoreParams} />
                </div>
                <div>
                  <h3 className="mb-4 text-base font-bold text-gray-900">Implementation Notes</h3>
                  <ul className="space-y-3">
                    {queryingNotes.map((note) => (
                      <li key={note} className="flex gap-3 items-start text-sm text-gray-600 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-vigan-primary" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DocsAccordion>

            <DocsAccordion
              title="Example: cURL"
              description="Quick shell commands for search, details, and DataStore access."
            >
              <div className="space-y-4">
                {curlExamples.map((e) => <ExampleBlock key={e.title} {...e} lang="shell" />)}
              </div>
            </DocsAccordion>

            <DocsAccordion
              title="Example: JavaScript"
              description="Browser or Node examples using fetch and the CKAN Action API response format."
            >
              <div className="space-y-4">
                {javascriptExamples.map((e) => <ExampleBlock key={e.title} {...e} lang="js" />)}
              </div>
            </DocsAccordion>

            <DocsAccordion
              title="Example: Python"
              description="Python requests examples for dataset search and DataStore row retrieval."
            >
              <div className="space-y-4">
                {pythonExamples.map((e) => <ExampleBlock key={e.title} {...e} lang="py" />)}
              </div>
            </DocsAccordion>

            <DocsAccordion
              title="Response and Error Handling"
              description="How CKAN structures responses and what common status codes mean."
            >
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-base font-bold text-gray-900">Typical CKAN JSON Envelope</h3>
                  <ExampleBlock
                    lang="json"
                    title="Successful response"
                    code={`{
  "help": "${baseEndpoint}/package_search",
  "success": true,
  "result": {
    "count": 1,
    "results": [
      {
        "name": "registered-businesses-2025",
        "title": "Registered Businesses 2025",
        "organization": {
          "name": "business-permits",
          "title": "Business Permits & Licensing Office"
        },
        "resources": [
          {
            "id": "resource-uuid",
            "name": "registered-businesses-2025.csv",
            "format": "CSV",
            "url": "/dataset/registered-businesses-2025/resource/resource-uuid/download/..."
          }
        ]
      }
    ]
  }
}`}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-base font-bold text-gray-900">Common Status Codes</h3>
                  <DocsTable headings={['Code', 'Meaning']} rows={errorCases} />
                </div>
              </div>
            </DocsAccordion>
          </section>

          {/* Live console */}
          <section id="console" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-vigan-primary">
              <Zap size={15} />
              Live Test Console
            </div>
            <h2 className="mb-2 text-2xl font-display font-bold text-gray-900">Test the Endpoint</h2>
            <p className="mb-8 max-w-3xl text-sm leading-relaxed text-gray-500">
              Verify responses from your local Docker stack. The console targets{' '}
              <code className="rounded bg-vigan-light border border-vigan-border px-1.5 py-0.5 text-xs text-vigan-primary">package_search</code>{' '}
              and returns live JSON from the portal.
            </p>
            <APITestConsole baseEndpoint={baseEndpoint} />
          </section>

          {/* Quick links */}
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              { href: '/datasets', icon: Database, label: 'Browse catalog' },
              { href: '/organizations', icon: Server, label: 'View agencies' },
              { href: '/api/3/action/package_search', icon: FileJson, label: 'Open raw endpoint', external: true },
            ].map(({ href, icon: Icon, label, external }) => (
              <Link
                key={href}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4
                             hover:border-vigan-primary/40 hover:bg-vigan-surface hover:shadow-sm
                             transition-all duration-150"
              >
                <div className="w-9 h-9 rounded-xl bg-vigan-light border border-vigan-border
                                  flex items-center justify-center text-vigan-primary flex-shrink-0
                                  group-hover:bg-vigan-primary group-hover:text-white group-hover:border-vigan-primary
                                  transition-all duration-150">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-vigan-primary transition-colors">{label}</span>
                <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-vigan-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </section>

        </div>
      </main>
    </div>
  )
}
