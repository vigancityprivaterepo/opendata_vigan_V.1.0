import { NextRequest, NextResponse } from 'next/server'

function getCKANBaseURL() {
  return process.env.CKAN_INTERNAL_URL || process.env.NEXT_PUBLIC_CKAN_URL || 'http://ckan:5000'
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ rid: string }> | { rid: string } },
) {
  const { rid } = await context.params
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing download URL' }, { status: 400 })
  }

  const ckanBase = getCKANBaseURL().replace(/\/$/, '')

  try {
    await fetch(`${ckanBase}/api/3/action/vigan_record_download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource_id: rid }),
      cache: 'no-store',
    })
  } catch {
    // Do not block the user download if counting fails.
  }

  return NextResponse.redirect(new URL(url, request.url))
}
