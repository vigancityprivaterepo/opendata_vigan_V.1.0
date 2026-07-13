import type { MetadataRoute } from 'next'
import { ckanAPI } from '@/lib/ckan'
import { getPublicSiteURL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getPublicSiteURL()
  const staticRoutes = [
    '',
    '/about',
    '/api-docs',
    '/contact',
    '/data-request',
    '/datasets',
    '/feedback',
    '/groups',
    '/organizations',
    '/privacy-policy',
    '/terms-of-use',
  ]

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))

  try {
    const datasetNames = await ckanAPI.getDatasetNames()
    return entries.concat(
      datasetNames.map((name) => ({
        url: `${siteUrl}/datasets/${name}`,
        lastModified: new Date(),
      })),
    )
  } catch {
    return entries
  }
}
