import * as RPNInput from 'react-phone-number-input'
import { CountrySelect, FlagComponent, PhoneInput } from './phone-input'
import { Label } from '../ui/label'
import { Controller, useFormContext } from 'react-hook-form'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface PhoneInputWrapperProps {
  fieldName: string // Field name for React Hook Form
  label?: string // Optional label
  defaultCountry?: RPNInput.Country // Default country for phone input
  divClass?: string
  labelClass?: string
  divProps?: ComponentProps<'div'>
  labelProps?: ComponentProps<'label'>
}

export default function PhoneInputWrapper({
  fieldName,
  label = 'Phone number',
  defaultCountry = 'IN',
  divClass,
  labelClass,
  labelProps = {},
  divProps = {},
}: PhoneInputWrapperProps) {
  const { control } = useFormContext() // Use FormContext to access control

  return (
    <div className={cn('space-y-2', divClass)} {...divProps}>
      {label && (
        <Label className={cn('', labelClass)} {...labelProps}>
          {label}
        </Label>
      )}
      <Controller
        name={fieldName}
        control={control}
        defaultValue=""
        render={({
          field: { onChange, value, ref },
          fieldState: { error },
        }) => (
          <>
            <RPNInput.default
              className="flex rounded-lg shadow-sm shadow-black/5"
              international
              flagComponent={FlagComponent}
              countrySelectComponent={CountrySelect}
              defaultCountry={defaultCountry}
              countryCallingCodeEditable={false}
              inputComponent={PhoneInput}
              id={`input-${fieldName}`}
              placeholder="Enter phone number"
              value={value}
              onChange={(newValue) => onChange(newValue ?? '')}
              ref={ref}
            />
            {error && (
              <span className="text-sm text-red-500">{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  )
}
