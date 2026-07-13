import Link from 'next/link'

export const metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-vigan-bg">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10">
          <nav className="mb-5 flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-vigan-primary">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-700">Contact</span>
          </nav>
          <h1 className="text-3xl font-bold text-vigan-text md:text-4xl">Contact</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
            Coordinate with the Vigan City Open Data Portal team for portal operations, data publication support, and agency onboarding.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:px-10 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900">Portal administration</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
            <p>City Government of Vigan, Quezon Avenue, Vigan City, Ilocos Sur 2700</p>
            <p>Email: <a className="text-vigan-primary hover:underline" href="mailto:opendata@vigan.gov.ph">opendata@vigan.gov.ph</a></p>
            <p>Telephone: <span className="font-medium">(077) 722-2623</span></p>
            <p>Office hours: Monday to Friday, 8:00 AM to 5:00 PM</p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">What to include</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-600">
            <li>The dataset or page URL you are asking about.</li>
            <li>The agency responsible for the data, if known.</li>
            <li>A short description of the issue, request, or correction.</li>
            <li>Your preferred follow-up contact details.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
