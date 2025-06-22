import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import React, { ComponentPropsWithoutRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type CalendarWrapperProps = {
  field: string
  label: string
  divClass?: string
  labelClass?: string
  contentClass?: string
  divProps?: ComponentPropsWithoutRef<'div'>
  selectValueProps?: ComponentPropsWithoutRef<'input'>
}
export const CalendarWrapper = ({
  field,
  label,
  divClass,
  labelClass,
  // selectValueProps = {},
  ...divProps
}: CalendarWrapperProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <div className={cn('w-full', divClass)} {...divProps}>
      {label && <Label className={cn('my-2', labelClass)}>{label}</Label>}
      <Controller
        control={control}
        name={field}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground'
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {field.value ? format(field.value, 'PPP') : <span>select</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errors[field] && (
        <span className="text-sm text-red-500">
          {errors[field].message as string}
        </span>
      )}
    </div>
  )
}
