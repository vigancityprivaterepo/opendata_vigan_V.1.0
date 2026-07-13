'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] items-center bg-vigan-surface">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-vigan-primary">Portal error</p>
        <h1 className="mt-3 text-4xl font-extrabold text-gray-900 md:text-5xl">Something went wrong</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
          The portal could not finish this request. Try again, or return to the catalog while the issue is being resolved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-vigan-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vigan-accent"
          >
            Try again
          </button>
          <Link href="/datasets" className="rounded-lg border border-vigan-border bg-white px-5 py-3 text-sm font-semibold text-vigan-primary transition-colors hover:bg-vigan-light">
            Browse datasets
          </Link>
        </div>
      </div>
    </div>
  )
}
