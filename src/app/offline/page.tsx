'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Ship, Truck, WifiOff, RefreshCw, Plane } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="border-b pb-6 text-center">
          <div className="mx-auto mb-4 rounded-full bg-red-100 p-3">
            <WifiOff className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            You&apos;re Offline
          </CardTitle>
          <CardDescription className="text-slate-500">
            You&apos;re currently offline. Please check your internet connection
            to continue using the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-600"></p>

            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-blue-100 p-2">
                  <Ship className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-center text-xs text-slate-600">
                  Sea Freight
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-green-100 p-2">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-center text-xs text-slate-600">
                  Road Freight
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-purple-100 p-2">
                  <Plane className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-center text-xs text-slate-600">
                  Air Freight
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t pt-6">
          <Button
            className="w-full gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <div className="text-center text-xs text-slate-500">
            Some features may be available offline. Try accessing your
            <Link href="/dashboard" className="mx-1 font-medium text-primary">
              dashboard
            </Link>
            to view cached data.
          </div>
        </CardFooter>
      </Card>

      <footer className="mt-auto pt-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Your Freight Forwarding Company</p>
      </footer>
    </div>
  )
}
