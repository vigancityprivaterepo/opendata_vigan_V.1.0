// ─────────────────────────────────────────────────────────────────────────────
// types/ckan.ts — Complete TypeScript type definitions for the CKAN REST API
// ─────────────────────────────────────────────────────────────────────────────

// Generic CKAN API wrapper
export interface CKANAPIResponse<T> {
  success: boolean
  result: T
  error?: {
    message: string
    __type: string
  }
}

// ── Resource (a single file/link attached to a dataset) ─────────────────────
export interface CKANResource {
  id: string
  name: string | null
  description: string | null
  format: string           // e.g. "CSV", "GeoJSON", "PDF"
  url: string
  url_type: string | null  // "upload" | "link" | null
  mimetype: string | null
  size: number | null
  created: string
  last_modified: string | null
  datastore_active: boolean
  package_id: string
  position: number
  resource_type: string | null
}

// ── Tag ──────────────────────────────────────────────────────────────────────
export interface CKANTag {
  id: string
  name: string
  display_name: string
  vocabulary_id: string | null
  state: string
}

// ── Organization (Department) ─────────────────────────────────────────────────
export interface CKANOrganization {
  id: string
  name: string             // slug
  title: string
  description: string | null
  image_url: string | null
  created: string
  state: string
  approval_status: string
  is_organization: boolean
  package_count?: number
}

// ── Dataset (Package) ─────────────────────────────────────────────────────────
export interface CKANDataset {
  id: string
  name: string             // slug / URL key
  title: string
  notes: string | null     // description (Markdown)
  url: string | null
  author: string | null
  author_email: string | null
  maintainer: string | null
  maintainer_email: string | null
  license_id: string | null
  license_title: string | null
  license_url: string | null
  version: string | null
  state: string
  type: string
  metadata_created: string
  metadata_modified: string
  num_resources: number
  num_tags: number
  isopen: boolean
  private: boolean
  owner_org: string | null
  organization: CKANOrganization | null
  resources: CKANResource[]
  tags: CKANTag[]
  groups: CKANGroup[]
  extras: CKANExtra[]
}

// ── Group (Category) ──────────────────────────────────────────────────────────
export interface CKANGroup {
  id: string
  name: string
  title: string
  description: string | null
  image_display_url: string | null
  package_count?: number
}

// ── Extras (key-value metadata pairs) ────────────────────────────────────────
export interface CKANExtra {
  key: string
  value: string
}

// ── User ─────────────────────────────────────────────────────────────────────
export interface CKANUser {
  id: string
  name: string
  fullname: string | null
  email: string | null
  about: string | null
  created: string
  sysadmin: boolean
  state: string
  number_of_edits: number
  number_created_packages: number
}

// ── Package search result ─────────────────────────────────────────────────────
export interface CKANPackageSearchResult {
  count: number
  results: CKANDataset[]
  facets?: Record<string, Record<string, number>>
  search_facets?: Record<string, {
    items: Array<{ name: string; display_name: string; count: number }>
    title: string
  }>
}

// ── Site stats ────────────────────────────────────────────────────────────────
export interface CKANSiteStats {
  datasetCount: number
  organizationCount: number
  tagCount: number
}

// ── Query params for dataset listing ─────────────────────────────────────────
export interface DatasetListParams {
  q?: string               // full-text search query
  fq?: string              // facet query (e.g. "organization:tourism-office")
  rows?: number            // page size (default 20)
  start?: number           // pagination offset
  sort?: string            // e.g. "metadata_modified desc", "title asc"
  facet?: boolean
  'facet.field'?: string[]
  tags?: string
  organization?: string
  groups?: string
  format?: string
}
