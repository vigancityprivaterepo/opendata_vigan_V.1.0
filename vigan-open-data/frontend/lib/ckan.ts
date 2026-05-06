// ─────────────────────────────────────────────────────────────────────────────
// lib/ckan.ts — Full CKAN REST API client with server + client support
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CKANAPIResponse,
  CKANDataset,
  CKANOrganization,
  CKANPackageSearchResult,
  CKANSiteStats,
  CKANTag,
  DatasetListParams,
} from '@/types/ckan'

// ── Base URL resolution ───────────────────────────────────────────────────────
// Server-side (Docker): uses the internal service name
// Browser-side: uses relative /ckan-api proxy or public URL

function getCKANBaseURL(): string {
  if (typeof window === 'undefined') {
    // Server-side render or API route
    return process.env.NEXT_PUBLIC_CKAN_URL || 'http://ckan:5000'
  }
  // Client-side — use the Next.js rewrite proxy to avoid CORS
  return ''
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────
async function ckanFetch<T>(
  action: string,
  params: Record<string, string | number | boolean | string[]> = {}
): Promise<T> {
  const base = getCKANBaseURL()
  const endpoint = base
    ? `${base}/api/3/action/${action}`
    : `/ckan-api/3/action/${action}`

  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v))
    } else if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })

  const url = `${endpoint}?${query.toString()}`

  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`CKAN API error: ${res.status} ${res.statusText} — ${url}`)
  }

  const json: CKANAPIResponse<T> = await res.json()

  if (!json.success) {
    throw new Error(
      `CKAN action failed: ${json.error?.message || 'Unknown error'} (${action})`
    )
  }

  return json.result
}

// ─────────────────────────────────────────────────────────────────────────────
// CKAN API Client
// ─────────────────────────────────────────────────────────────────────────────
export const ckanAPI = {

  // ── Datasets ──────────────────────────────────────────────────────────────

  /** Search datasets with full filter support */
  async getDatasets(params: DatasetListParams = {}): Promise<CKANPackageSearchResult> {
    const query: Record<string, string | number | boolean | string[]> = {
      rows:  params.rows  ?? 20,
      start: params.start ?? 0,
      sort:  params.sort  ?? 'metadata_modified desc',
    }

    // Build filter query
    const fqParts: string[] = []
    if (params.fq)           fqParts.push(params.fq)
    if (params.organization) fqParts.push(`organization:${params.organization}`)
    if (params.tags)         fqParts.push(`tags:${params.tags}`)
    if (params.groups)       fqParts.push(`groups:${params.groups}`)
    if (fqParts.length > 0)  query['fq'] = fqParts.join(' AND ')

    if (params.q)       query['q'] = params.q
    if (params.facet)   query['facet'] = 'true'

    return ckanFetch<CKANPackageSearchResult>('package_search', query)
  },

  /** Get a single dataset by name or ID */
  async getDataset(id: string): Promise<CKANDataset> {
    return ckanFetch<CKANDataset>('package_show', { id })
  },

  /** Search datasets by query string */
  async searchDatasets(q: string, params: DatasetListParams = {}): Promise<CKANPackageSearchResult> {
    return ckanAPI.getDatasets({ ...params, q })
  },

  /** Get the 6 most recently updated public datasets */
  async getFeaturedDatasets(limit = 6): Promise<CKANDataset[]> {
    const result = await ckanAPI.getDatasets({ rows: limit, sort: 'metadata_modified desc' })
    return result.results
  },

  /** Get recent datasets */
  async getRecentDatasets(limit = 10): Promise<CKANDataset[]> {
    const result = await ckanAPI.getDatasets({ rows: limit, sort: 'metadata_created desc' })
    return result.results
  },

  // ── Organizations ──────────────────────────────────────────────────────────

  /** List all organizations with full metadata and package count */
  async getOrganizations(): Promise<CKANOrganization[]> {
    return ckanFetch<CKANOrganization[]>('organization_list', {
      all_fields:     true,
      include_extras: true,
      include_dataset_count: true,
    })
  },

  /** Get a single organization by name or ID */
  async getOrganization(id: string): Promise<CKANOrganization> {
    return ckanFetch<CKANOrganization>('organization_show', {
      id,
      include_datasets: false,
    })
  },

  // ── Tags ──────────────────────────────────────────────────────────────────

  /** List all tags */
  async getTagList(): Promise<CKANTag[]> {
    return ckanFetch<CKANTag[]>('tag_list', { all_fields: true })
  },

  // ── Site Stats ────────────────────────────────────────────────────────────

  /** Aggregate site-wide statistics */
  async getSiteStats(): Promise<CKANSiteStats> {
    const [datasetsResult, orgs, tags] = await Promise.allSettled([
      ckanFetch<CKANPackageSearchResult>('package_search', { rows: 0 }),
      ckanFetch<string[]>('organization_list', {}),
      ckanFetch<string[]>('tag_list', {}),
    ])

    return {
      datasetCount:      datasetsResult.status === 'fulfilled' ? datasetsResult.value.count : 0,
      organizationCount: orgs.status  === 'fulfilled' ? orgs.value.length  : 7,
      tagCount:          tags.status  === 'fulfilled' ? tags.value.length  : 0,
    }
  },

  // ── DataStore ─────────────────────────────────────────────────────────────

  /** Search within a tabular resource via the DataStore API */
  async datastoreSearch(
    resourceId: string,
    limit = 10
  ): Promise<{ records: Record<string, unknown>[]; fields: Array<{ id: string; type: string }> }> {
    return ckanFetch('datastore_search', { resource_id: resourceId, limit })
  },
}
