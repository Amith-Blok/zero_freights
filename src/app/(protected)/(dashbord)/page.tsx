import { getUser } from '@/lib/user'
import LinesSection from './_component/lines-section'
// import QuickLinkSection from './_component/quick-link-section'
import ServiceSection from './_component/service-section'
import Greeting from './_component/greeting'
import { redirect } from 'next/navigation'
import { LOGIN_ROUTE } from '@/routes'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) {
    redirect(LOGIN_ROUTE)
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-8 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center gap-2">
              <Greeting />
            </div>
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Welcome back, {user.name?.split(' ')[0] || user.name}!
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600">
              Your logistics command center is ready. Select a transport mode or
              warehouse service below to manage your shipments, track
              deliveries, and optimize your supply chain.
            </p>
          </div>
        </div>
      </header>

      <ServiceSection />
      {/* <QuickLinkSection /> */}
      <LinesSection />
    </main>
  )
}
