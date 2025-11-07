'use client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
export default function PopoverDataTableComp(params: {
  content: string
  shortContentLength: number
  size: number
}) {
  const content = params.content ?? ''
  const isLenghtOkay = content.length <= params.shortContentLength
  const processedContent =
    typeof content !== 'string' ? JSON.stringify(content, null, 2) : content
  const [open, setOpen] = useState(false)
  const canOpen = !isLenghtOkay

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (canOpen) setOpen(next)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex h-full w-full cursor-text select-text justify-start hover:bg-transparent"
        >
          <span
            className="block min-w-0 select-text truncate"
            style={{ maxWidth: `${params.shortContentLength}ch` }}
          >
            {content}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="h-fit w-fit p-0"
        side="bottom"
        sideOffset={-50}
        align="start"
        alignOffset={-10}
      >
        <Textarea
          className="min-h-[100px] min-w-[300px] resize p-2 text-sm"
          readOnly
          value={processedContent}
        />
      </PopoverContent>
    </Popover>
  )
}
