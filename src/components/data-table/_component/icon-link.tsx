import { ExternalLink } from 'lucide-react'
import React from 'react'
import Link, { LinkProps } from 'next/link'

export default function IconLink(params: {
  label: string
  href: LinkProps<any>['href']
}) {
  return (
    <Link
      href={params.href}
      className="h-fit w-fit p-0 font-normal hover:underline"
    >
      <div className="flex w-full items-center justify-between">
        <p className="min-w-0 max-w-[200px] truncate">{params.label}</p>
        <ExternalLink className="ml-1 h-4 w-4" />
      </div>
    </Link>
  )
}
