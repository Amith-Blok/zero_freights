'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

type InputWrapperProp = {
  field: string
  isInputValueAsNumber?: boolean
  label?: string
  divClass?: string
  labelClass?: string
  inputClass?: string
  errorClass?: string
  inputProps?: ComponentPropsWithoutRef<'input'>
} & ComponentPropsWithoutRef<'div'>

export const InputWrapper = ({
  field,
  isInputValueAsNumber,
  label,
  divClass,
  labelClass,
  inputClass,
  errorClass,
  inputProps = {},
  ...divProps
}: InputWrapperProp) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className={cn('w-full', divClass)} {...divProps}>
      {label && (
        <Label className={cn('required mb-2', labelClass)}>{label}</Label>
      )}
      <Controller
        name={field}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Input
            className={cn('w-full placeholder:text-sm', inputClass)}
            {...inputProps}
            value={value || ''}
            onChange={(e) => {
              onChange(isInputValueAsNumber ? +e.target.value : e.target.value)
            }}
            ref={ref}
          />
        )}
      />
      {errors[field] && (
        <span className={cn('text-sm text-red-500', errorClass)}>
          {errors[field].message as string}
        </span>
      )}
    </div>
  )
}
