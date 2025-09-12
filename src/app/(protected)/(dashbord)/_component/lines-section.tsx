import { LogoTicker } from '@/components/shared/logo-ticker'
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import { SHIPPING_LINES } from '@/constants/dashbord'
import React from 'react'

export default function LinesSection() {
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
            items={SHIPPING_LINES}
            speed={35}
          />
        </CardContent>
      </Card>
    </section>
  )
}
