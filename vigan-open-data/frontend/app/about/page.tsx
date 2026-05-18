import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Database,
  Download,
  FileSearch,
  Globe2,
  Landmark,
  ShieldCheck,
} from 'lucide-react'

export const metadata = {
  title: 'About the Portal',
}

const userActions = [
  {
    title: 'Find public datasets',
    description: 'Search records published by Vigan City Government offices in one catalog.',
    icon: FileSearch,
  },
  {
    title: 'Check the source agency',
    description: 'Each dataset is tied to the office responsible for publishing and maintaining it.',
    icon: Building2,
  },
  {
    title: 'Download reusable files',
    description: 'Access public resources in formats suited for reports, maps, research, and analysis.',
    icon: Download,
  },
  {
    title: 'Build with the API',
    description: 'Use CKAN endpoints for civic apps, dashboards, and internal government tools.',
    icon: Database,
  },
]

const principles = [
  'Public data first: the portal is for non-sensitive datasets cleared for public release.',
  'Source agency ownership: publishing offices remain responsible for accuracy and updates.',
  'Reusable access: datasets should be readable, downloadable, and useful beyond a PDF where possible.',
  'Transparent records: metadata should explain what the dataset contains and when it was last updated.',
]

const dataCoverage = [
  'Tourism',
  'Budget',
  'Health',
  'City Planning',
  'DRRMO',
  'Environment',
  'Business Permits',
]

export default function AboutPage() {
  return (
    <div className="bg-vigan-bg min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-vigan-primary transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">About</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-4">
                <Landmark size={15} />
                City Government of Vigan
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-vigan-text mb-4">
                About the Open Data Portal
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
                This portal is the public catalog for datasets released by offices of the
                City Government of Vigan. It helps residents, researchers, developers, and
                government staff find official data from source agencies in one place.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded bg-white border border-gray-200 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="City Government of Vigan seal"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    priority
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Official data catalog</p>
                  <p className="text-xs text-gray-500">Vigan City, Ilocos Sur</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dataset records are organized through CKAN and published for public access,
                reuse, and verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 mb-12" aria-labelledby="portal-purpose">
          <div className="bg-white border border-gray-200 rounded p-6">
            <div className="w-11 h-11 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-vigan-primary mb-5">
              <Globe2 size={22} />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-3">
              Purpose
            </p>
            <h2 id="portal-purpose" className="text-2xl font-bold text-gray-900 mb-4">
              What this portal is for
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The Vigan Open Data Portal provides a single public entry point for
              datasets that may be shared outside government. It is intended to make
              official records easier to locate, cite, download, and reuse.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The portal does not replace the source offices. It points users to the
              agency responsible for each dataset and keeps the catalog organized for
              public use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userActions.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white border border-gray-200 rounded p-5">
                  <Icon size={20} className="text-vigan-primary mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12" aria-labelledby="publishing-principles">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded p-6">
            <div className="flex items-center gap-2 text-vigan-primary mb-4">
              <ShieldCheck size={21} />
              <p className="text-xs font-semibold tracking-widest uppercase">Publishing Principles</p>
            </div>
            <h2 id="publishing-principles" className="text-2xl font-bold text-gray-900 mb-5">
              How public datasets should be handled
            </h2>
            <div className="space-y-4">
              {principles.map((principle) => (
                <div key={principle} className="flex gap-3">
                  <CheckCircle2 size={18} className="text-vigan-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">{principle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-vigan-primaryDk text-white rounded p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300 mb-3">
              Infrastructure
            </p>
            <h2 className="text-xl font-bold mb-4">Built on CKAN</h2>
            <p className="text-sm text-emerald-100/75 leading-relaxed mb-5">
              CKAN manages the catalog, metadata, organizations, resources, and public API
              used by this portal.
            </p>
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-200 transition-colors"
            >
              View API documentation
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded p-6 mb-12" aria-labelledby="data-coverage">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-vigan-primary mb-3">
                Data Coverage
              </p>
              <h2 id="data-coverage" className="text-2xl font-bold text-gray-900">
                Types of records expected in the catalog
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-xl">
              Coverage grows as offices publish and update datasets through the portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {dataCoverage.map((item) => (
              <Link
                key={item}
                href={`/datasets?q=${encodeURIComponent(item)}`}
                className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:border-vigan-primary hover:bg-vigan-light hover:text-vigan-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded overflow-hidden" aria-label="Next steps">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <Link href="/datasets" className="group p-6 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-semibold text-gray-900 mb-2">Browse datasets</p>
              <p className="text-sm text-gray-500 mb-4">Search records and download public resources.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-vigan-primary">
                Open catalog <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <Link href="/organizations" className="group p-6 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-semibold text-gray-900 mb-2">View agencies</p>
              <p className="text-sm text-gray-500 mb-4">See which offices publish datasets.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-vigan-primary">
                Open agencies <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <Link href="/api-docs" className="group p-6 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-semibold text-gray-900 mb-2">Use the API</p>
              <p className="text-sm text-gray-500 mb-4">Access catalog data through CKAN endpoints.</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-vigan-primary">
                Read docs <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
