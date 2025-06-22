export default async function QuoteLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="absolute min-h-screen min-w-[100%] justify-center bg-white">
        {children}
      </div>
    </>
  )
}
