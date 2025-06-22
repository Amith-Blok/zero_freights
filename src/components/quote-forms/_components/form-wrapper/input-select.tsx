import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef } from 'react'

type InputSelectComboProps = {
  label: string
  inputField: string
  selectField: string
  defaultSelectValue?: string
  isInputValueAsNumber?: boolean
  data: string[]
  divClass?: string
  inputClass?: string
  labelClass?: string
  selectDivClass?: string
  errorClass?: string
  inputProps: ComponentPropsWithoutRef<'input'>
} & ComponentPropsWithoutRef<'div'>

export const InputSelect = ({
  label,
  inputField,
  selectField,
  data,
  divClass,
  selectDivClass,
  labelClass,
  inputClass,
  errorClass,
  defaultSelectValue,
  isInputValueAsNumber = false,
  inputProps = {},
  ...divProps
}: InputSelectComboProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()
  const inputError = errors[inputField]
  const UnitError = errors[selectField]
  return (
    <div className={cn('w-full', divClass)} {...divProps}>
      <Label className={cn('required mb-2', labelClass)}>{label}</Label>
      <div className="relative w-full max-w-[400px]">
        <Input
          className={cn(
            'no-spin-buttons w-full rounded-md text-sm shadow-sm',
            inputClass
          )}
          {...register(inputField, { valueAsNumber: isInputValueAsNumber })}
          {...inputProps}
        />
        <div
          className={cn(
            'absolute inset-y-0 right-0 z-20 flex w-fit items-end',
            selectDivClass
          )}
        >
          <Controller
            name={selectField}
            control={control}
            defaultValue={defaultSelectValue ?? data[0]}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-l-none">
                  {/* //TODO: make class name in future */}
                  <SelectValue className="text-sm" />
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
      {(inputError || UnitError) && (
        <span className={cn('text-sm text-red-500', errorClass)}>
          {inputError
            ? (inputError?.message as string)
            : (UnitError?.message as string)}
        </span>
      )}
    </div>
  )
}
