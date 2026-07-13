import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use',
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-vigan-bg">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10">
          <nav className="mb-5 flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-vigan-primary">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-700">Terms of Use</span>
          </nav>
          <h1 className="text-3xl font-bold text-vigan-text md:text-4xl">Terms of Use</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
            Public data on this portal may be viewed, downloaded, and reused subject to the applicable dataset license, attribution requirements, and official restrictions published with each dataset.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-10 sm:px-10">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Acceptable use</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Users must not misrepresent dataset meaning, remove required attribution, or use the service in a way that disrupts portal availability, bypasses safeguards, or attempts unauthorized modification of data and systems.
          </p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Data quality and warranties</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Datasets are published as provided by the responsible City Government office. While the City aims to maintain accurate and timely public information, users remain responsible for validating suitability for legal, operational, or analytical use.
          </p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Attribution and restrictions</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Reuse should cite the Vigan City Open Data Portal and the publishing agency when attribution is required. Dataset-specific licenses, notices, and restrictions take precedence over this general summary.
          </p>
        </section>
      </div>
    </div>
  )
}
