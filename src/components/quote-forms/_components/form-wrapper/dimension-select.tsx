'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type DimensionSelectProps = {
  label: string
  inputFieldOne: string
  inputFieldTwo: string
  inputFieldThree: string
  selectField: string
  defaultSelectValue?: string
  data: string[]
  divClass?: string
  labelClass?: string
  divProps?: ComponentPropsWithoutRef<'div'>
  commonInputProps?: ComponentPropsWithoutRef<'input'>
}
export const DimensionSelect = ({
  label,
  inputFieldOne,
  inputFieldTwo,
  inputFieldThree,
  selectField,
  defaultSelectValue,
  data,
  divClass,
  labelClass,
  divProps = {},
  commonInputProps = {},
}: DimensionSelectProps) => {
  const { register, control } = useFormContext()
  return (
    <div className={cn('mt-2 w-full', divClass)} {...divProps}>
      <Label className={cn('mb-2', labelClass)}>{label}</Label>
      <div className="max-w-[450px] rounded-md border shadow-sm">
        <div className="flex min-h-10 gap-0">
          <Input
            type="number"
            className="w-1/4 rounded-r-none border-y-0 border-l-0 px-2 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register(inputFieldOne, {
              valueAsNumber: true,
              required: true,
            })}
            {...commonInputProps}
            placeholder="l"
          />
          <Input
            type="number"
            className="w-1/4 rounded-r-none border-y-0 border-l-0 px-2 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register(inputFieldTwo, {
              valueAsNumber: true,
              required: true,
            })}
            {...commonInputProps}
            placeholder="h"
          />
          <Input
            type="number"
            className="w-1/4 rounded-r-none border-y-0 border-l-0 px-2 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register(inputFieldThree, {
              valueAsNumber: true,
              required: true,
            })}
            {...commonInputProps}
            placeholder="w"
          />

          <div className="relative w-1/4">
            <Controller
              name={selectField}
              control={control}
              defaultValue={defaultSelectValue ?? data[0]}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-l-none border-y-0 border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {data.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
