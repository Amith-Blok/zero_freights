/* eslint-disable react-hooks/exhaustive-deps */
import { useFormContext, useWatch } from 'react-hook-form'
import { WAREHOUSE_COUNTRIES_OPTION } from '@/constants/warehosue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { CountryCombobox } from '../_components/form-wrapper/country-combobox'
export const DestinationWarehouseForm = () => {
  const { control, setValue } = useFormContext()
  const [inputText, setInputText] = useState<string>('')
  const watchPickupLocation = useWatch({ control, name: 'pickup_location' })
  const text = watchPickupLocation?.port_name
    ? `Bloksupplychain Warehouse (${watchPickupLocation.port_code})`
    : watchPickupLocation?.description
      ? `Bloksupplychain Warehouse (${watchPickupLocation?.description})`
      : undefined

  const watchPickupLocationPort = watchPickupLocation?.port_name
  const watchPickupLocationDescription = watchPickupLocation?.description
  useEffect(() => {
    if (watchPickupLocationPort) {
      setValue('delivery_location', {
        port_code: watchPickupLocation.port_code,
        port_name: text,
      })
    }
    if (watchPickupLocationDescription) {
      setValue('delivery_location', {
        port_name: text,
        port_code: watchPickupLocation.place_id,
      })
    }
    if (text) setInputText(text)
  }, [text])
  return (
    <>
      <div className="mt-0 flex flex-col items-start gap-2 md:mt-12">
        <CountryCombobox
          field="country"
          label="Country"
          countries={WAREHOUSE_COUNTRIES_OPTION}
          divClass={`w-full`}
          labelClass="required"
        />

        <Label>Warehouse</Label>
        <Input
          value={inputText}
          placeholder="fill origin section first !"
          className={`placeholder:text-xm placeholder:text-muted-foreground ${inputText.length < 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          readOnly
        />
      </div>
    </>
  )
}
