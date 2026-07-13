'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import {
  BarChart3,
  Download,
  ExternalLink,
  Filter,
  Loader2,
  MapPinned,
  Table2,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CKANDataset, CKANResource } from '@/types/ckan'
import type {
  CSVAnalyticsModel,
  DashboardChartPoint,
  DashboardKPI,
  DatasetDashboardTab,
  GeoAnalyticsModel,
} from '@/types/analytics'
import { getResourceDownloadURL, getTrackedResourceDownloadURL } from '@/lib/utils'
import {
  applyCSVFilters,
  applyGeoFilters,
  buildCSVAnalyticsModel,
  buildCSVCharts,
  buildCSVKPIs,
  buildGeoAnalyticsModel,
  buildGeoCharts,
  buildGeoKPIs,
} from '@/lib/datasetAnalytics'

const KPI_ACCENTS: Record<NonNullable<DashboardKPI['accent']>, string> = {
  blue: 'text-sky-600',
  green: 'text-emerald-600',
  purple: 'text-violet-600',
  amber: 'text-amber-600',
}

const PIE_COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#F97316', '#8B5CF6', '#14B8A6', '#EF4444', '#84CC16']

interface Props {
  dataset: CKANDataset
}

interface DashboardState {
  loading: boolean
  error: string | null
  model: CSVAnalyticsModel | GeoAnalyticsModel | null
}

function formatHeaderLabel(header: string): string {
  return header
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function getPrimaryChartTitle(model: CSVAnalyticsModel): string {
  if (model.dateField) return `${formatHeaderLabel(model.dateField)} Overview`
  if (model.primaryGroupField) return `${formatHeaderLabel(model.primaryGroupField)} Budget Overview`
  return 'Primary Breakdown'
}

function getCompositionTitle(model: CSVAnalyticsModel): string {
  if (model.compositionField) return `${formatHeaderLabel(model.compositionField)} Composition`
  if (model.categoryField) return `Top ${formatHeaderLabel(model.categoryField)}`
  return 'Composition'
}

function TabButton({
  tab,
  activeTab,
  onClick,
  icon,
  label,
}: {
  tab: DatasetDashboardTab
  activeTab: DatasetDashboardTab
  onClick: (tab: DatasetDashboardTab) => void
  icon: ReactNode
  label: string
}) {
  const active = tab === activeTab
  return (
    <button
      type="button"
      onClick={() => onClick(tab)}
      className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${active
          ? 'border-vigan-primary text-vigan-primary'
          : 'border-transparent text-gray-500 hover:text-gray-800'
        }`}
    >
      {icon}
      {label}
    </button>
  )
}

function KPIGrid({ kpis }: { kpis: DashboardKPI[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{kpi.label}</p>
          <p className={`mt-3 text-3xl font-bold ${kpi.accent ? KPI_ACCENTS[kpi.accent] : 'text-gray-900'}`}>
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function EmptyPanel({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
      {title}
    </div>
  )
}

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
        <span className="text-vigan-primary">{icon}</span>
        {title}
      </div>
      <div className="h-[280px]">{children}</div>
    </div>
  )
}

function renderLabel(value: string) {
  return value.length > 16 ? `${value.slice(0, 15)}...` : value
}

function VerticalBarPanel({ data, dataKeyLabel = 'label' }: { data: DashboardChartPoint[]; dataKeyLabel?: string }) {
  if (!data.length) return <EmptyPanel title="Not enough data for this chart." />

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey={dataKeyLabel} tickFormatter={renderLabel} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#1D4ED8" radius={[6, 6, 0, 0]} name="Value" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function HorizontalBarPanel({ data }: { data: DashboardChartPoint[] }) {
  if (!data.length) return <EmptyPanel title="Not enough ranked data for this chart." />

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis dataKey="label" type="category" width={120} tickFormatter={renderLabel} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#FB923C" radius={[0, 6, 6, 0]} name="Value" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function PiePanel({ data }: { data: DashboardChartPoint[] }) {
  if (!data.length) return <EmptyPanel title="Not enough composition data for this chart." />

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="48%"
          outerRadius={90}
          innerRadius={42}
          paddingAngle={2}
          label={({ name }) => renderLabel(String(name))}
        >
          {data.map((entry, index) => (
            <Cell key={`${entry.label}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function MapBackdrop({ label = 'Vigan City Land Context' }: { label?: string }) {
  return (
    <>
      <rect width="720" height="360" fill="#D9EEF7" />
      <path
        d="M0 76C60 65 111 78 161 102C211 126 254 121 307 100C361 78 407 81 465 106C519 129 562 136 617 120C663 106 694 85 720 72V360H0V76Z"
        fill="#E6F4E7"
      />
      <path
        d="M0 115C53 93 109 99 168 133C214 160 257 166 308 145C363 123 418 122 474 147C532 173 591 182 648 170C678 164 702 154 720 145V360H0V115Z"
        fill="#D2E8D0"
      />
      <path
        d="M0 252C52 227 104 221 156 238C223 260 275 289 337 283C384 278 428 245 482 232C552 216 626 222 720 258V360H0V252Z"
        fill="#BDD8B6"
        opacity="0.85"
      />
      <path
        d="M28 214C102 186 168 188 237 221C294 249 350 252 416 228C493 200 550 200 618 232C647 246 675 250 705 246"
        stroke="#93C5AA"
        strokeWidth="3"
        strokeDasharray="8 10"
        fill="none"
      />
      <path
        d="M36 286C109 266 164 270 223 294C281 318 342 319 399 293C456 267 517 259 582 276C626 288 665 306 702 324"
        stroke="#7DA286"
        strokeWidth="2.5"
        strokeOpacity="0.65"
        fill="none"
      />
      <path
        d="M56 82C117 101 183 142 228 195C274 248 324 269 389 263C444 257 492 220 545 173C588 135 639 102 698 91"
        stroke="#7CC7E8"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M70 86C128 106 188 147 231 198C275 249 325 271 387 266C441 262 491 225 543 178C584 141 635 109 690 98"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      <path
        d="M90 136H660"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeDasharray="4 10"
        strokeOpacity="0.45"
      />
      <path
        d="M134 68V128"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeDasharray="4 10"
        strokeOpacity="0.45"
      />
      <rect x="18" y="18" width="180" height="34" rx="17" fill="rgba(255,255,255,0.72)" />
      <text x="34" y="40" fill="#406356" fontSize="13" fontWeight="700">
        {label}
      </text>
      <g opacity="0.9">
        <path d="M678 34L689 12L700 34H692V52H686V34H678Z" fill="#255E4A" />
        <text x="684" y="66" fill="#255E4A" fontSize="11" fontWeight="700">
          N
        </text>
      </g>
    </>
  )
}

function GeoMapPanel({
  model,
  featureCount,
}: {
  model: GeoAnalyticsModel
  featureCount: number
}) {
  if (!model.paths.length && !model.points.length) {
    return <EmptyPanel title="No map geometry available for this dataset." />
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
        <MapPinned size={16} className="text-vigan-primary" />
        Map View
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-[linear-gradient(180deg,#f7fffb_0%,#eef6ff_100%)]">
        <svg viewBox="0 0 720 360" className="h-auto w-full">
          <MapBackdrop />
          {model.paths.map((path, index) => (
            <path
              key={`${path.kind}-${index}`}
              d={path.d}
              fill={path.kind === 'polygon' ? 'rgba(16,185,129,0.24)' : 'none'}
              stroke={path.kind === 'polygon' ? '#0F766E' : '#0F766E'}
              strokeWidth={path.kind === 'polygon' ? 2.2 : 2.4}
            />
          ))}
          {model.points.map((point, index) => (
            <circle key={`point-${index}`} cx={point.x} cy={point.y} r="3.5" fill="#DC2626" opacity="0.85" />
          ))}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500 md:grid-cols-4">
        <div className="rounded-lg bg-gray-50 px-3 py-2">Features: {featureCount}</div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">Polygons: {model.polygonCount}</div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">Lines: {model.lineCount}</div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">Points: {model.pointCount}</div>
      </div>
    </div>
  )
}

function CSVPointMap({
  rows,
  latitudeField,
  longitudeField,
}: {
  rows: Record<string, string>[]
  latitudeField: string
  longitudeField: string
}) {
  const points = useMemo(() => {
    const parsed = rows
      .map((row) => ({
        lat: Number(row[latitudeField]),
        lon: Number(row[longitudeField]),
        label: row[latitudeField],
      }))
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon))

    if (!parsed.length) return []

    const minLat = Math.min(...parsed.map((point) => point.lat))
    const maxLat = Math.max(...parsed.map((point) => point.lat))
    const minLon = Math.min(...parsed.map((point) => point.lon))
    const maxLon = Math.max(...parsed.map((point) => point.lon))

    return parsed.map((point) => {
      const x = 24 + ((point.lon - minLon) / Math.max(maxLon - minLon, 0.0001)) * 672
      const y = 336 - ((point.lat - minLat) / Math.max(maxLat - minLat, 0.0001)) * 312
      return { x, y }
    })
  }, [latitudeField, longitudeField, rows])

  if (!points.length) return <EmptyPanel title="No coordinate points available after filtering." />

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
        <MapPinned size={16} className="text-vigan-primary" />
        Map View
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-[linear-gradient(180deg,#f7fffb_0%,#eef6ff_100%)]">
        <svg viewBox="0 0 720 360" className="h-auto w-full">
          <MapBackdrop label="Coordinate Map Context" />
          {points.map((point, index) => (
            <circle key={`csv-point-${index}`} cx={point.x} cy={point.y} r="5" fill="#1D4ED8" opacity="0.8" />
          ))}
        </svg>
      </div>
    </div>
  )
}

export default function DatasetDashboard({ dataset }: Props) {
  const primaryResource = useMemo(
    () =>
      dataset.resources?.find((resource) => {
        const format = (resource.format || '').toUpperCase()
        const url = (resource.url || '').toLowerCase()
        return format === 'CSV' || url.endsWith('.csv') || format === 'GEOJSON' || url.endsWith('.geojson') || format === 'JSON'
      }) ?? dataset.resources?.[0],
    [dataset.resources]
  )
  const [state, setState] = useState<DashboardState>({ loading: true, error: null, model: null })
  const [activeTab, setActiveTab] = useState<DatasetDashboardTab>('visual')
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!primaryResource?.url) {
      setState({ loading: false, error: 'No dataset resource available.', model: null })
      return
    }

    const format = (primaryResource.format || '').toUpperCase()
    const resourceUrl = (primaryResource.url || '').toLowerCase()
    setState({ loading: true, error: null, model: null })

    if (format === 'CSV' || resourceUrl.endsWith('.csv')) {
      Papa.parse<Record<string, string>>(getResourceDownloadURL(primaryResource.url), {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const rows = result.data.filter((row) =>
            Object.values(row).some((value) => String(value ?? '').trim() !== '')
          )
          setState({ loading: false, error: null, model: buildCSVAnalyticsModel(rows) })
        },
        error: (error) => {
          setState({ loading: false, error: error.message || 'Failed to load CSV resource.', model: null })
        },
      })
      return
    }

    if (format === 'GEOJSON' || format === 'JSON' || resourceUrl.endsWith('.geojson')) {
      fetch(getResourceDownloadURL(primaryResource.url))
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to load GeoJSON (${response.status})`)
          return response.json()
        })
        .then((json) => {
          setState({ loading: false, error: null, model: buildGeoAnalyticsModel(json) })
        })
        .catch((error: Error) => {
          setState({ loading: false, error: error.message || 'Failed to load map resource.', model: null })
        })
      return
    }

    setState({ loading: false, error: 'This resource format is not yet supported by the dashboard.', model: null })
  }, [primaryResource?.format, primaryResource?.url])

  useEffect(() => {
    if (state.model) {
      setActiveTab(state.model.availableTabs[0] ?? 'visual')
      setSelectedFilters(
        Object.fromEntries(state.model.filterDefinitions.map((filter) => [filter.id, '']))
      )
    }
  }, [state.model])

  const csvResults = useMemo(() => {
    if (!state.model || state.model.kind !== 'csv') return null
    const filteredRows = applyCSVFilters(state.model.rows, selectedFilters)
    return {
      filteredRows,
      kpis: buildCSVKPIs(state.model, filteredRows),
      charts: buildCSVCharts(state.model, filteredRows),
    }
  }, [selectedFilters, state.model])

  const geoResults = useMemo(() => {
    if (!state.model || state.model.kind !== 'geojson') return null
    const filteredFeatures = applyGeoFilters(state.model.features, selectedFilters)
    return {
      filteredFeatures,
      kpis: buildGeoKPIs(state.model, filteredFeatures),
      charts: buildGeoCharts(state.model, filteredFeatures),
    }
  }, [selectedFilters, state.model])

  const geoTableHeaders = useMemo(() => {
    if (!geoResults) return []
    const headers = new Set<string>()
    geoResults.filteredFeatures.forEach((feature) => {
      Object.keys(feature.properties).forEach((header) => headers.add(header))
    })
    return Array.from(headers)
  }, [geoResults])

  const handleFilterChange = (field: string, value: string) => {
    setSelectedFilters((current) => ({ ...current, [field]: value }))
  }

  if (!primaryResource) return null

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Filter size={15} className="text-vigan-primary" />
            Filters
          </div>

          {state.loading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin text-vigan-primary" />
              Loading filters...
            </div>
          ) : state.model?.filterDefinitions.length ? (
            <div className="space-y-3">
              {state.model.filterDefinitions.map((filter) => (
                <label key={filter.id} className="block">
                  <span className="mb-1.5 block text-xs font-medium text-gray-500">
                    {formatHeaderLabel(filter.label)}
                  </span>
                  <select
                    value={selectedFilters[filter.id] ?? ''}
                    onChange={(event) => handleFilterChange(filter.id, event.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-vigan-primary"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No filterable fields were detected for this dataset.</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</h3>
          <div className="space-y-2">
            <a
              href={getTrackedResourceDownloadURL(primaryResource.id, primaryResource.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-vigan-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vigan-accent"
            >
              <Download size={15} />
              Export Data
            </a>
            <a
              href={`/api/3/action/package_show?id=${dataset.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-vigan-primary hover:text-vigan-primary"
            >
              <ExternalLink size={15} />
              Open API
            </a>
          </div>
        </div>

      </aside>

      <div className="min-w-0 space-y-5">
        <div className="rounded-xl border border-vigan-border bg-vigan-light px-5 py-4 text-sm text-vigan-primary shadow-sm">
          <p className="font-semibold">Portal insights</p>
          <p className="mt-1 text-xs leading-relaxed text-vigan-primary/80">
            These visual summaries complement the canonical CKAN resource pages. Use them for quick public exploration, then open the resource in CKAN for native previews and downloads.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6">
            <div className="flex flex-wrap items-center gap-6">
              {state.model?.availableTabs.includes('visual') && (
                <TabButton
                  tab="visual"
                  activeTab={activeTab}
                  onClick={setActiveTab}
                  icon={<BarChart3 size={15} />}
                  label="Visual"
                />
              )}
              {state.model?.availableTabs.includes('table') && (
                <TabButton
                  tab="table"
                  activeTab={activeTab}
                  onClick={setActiveTab}
                  icon={<Table2 size={15} />}
                  label="Table"
                />
              )}
              {state.model?.availableTabs.includes('map') && (
                <TabButton
                  tab="map"
                  activeTab={activeTab}
                  onClick={setActiveTab}
                  icon={<MapPinned size={15} />}
                  label="Map"
                />
              )}
            </div>
          </div>

          <div className="p-6">
            {state.loading ? (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-10 text-gray-600">
                <Loader2 size={20} className="animate-spin text-vigan-primary" />
                Building dashboard analytics...
              </div>
            ) : state.error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
                {state.error}
              </div>
            ) : state.model?.kind === 'csv' && csvResults ? (
              <div className="space-y-5">
                {activeTab === 'visual' && (
                  <>
                    <KPIGrid kpis={csvResults.kpis} />
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                      <ChartCard title={getPrimaryChartTitle(state.model)} icon={<BarChart3 size={15} />}>
                        <VerticalBarPanel data={csvResults.charts.primarySeries} />
                      </ChartCard>
                      <ChartCard title={getCompositionTitle(state.model)} icon={<BarChart3 size={15} />}>
                        <PiePanel data={csvResults.charts.compositionSeries} />
                      </ChartCard>
                      <ChartCard title="Ranked Results" icon={<BarChart3 size={15} />}>
                        <HorizontalBarPanel data={csvResults.charts.secondarySeries} />
                      </ChartCard>
                      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-gray-800">Need detailed results?</h3>
                        <p className="text-sm leading-relaxed text-gray-500">
                          Use the table view for detailed records, sortable columns, and filtered row results based on the selections in the left panel.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'table' && (
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-5 py-4 text-sm font-semibold text-gray-800">
                      Filtered Records ({csvResults.filteredRows.length})
                    </div>
                    {csvResults.filteredRows.length ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {(state.model as CSVAnalyticsModel).headers.map((header: string) => (
                                <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                  {formatHeaderLabel(header)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {csvResults.filteredRows.slice(0, 100).map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-50">
                                {(state.model as CSVAnalyticsModel).headers.map((header: string) => (
                                  <td key={`${rowIndex}-${header}`} className="whitespace-nowrap px-4 py-3 text-gray-700">
                                    {row[header] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="px-5 py-10 text-sm text-gray-500">No records match the current filters.</div>
                    )}
                  </div>
                )}

                {activeTab === 'map' && state.model.latitudeField && state.model.longitudeField && (
                  <CSVPointMap
                    rows={csvResults.filteredRows}
                    latitudeField={state.model.latitudeField}
                    longitudeField={state.model.longitudeField}
                  />
                )}
              </div>
            ) : state.model?.kind === 'geojson' && geoResults ? (
              <div className="space-y-5">
                {activeTab === 'visual' && (
                  <>
                    <KPIGrid kpis={geoResults.kpis} />
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                      <ChartCard title="Feature Breakdown" icon={<BarChart3 size={15} />}>
                        <VerticalBarPanel data={geoResults.charts.primarySeries} />
                      </ChartCard>
                      <ChartCard title="Composition" icon={<BarChart3 size={15} />}>
                        <PiePanel data={geoResults.charts.compositionSeries} />
                      </ChartCard>
                    </div>
                  </>
                )}

                {activeTab === 'table' && (
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-5 py-4 text-sm font-semibold text-gray-800">
                      Filtered Features ({geoResults.filteredFeatures.length})
                    </div>
                    {geoResults.filteredFeatures.length ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Geometry
                              </th>
                              {geoTableHeaders.map((header) => (
                                <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                  {formatHeaderLabel(header)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {geoResults.filteredFeatures.slice(0, 100).map((feature) => (
                              <tr key={feature.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                  {feature.geometryType || '-'}
                                </td>
                                {geoTableHeaders.map((header) => (
                                  <td key={`${feature.id}-${header}`} className="whitespace-nowrap px-4 py-3 text-gray-700">
                                    {feature.properties[header] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="px-5 py-10 text-sm text-gray-500">No features match the current filters.</div>
                    )}
                  </div>
                )}

                {activeTab === 'map' && (
                  <GeoMapPanel model={state.model} featureCount={geoResults.filteredFeatures.length} />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

