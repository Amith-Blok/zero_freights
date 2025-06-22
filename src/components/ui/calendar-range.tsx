'use client'

import React from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Controller, useFormContext } from 'react-hook-form'

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className={cn('grid gap-2', className)}>
      <Controller
        control={control}
        name="storage_date"
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[300px] justify-start text-left font-normal lg:w-full',
                  !field.value && 'text-muted-foreground'
                )}
              >
                <FaCalendarAlt className="mr-2 h-4 w-4" />
                {field.value?.from ? (
                  field.value.to ? (
                    <>
                      {format(field.value.from, 'LLL dd, y')} -
                      {format(field.value.to, 'LLL dd, y')}
                      <p>
                        (
                        <span>
                          {Math.round(
                            Math.abs(
                              (field.value.from.getTime() -
                                field.value.to.getTime()) /
                                86400000
                            )
                          )}
                          &nbsp;
                        </span>
                        days)
                      </p>
                    </>
                  ) : (
                    format(field.value.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={field.value.from}
                selected={{ from: field.value.from, to: field.value.to }}
                onSelect={field.onChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errors.storage_date && (
        <span className="text-sm text-red-500">
          {errors.storage_date.message as string}
        </span>
      )}
    </div>
  )
}
