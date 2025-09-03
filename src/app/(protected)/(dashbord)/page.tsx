import LinesSection from './_component/lines-section'
import QuickLinkSection from './_component/quick-link-section'
import ServiceSection from './_component/service-section'

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a mode of transport or warehouse service to continue.
        </p>
      </header>

      <ServiceSection />
      <QuickLinkSection />
      <LinesSection />
    </main>
  )
}
