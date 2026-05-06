import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ckanAPI } from '@/lib/ckan'
import { truncate, formatDate, formatFileSize, getFormatColor, getResourceDownloadURL } from '@/lib/utils'
import CSVPreview from '@/components/datasets/CSVPreview'
import DownloadButton from '@/components/datasets/DownloadButton'
import { FileText, Building2, Calendar, Scale, Code2, Link as LinkIcon, Database, ExternalLink, Download } from 'lucide-react'

export const revalidate = 60

export default async function DatasetDetailPage({ params }: { params: { id: string } }) {
  try {
    const dataset = await ckanAPI.getDataset(params.id)
    if (!dataset) return notFound()

    const primaryResource = dataset.resources?.[0]
    const format = primaryResource?.format || 'DATA'
    const hasPreview = format.toUpperCase() === 'CSV'

    return (
      <div className="bg-white min-h-screen pb-20">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-vigan-primary">Home</Link>
            <span>/</span>
            <Link href="/datasets" className="hover:text-vigan-primary">Datasets</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{dataset.title || dataset.name}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-vigan-primary border border-vigan-border">
                    {dataset.organization?.title || 'Vigan City'}
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-gray-100 text-gray-700">
                    {format}
                  </span>
                  {dataset.license_title && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                      <Scale size={12} /> {dataset.license_title}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {dataset.title || dataset.name}
                </h1>

                <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
                  {truncate(dataset.notes, 250)}
                </p>
              </div>

              {/* Download Card */}
              {primaryResource && (
                <div className="bg-emerald-50 p-6 rounded-lg border border-vigan-border w-full md:w-80 flex-shrink-0">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Primary File</p>
                  <p className="font-semibold text-gray-900 mb-1 truncate" title={primaryResource.name || 'Resource'}>
                    {primaryResource.name || `${(dataset.title || dataset.name)} Data`}
                  </p>
                  <p className="text-sm text-vigan-primary mb-6">
                    {formatFileSize(primaryResource.size)} · {primaryResource.format || 'DATA'}
                  </p>
                  <DownloadButton
                    url={getResourceDownloadURL(primaryResource.url)}
                    name={`${dataset.name}-${primaryResource.format?.toLowerCase() || 'data'}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Resources List */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <Database className="text-vigan-primary" size={20} />
                    Data & Resources
                  </h3>
                  <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-md border border-gray-200">
                    {dataset.resources?.length || 0} Files
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {dataset.resources?.map((res, i) => (
                    <div key={res.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="font-semibold text-gray-900 text-base truncate">{res.name || `Data Resource ${i + 1}`}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getFormatColor(res.format)}`}>
                              {res.format || 'DATA'}
                            </span>
                          </div>
                          {res.description && <p className="text-sm text-gray-500 mb-3">{res.description}</p>}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5"><Calendar size={13}/> Updated {formatDate(res.last_modified || res.created)}</span>
                            {res.size && <span className="flex items-center gap-1.5"><FileText size={13}/> {formatFileSize(res.size)}</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                          <a href={getResourceDownloadURL(res.url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-vigan-primary border border-vigan-primary rounded-md hover:bg-vigan-primary hover:text-white transition-colors w-full justify-center">
                            <Download size={14} /> Download
                          </a>
                        </div>
                      </div>

                      {/* Preview for CSV */}
                      {hasPreview && i === 0 && res.format?.toUpperCase() === 'CSV' && (
                        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-white">
                          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 before:content-[''] before:block before:w-2 before:h-2 before:bg-vigan-secondary before:rounded-full">
                            Data Preview
                          </h5>
                          <CSVPreview resource={res} />
                        </div>
                      )}
                    </div>
                  ))}
                  {(!dataset.resources || dataset.resources.length === 0) && (
                    <div className="p-10 text-center text-gray-500">
                      No files are currently attached to this dataset.
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-3">
                  About this Dataset
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {dataset.notes ? (
                    <div dangerouslySetInnerHTML={{ __html: dataset.notes.replace(/\ng/, '<br/>') }} />
                  ) : 'No description provided.'}
                </div>
              </div>

              {/* Developer API */}
              <div className="bg-vigan-primaryDk rounded-lg p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Code2 size={100} />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2 flex items-center gap-2 relative z-10">
                  <Code2 className="text-emerald-300" size={20} /> Developer API Access
                </h3>
                <p className="text-white/70 text-sm mb-4 relative z-10">Use CKAN's Action API to programmatically interact with this dataset.</p>
                <div className="bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xs text-emerald-300 overflow-x-auto relative z-10">
                  curl {process.env.NEXT_PUBLIC_CKAN_URL || 'https://data.vigan.gov.ph'}/api/3/action/package_show?id={dataset.name}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Publisher */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-1 bg-vigan-primary"></div>
                <div className="p-6">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Agency</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg border border-vigan-border flex items-center justify-center text-2xl">
                      🏛️
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 leading-tight">{dataset.organization?.title || 'City Government'}</p>
                      <a href={`/organizations/${dataset.organization?.name}`} className="text-xs font-medium text-vigan-primary hover:underline mt-1 inline-block">
                        View Agency →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mx-6 mt-6 mb-4">Metadata</h3>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-gray-500 w-1/3">Release Date</th>
                      <td className="py-3 px-6 text-gray-900 font-medium">{formatDate(dataset.metadata_created)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-gray-500">Last Updated</th>
                      <td className="py-3 px-6 text-gray-900 font-medium">{formatDate(dataset.metadata_modified)}</td>
                    </tr>
                    <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-gray-500 flex items-start gap-1"><Scale size={14} className="mt-0.5"/> License</th>
                      <td className="py-3 px-6 text-gray-900">
                        {dataset.license_title ? (
                          <a href={dataset.license_url || '#'} target="_blank" rel="noopener noreferrer" className="text-vigan-primary hover:underline flex items-center gap-1">
                            {dataset.license_title} <ExternalLink size={10} />
                          </a>
                        ) : 'Open Data Commons'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-gray-500">Visibility</th>
                      <td className="py-3 px-6"><span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-[10px] uppercase">Public</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                 <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Keywords / Tags</h3>
                 {dataset.tags && dataset.tags.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                     {dataset.tags.map(t => (
                       <Link key={t.id} href={`/datasets?tags=${t.name}`} className="px-3 py-1.5 bg-emerald-50 border border-vigan-border rounded-md text-xs font-medium text-vigan-primary hover:bg-vigan-primary hover:text-white transition-colors">
                         {t.display_name}
                       </Link>
                     ))}
                   </div>
                 ) : (
                   <p className="text-sm text-gray-500">No tags applied.</p>
                 )}
              </div>

            </div>
          </div>
        </div>

      </div>
    )
  } catch (error) {
    console.error(error)
    return notFound()
  }
}
