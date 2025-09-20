'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: MultiSelectOption[]
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  className?: string
  'aria-label'?: string
}

export default function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  className,
  'aria-label': ariaLabel = 'Multi select',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  function toggle(optionValue: string) {
    const isSelected = value.includes(optionValue)
    const next = isSelected
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(next)
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation()
    onChange([])
  }

  const selectedOptions = options.filter((o) => value.includes(o.value))

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-label={ariaLabel}
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              selectedOptions.length === 0 && 'text-muted-foreground'
            )}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selectedOptions.length ? (
                selectedOptions.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="flex items-center text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle(opt.value)
                    }}
                  >
                    {opt.label}
                    <X className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">{'Remove ' + opt.label}</span>
                  </Badge>
                ))
              ) : (
                <span className="text-sm font-normal text-zinc-400">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronsUpDown
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command>
            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
              <CommandInput placeholder="Search..." />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={clearAll}
                disabled={value.length === 0}
              >
                Clear
              </Button>
            </div>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = value.includes(opt.value)
                  return (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => toggle(opt.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50'
                        )}
                        aria-hidden="true"
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{opt.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
