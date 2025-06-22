import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SelectDataType } from '@/types/global'
import { ComponentPropsWithoutRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type SelectWrapperProps = {
  data: SelectDataType
  label?: string
  field: string
  defaulValue?: string

  divClass?: string
  labelClass?: string
  contentClass?: string
  divProps?: ComponentPropsWithoutRef<'div'>
  selectValueProps?: ComponentPropsWithoutRef<'input'>
}
export const SelectWrapper = ({
  field,
  label,
  data,
  defaulValue,
  divClass,
  labelClass,
  contentClass,
  selectValueProps = { placeholder: 'select' },
  ...divProps
}: SelectWrapperProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <div className={cn('w-full', divClass)} {...divProps}>
      {label && <Label className={cn('my-2', labelClass)}>{label}</Label>}
      <Controller
        name={field}
        defaultValue={data[0].value}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            defaultValue={defaulValue ? defaulValue : data[0].value}
            autoComplete="new-password"
          >
            <SelectTrigger>
              <SelectValue {...selectValueProps} />
            </SelectTrigger>
            <SelectContent className={cn('', contentClass)}>
              <ScrollArea type="always" className="max-h-72">
                {data.map((x, idx) => (
                  <SelectItem key={idx} value={x.value} disabled={x.disable}>
                    {x.label}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
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
