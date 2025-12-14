import { getUser } from '@/lib/user'
import { TrackingSearch } from './_components/tracking-search'
import { redirect } from 'next/navigation'

export default async function TrackingPage() {
  const dbUser = await getUser()
  if (!dbUser) {
    redirect('/login')
  }
  return <TrackingSearch userId={dbUser.id} />
}
