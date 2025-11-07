import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import React from 'react'

export default function JsonDataTableComp({
  fields,
  productLabel,
}: {
  fields: any
  productLabel: string
}) {
  const entries = Object.entries(fields)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`View ${productLabel} details`}
        >
          View details
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-2xl flex-col overflow-y-auto rounded-xl p-4 sm:w-[90vw] sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-pretty">
            {productLabel} details
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3">
          <dl className="grid grid-cols-1 gap-5">
            {entries.map((s) => (
              <div key={s[0]} className="grid grid-cols-3 gap-2">
                <dt className="col-span-1 text-sm text-muted-foreground">
                  {s[0]}
                </dt>
                <dd className="col-span-2 text-sm">
                  {JSON.stringify(s[1], null, 2)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  )
}
