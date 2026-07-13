import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-vigan-bg">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10">
          <nav className="mb-5 flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-vigan-primary">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-700">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl font-bold text-vigan-text md:text-4xl">Privacy Policy</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
            This portal publishes public government data and processes limited operational information to keep the service available, secure, and accountable.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-10 sm:px-10">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Information handled by the portal</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            The portal may process standard server logs, request metadata, basic usage analytics, and contact details voluntarily sent through support email. Published datasets should contain only information authorized for public release by the responsible City Government office.
          </p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Use and disclosure</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Operational data is used to maintain service availability, investigate misuse, and respond to user inquiries. Personal information should only be collected, processed, and disclosed in accordance with applicable Philippine law, City Government policy, and the official publication authority of each dataset owner.
          </p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Questions and corrections</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            If you believe a dataset contains personal or restricted information that should not be public, contact <a className="text-vigan-primary hover:underline" href="mailto:opendata@vigan.gov.ph">opendata@vigan.gov.ph</a> immediately with the dataset link and the reason for review.
          </p>
        </section>
      </div>
    </div>
  )
}
