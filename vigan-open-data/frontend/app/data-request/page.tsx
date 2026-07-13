import Link from 'next/link'

export const metadata = {
  title: 'Request a Dataset',
}

export default function DataRequestPage() {
  return (
    <div className="min-h-screen bg-vigan-bg">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10">
          <nav className="mb-5 flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-vigan-primary">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-700">Request a Dataset</span>
          </nav>
          <h1 className="text-3xl font-bold text-vigan-text md:text-4xl">Request a Dataset</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
            Request publication of a dataset that is not yet available in the public catalog.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:px-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">How to request publication</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Coordinate first with the responsible City Government office. If you need assistance identifying the publisher or forwarding a request, contact <a className="text-vigan-primary hover:underline" href="mailto:opendata@vigan.gov.ph">opendata@vigan.gov.ph</a>.
          </p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Include in your request</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-600">
            <li>The dataset title or subject matter.</li>
            <li>The intended public use or policy purpose.</li>
            <li>The desired update frequency and file format, if known.</li>
            <li>The agency or office most likely to own the data.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
