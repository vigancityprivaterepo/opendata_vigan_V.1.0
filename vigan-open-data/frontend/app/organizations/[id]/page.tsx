import CKANFrame from '@/components/ckan/CKANFrame'

export const dynamic = 'force-dynamic'

export default function OrganizationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <CKANFrame src={`/organization/${encodeURIComponent(params.id)}`} title={`CKAN organization ${params.id}`} />
}
