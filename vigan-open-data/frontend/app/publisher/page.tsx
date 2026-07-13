import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function PublisherPage() {
  redirect('/login-access?next=/api/ckan-proxy/user/login')
}