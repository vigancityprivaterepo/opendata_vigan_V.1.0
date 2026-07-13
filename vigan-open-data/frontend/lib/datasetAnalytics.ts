import type {
  CSVAnalyticsModel,
  DashboardChartPoint,
  DashboardChartSet,
  DashboardFilterDefinition,
  DashboardKPI,
  DatasetAnalyticsModel,
  GeoAnalyticsModel,
  GeoBoundsSummary,
  GeoFeatureRecord,
  GeoPath,
  GeoPoint,
} from '@/types/analytics'

export function parseNumber(value: unknown): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const normalized = String(value).replace(/,/g, '').trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function isDateLike(value: string): boolean {
  if (!value) return false
  if (/^\d{4}$/.test(value)) return true
  const date = Date.parse(value)
  return Number.isFinite(date)
}

function normalizeValue(value: unknown): string {
  return String(value ?? '').trim()
}

function normalizeHeaderKey(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function findHeader(headers: string[], candidates: string[]): string | null {
  const normalizedMap = new Map(headers.map((header) => [normalizeHeaderKey(header), header]))
  for (const candidate of candidates) {
    const match = normalizedMap.get(normalizeHeaderKey(candidate))
    if (match) return match
  }
  return null
}

function buildFilterDefinitions(rows: Record<string, string>[]): DashboardFilterDefinition[] {
  if (!rows.length) return []

  const headers = Object.keys(rows[0])
  const filters: DashboardFilterDefinition[] = []

  for (const header of headers) {
    const values = rows.map((row) => normalizeValue(row[header])).filter(Boolean)
    if (!values.length) continue

    const uniqueValues = Array.from(new Set(values))
    const numericCount = values.filter((value) => parseNumber(value) !== null).length
    const dateCount = values.filter((value) => isDateLike(value)).length

    if (numericCount >= values.length * 0.8 && dateCount < values.length * 0.8) {
      continue
    }

    if (dateCount >= values.length * 0.8) {
      const years = Array.from(
        new Set(
          values
            .map((value) => {
              if (/^\d{4}$/.test(value)) return value
              const parsed = new Date(value)
              return Number.isNaN(parsed.getTime()) ? '' : String(parsed.getFullYear())
            })
            .filter(Boolean)
        )
      ).sort()

      if (years.length >= 2 && years.length <= 12) {
        filters.push({
          id: header,
          label: header,
          type: 'select',
          options: years.map((year) => ({ value: year, label: year })),
        })
      }
      continue
    }

    if (uniqueValues.length >= 2 && uniqueValues.length <= 12) {
      filters.push({
        id: header,
        label: header,
        type: 'select',
        options: uniqueValues
          .sort((a, b) => a.localeCompare(b))
          .map((value) => ({ value, label: value })),
      })
    }
  }

  return filters.slice(0, 6)
}

function inferPrimaryMetric(headers: string[], rows: Record<string, string>[]): string | null {
  let bestField: string | null = null
  let bestScore = -1

  for (const header of headers) {
    const values = rows.map((row) => parseNumber(row[header])).filter((value): value is number => value !== null)
    if (!values.length) continue
    const score = values.length * (values.reduce((sum, value) => sum + Math.abs(value), 0) + 1)
    if (score > bestScore) {
      bestScore = score
      bestField = header
    }
  }

  return bestField
}

function inferCategoryField(headers: string[], rows: Record<string, string>[]): string | null {
  for (const header of headers) {
    const values = rows.map((row) => normalizeValue(row[header])).filter(Boolean)
    if (!values.length) continue
    const uniqueValues = new Set(values)
    const numericCount = values.filter((value) => parseNumber(value) !== null).length

    if (uniqueValues.size >= 2 && uniqueValues.size <= Math.min(rows.length, 12) && numericCount < values.length * 0.6) {
      return header
    }
  }

  return null
}

function inferDateField(headers: string[], rows: Record<string, string>[]): string | null {
  for (const header of headers) {
    const values = rows.map((row) => normalizeValue(row[header])).filter(Boolean)
    if (!values.length) continue
    const dateCount = values.filter((value) => isDateLike(value)).length
    if (dateCount >= Math.max(3, Math.floor(values.length * 0.7))) {
      return header
    }
  }

  return null
}

function inferCoordinateField(headers: string[], patterns: RegExp[]): string | null {
  return headers.find((header) => patterns.some((pattern) => pattern.test(header.toLowerCase()))) || null
}

function inferCSVPresentation(headers: string[], rows: Record<string, string>[]) {
  const departmentField = findHeader(headers, ['Department'])
  const programNameField = findHeader(headers, ['Program Name'])
  const expenseClassField = findHeader(headers, ['Expense Class'])
  const approvedBudgetField = findHeader(headers, ['Approved Budget Php', 'Approved Budget'])

  const isBudgetDataset = Boolean(departmentField && programNameField && expenseClassField && approvedBudgetField)

  if (isBudgetDataset) {
    return {
      primaryMetricField: approvedBudgetField,
      categoryField: departmentField,
      primaryGroupField: departmentField,
      compositionField: expenseClassField,
      rankingField: programNameField,
    }
  }

  const primaryMetricField = inferPrimaryMetric(headers, rows)
  const categoryField = inferCategoryField(headers, rows)

  return {
    primaryMetricField,
    categoryField,
    primaryGroupField: categoryField,
    compositionField: categoryField,
    rankingField:
      categoryField ||
      headers.find((header) => header !== primaryMetricField) ||
      headers[0] ||
      null,
  }
}

export function buildCSVAnalyticsModel(rows: Record<string, string>[]): CSVAnalyticsModel {
  const headers = rows.length ? Object.keys(rows[0]) : []
  const presentation = inferCSVPresentation(headers, rows)
  const dateField = inferDateField(headers, rows)
  const latitudeField = inferCoordinateField(headers, [/^lat$/, /latitude/, /y_coord/])
  const longitudeField = inferCoordinateField(headers, [/^lon$/, /^lng$/, /longitude/, /x_coord/])

  const availableTabs: CSVAnalyticsModel['availableTabs'] = ['visual', 'table']
  if (latitudeField && longitudeField) {
    availableTabs.push('map')
  }

  return {
    kind: 'csv',
    headers,
    rows,
    filterDefinitions: buildFilterDefinitions(rows),
    availableTabs,
    primaryMetricField: presentation.primaryMetricField,
    categoryField: presentation.categoryField,
    primaryGroupField: presentation.primaryGroupField,
    compositionField: presentation.compositionField,
    rankingField: presentation.rankingField,
    dateField,
    latitudeField,
    longitudeField,
  }
}

function flattenPositions(coords: unknown): [number, number][] {
  if (!Array.isArray(coords)) return []
  if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    return [[Number(coords[0]), Number(coords[1])]]
  }
  return coords.flatMap((entry) => flattenPositions(entry))
}

function projectPoint(lon: number, lat: number, bounds: GeoBoundsSummary, width: number, height: number, padding: number): GeoPoint {
  const safeWidth = Math.max(bounds.maxLon - bounds.minLon, 0.0001)
  const safeHeight = Math.max(bounds.maxLat - bounds.minLat, 0.0001)
  return {
    x: padding + ((lon - bounds.minLon) / safeWidth) * (width - padding * 2),
    y: height - padding - ((lat - bounds.minLat) / safeHeight) * (height - padding * 2),
  }
}

function buildPath(
  coords: unknown,
  bounds: GeoBoundsSummary,
  width: number,
  height: number,
  padding: number,
  closePath: boolean
): string {
  if (!Array.isArray(coords) || !Array.isArray(coords[0])) return ''
  const commands = (coords as unknown[])
    .map((point, index) => {
      if (!Array.isArray(point) || typeof point[0] !== 'number' || typeof point[1] !== 'number') {
        return ''
      }
      const projected = projectPoint(Number(point[0]), Number(point[1]), bounds, width, height, padding)
      return `${index === 0 ? 'M' : 'L'} ${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`
    })
    .filter(Boolean)
    .join(' ')

  if (!commands) return ''
  return closePath ? `${commands} Z` : commands
}

export function buildGeoAnalyticsModel(input: unknown): GeoAnalyticsModel {
  const source = input as {
    type?: string
    geometry?: { type?: string; coordinates?: unknown }
    properties?: Record<string, unknown>
    features?: Array<{ id?: string | number; geometry?: { type?: string; coordinates?: unknown }; properties?: Record<string, unknown> }>
  }
  type GeoSourceFeature = { id?: string | number; geometry?: { type?: string; coordinates?: unknown }; properties?: Record<string, unknown> }

  const features: GeoSourceFeature[] =
    source.type === 'FeatureCollection'
      ? source.features ?? []
      : source.type === 'Feature'
        ? [source as GeoSourceFeature]
        : source.geometry
          ? [source as GeoSourceFeature]
          : []

  const featureRecords: GeoFeatureRecord[] = []
  const positions: [number, number][] = []
  let polygonCount = 0
  let lineCount = 0
  let pointCount = 0

  for (const [index, feature] of features.entries()) {
    const geometry = feature.geometry
    if (!geometry) continue
    const geometryType = geometry.type || 'Unknown'
    const props = Object.fromEntries(
      Object.entries(feature.properties ?? {}).map(([key, value]) => [key, normalizeValue(value)])
    )
    featureRecords.push({
      id: String(feature.id ?? index),
      properties: props,
      geometryType,
    })
    positions.push(...flattenPositions(geometry.coordinates))

    if (geometryType.includes('Polygon')) polygonCount += 1
    else if (geometryType.includes('LineString')) lineCount += 1
    else if (geometryType.includes('Point')) pointCount += 1
  }

  const bounds =
    positions.length > 0
      ? {
          minLon: Math.min(...positions.map(([lon]) => lon)),
          minLat: Math.min(...positions.map(([, lat]) => lat)),
          maxLon: Math.max(...positions.map(([lon]) => lon)),
          maxLat: Math.max(...positions.map(([, lat]) => lat)),
        }
      : null

  const width = 720
  const height = 360
  const padding = 24
  const paths: GeoPath[] = []
  const points: GeoPoint[] = []

  if (bounds) {
    for (const feature of features) {
      const geometry = feature.geometry
      if (!geometry) continue

      if (geometry.type === 'Polygon') {
        const ring = Array.isArray(geometry.coordinates) ? geometry.coordinates[0] : null
        const d = buildPath(ring, bounds, width, height, padding, true)
        if (d) paths.push({ d, kind: 'polygon' })
      } else if (geometry.type === 'MultiPolygon') {
        const polygons = Array.isArray(geometry.coordinates) ? geometry.coordinates : []
        for (const polygon of polygons.slice(0, 8)) {
          const ring = Array.isArray(polygon) ? polygon[0] : null
          const d = buildPath(ring, bounds, width, height, padding, true)
          if (d) paths.push({ d, kind: 'polygon' })
        }
      } else if (geometry.type === 'LineString') {
        const d = buildPath(geometry.coordinates, bounds, width, height, padding, false)
        if (d) paths.push({ d, kind: 'line' })
      } else if (geometry.type === 'MultiLineString') {
        const lines = Array.isArray(geometry.coordinates) ? geometry.coordinates : []
        for (const line of lines.slice(0, 10)) {
          const d = buildPath(line, bounds, width, height, padding, false)
          if (d) paths.push({ d, kind: 'line' })
        }
      } else if (geometry.type === 'Point') {
        const [point] = flattenPositions(geometry.coordinates)
        if (point) points.push(projectPoint(point[0], point[1], bounds, width, height, padding))
      } else if (geometry.type === 'MultiPoint') {
        for (const point of flattenPositions(geometry.coordinates).slice(0, 40)) {
          points.push(projectPoint(point[0], point[1], bounds, width, height, padding))
        }
      }
    }
  }

  const propertyRows = featureRecords.map((feature) => feature.properties)
  const filterDefinitions = buildFilterDefinitions(propertyRows)
  const propertyHeaders = propertyRows.length ? Object.keys(propertyRows[0]) : []

  return {
    kind: 'geojson',
    features: featureRecords,
    filterDefinitions,
    availableTabs: ['visual', 'table', 'map'],
    categoryField: inferCategoryField(propertyHeaders, propertyRows),
    numericField: inferPrimaryMetric(propertyHeaders, propertyRows),
    bounds,
    paths,
    points,
    polygonCount,
    lineCount,
    pointCount,
  }
}

export function applyCSVFilters(rows: Record<string, string>[], filters: Record<string, string>): Record<string, string>[] {
  return rows.filter((row) =>
    Object.entries(filters).every(([field, selected]) => {
      if (!selected) return true
      const rawValue = normalizeValue(row[field])
      if (/^\d{4}$/.test(selected) && isDateLike(rawValue)) {
        const year = /^\d{4}$/.test(rawValue) ? rawValue : String(new Date(rawValue).getFullYear())
        return year === selected
      }
      return rawValue === selected
    })
  )
}

export function applyGeoFilters(features: GeoFeatureRecord[], filters: Record<string, string>): GeoFeatureRecord[] {
  return features.filter((feature) =>
    Object.entries(filters).every(([field, selected]) => {
      if (!selected) return true
      return normalizeValue(feature.properties[field]) === selected
    })
  )
}

export function buildCSVKPIs(model: CSVAnalyticsModel, rows: Record<string, string>[]): DashboardKPI[] {
  const primaryMetricValues = model.primaryMetricField
    ? rows
        .map((row) => parseNumber(row[model.primaryMetricField!]))
        .filter((value): value is number => value !== null)
    : []

  const categoryValues = model.categoryField
    ? rows.map((row) => normalizeValue(row[model.categoryField!])).filter(Boolean)
    : []

  const totalMetric = primaryMetricValues.reduce((sum, value) => sum + value, 0)
  const averageMetric = primaryMetricValues.length ? totalMetric / primaryMetricValues.length : 0

  return [
    { id: 'records', label: 'Total Records', value: rows.length.toLocaleString(), accent: 'blue' },
    {
      id: 'metric-total',
      label: model.primaryMetricField ? `Total ${model.primaryMetricField}` : 'Primary Metric',
      value: model.primaryMetricField ? totalMetric.toLocaleString() : 'N/A',
      accent: 'green',
    },
    {
      id: 'unique-category',
      label: model.categoryField ? `Unique ${model.categoryField}` : 'Unique Categories',
      value: categoryValues.length ? new Set(categoryValues).size.toLocaleString() : 'N/A',
      accent: 'purple',
    },
    {
      id: 'metric-average',
      label: model.primaryMetricField ? `Average ${model.primaryMetricField}` : 'Average Metric',
      value: model.primaryMetricField ? averageMetric.toFixed(1) : 'N/A',
      accent: 'amber',
    },
  ]
}

function groupByField(rows: Record<string, string>[], field: string, metricField?: string | null): DashboardChartPoint[] {
  const map = new Map<string, number>()
  for (const row of rows) {
    const label = normalizeValue(row[field]) || 'Unspecified'
    const amount = metricField ? parseNumber(row[metricField]) ?? 0 : 1
    map.set(label, (map.get(label) ?? 0) + amount)
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }))
}

function groupByDate(rows: Record<string, string>[], field: string, metricField?: string | null): DashboardChartPoint[] {
  const map = new Map<string, number>()
  for (const row of rows) {
    const rawValue = normalizeValue(row[field])
    if (!rawValue) continue
    const label = /^\d{4}$/.test(rawValue)
      ? rawValue
      : Number.isNaN(new Date(rawValue).getTime())
        ? rawValue
        : String(new Date(rawValue).getFullYear())
    const amount = metricField ? parseNumber(row[metricField]) ?? 0 : 1
    map.set(label, (map.get(label) ?? 0) + amount)
  }

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([label, value]) => ({ label, value }))
}

export function buildCSVCharts(model: CSVAnalyticsModel, rows: Record<string, string>[]): DashboardChartSet {
  const primarySeries = model.dateField
    ? groupByDate(rows, model.dateField, model.primaryMetricField)
    : model.primaryGroupField
      ? groupByField(rows, model.primaryGroupField, model.primaryMetricField)
      : []

  const compositionSeries = model.compositionField
    ? groupByField(rows, model.compositionField, null)
    : []

  const secondarySeries = model.rankingField
    ? groupByField(rows, model.rankingField, model.primaryMetricField)
    : []

  return { primarySeries, secondarySeries, compositionSeries }
}

export function buildGeoKPIs(model: GeoAnalyticsModel, features: GeoFeatureRecord[]): DashboardKPI[] {
  const numericValues = model.numericField
    ? features
        .map((feature) => parseNumber(feature.properties[model.numericField!]))
        .filter((value): value is number => value !== null)
    : []

  const totalMetric = numericValues.reduce((sum, value) => sum + value, 0)
  return [
    { id: 'features', label: 'Total Features', value: features.length.toLocaleString(), accent: 'blue' },
    { id: 'polygons', label: 'Polygon Layers', value: model.polygonCount.toLocaleString(), accent: 'green' },
    {
      id: 'primary-metric',
      label: model.numericField ? `Total ${model.numericField}` : 'Line Features',
      value: model.numericField ? totalMetric.toLocaleString() : model.lineCount.toLocaleString(),
      accent: 'purple',
    },
    { id: 'points', label: 'Point Features', value: model.pointCount.toLocaleString(), accent: 'amber' },
  ]
}

export function buildGeoCharts(model: GeoAnalyticsModel, features: GeoFeatureRecord[]): DashboardChartSet {
  const propertyRows = features.map((feature) => feature.properties)
  const primarySeries =
    model.categoryField && propertyRows.length
      ? groupByField(propertyRows, model.categoryField, model.numericField)
      : []
  const compositionSeries =
    model.categoryField && propertyRows.length
      ? groupByField(propertyRows, model.categoryField, null)
      : []
  const secondarySeries =
    model.numericField && model.categoryField && propertyRows.length
      ? groupByField(propertyRows, model.categoryField, model.numericField)
      : primarySeries

  return { primarySeries, secondarySeries, compositionSeries }
}
