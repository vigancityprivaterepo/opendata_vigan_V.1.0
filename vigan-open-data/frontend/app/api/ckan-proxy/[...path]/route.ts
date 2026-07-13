import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const LOGIN_GATE_COOKIE = 'vigan_login_gate'
const LOGIN_GATE_MAX_AGE_MS = 10 * 60 * 1000

// ---------------------------------------------------------------------------
// CSS injected into every proxied CKAN page.
// This hides ALL CKAN chrome so only the body content shows inside the iframe.
// ---------------------------------------------------------------------------
const CKAN_CHROME_HIDE_CSS = `
  /* ── Hide all CKAN navigation / header / footer chrome ── */
  .account-masthead,
  .masthead,
  header.masthead,
  .navbar,
  .navbar-default,
  .navbar-static-top,
  .gov-banner,
  .site-header,
  header.site-header,
  .site-nav,
  nav.site-nav,
  .language-select,
  .lang-select,
  .topbar,
  .toolbar .breadcrumb li.divider:first-of-type,
  .flash-messages,
  .site-footer,
  footer.site-footer,
  footer[role="contentinfo"],
  .footer-links,
  .attribution,
  .legal,
  #header,
  #ckan-header,
  #site-header,
  [id*="header"],
  [class*="header-"],
  #footer,
  #ckan-footer,
  #site-footer,
  [id*="footer"],
  [class*="footer-"] {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }

  /* ── Reset page chrome ── */
  html, body {
    background: #f3f3f3 !important;
    min-height: 0 !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }

  body {
    padding-top: 0 !important;
  }

  /* ── Remove top spacing from content wrappers ── */
  .wrapper,
  .row.wrapper,
  .toolbar,
  .main,
  [role="main"],
  .container,
  .row,
  .primary,
  .secondary {
    margin-top: 0 !important;
    min-height: 0 !important;
    height: auto !important;
    border: 0 !important;
    background-image: none !important;
    box-shadow: none !important;
  }


  /* Force embedded CKAN pages to use the available iframe width. */
  .main,
  [role="main"],
  .container,
  .container-fluid,
  #content,
  .page,
  .wrapper,
  .row.wrapper,
  .module-content,
  .page-header,
  .search-form,
  .dataset-list,
  .resource-list {
    width: 100% !important;
    max-width: none !important;
    box-sizing: border-box !important;
  }

  .main .container,
  .page .container,
  .toolbar .container,
  .wrapper,
  #content {
    padding-left: 36px !important;
    padding-right: 36px !important;
  }

  .row,
  .row.wrapper {
    margin-left: 0 !important;
    margin-right: 0 !important;
    border: 0 !important;
    background: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
  }

  .row.wrapper::before,
  .row.wrapper::after,
  .wrapper::before,
  .wrapper::after {
    display: none !important;
    content: none !important;
    border: 0 !important;
    background: transparent !important;
  }

  .row.wrapper {
    display: flex !important;
    align-items: flex-start !important;
    gap: 24px !important;
    flex-wrap: nowrap !important;
  }

  .primary,
  .span9,
  .span8 {
    float: none !important;
    flex: 1 1 auto !important;
    min-width: 0 !important;
    width: auto !important;
    max-width: none !important;
    box-sizing: border-box !important;
    border: 0 !important;
    background-image: none !important;
  }

  .secondary,
  .span3,
  .span4 {
    float: none !important;
    flex: 0 0 300px !important;
    min-width: 0 !important;
    width: 300px !important;
    max-width: 300px !important;
    box-sizing: border-box !important;
    border: 0 !important;
    background-image: none !important;
  }

  .primary:only-child,
  .span9:only-child,
  .span8:only-child,
  .span12 {
    flex-basis: 100% !important;
    width: 100% !important;
    max-width: none !important;
  }
  .vigan-proxy-shell {
    background: #f3f3f3 !important;
    min-height: 100vh;
  }
  .vigan-proxy-shell .container,
  .vigan-proxy-shell .wrapper,
  .vigan-proxy-shell .main,
  .vigan-proxy-shell [role="main"] {
    width: 100% !important;
    max-width: none !important;
    box-sizing: border-box !important;
  }

  .vigan-proxy-shell .wrapper,
  .vigan-proxy-shell .main,
  .vigan-proxy-shell [role="main"] {
    padding-left: 36px !important;
    padding-right: 36px !important;
  }

  .vigan-proxy-shell .row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .vigan-proxy-shell .primary,
  .vigan-proxy-shell .secondary {
    box-sizing: border-box !important;
  }

  .vigan-proxy-nav {
    position: sticky;
    top: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 18px;
    min-height: 64px;
    padding: 0 36px;
    background: #ffffff;
    border-bottom: 1px solid #d9e2df;
    box-shadow: 0 1px 6px rgba(15, 23, 42, 0.08);
    box-sizing: border-box;
  }

  .vigan-proxy-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 220px;
    color: #064e3b !important;
    font-weight: 800;
    text-decoration: none !important;
    white-space: nowrap;
  }

  .vigan-proxy-brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 50%;
    overflow: hidden;
    background: #ffffff;
  }

  .vigan-proxy-brand-logo {
    display: block;
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  .vigan-proxy-links {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    flex-wrap: wrap;
  }


  .vigan-proxy-history {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
  }

  .vigan-proxy-history-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    padding: 0 10px;
    border: 1px solid #cbded8;
    border-radius: 6px;
    background: #ffffff;
    color: #065f46;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  }

  .vigan-proxy-history-button:hover,
  .vigan-proxy-history-button:focus {
    border-color: #86b9a8;
    background: #ecfdf5;
    color: #064e3b;
    outline: none;
  }
  .vigan-proxy-link {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 0 12px;
    border-radius: 6px;
    color: #047857 !important;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none !important;
    white-space: nowrap;
  }

  .vigan-proxy-link:hover,
  .vigan-proxy-link:focus {
    background: #ecfdf5;
    color: #064e3b !important;
  }

  .vigan-proxy-link--primary {
    background: #065f46;
    color: #ffffff !important;
  }

  .vigan-proxy-link--primary:hover,
  .vigan-proxy-link--primary:focus {
    background: #047857;
    color: #ffffff !important;
  }

  @media (max-width: 760px) {
    .vigan-proxy-nav {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      padding: 12px 18px;
    }

    .vigan-proxy-brand {
      min-width: 0;
    }

    .vigan-proxy-links {
      width: 100%;
      margin-left: 0;
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 2px;
    }

    .vigan-proxy-link {
      flex: 0 0 auto;
    }

    .vigan-proxy-history {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    .vigan-proxy-history-button {
      flex: 0 0 auto;
    }
    .vigan-proxy-shell .wrapper,
    .vigan-proxy-shell .main,
    .vigan-proxy-shell [role="main"] {
      padding-left: 18px !important;
      padding-right: 18px !important;
    }
    .main .container,
    .page .container,
    .toolbar .container,
    .wrapper,
    #content {
      padding-left: 18px !important;
      padding-right: 18px !important;
    }

    .row.wrapper {
      flex-direction: column !important;
      gap: 18px !important;
      flex-wrap: nowrap !important;
    }

    .primary,
    .secondary,
    .span9,
    .span8,
    .span4,
    .span3 {
      flex: 1 1 auto !important;
      width: 100% !important;
      max-width: none !important;
      padding-right: 0 !important;
    }
  }
  .toolbar {
    padding-top: 16px !important;
  }
`

const PROXY_NAV_HTML = `
  <div class="vigan-proxy-nav" role="navigation" aria-label="CKAN workspace navigation">
    <a class="vigan-proxy-brand" href="/" target="_top" aria-label="Vigan Open Data home">
      <span class="vigan-proxy-brand-mark" aria-hidden="true"><img class="vigan-proxy-brand-logo" src="/logo.png" alt="" /></span>
      <span>Vigan Open Data</span>
    </a>
    <div class="vigan-proxy-history" aria-label="Page history controls">
      <button type="button" class="vigan-proxy-history-button" onclick="if (window.history.length > 1) { window.history.back(); } else { window.location.href = '/api/ckan-proxy/dataset'; }" aria-label="Go back">&lsaquo; Back</button>
      <button type="button" class="vigan-proxy-history-button" onclick="window.history.forward();" aria-label="Go forward">Forward &rsaquo;</button>
    </div>
    <div class="vigan-proxy-links">
      <a class="vigan-proxy-link" href="/" target="_top">Home</a>
      <a class="vigan-proxy-link" href="/api/ckan-proxy/dataset">Datasets</a>
      <a class="vigan-proxy-link" href="/api/ckan-proxy/organization">Organizations</a>
      <a class="vigan-proxy-link" href="/api/ckan-proxy/group">Groups</a>
      <a class="vigan-proxy-link" href="/api/ckan-proxy/dashboard">Dashboard</a>
      <a class="vigan-proxy-link" href="/api/ckan-proxy/user">Users</a>
      <a class="vigan-proxy-link vigan-proxy-link--primary" href="/api/ckan-proxy/dataset/new">Add Dataset</a>
    </div>
  </div>
`
function gateCookieSecret() {
  return (
    process.env.LOGIN_ACCESS_TOKEN_HASH?.trim() ||
    process.env.LOGIN_ACCESS_TOKEN?.trim() ||
    process.env.CKAN_SECRET_KEY?.trim() ||
    ''
  )
}

function signGateCookie(timestamp: string) {
  const secret = gateCookieSecret()
  return secret ? createHmac('sha256', secret).update(timestamp).digest('hex') : ''
}

function constantTimeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer)
}

function hasValidLoginGate(request: NextRequest) {
  const cookieValue = request.cookies.get(LOGIN_GATE_COOKIE)?.value || ''
  const [timestamp, signature] = cookieValue.split('.', 2)
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) {
    return false
  }

  const issuedAt = Number(timestamp)
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > LOGIN_GATE_MAX_AGE_MS || issuedAt > Date.now() + 30000) {
    return false
  }

  const expectedSignature = signGateCookie(timestamp)
  return Boolean(expectedSignature) && constantTimeEqual(signature, expectedSignature)
}
function buildTargetUrl(pathnameParts: string[], requestUrl: string) {
  const ckanBase = process.env.CKAN_INTERNAL_URL || 'http://ckan:5000'
  const upstream = new URL(pathnameParts.join('/'), `${ckanBase.replace(/\/$/, '')}/`)
  const incoming = new URL(requestUrl)

  incoming.searchParams.forEach((value, key) => {
    if (key !== 'embed' && key !== 'vigan_frame') {
      upstream.searchParams.set(key, value)
    }
  })

  return upstream
}

function normalizePortalOrigin(raw: string) {
  return raw.replace(/\/$/, '')
}

function getPublicRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'http'

  if (host && !host.startsWith('0.0.0.0')) {
    return `${forwardedProto}://${host}`
  }

  return normalizePortalOrigin(process.env.CKAN_SITE_URL || 'http://172.16.2.11:8080')
}

function mapCkanRedirect(location: string, requestUrl: string) {
  const portalOrigin = normalizePortalOrigin(process.env.CKAN_SITE_URL || 'http://172.16.2.11:8080')
  const proxyOrigin = new URL(requestUrl).origin
  const upstreamBase = normalizePortalOrigin(process.env.CKAN_INTERNAL_URL || 'http://ckan:5000')

  let target: URL

  try {
    target = new URL(location, `${portalOrigin}/`)
  } catch {
    return location
  }

  const targetOrigin = normalizePortalOrigin(target.origin)
  const isCkanRedirect =
    targetOrigin === portalOrigin ||
    targetOrigin === proxyOrigin ||
    targetOrigin === upstreamBase ||
    /^https?:\/\/localhost(?::\d+)?$/i.test(target.origin)

  if (!isCkanRedirect) {
    return location
  }

  const query = `${target.search || ''}${target.hash || ''}`
  const pathname = target.pathname.replace(/\/+$/, '') || '/'
  const segments = target.pathname.split('/').filter(Boolean)

  if (pathname === '/dataset') return `/api/ckan-proxy/dataset${query}`
  if (pathname === '/organization') return `/api/ckan-proxy/organization${query}`
  if (pathname === '/group') return `/api/ckan-proxy/group${query}`

  if (segments[0] === 'dataset' && segments.length === 2) {
    return `/api/ckan-proxy/dataset/${segments[1]}${query}`
  }

  if (segments[0] === 'dataset' && segments[2] === 'resource' && segments.length === 4) {
    return `/api/ckan-proxy/dataset/${segments[1]}/resource/${segments[3]}${query}`
  }

  if (segments[0] === 'dataset' && segments[1] === 'groups' && segments.length === 3) {
    return `/api/ckan-proxy/dataset/groups/${segments[2]}${query}`
  }

  if (segments[0] === 'organization' && segments.length === 2) {
    return `/api/ckan-proxy/organization/${segments[1]}${query}`
  }

  if (segments[0] === 'group' && segments.length === 2) {
    return `/api/ckan-proxy/group/${segments[1]}${query}`
  }

  const shouldProxy =
    target.pathname.startsWith('/dataset') ||
    target.pathname.startsWith('/organization') ||
    target.pathname.startsWith('/group') ||
    target.pathname.startsWith('/user') ||
    target.pathname.startsWith('/dashboard') ||
    target.pathname.startsWith('/login_generic') ||
    target.pathname.startsWith('/revision') ||
    target.pathname.startsWith('/tag') ||
    target.pathname.startsWith('/related') ||
    target.pathname.startsWith('/error')

  if (shouldProxy) {
    return `/api/ckan-proxy${target.pathname}${query}`
  }

  return `${target.pathname}${query}`
}

/**
 * Rewrite the raw CKAN HTML before delivering it to the browser.
 * We strip all CKAN chrome server-side so it never flashes in the iframe,
 * then inject our hide CSS as a belt-and-suspenders measure.
 */

function extractCsrfToken(html: string) {
  const match = html.match(/<meta\s+name=["']_csrf_token["']\s+content=["']([^"']+)["']/i)
  return match?.[1] || null
}

async function getCkanCsrfToken(request: NextRequest, upstreamHeaders: Headers) {
  const referer = request.headers.get('referer')
  if (!referer) {
    return null
  }

  let refererUrl: URL

  try {
    refererUrl = new URL(referer)
  } catch {
    return null
  }

  if (!refererUrl.pathname.startsWith('/api/ckan-proxy/')) {
    return null
  }

  const ckanBase = process.env.CKAN_INTERNAL_URL || 'http://ckan:5000'
  const upstreamUrl = new URL(
    `${ckanBase.replace(/\/$/, '')}/${refererUrl.pathname.replace(/^\/api\/ckan-proxy\//, '')}`,
  )
  upstreamUrl.search = refererUrl.search

  const tokenHeaders = new Headers()
  const cookie = upstreamHeaders.get('cookie') || request.headers.get('cookie')
  const userAgent = request.headers.get('user-agent')
  const acceptLanguage = request.headers.get('accept-language')

  if (cookie) {
    tokenHeaders.set('cookie', cookie)
  }
  if (userAgent) {
    tokenHeaders.set('user-agent', userAgent)
  }
  if (acceptLanguage) {
    tokenHeaders.set('accept-language', acceptLanguage)
  }
  tokenHeaders.set('accept', 'text/html,application/xhtml+xml')
  tokenHeaders.set('x-forwarded-proto', request.headers.get('x-forwarded-proto') || 'http')
  tokenHeaders.set('x-forwarded-host', request.headers.get('host') || '172.16.2.11:8080')
  tokenHeaders.set('x-vigan-embed', '1')

  const response = await fetch(upstreamUrl, {
    method: 'GET',
    headers: tokenHeaders,
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  return extractCsrfToken(await response.text())
}

function ckanUnavailableResponse(request: NextRequest, target: URL, error: unknown) {
  console.error('[ckan-proxy] upstream fetch failed', {
    path: request.nextUrl.pathname,
    target: target.toString(),
    error,
  })

  return new NextResponse(
    `<!doctype html><html><head><title>CKAN temporarily unavailable</title></head><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:0;background:#f8fafc;color:#0f172a"><main style="max-width:720px;margin:64px auto;padding:32px"><h1 style="font-size:24px;margin:0 0 12px">CKAN is temporarily unavailable</h1><p style="line-height:1.6;margin:0 0 20px">The dataset workspace did not respond in time. Please go back and try again in a moment.</p><a href="/api/ckan-proxy/dataset" style="color:#047857;font-weight:700">Back to datasets</a></main></body></html>`,
    {
      status: 503,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex',
      },
    },
  )
}

async function fetchCkanWithSafeRetry(target: URL, options: RequestInit & { duplex?: 'half' }, request: NextRequest) {
  try {
    return await fetch(target, options)
  } catch (error) {
    const canRetry = request.method === 'GET' || request.method === 'HEAD'
    if (!canRetry) {
      throw error
    }

    await new Promise((resolve) => setTimeout(resolve, 150))
    return fetch(target, options)
  }
}

function shouldInjectProxyNav(request: NextRequest) {
  if (request.nextUrl.searchParams.get('vigan_frame') === '1') {
    return false
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      const publicOrigin = getPublicRequestOrigin(request)
      const sameOrigin =
        refererUrl.origin === request.nextUrl.origin ||
        refererUrl.origin === publicOrigin
      const fromFramedProxy =
        refererUrl.pathname.startsWith('/api/ckan-proxy/') &&
        refererUrl.searchParams.get('vigan_frame') === '1'

      if (sameOrigin && fromFramedProxy) return false
    } catch {
      // Ignore malformed referers and fall back to the request URL checks.
    }
  }
  const requestedWith = request.headers.get('x-requested-with')
  if (requestedWith?.toLowerCase() === 'xmlhttprequest') {
    return false
  }

  const proxyPath = request.nextUrl.pathname.replace(/^\/api\/ckan-proxy/, '') || '/'
  const pathParts = proxyPath.split('/').filter(Boolean)
  const isResourceView =
    pathParts[0] === 'dataset' &&
    pathParts[2] === 'resource' &&
    pathParts[4] === 'view'

  if (
    isResourceView ||
    proxyPath === '/_tracking' ||
    proxyPath.startsWith('/api/i18n/') ||
    proxyPath.startsWith('/datastore/') ||
    proxyPath.startsWith('/datatables/')
  ) {
    return false
  }

  const fetchDest = request.headers.get('sec-fetch-dest')
  if (fetchDest === 'iframe') {
    return false
  }

  return true
}
function withFrameParam(proxyPath: string) {
  try {
    const url = new URL(proxyPath, 'http://vigan.local')
    url.searchParams.set('vigan_frame', '1')
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    const [beforeHash, hash = ''] = proxyPath.split('#', 2)
    const separator = beforeHash.includes('?') ? '&' : '?'
    const framed = beforeHash.includes('vigan_frame=')
      ? beforeHash
      : `${beforeHash}${separator}vigan_frame=1`
    return hash ? `${framed}#${hash}` : framed
  }
}

function rewriteCkanHtml(html: string, includeProxyNav: boolean) {
  const styleTag = `<style id="next-ckan-embed-style">${CKAN_CHROME_HIDE_CSS}</style>`
  let nextHtml = html

  const absoluteCkanOrigins = [
    process.env.CKAN_SITE_URL,
    process.env.CKAN_INTERNAL_URL,
    'http://localhost:5000',
    'http://localhost:8080',
  ].filter((origin): origin is string => Boolean(origin))

  for (const origin of absoluteCkanOrigins) {
    const normalizedOrigin = origin.replace(/\/$/, '')
    const escapedOrigin = normalizedOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    nextHtml = nextHtml.replace(new RegExp(`${escapedOrigin}/`, 'gi'), '/')
  }

  // Normalize localhost references
  nextHtml = nextHtml.replace(/https?:\/\/localhost(?::\d+)?\//gi, '/')

  // Rewrite CKAN-owned root assets so embedded pages still load CSS, JS, images,
  // uploads, and fanstatic bundles through the proxy origin.
  nextHtml = nextHtml.replace(
    /\b(href|src|action|data-ajaxurl|data-languagefile)=["']\/(css|js|images|uploads|webassets|base|vendor|datatables)\/([^"'?#]+(?:\?[^"'#]*)?(?:#[^"']*)?)["']/gi,
    (_match, attr, folder, remainder) => `${attr}="/api/ckan-proxy/${folder}/${remainder}"`,
  )

  // Keep CKAN page navigation and form submissions inside the proxy namespace.
  nextHtml = nextHtml.replace(
    /\bhref=["']\/((?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error|api\/1\/util)\/[^"'#?]*)([^"']*)["']/gi,
    (_match, route, suffix) => `href="/api/ckan-proxy/${route}${suffix}"`,
  )

  nextHtml = nextHtml.replace(
    /\bsrc=["']\/((?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error|api\/1\/util)\/[^"'#?]*)([^"']*)["']/gi,
    (_match, route, suffix) => `src="/api/ckan-proxy/${route}${suffix}"`,
  )

  nextHtml = nextHtml.replace(
    /\bhref=["']\/((?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error))(?:["'])/gi,
    (_match, route) => `href="/api/ckan-proxy/${route}"`,
  )

  nextHtml = nextHtml.replace(
    /\bsrc=["']\/((?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error))(?:["'])/gi,
    (_match, route) => `src="/api/ckan-proxy/${route}"`,
  )

  nextHtml = nextHtml.replace(
    /\baction=["']\/((?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error|api\/1\/util)\/[^"']*)["']/gi,
    (_match, route) => `action="/api/ckan-proxy/${route}"`,
  )

  nextHtml = nextHtml.replace(
    /\baction=["']\/((?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error))["']/gi,
    (_match, route) => `action="/api/ckan-proxy/${route}"`,
  )

  // Ensure CKAN form actions remain in the proxy namespace.
  nextHtml = nextHtml.replace(
    /\baction=["']\/api\/ckan-proxy\/((?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error|api\/1\/util)\/[^"']*)["']/gi,
    (_match, route) => `action="/api/ckan-proxy/${route}"`,
  )

  nextHtml = nextHtml.replace(
    /\baction=["']\/api\/ckan-proxy\/(datatables\/[^"']*)["']/gi,
    (_match, route) => `action="/api/ckan-proxy/${route}"`,
  )

  // ── Strip CKAN chrome elements server-side ──────────────────────────────
  if (!includeProxyNav) {
    nextHtml = nextHtml.replace(
      /\b(href|src|action)=["'](\/api\/ckan-proxy\/(?:dataset|organization|group|user|dashboard|login_generic|revision|tag|related|error|api\/1\/util)[^"']*)["']/gi,
      (_match, attr, proxyPath) => `${attr}="${withFrameParam(proxyPath)}"`,
    )
  }
  // account-masthead (user toolbar at very top)
  nextHtml = nextHtml.replace(
    /<div[^>]*class="[^"]*\baccount-masthead\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*(<\/div>)?/gi,
    '',
  )
  // masthead header
  nextHtml = nextHtml
    .replace(/<header[^>]*class="[^"]*\bmasthead\b[^"]*"[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<div[^>]*class="[^"]*\bmasthead\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*(<\/div>)?/gi, '')
  // navbars
  nextHtml = nextHtml.replace(
    /<nav[^>]*class="[^"]*\b(?:masthead|navbar|site-nav)\b[^"]*"[^>]*>[\s\S]*?<\/nav>/gi,
    '',
  )
  // language/top bar divs
  nextHtml = nextHtml.replace(
    /<div[^>]*class="[^"]*\b(?:language-select|lang-select|topbar|login-bar)\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    '',
  )
  // footer elements
  nextHtml = nextHtml
    .replace(/<footer[^>]*class="[^"]*\bsite-footer\b[^"]*"[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<footer[^>]*role="contentinfo"[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(
      /<section[^>]*class="[^"]*\b(?:site-footer|footer-links|attribution)\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
      '',
    )
    .replace(
      /<div[^>]*class="[^"]*\b(?:site-footer|footer-links|attribution|legal)\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*(<\/div>)?/gi,
      '',
    )

  // Remove embed-related hidden inputs / params
  nextHtml = nextHtml
    .replace(/<input type="hidden" name="embed" value="1"\s*\/?>/gi, '')
    .replace(/\?embed=1/g, '')

  // Remove any X-Frame-Options meta equiv that blocks iframe rendering
  nextHtml = nextHtml.replace(
    /<meta[^>]*http-equiv="X-Frame-Options"[^>]*>/gi,
    '',
  )

  // ── Inject our CSS (skip if already injected) ───────────────────────────

  if (includeProxyNav && !nextHtml.includes('vigan-proxy-nav')) {
    if (/<body[^>]*>/i.test(nextHtml)) {
      nextHtml = nextHtml.replace(/<body([^>]*)>/i, `<body$1><div class="vigan-proxy-shell">${PROXY_NAV_HTML}`)
      nextHtml = nextHtml.replace(/<\/body>/i, '</div></body>')
    } else {
      nextHtml = `${PROXY_NAV_HTML}${nextHtml}`
    }
  }
  if (nextHtml.includes('next-ckan-embed-style')) {
    return nextHtml
  }

  if (nextHtml.includes('</head>')) {
    return nextHtml.replace('</head>', `${styleTag}</head>`)
  }

  return `${styleTag}${nextHtml}`
}

async function proxyToCkan(request: NextRequest, params: { path?: string[] }) {
  const pathParts = params.path || []
  const pathName = `/${pathParts.join('/')}`
  const normalizedPathName = pathName.replace(/\/+$/, '') || '/'

  if (pathName === '/vendor/DataTables/i18n/en.json') {
    return NextResponse.json({})
  }

  if ((request.method === 'GET' || request.method === 'HEAD') && normalizedPathName === '/_tracking') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex',
      },
    })
  }
  if (request.method === 'GET' && normalizedPathName === '/user/login' && !hasValidLoginGate(request)) {
    const accessUrl = new URL('/login-access', getPublicRequestOrigin(request))
    accessUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    const response = NextResponse.redirect(accessUrl)
    response.cookies.delete(LOGIN_GATE_COOKIE)
    return response
  }
  const isActionApiPath = pathName.startsWith('/api/3/action/')
  const isReadMethod = request.method === 'GET' || request.method === 'HEAD'
  const isAllowedUiMethod = isReadMethod || request.method === 'POST'

  let bufferedBody: BodyInit | undefined

  if (!isReadMethod) {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('application/json')) {
      const textBody = await request.text()
      bufferedBody = textBody
    } else if (contentType.includes('multipart/form-data')) {
      bufferedBody = await request.arrayBuffer()
    } else {
      bufferedBody = request.body ?? undefined
    }
  }

  if (!isAllowedUiMethod || (isActionApiPath && !isReadMethod)) {
    return NextResponse.json(
      { success: false, error: 'CKAN Action API writes are blocked. Use the CKAN web UI for publisher actions.' },
      { status: 405, headers: { Allow: 'GET, HEAD, POST' } },
    )
  }

  const target = buildTargetUrl(pathParts, request.url)

  const upstreamHeaders = new Headers()
  const forwardHeader = (source: string, target = source) => {
    const value = request.headers.get(source)
    if (value) {
      upstreamHeaders.set(target, value)
    }
  }

  forwardHeader('accept')
  forwardHeader('accept-language')
  forwardHeader('content-type')
  forwardHeader('cookie')
  forwardHeader('origin')
  forwardHeader('referer')
  forwardHeader('user-agent')
  forwardHeader('x-requested-with')
  forwardHeader('x-csrftoken')
  forwardHeader('x-csrf-token')
  forwardHeader('x-ckan-api-key')
  upstreamHeaders.set('x-forwarded-proto', request.headers.get('x-forwarded-proto') || 'http')
  upstreamHeaders.set('x-forwarded-host', request.headers.get('host') || '172.16.2.11:8080')
  upstreamHeaders.set('x-vigan-embed', '1')

  const needsDatatablesCsrf =
    request.method === 'POST' &&
    pathName.startsWith('/datatables/') &&
    !upstreamHeaders.has('x-csrftoken') &&
    !upstreamHeaders.has('x-csrf-token')

  if (needsDatatablesCsrf) {
    try {
      const csrfToken = await getCkanCsrfToken(request, upstreamHeaders)
      if (csrfToken) {
        upstreamHeaders.set('x-csrftoken', csrfToken)
        upstreamHeaders.set('x-csrf-token', csrfToken)
      }
    } catch (error) {
      console.error('[ckan-proxy] failed to hydrate datatables csrf token', error)
    }
  }

  const fetchOptions: RequestInit & { duplex?: 'half' } = {
    method: request.method,
    headers: upstreamHeaders,
    body: isReadMethod ? undefined : bufferedBody,
    duplex: isReadMethod || typeof bufferedBody === 'string' || bufferedBody instanceof ArrayBuffer ? undefined : 'half',
    redirect: 'manual',
    cache: 'no-store',
  }

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetchCkanWithSafeRetry(target, fetchOptions, request)
  } catch (error) {
    return ckanUnavailableResponse(request, target, error)
  }

  if (
    upstreamResponse.status === 403 &&
    request.method === 'GET' &&
    (pathName === '/organization/new' || pathName === '/group/new')
  ) {
    const loginUrl = new URL('/api/ckan-proxy/user/login', getPublicRequestOrigin(request))
    loginUrl.searchParams.set('came_from', pathName)
    return NextResponse.redirect(loginUrl)
  }
  const contentType = upstreamResponse.headers.get('content-type') || ''
  const headers = new Headers(upstreamResponse.headers)
  headers.delete('content-length')
  headers.delete('content-encoding')
  headers.delete('transfer-encoding')
  headers.delete('content-security-policy')
  // Allow the iframe to render — remove any frame-blocking headers
  headers.delete('x-frame-options')
  headers.set('x-robots-tag', 'noindex')

  const location = headers.get('location')
  if (location) {
    headers.set('location', mapCkanRedirect(location, request.url))
  }

  if (pathName.startsWith('/datatables/ajax/')) {
    const ajaxHeaders = new Headers(headers)
    ajaxHeaders.set('content-type', 'application/json; charset=utf-8')

    return new NextResponse(await upstreamResponse.text(), {
      status: upstreamResponse.status,
      headers: ajaxHeaders,
    })
  }
  if (contentType.includes('text/html')) {
    const html = await upstreamResponse.text()
    return new NextResponse(rewriteCkanHtml(html, shouldInjectProxyNav(request)), {
      status: upstreamResponse.status,
      headers,
    })
  }

  // Also normalise any localhost references baked into JS/CSS fanstatic bundles
  if (contentType.includes('javascript') || contentType.includes('text/css')) {
    const text = await upstreamResponse.text()
    const rewritten = text.replace(/https?:\/\/localhost(?::\d+)?\//gi, '/')
    return new NextResponse(rewritten, {
      status: upstreamResponse.status,
      headers,
    })
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  })
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> | { path?: string[] } },
) {
  const params = await context.params
  return proxyToCkan(request, params)
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> | { path?: string[] } },
) {
  const params = await context.params
  return proxyToCkan(request, params)
}


