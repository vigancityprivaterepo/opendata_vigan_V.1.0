'use client'

import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

/* ─── Loading overlay ──────────────────────────────────────────────────────── */
function CKANLoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(243, 244, 246, 0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.22s ease',
      }}
    >
      {/* Spinner ring */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '4px solid #d1fae5',
          borderTopColor: '#065f46',
          animation: 'ckan-spin 0.75s linear infinite',
          marginBottom: 16,
          flexShrink: 0,
        }}
      />
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 600,
          color: '#065f46',
          letterSpacing: '0.04em',
        }}
      >
        Loading dataset…
      </p>
      <style>{`
        @keyframes ckan-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function CKANErrorCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
        <AlertTriangle size={22} />
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  )
}

interface CKANFrameProps {
  src: string
  title: string
}

const PROXY_PREFIX = '/api/ckan-proxy'
const FRAME_PARAM = 'vigan_frame'
const INTERNAL_QUERY_PARAMS = new Set([FRAME_PARAM, 'embed'])

function publicSearchAndHash(url: URL): string {
  const params = new URLSearchParams(url.search)
  INTERNAL_QUERY_PARAMS.forEach((param) => params.delete(param))
  const query = params.toString()
  return `${query ? `?${query}` : ''}${url.hash || ''}`
}
function markFrameProxyPath(path: string): string {
  try {
    const url = new URL(path, window.location.origin)
    url.searchParams.set(FRAME_PARAM, '1')
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    const [beforeHash, hash = ''] = path.split('#', 2)
    const separator = beforeHash.includes('?') ? '&' : '?'
    const marked = beforeHash.includes(`${FRAME_PARAM}=`)
      ? beforeHash
      : `${beforeHash}${separator}${FRAME_PARAM}=1`
    return hash ? `${marked}#${hash}` : marked
  }
}
/** Convert a relative CKAN path → proxy path */
function toProxyPath(src: string): string {
  if (src.startsWith(PROXY_PREFIX)) return markFrameProxyPath(src)
  return markFrameProxyPath(`${PROXY_PREFIX}${src}`)
}

/**
 * Given the iframe's current href (which is always a proxy URL like
 * http://localhost:3000/api/ckan-proxy/dataset/foo) extract the CKAN path
 * portion and map it to the corresponding Next.js route.
 *
 * Returns null when no Next.js route mapping exists (proxy-internal pages).
 */
function proxyHrefToNextRoute(href: string): string | null {
  if (!href) return null

  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }

  const pathname = url.pathname

  // CKAN resource view tabs reuse the canonical resource page with a view_id
  // query param. Keep those navigations inside the iframe so CKAN can switch
  // between views without the Next.js route layer flattening the state.
  if (url.searchParams.has('view_id')) {
    return null
  }

  // Only process paths that are inside the proxy
  if (!pathname.startsWith(PROXY_PREFIX)) {
    if (pathname === '/' || pathname === '') return '/'
    return null
  }

  // Strip the proxy prefix to get the CKAN path
  const ckanPath = pathname.slice(PROXY_PREFIX.length) || '/'
  const segments = ckanPath.split('/').filter(Boolean)
  const qh = publicSearchAndHash(url)

  // /api/ckan-proxy/dataset  →  /datasets
  if (ckanPath === '/dataset' || ckanPath === '/dataset/') return `/datasets${qh}`

  // /api/ckan-proxy/dataset/<slug>  →  /datasets/<slug>
  if (segments[0] === 'dataset' && segments.length === 2) {
    return `/datasets/${segments[1]}${qh}`
  }

  // /api/ckan-proxy/dataset/<slug>/resource/<id>  ->  /datasets/<slug>/resources/<id>
  // Only map real public resource pages. Management routes such as
  // /resource/new must stay inside CKAN so publisher POSTs hit the proxy.
  if (segments[0] === 'dataset' && segments[2] === 'resource' && segments.length === 4) {
    if (['new', 'edit'].includes(segments[3])) return null
    return `/datasets/${segments[1]}/resources/${segments[3]}${qh}`
  }

  // /api/ckan-proxy/organization  →  /organizations
  if (ckanPath === '/organization' || ckanPath === '/organization/') return `/organizations${qh}`

  // Keep CKAN organization admin/create pages inside the iframe.
  if (segments[0] === 'organization' && ['new', 'edit', 'members', 'bulk_process'].includes(segments[1])) {
    return null
  }
  // /api/ckan-proxy/organization/<slug>  →  /organizations/<slug>
  if (segments[0] === 'organization' && segments.length === 2) {
    return `/organizations/${segments[1]}${qh}`
  }

  // /api/ckan-proxy/group  →  /groups
  if (ckanPath === '/group' || ckanPath === '/group/') return `/groups${qh}`

  // /api/ckan-proxy/group/<slug>  →  /groups/<slug>
  if (segments[0] === 'group' && segments.length === 2) {
    return `/groups/${segments[1]}${qh}`
  }

  // /api/ckan-proxy/dataset/groups/<slug>  →  /groups/<slug>
  if (segments[0] === 'dataset' && segments[1] === 'groups' && segments.length === 3) {
    return `/groups/${segments[2]}${qh}`
  }

  return null
}

/**
 * Given a link href found inside the iframe document, determine if it should
 * trigger a top-level Next.js navigation.  The href may be relative (to the
 * proxy origin) or absolute.
 */
function linkHrefToNextRoute(href: string, docBaseHref: string): string | null {
  if (!href) return null
  if (
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  ) {
    return null
  }

  let url: URL
  try {
    url = new URL(href, docBaseHref)
  } catch {
    return null
  }

  if (url.pathname === '/' || url.pathname === '') {
    return '/'
  }

  // Resolve against the current document's origin so relative links work
  return proxyHrefToNextRoute(url.href)
}

/**
 * Map a link inside the iframe to an in-proxy URL (stays in the iframe).
 * Returns null if not a proxyable CKAN path.
 */
function linkHrefToProxyPath(href: string, docBaseHref: string): string | null {
  if (!href) return null
  if (
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  ) {
    return null
  }

  let url: URL
  try {
    url = new URL(href, docBaseHref)
  } catch {
    return null
  }

  // If it's already a proxy path, leave it alone
  if (url.pathname.startsWith(PROXY_PREFIX)) return markFrameProxyPath(`${url.pathname}${url.search}${url.hash}`)

  // Only rewrite same-origin relative links that map to CKAN paths
  const base = new URL(docBaseHref)
  if (url.origin !== base.origin) return null

  const ckanPaths = [
    '/dataset', '/organization', '/group', '/user',
    '/dashboard', '/login_generic', '/revision',
    '/tag', '/related', '/error',
  ]
  if (!ckanPaths.some(p => url.pathname.startsWith(p))) return null

  return markFrameProxyPath(`${PROXY_PREFIX}${url.pathname}${url.search}${url.hash}`)
}

function isDownloadUrl(href: string, docBaseHref: string): boolean {
  try {
    const url = new URL(href, docBaseHref)
    return url.pathname.includes('/download/')
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------

export default function CKANFrame({ src, title }: CKANFrameProps) {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [height, setHeight] = useState(1400)
  const [isLoading, setIsLoading] = useState(true)
  const [frameError, setFrameError] = useState<string | null>(null)
  const [hasRenderedFrame, setHasRenderedFrame] = useState(false)

  // Guards to prevent navigation loops
  const lastPushedRoute = useRef<string>('')
  const isNavigating = useRef(false)

  const doNavigate = useCallback(
    (nextRoute: string, method: 'push' | 'replace' = 'push') => {
      const topRoute = window.location.pathname + window.location.search + window.location.hash
      if (nextRoute === topRoute) return
      if (nextRoute === lastPushedRoute.current && isNavigating.current) return

      isNavigating.current = true
      lastPushedRoute.current = nextRoute
      setFrameError(null)
      setIsLoading(true)

      if (method === 'replace') {
        router.replace(nextRoute)
      } else {
        router.push(nextRoute)
      }
    },
    [router],
  )

  const syncFrame = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc || !doc.body) return

    // The iframe's actual current URL (proxy URL)
    const currentHref = doc.location?.href || ''
    const bodyText = (doc.body.innerText || '').trim()
    const titleText = (doc.title || '').trim()
    const looksUnavailable =
      !bodyText ||
      /404|not found|internal server error|application error|bad gateway|traceback/i.test(bodyText) ||
      /404|not found|internal server error|application error/i.test(titleText)

    if (looksUnavailable) {
      setFrameError('Dataset content is currently unavailable. Please try again later.')
      setIsLoading(false)
      return
    }

    // ── 1. Escape-hatch: if the proxy navigated to a mappable CKAN page,
    //       redirect the top-level window to the corresponding Next.js route.
    //       ONLY navigate away when the route differs from the current URL.
    //       If we're already on the correct page, fall through and render content.
    const escapedRoute = proxyHrefToNextRoute(currentHref)
    if (escapedRoute) {
      const topRoute = window.location.pathname + window.location.search + window.location.hash
      if (escapedRoute !== topRoute) {
        // We're on the wrong Next.js page — redirect and wait for remount
        doNavigate(escapedRoute, 'replace')
        return
      }
      // Already on the correct page — fall through to render the content
    }

    // ── 2. Bind DOM event listeners (once per document load)
    // Remove any proxy workspace chrome that slipped into the iframe.
    doc.querySelectorAll('.vigan-proxy-nav').forEach((node) => node.remove())

    isNavigating.current = false

    if (doc.documentElement.dataset.viganBound !== '1') {
      doc.addEventListener(
        'click',
        (event) => {
          const target = event.target
          if (!(target instanceof Element)) return

          const link = target.closest('a[href]')
          if (!(link instanceof HTMLAnchorElement)) return
          if (
            link.target === '_blank' ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return

          const href = link.getAttribute('href')
          if (!href || href.startsWith('#')) return
          if (isDownloadUrl(href, currentHref)) return

          const nextRoute = linkHrefToNextRoute(href, currentHref)
          if (nextRoute) {
            event.preventDefault()
            event.stopPropagation()
            doNavigate(nextRoute, 'push')
            return
          }
        },
        true,
      )

      doc.addEventListener(
        'submit',
        (event) => {
          const form = event.target
          if (!(form instanceof HTMLFormElement)) return
          const method = (form.getAttribute('method') || 'get').toLowerCase()
          if (method !== 'get') return

          const action = form.getAttribute('action') || currentHref
          const nextRoute = linkHrefToNextRoute(action, currentHref)
          if (!nextRoute) return

          const url = new URL(nextRoute, window.location.origin)
          const formData = new FormData(form)
          for (const [key, value] of formData.entries()) {
            if (typeof value === 'string' && value.length > 0) {
              url.searchParams.set(key, value)
            }
          }

          event.preventDefault()
          doNavigate(`${url.pathname}${url.search}${url.hash}`, 'push')
        },
        true,
      )

      doc.documentElement.dataset.viganBound = '1'
    }

    // ── 3. Rewrite anchor hrefs so they don't use target="_top"
    doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
      if (link.dataset.vp === '1') return
      link.dataset.vp = '1'

      const href = link.getAttribute('href')
      if (!href) return

      if (isDownloadUrl(href, currentHref)) {
        link.setAttribute('target', '_blank')
        link.setAttribute('download', '')
        return
      }

      // If the link maps to a Next.js route, point it at the top window too.
      // The click listener should intercept first, but this prevents nested
      // app rendering if the browser falls back to native navigation.
      const nextRoute = linkHrefToNextRoute(href, currentHref)
      if (nextRoute) {
        link.setAttribute('href', nextRoute)
        link.setAttribute('target', '_top')
        return
      }

      // If it maps to an in-proxy CKAN page — rewrite href to proxy path
      const proxyPath = linkHrefToProxyPath(href, currentHref)
      if (proxyPath) {
        link.setAttribute('href', proxyPath)
        link.removeAttribute('target')
        return
      }
    })

    // ── 4. Rewrite form actions
    doc.querySelectorAll<HTMLFormElement>('form[action]').forEach((form) => {
      if (form.dataset.vp === '1') return
      form.dataset.vp = '1'

      const action = form.getAttribute('action')
      if (!action) return

      const method = (form.getAttribute('method') || 'get').toLowerCase()
      const proxyPath = linkHrefToProxyPath(action, currentHref)

      if (method !== 'get') {
        if (proxyPath) {
          form.setAttribute('action', proxyPath)
          form.removeAttribute('target')
        }
        return
      }

      const nextRoute = linkHrefToNextRoute(action, currentHref)
      if (nextRoute) {
        form.setAttribute('action', nextRoute)
        form.setAttribute('target', '_top')
        return
      }

      if (proxyPath) {
        form.setAttribute('action', proxyPath)
        form.removeAttribute('target')
      }
    })

    // ── 5. Fix image sources
    doc.querySelectorAll<HTMLImageElement>('img[src]').forEach((img) => {
      const s = img.getAttribute('src')
      if (!s) return
      try {
        const resolved = new URL(s, currentHref)
        if (resolved.href !== s) img.setAttribute('src', resolved.href)
      } catch {
        // ignore
      }
    })

    // ── 6. Auto-size
    const contentRoot =
      (doc.querySelector('[role="main"]') as HTMLElement | null) ??
      (doc.querySelector('.main') as HTMLElement | null) ??
      (doc.querySelector('.wrapper') as HTMLElement | null) ??
      doc.body

    const nextH = Math.max(
      Math.ceil(contentRoot.getBoundingClientRect().height),
      contentRoot.scrollHeight,
      doc.body.scrollHeight,
    )
    if (nextH > 0) setHeight(nextH + 32)

    setFrameError(null)
    setHasRenderedFrame(true)
    setIsLoading(false)
  }, [doNavigate])

  // Reset navigation guard + loading state when the dataset/page changes
  useEffect(() => {
    isNavigating.current = false
    lastPushedRoute.current = ''
    setIsLoading(true)
    setFrameError(null)
  }, [src])

  const proxySrc = toProxyPath(src)

  return (
    <div className="bg-[#f3f3f3] w-full" style={{ position: 'relative', minHeight: isLoading ? 320 : undefined }}>
      {/* Loading overlay — shown until iframe content is fully processed */}
      <CKANLoadingOverlay visible={isLoading} />

      {frameError && !isLoading && (
        <CKANErrorCard
          title="Dataset currently unavailable"
          description={frameError}
        />
      )}

      <iframe
        ref={iframeRef}
        src={proxySrc}
        title={title}
        className="block w-full border-0 bg-transparent"
        style={{
          height: frameError ? 0 : height,
          display: frameError ? 'none' : 'block',
          opacity: isLoading ? 0 : 1,
          filter: 'none',
          transition: 'opacity 0.16s ease',
          visibility: isLoading || !hasRenderedFrame ? 'hidden' : 'visible',
        }}
        onLoad={() => {
          syncFrame()
          window.requestAnimationFrame(() => syncFrame())
          window.setTimeout(() => syncFrame(), 200)
          window.setTimeout(() => syncFrame(), 700)
          // Safety valve: never leave the overlay up indefinitely
          window.setTimeout(() => {
            setIsLoading((current) => {
              if (current) {
                setFrameError('Dataset content did not finish loading. Please refresh or try again later.')
              }
              return false
            })
          }, 4000)
        }}
        onError={() => {
          setFrameError('Dataset content could not be loaded from CKAN.')
          setIsLoading(false)
        }}
      />
    </div>
  )
}
