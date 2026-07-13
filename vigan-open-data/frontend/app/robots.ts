import type { MetadataRoute } from 'next'
import { getPublicSiteURL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getPublicSiteURL()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/ckan-proxy/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
