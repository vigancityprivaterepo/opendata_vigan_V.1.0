const DEFAULT_PUBLIC_SITE_URL = 'https://data.vigancity.gov.ph'

export function getPublicSiteURL(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CKAN_SITE_URL ||
    DEFAULT_PUBLIC_SITE_URL

  return raw.replace(/\/$/, '')
}

export function getPublicActionAPIBase(): string {
  return `${getPublicSiteURL()}/api/3/action`
}
