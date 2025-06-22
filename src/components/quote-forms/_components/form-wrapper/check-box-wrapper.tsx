import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type CheckBoxWrapperProps = {
  field: string
  disable?: boolean
  label: string
  divClass?: string
  labelClass?: string
  divProps?: ComponentPropsWithoutRef<'div'>
}
export const CheckBoxWrapper = ({
  label,
  field,
  disable,
  divClass,
  labelClass,
  ...divProps
}: CheckBoxWrapperProps) => {
  const { control } = useFormContext()
  return (
    <div className={cn('flex items-center space-x-2', divClass)} {...divProps}>
      <Controller
        name={field}
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            disabled={disable}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Label className={cn('', labelClass)}>{label}</Label>
    </div>
  )
}
