import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center bg-vigan-surface">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-vigan-primary">404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-gray-900 md:text-5xl">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
          The page you requested is not available in the Vigan City Open Data Portal. Return to the catalog or browse published agencies.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/datasets" className="rounded-lg bg-vigan-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vigan-accent">
            Browse datasets
          </Link>
          <Link href="/organizations" className="rounded-lg border border-vigan-border bg-white px-5 py-3 text-sm font-semibold text-vigan-primary transition-colors hover:bg-vigan-light">
            View agencies
          </Link>
        </div>
      </div>
    </div>
  )
}
