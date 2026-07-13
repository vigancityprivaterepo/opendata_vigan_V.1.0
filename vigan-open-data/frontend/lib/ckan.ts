// ─────────────────────────────────────────────────────────────────────────────
// lib/ckan.ts — Full CKAN REST API client with server + client support
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CKANAPIResponse,
  CKANDataset,
  CKANGroup,
  CKANOrganization,
  CKANPackageSearchResult,
  CKANSiteStats,
  CKANTag,
  DatasetListResponse,
  DatasetListParams,
} from '@/types/ckan'

// ── Base URL resolution ───────────────────────────────────────────────────────
// Server-side (Docker): uses the internal service name
// Browser-side: uses relative /ckan-api proxy or public URL

function getCKANBaseURL(): string {
  if (typeof window === 'undefined') {
    // Server-side render or API route should prefer the internal CKAN service.
    return process.env.CKAN_INTERNAL_URL || process.env.NEXT_PUBLIC_CKAN_URL || 'http://ckan:5000'
  }
  // Client-side — use the Next.js rewrite proxy to avoid CORS
  return ''
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────
async function ckanFetch<T>(
  action: string,
  params: Record<string, string | number | boolean | string[]> = {},
  revalidateSeconds = 3600,
  method: 'GET' | 'POST' = 'GET'
): Promise<T> {
  const base = getCKANBaseURL()
  const endpoint = base
    ? `${base}/api/3/action/${action}`
    : `/ckan-api/3/action/${action}`

  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (key === 'facet.field') query.set(key, JSON.stringify(value))
      else value.forEach((v) => query.append(key, v))
    } else if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })

  const url = method === 'GET' ? `${endpoint}?${query.toString()}` : endpoint

  const res = await fetch(url, {
    method,
    next: { revalidate: revalidateSeconds },
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(params) : undefined,
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

let totalDownloadsCache:
  | {
      expiresAt: number
      value: number
    }
  | null = null

const PRIMARY_CATEGORY_TAGS = [
  'tourism',
  'drrm',
  'health',
  'planning',
  'business',
  'budget',
  'environment',
]

async function getTotalResourceTracking(): Promise<number> {
  const now = Date.now()
  if (totalDownloadsCache && totalDownloadsCache.expiresAt > now) {
    return totalDownloadsCache.value
  }

  const totalDownloads = await ckanFetch<number>('vigan_total_downloads', {}, 60, 'POST')

  totalDownloadsCache = {
    value: totalDownloads,
    expiresAt: now + 60 * 1000,
  }

  return totalDownloads
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
    if (params.format)       fqParts.push(`res_format:${params.format.toUpperCase()}`)
    if (fqParts.length > 0)  query['fq'] = fqParts.join(' AND ')

    if (params.q)       query['q'] = params.q
    if (params.facet)   query['facet'] = 'true'

    return ckanFetch<CKANPackageSearchResult>('package_search', query, 3600)
  },

  /** Get a single dataset by name or ID */
  async getDataset(id: string): Promise<CKANDataset> {
    return ckanFetch<CKANDataset>('package_show', { id }, 3600)
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
    }, 3600)
  },

  /** Get a single organization by name or ID */
  async getOrganization(id: string): Promise<CKANOrganization> {
    return ckanFetch<CKANOrganization>('organization_show', {
      id,
      include_datasets: false,
    }, 3600)
  },

  // Categories / groups
  async getGroups(): Promise<CKANGroup[]> {
    return ckanFetch<CKANGroup[]>('group_list', {
      all_fields: true,
      include_extras: true,
      include_dataset_count: true,
    }, 3600)
  },

  async getGroup(id: string): Promise<CKANGroup> {
    return ckanFetch<CKANGroup>('group_show', {
      id,
      include_datasets: false,
    }, 3600)
  },

  // ── Tags ──────────────────────────────────────────────────────────────────

  /** List all tags */
  async getTagList(): Promise<CKANTag[]> {
    return ckanFetch<CKANTag[]>('tag_list', { all_fields: true }, 3600)
  },

  // ── Site Stats ────────────────────────────────────────────────────────────

  /** Aggregate site-wide statistics */
  async getSiteStats(): Promise<CKANSiteStats> {
    const [datasetsResult, orgs, groups, categoryFacets, downloads] = await Promise.allSettled([
      ckanFetch<CKANPackageSearchResult>('package_search', { rows: 0 }, 300),
      ckanFetch<string[]>('organization_list', {}, 3600),
      ckanFetch<string[]>('group_list', {}, 3600),
      ckanFetch<CKANPackageSearchResult>('package_search', {
        rows: 0,
        facet: true,
        'facet.field': ['tags'],
      }, 300),
      getTotalResourceTracking(),
    ])

    const groupCount = groups.status === 'fulfilled' ? groups.value.length : 0
    const categoryCount =
      categoryFacets.status === 'fulfilled'
        ? PRIMARY_CATEGORY_TAGS.filter(
            (tag) => (categoryFacets.value.facets?.tags?.[tag] ?? 0) > 0
          ).length
        : 0

    return {
      datasetCount:      datasetsResult.status === 'fulfilled' ? datasetsResult.value.count : 0,
      organizationCount: orgs.status  === 'fulfilled' ? orgs.value.length  : 7,
      groupCount:        categoryCount || groupCount,
      downloads:         downloads.status === 'fulfilled' ? downloads.value : 0,
    }
  },

  // ── DataStore ─────────────────────────────────────────────────────────────

  /** Search within a tabular resource via the DataStore API */
  async datastoreSearch(
    resourceId: string,
    limit = 10
  ): Promise<{ records: Record<string, unknown>[]; fields: Array<{ id: string; type: string }> }> {
    return ckanFetch('datastore_search', { resource_id: resourceId, limit }, 3600)
  },

  async getDatasetListPage(params: DatasetListParams = {}): Promise<DatasetListResponse> {
    const pageSize = Math.min(Math.max(params.rows ?? 12, 1), 24)
    const start = Math.max(params.start ?? 0, 0)
    const page = Math.floor(start / pageSize) + 1

    const [result, organizations] = await Promise.all([
      ckanAPI.getDatasets({ ...params, rows: pageSize, start }),
      ckanAPI.getOrganizations(),
    ])

    return {
      result,
      organizations,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(result.count / pageSize)),
    }
  },

  async getDatasetNames(): Promise<string[]> {
    return ckanFetch<string[]>('package_list', {}, 3600)
  },
}
