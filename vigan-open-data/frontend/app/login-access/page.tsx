'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'

function safeNext(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/api/ckan-proxy/user/login'
  }
  return value
}

function LoginAccessForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = useMemo(() => safeNext(searchParams.get('next')), [searchParams])
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const response = await fetch('/api/login-access', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, next }),
    })

    if (!response.ok) {
      setSubmitting(false)
      setError('Invalid access token. Please check the token and try again.')
      return
    }

    const payload = await response.json()
    router.replace(payload.next || next)
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-vigan-surface px-12 py-16 max-[991px]:px-6 max-[768px]:px-5">
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-vigan-border bg-vigan-light text-vigan-primary">
          <ShieldCheck size={24} />
        </div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-vigan-primary">Publisher Access</p>
        <h1 className="mb-3 text-2xl font-display font-bold text-gray-900">Enter access token</h1>
        <p className="mb-7 text-sm leading-relaxed text-gray-600">
          This extra check protects the CKAN login screen. After the token is accepted, you can continue with your CKAN username and password.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-800">Access token</span>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:border-vigan-primary focus-within:ring-2 focus-within:ring-vigan-primary/20">
              <KeyRound size={18} className="text-vigan-primary" aria-hidden="true" />
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                placeholder="Enter token"
                autoComplete="off"
                required
              />
            </div>
          </label>

          {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-vigan-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-vigan-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Checking token...' : 'Continue to CKAN login'}
            <ArrowRight size={16} />
          </button>
        </form>

        <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-vigan-primary hover:text-vigan-accent">
          Back to portal
        </Link>
      </div>
    </main>
  )
}
export default function LoginAccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[calc(100vh-80px)] bg-vigan-surface px-12 py-16 max-[991px]:px-6 max-[768px]:px-5">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
          <p className="text-sm font-semibold text-vigan-primary">Loading access check...</p>
        </div>
      </main>
    }>
      <LoginAccessForm />
    </Suspense>
  )
}