import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package2 } from 'lucide-react'

export default function NotFound({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-8 text-2xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-center">
        <span className="inline-block pb-1 align-bottom">
          <Package2 size={18} />
        </span>{' '}
        {message ||
          'Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.'}
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
