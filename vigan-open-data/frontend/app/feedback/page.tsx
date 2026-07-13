import Link from 'next/link'

export const metadata = {
  title: 'Feedback',
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-vigan-bg">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10">
          <nav className="mb-5 flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-vigan-primary">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-700">Feedback</span>
          </nav>
          <h1 className="text-3xl font-bold text-vigan-text md:text-4xl">Feedback</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
            Send bug reports, usability feedback, data quality comments, and publication suggestions to the portal team.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:px-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Submit feedback</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Email <a className="text-vigan-primary hover:underline" href="mailto:opendata@vigan.gov.ph">opendata@vigan.gov.ph</a> with the affected page, the issue observed, and any screenshots or steps to reproduce the problem.
          </p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Useful details</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-600">
            <li>The dataset or organization URL.</li>
            <li>What you expected to happen.</li>
            <li>What actually happened.</li>
            <li>Your browser, device, and time of access.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
