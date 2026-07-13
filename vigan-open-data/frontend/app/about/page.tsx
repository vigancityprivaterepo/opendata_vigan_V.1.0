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
  title: 'About — Vigan City Open Data Portal',
  description: 'Learn about the Vigan City Open Data Portal — a public catalog of government datasets released by city offices.',
}

const userActions = [
  {
    title: 'Find public datasets',
    description: 'Search records published by Vigan City Government offices in one catalog.',
    icon: FileSearch,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    title: 'Check the source agency',
    description: 'Each dataset is tied to the office responsible for publishing and maintaining it.',
    icon: Building2,
    color: 'bg-teal-50 text-teal-700 border-teal-100',
  },
  {
    title: 'Download reusable files',
    description: 'Access public resources in formats suited for reports, maps, research, and analysis.',
    icon: Download,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  },
  {
    title: 'Build with the API',
    description: 'Use CKAN endpoints for civic apps, dashboards, and internal government tools.',
    icon: Database,
    color: 'bg-green-50 text-green-700 border-green-100',
  },
]

const principles = [
  { text: 'Public data first — the portal is for non-sensitive datasets cleared for public release.', label: '01' },
  { text: 'Source agency ownership — publishing offices remain responsible for accuracy and updates.', label: '02' },
  { text: 'Reusable access — datasets should be readable, downloadable, and useful beyond a PDF where possible.', label: '03' },
  { text: 'Transparent records — metadata should explain what the dataset contains and when it was last updated.', label: '04' },
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
    <div className="bg-vigan-surface min-h-screen pb-20">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #022C22 0%, #044034 50%, #065F46 100%)' }}>
        <div className="hero-pattern absolute inset-0" aria-hidden="true" />
        {/* Subtle heritage watermark */}
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-10 pointer-events-none select-none" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="h-72 w-72 opacity-[0.06] fill-white">
            <path d="M100 10 L130 40 L190 40 L145 75 L165 135 L100 100 L35 135 L55 75 L10 40 L70 40 Z" />
          </svg>
        </div>

        <div className="relative w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/70 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">About</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase
                              text-emerald-300 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full mb-6">
                <Landmark size={13} />
                City Government of Vigan · Ilocos Sur
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4 leading-tight">
                About the<br />Open Data Portal
              </h1>
              <p className="text-base md:text-lg text-emerald-100/80 max-w-2xl leading-relaxed">
                The public catalog for datasets released by offices of the City Government of Vigan —
                helping residents, researchers, developers, and government staff find official data from
                source agencies in one place.
              </p>
            </div>

            {/* Official card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md">
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
                  <p className="text-sm font-bold text-white">Official data catalog</p>
                  <p className="text-xs text-emerald-200/70">Vigan City, Ilocos Sur</p>
                </div>
              </div>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Dataset records are organized through CKAN and published for public access, reuse, and verification.
              </p>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-300 font-medium">Portal actively maintained</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-14 space-y-10">

        {/* ── Purpose + Actions ── */}
        <section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6" aria-labelledby="portal-purpose">
          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100
                            flex items-center justify-center text-vigan-primary mb-6">
              <Globe2 size={24} />
            </div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-vigan-primary mb-3">Purpose</p>
            <h2 id="portal-purpose" className="text-2xl font-display font-bold text-gray-900 mb-4">
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
                <div key={item.title}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card
                             hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Principles + CKAN ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-labelledby="publishing-principles">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-7 shadow-card">
            <div className="flex items-center gap-2 text-vigan-primary mb-4">
              <ShieldCheck size={22} />
              <p className="text-[11px] font-bold tracking-widest uppercase">Publishing Principles</p>
            </div>
            <h2 id="publishing-principles" className="text-2xl font-display font-bold text-gray-900 mb-6">
              How public datasets should be handled
            </h2>
            <div className="space-y-4">
              {principles.map((p) => (
                <div key={p.label} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-vigan-light border border-vigan-border
                                   text-vigan-primary text-xs font-black flex items-center justify-center">
                    {p.label}
                  </span>
                  <div className="flex gap-2 items-start pt-1.5">
                    <CheckCircle2 size={15} className="text-vigan-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CKAN card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-vigan-primaryDk to-emerald-500 rounded-2xl p-7 text-white shadow-card">
            <div className="absolute inset-0 hero-pattern opacity-30" aria-hidden="true" />
            <div className="relative">
              <p className="text-[11px] font-bold tracking-widest uppercase text-emerald-300 mb-3">Infrastructure</p>
              <h2 className="text-2xl font-display font-bold mb-3">Built on CKAN</h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed mb-6">
                CKAN manages the catalog, metadata, organizations, resources, and public API
                used by this portal.
              </p>
              <div className="space-y-2 mb-6">
                {['Open source data platform', 'RESTful Action API', 'DataStore for tabular data'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-emerald-100/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href="/api-docs"
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase
                           bg-white text-vigan-primary px-4 py-1.5 rounded-full
                           hover:bg-emerald-50 active:scale-95 transition-all duration-150 shadow-sm"
              >
                View API docs
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Data Coverage ── */}
        <section className="bg-white border border-gray-200 rounded-2xl p-7 shadow-card" aria-labelledby="data-coverage">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-vigan-primary mb-3">Data Coverage</p>
              <h2 id="data-coverage" className="text-2xl font-display font-bold text-gray-900">
                Types of records in the catalog
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">Coverage grows as offices publish and update datasets.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {dataCoverage.map((item) => (
              <Link
                key={item}
                href={`/datasets?q=${encodeURIComponent(item)}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase
                           bg-vigan-primary text-white px-4 py-2 rounded-full
                           hover:bg-vigan-accent active:scale-95 transition-all duration-150 shadow-sm"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Next steps ── */}
        <section aria-label="Next steps">
          <p className="text-[11px] font-bold tracking-widest uppercase text-vigan-mid mb-4">Get started</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: '/datasets', icon: Database, title: 'Browse datasets', desc: 'Search records and download public resources.', cta: 'Open catalog' },
              { href: '/organizations', icon: Building2, title: 'View agencies', desc: 'See which offices publish datasets.', cta: 'Open agencies' },
              { href: '/api-docs', icon: FileSearch, title: 'Use the API', desc: 'Access catalog data through CKAN endpoints.', cta: 'Read docs' },
            ].map(({ href, icon: Icon, title, desc, cta }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-card
                           hover:border-vigan-primary/40 hover:shadow-card-hover hover:-translate-y-0.5
                           transition-all duration-200 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-vigan-light border border-vigan-border
                                flex items-center justify-center text-vigan-primary mb-4
                                group-hover:bg-vigan-primary group-hover:text-white group-hover:border-vigan-primary
                                transition-all duration-200">
                  <Icon size={18} />
                </div>
                <p className="font-bold text-gray-900 mb-1">{title}</p>
                <p className="text-sm text-gray-500 mb-4 flex-1">{desc}</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase
                                 bg-vigan-primary text-white px-3 py-1 rounded-full self-start
                                 group-hover:bg-vigan-accent transition-colors duration-150">
                  {cta} <ArrowRight size={10} />
                </span>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
