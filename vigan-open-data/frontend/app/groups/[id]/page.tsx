import CKANFrame from '@/components/ckan/CKANFrame'

export const dynamic = 'force-dynamic'

export default function GroupDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <CKANFrame src={`/dataset/groups/${encodeURIComponent(params.id)}`} title={`CKAN group ${params.id}`} />
}
