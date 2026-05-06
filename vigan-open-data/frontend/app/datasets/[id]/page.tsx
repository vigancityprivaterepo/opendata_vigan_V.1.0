import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ckanAPI } from '@/lib/ckan'
import { truncate, formatDate, formatFileSize, getFormatColor, getResourceDownloadURL } from '@/lib/utils'
import CSVPreview from '@/components/datasets/CSVPreview'
import DownloadButton from '@/components/datasets/DownloadButton'
import { FileText, Building2, Calendar, Scale, Code2, Link as LinkIcon, Database, ExternalLink } from 'lucide-react'

export const revalidate = 60 // ISR

export default async function DatasetDetailPage({ params }: { params: { id: string } }) {
  try {
    const dataset = await ckanAPI.getDataset(params.id)
    if (!dataset) return notFound()

    const primaryResource = dataset.resources?.[0]
    const format = primaryResource?.format || 'DATA'
    const hasPreview = format.toUpperCase() === 'CSV'

    return (
      <div className="bg-vigan-gray-50 min-h-screen pb-20">
        
        {/* Breadcrumb Layer */}
        <div className="bg-white border-b border-vigan-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-sm text-vigan-muted flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-vigan-primary">Home</Link>
            <span>/</span>
            <Link href="/datasets" className="hover:text-vigan-primary">Datasets</Link>
            <span>/</span>
            <span className="text-vigan-text font-medium truncate">{dataset.title || dataset.name}</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-vigan-primary text-white border-b-4 border-vigan-gold pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/10 border border-white/20`}>
                    {dataset.organization?.title || 'Vigan City'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white text-vigan-primary`}>
                    {format}
                  </span>
                  {dataset.license_title && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-vigan-secondary/30 text-vigan-light">
                      <Scale size={13} /> {dataset.license_title}
                    </span>
                  )}
                </div>
                
                <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {dataset.title || dataset.name}
                </h1>
                
                <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
                  {truncate(dataset.notes, 250)}
                </p>
              </div>

              {/* Main Action Area */}
              {primaryResource && (
                <div className="bg-vigan-primaryDk p-6 rounded-xl border border-white/10 w-full md:w-80 flex-shrink-0 shadow-lg">
                  <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-2">Primary File</p>
                  <p className="font-semibold text-white mb-1 truncate" title={primaryResource.name || 'Resource'}>
                    {primaryResource.name || `${(dataset.title || dataset.name)} Data`}
                  </p>
                  <p className="text-sm text-vigan-gold mb-6">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Tab Navigation (Visual only for now context) */}
              <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-vigan-border/50 max-w-fit">
                <button className="px-5 py-2.5 bg-vigan-light text-vigan-primary font-semibold rounded-lg text-sm transition-colors">Resources</button>
                <button className="px-5 py-2.5 text-vigan-muted hover:text-vigan-text font-medium rounded-lg text-sm transition-colors">Metadata</button>
              </div>

              {/* Resources List */}
              <div className="bg-white rounded-xl shadow-sm border border-vigan-border/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-vigan-gray-100 bg-vigan-gray-50 flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-vigan-text flex items-center gap-2">
                    <Database className="text-vigan-primary" size={20} />
                    Data & Resources
                  </h3>
                  <span className="text-sm text-vigan-muted font-medium bg-white px-3 py-1 rounded-full border border-vigan-gray-200">
                    {dataset.resources?.length || 0} Files
                  </span>
                </div>
                
                <div className="divide-y divide-vigan-gray-100">
                  {dataset.resources?.map((res, i) => (
                    <div key={res.id} className="p-6 hover:bg-vigan-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="font-bold text-vigan-text text-base truncate">{res.name || `Data Resource ${i + 1}`}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getFormatColor(res.format)}`}>
                              {res.format || 'DATA'}
                            </span>
                          </div>
                          {res.description && <p className="text-sm text-vigan-muted mb-3">{res.description}</p>}
                          <div className="flex flex-wrap gap-4 text-xs text-vigan-muted">
                            <span className="flex items-center gap-1.5"><Calendar size={13}/> Updated {formatDate(res.last_modified || res.created)}</span>
                            {res.size && <span className="flex items-center gap-1.5"><FileText size={13}/> {formatFileSize(res.size)}</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                          <a href={getResourceDownloadURL(res.url)} target="_blank" rel="noopener noreferrer" className="btn-outline w-full justify-center">
                            <Download size={14} /> Download
                          </a>
                        </div>
                      </div>

                      {/* Preview for CSV (only show for first resource to save space) */}
                      {hasPreview && i === 0 && res.format?.toUpperCase() === 'CSV' && (
                        <div className="mt-6 border border-vigan-border rounded-xl p-4 bg-white">
                          <h5 className="text-sm font-semibold text-vigan-text mb-3 flex items-center gap-2 before:content-[''] before:block before:w-2 before:h-2 before:bg-vigan-secondary before:rounded-full">
                            Data Preview
                          </h5>
                          <CSVPreview resource={res} />
                        </div>
                      )}
                    </div>
                  ))}
                  {(!dataset.resources || dataset.resources.length === 0) && (
                    <div className="p-10 text-center text-vigan-muted">
                      No files are currently attached to this dataset.
                    </div>
                  )}
                </div>
              </div>

              {/* Description Full */}
              <div className="bg-white rounded-xl shadow-sm border border-vigan-border/50 p-6">
                <h3 className="font-display font-bold text-lg text-vigan-text mb-4 border-b border-vigan-gray-100 pb-3">
                  About this Dataset
                </h3>
                <div className="prose prose-sm prose-vigan max-w-none text-vigan-text/90">
                  {dataset.notes ? (
                    <div dangerouslySetInnerHTML={{ __html: dataset.notes.replace(/\ng/, '<br/>') }} />
                  ) : 'No description provided.'}
                </div>
              </div>

              {/* Developer API Setup */}
              <div className="bg-gradient-to-br from-black to-vigan-primaryDk rounded-xl shadow-lg border border-vigan-gold/30 p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Code2 size={100} />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 flex items-center gap-2 relative z-10">
                  <Code2 className="text-vigan-gold" size={20} /> Developer API Access
                </h3>
                <p className="text-white/70 text-sm mb-4 relative z-10">Use CKAN's Action API to programmatically interact with this dataset's metadata.</p>
                <div className="bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto relative z-10">
                  curl {process.env.NEXT_PUBLIC_CKAN_URL || 'https://data.vigan.gov.ph'}/api/3/action/package_show?id={dataset.name}
                </div>
              </div>

            </div>

            {/* Sidebar Metadata */}
            <div className="space-y-6">
              
              {/* Publisher Info */}
              <div className="bg-white rounded-xl shadow-sm border border-vigan-border/50 overflow-hidden">
                <div className="h-1 bg-vigan-primary"></div>
                <div className="p-6">
                  <h3 className="text-xs font-bold text-vigan-text uppercase tracking-widest mb-4">Department</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-vigan-bg rounded-lg border border-vigan-border flex items-center justify-center text-2xl">
                      🏛️
                    </div>
                    <div>
                      <p className="font-bold text-vigan-text leading-tight">{dataset.organization?.title || 'City Government'}</p>
                      <a href={`/organizations/${dataset.organization?.name}`} className="text-xs font-semibold text-vigan-accent hover:text-vigan-primary mt-1 inline-block">
                        View Organization →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Table */}
              <div className="bg-white rounded-xl shadow-sm border border-vigan-border/50 overflow-hidden">
                <h3 className="text-xs font-bold text-vigan-text uppercase tracking-widest mx-6 mt-6 mb-4">Metadata</h3>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-vigan-gray-100">
                    <tr className="bg-vigan-gray-50/50 hover:bg-vigan-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-vigan-muted w-1/3">Release Date</th>
                      <td className="py-3 px-6 text-vigan-text font-semibold">{formatDate(dataset.metadata_created)}</td>
                    </tr>
                    <tr className="hover:bg-vigan-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-vigan-muted">Last Updated</th>
                      <td className="py-3 px-6 text-vigan-text font-semibold">{formatDate(dataset.metadata_modified)}</td>
                    </tr>
                    <tr className="bg-vigan-gray-50/50 hover:bg-vigan-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-vigan-muted flex items-start gap-1"><Scale size={14} className="mt-0.5"/> License</th>
                      <td className="py-3 px-6 text-vigan-text">
                        {dataset.license_title ? (
                          <a href={dataset.license_url || '#'} target="_blank" rel="noopener noreferrer" className="text-vigan-accent hover:underline flex items-center gap-1">
                            {dataset.license_title} <ExternalLink size={10} />
                          </a>
                        ) : 'Open Data Commons'}
                      </td>
                    </tr>
                    <tr className="hover:bg-vigan-gray-50 transition-colors">
                      <th className="py-3 px-6 text-left font-medium text-vigan-muted">Visibility</th>
                      <td className="py-3 px-6"><span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold text-[10px] uppercase">Public</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl shadow-sm border border-vigan-border/50 p-6">
                 <h3 className="text-xs font-bold text-vigan-text uppercase tracking-widest mb-4">Keywords / Tags</h3>
                 {dataset.tags && dataset.tags.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                     {dataset.tags.map(t => (
                       <Link key={t.id} href={`/datasets?tags=${t.name}`} className="px-3 py-1.5 bg-vigan-bg border border-vigan-border rounded-lg text-xs font-semibold text-vigan-primary hover:bg-vigan-primary hover:text-white transition-colors">
                         {t.display_name}
                       </Link>
                     ))}
                   </div>
                 ) : (
                   <p className="text-sm text-vigan-muted">No tags applied.</p>
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
