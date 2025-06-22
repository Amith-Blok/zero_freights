import Header from '@/components/New-Header'
import { Toaster } from '@/components/ui/toaster'
export default async function FormLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="absolute min-h-screen min-w-[100%] justify-center">
        {/* <Image */}
        {/*   src="/layout_bg.jpg" */}
        {/*   fill */}
        {/*   alt="layout_bg" */}
        {/*   className="relative -z-10" */}
        {/* /> */}
        {children}
      </main>
      <Toaster />
    </>
  )
}
