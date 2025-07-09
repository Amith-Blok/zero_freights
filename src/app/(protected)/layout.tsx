import Footer from '@/components/Footer'
import Header from '@/components/New-Header'
import { Toaster } from '@/components/ui/toaster'
export default async function FormLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="absolute min-h-screen min-w-[100%] justify-center">
        <Header />
        {children}
        <Footer />
      </main>
      <Toaster />
    </>
  )
}
