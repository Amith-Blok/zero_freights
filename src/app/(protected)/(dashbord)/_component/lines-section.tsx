import { LogoTicker } from '@/components/shared/logo-ticker'
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import React from 'react'

export default function LinesSection() {
  const shippingLines = [
    { name: 'Hapag-Lloyd', src: '/lines/hapag-line.png' },
    { name: 'MSC', src: '/lines/msc-line.png' },
    { name: 'COSCO', src: '/lines/cosco-line.png' },
    { name: 'Maersk', src: '/lines/maersk-line.png' },
    { name: 'ONE', src: '/lines/one-line.png' },
    { name: 'HMM', src: '/lines/hmm-line.png' },
    { name: 'Evergreen', src: '/lines/evergreen-line.png' },
    { name: 'CMA CGM', src: '/lines/cma-line.png' },
  ]
  return (
    <section className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Collaborators — Shipping Lines
          </CardTitle>
          <CardDescription>Trusted ocean carriers we work with</CardDescription>
        </CardHeader>
        <CardContent>
          <LogoTicker
            ariaLabel="Shipping line collaborators"
            items={shippingLines}
            speed={35}
          />
        </CardContent>
      </Card>
    </section>
  )
}
