import React from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const QUICK_LINKS = [
  { href: '/get-rates?mode=SEA', label: 'FCL' },
  { href: '/get-rates?mode=SEA', label: 'LCL' },
  { href: '/get-rates?mode=AIR', label: 'Air Freight' },
  { href: '/get-rates?mode=LAND', label: 'Seaport Trucking' },
  { href: '/get-rates?mode=LAND', label: 'Domestic Trucking' },
  { href: '/get-rates?mode=LAND', label: 'Airport Trucking' },
  { href: '/get-rates?mode=WAR', label: 'FCL Warehouse' },
  { href: '/get-rates?mode=WAR', label: 'LTL Warehouse' },
  { href: '/get-rates?mode=WAR', label: 'Airport Warehouse Costing' },
]

export default function QuickLinkSection() {
  return (
    <section className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Links</CardTitle>
          <CardDescription>Jump straight to popular flows</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((link, index) => (
            <Link key={index} href={link.href}>
              <Badge
                variant="secondary"
                className="cursor-pointer border-green-100 text-green-700 hover:bg-secondary/80"
              >
                {link.label}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
