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
import { QUICK_LINKS } from '@/constants/dashbord'

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
