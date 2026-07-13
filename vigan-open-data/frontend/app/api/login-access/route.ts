import { NextRequest, NextResponse } from 'next/server'
import { createHash, createHmac, timingSafeEqual } from 'crypto'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'vigan_login_gate'
const MAX_AGE_SECONDS = 10 * 60
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i

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

function createGateCookieValue() {
  const timestamp = String(Date.now())
  return `${timestamp}.${signGateCookie(timestamp)}`
}


function tokenDigest(value: string) {
  return createHash('sha256').update(value).digest()
}

function expectedTokenDigest() {
  const configuredHash = process.env.LOGIN_ACCESS_TOKEN_HASH?.trim()
  if (configuredHash) {
    return SHA256_HEX_PATTERN.test(configuredHash) ? Buffer.from(configuredHash, 'hex') : null
  }

  const configuredToken = process.env.LOGIN_ACCESS_TOKEN?.trim()
  return configuredToken ? tokenDigest(configuredToken) : null
}

function isValidToken(value: string) {
  const expectedDigest = expectedTokenDigest()
  if (!expectedDigest) {
    return false
  }

  const actualDigest = tokenDigest(value)
  return timingSafeEqual(actualDigest, expectedDigest)
}

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/api/ckan-proxy/user/login'
  }
  return value
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || ''
  let token = ''
  let next = '/api/ckan-proxy/user/login'

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}))
    token = typeof body.token === 'string' ? body.token : ''
    next = safeNextPath(typeof body.next === 'string' ? body.next : null)
  } else {
    const form = await request.formData()
    token = String(form.get('token') || '')
    next = safeNextPath(String(form.get('next') || ''))
  }

  if (!isValidToken(token.trim())) {
    return NextResponse.json({ success: false, error: 'Invalid access token.' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true, next })
  response.cookies.set(COOKIE_NAME, createGateCookieValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
  return response
}
