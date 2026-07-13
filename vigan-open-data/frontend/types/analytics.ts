export type DatasetDashboardTab = 'visual' | 'table' | 'map'

export interface DashboardFilterOption {
  value: string
  label: string
}

export interface DashboardFilterDefinition {
  id: string
  label: string
  type: 'select'
  options: DashboardFilterOption[]
}

export interface DashboardKPI {
  id: string
  label: string
  value: string
  accent?: 'blue' | 'green' | 'purple' | 'amber'
}

export interface DashboardChartPoint {
  label: string
  value: number
}

export interface DashboardChartSet {
  primarySeries: DashboardChartPoint[]
  secondarySeries: DashboardChartPoint[]
  compositionSeries: DashboardChartPoint[]
}

export interface CSVAnalyticsModel {
  kind: 'csv'
  headers: string[]
  rows: Record<string, string>[]
  filterDefinitions: DashboardFilterDefinition[]
  availableTabs: DatasetDashboardTab[]
  primaryMetricField: string | null
  categoryField: string | null
  primaryGroupField: string | null
  compositionField: string | null
  rankingField: string | null
  dateField: string | null
  latitudeField: string | null
  longitudeField: string | null
}

export interface GeoPoint {
  x: number
  y: number
}

export interface GeoPath {
  d: string
  kind: 'polygon' | 'line'
}

export interface GeoBoundsSummary {
  minLon: number
  minLat: number
  maxLon: number
  maxLat: number
}

export interface GeoFeatureRecord {
  id: string
  properties: Record<string, string>
  geometryType: string
}

export interface GeoAnalyticsModel {
  kind: 'geojson'
  features: GeoFeatureRecord[]
  filterDefinitions: DashboardFilterDefinition[]
  availableTabs: DatasetDashboardTab[]
  categoryField: string | null
  numericField: string | null
  bounds: GeoBoundsSummary | null
  paths: GeoPath[]
  points: GeoPoint[]
  polygonCount: number
  lineCount: number
  pointCount: number
}

export type DatasetAnalyticsModel = CSVAnalyticsModel | GeoAnalyticsModel
