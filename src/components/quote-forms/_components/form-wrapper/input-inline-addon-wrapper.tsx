import { ComponentPropsWithoutRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Controller, useFormContext } from 'react-hook-form'
type InputInlineAddonWrapperProp = {
  field: string
  isInputValueAsNumber?: boolean
  label?: string
  divClass?: string
  labelClass?: string
  inputClass?: string
  errorClass?: string
  inputProps?: ComponentPropsWithoutRef<'input'>
  addonFront?: string
  addonBack?: string
  addonBackClass?: string
  addonFrontClass?: string
} & ComponentPropsWithoutRef<'div'>
export default function InputInlineAddonWrapper({
  field,
  isInputValueAsNumber,
  label,
  divClass,
  labelClass,
  inputClass,
  errorClass,
  inputProps = {},
  addonFront,
  addonBack,
  addonBackClass,
  addonFrontClass,
  ...divProps
}: InputInlineAddonWrapperProp) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <div className={cn('*:not-first:mt-2', divClass)} {...divProps}>
      {label && (
        <Label className={cn('required mb-2', labelClass)}>{label}</Label>
      )}
      <div className="relative">
        <Controller
          name={field}
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <Input
              className={cn('peer pe-12 ps-6', inputClass)}
              placeholder="0.00"
              type="text"
              {...inputProps}
              value={value || ''}
              onChange={(e) => {
                onChange(
                  isInputValueAsNumber ? +e.target.value : e.target.value
                )
              }}
              ref={ref}
            />
          )}
        />
        {addonFront && (
          <span
            className={cn(
              'pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50',
              addonFrontClass
            )}
          >
            {addonFront}
          </span>
        )}
        {addonBack && (
          <span
            className={cn(
              'pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50',
              addonBackClass
            )}
          >
            {addonBack}
          </span>
        )}
      </div>
      {errors[field] && (
        <span className={cn('text-sm text-red-500', errorClass)}>
          {errors[field].message as string}
        </span>
      )}
    </div>
  )
}
