import CKANFrame from '@/components/ckan/CKANFrame'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

function buildQuery(searchParams: PageProps['searchParams']) {
  const next = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string' && value.length > 0) {
      next.set(key, value)
    }
  }

  const query = next.toString()
  return query ? `?${query}` : ''
}

export default function DatasetsPage({ searchParams }: PageProps) {
  return <CKANFrame src={`/dataset${buildQuery(searchParams)}`} title="CKAN datasets" />
}
