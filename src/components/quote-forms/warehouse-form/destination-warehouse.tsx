/* eslint-disable react-hooks/exhaustive-deps */
import { useFormContext, useWatch } from 'react-hook-form'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { WAREHOUSE_COUNTRIES_OPTION } from '@/constants/warehosue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
export const DestinationWarehouseForm = () => {
  const { control, setValue } = useFormContext()
  const [inputText, setInputText] = useState<string>('')
  // const watchMode = watch('modes');
  const watchPickupLocation = useWatch({ control, name: 'pickup_location' })
  // const watchPlaceId = useWatch({ control, name: 'pickup_location.place_id' })
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
        <SelectWrapper
          label="Country"
          field="country"
          data={WAREHOUSE_COUNTRIES_OPTION}
          divClass={`w-full`}
        />
        {/* 
        <AllDataCombobox<SeaPortsType & { place_id: string }>
          key={`${watchPlaceId}-${watchCountry}`}
          label="Delivery Warehouse"
          placeHolder="Pick a warehouse (14 options)"
          fieldName="delivery_location"
          labelClass="required"
          fetchUrl={`/api/autos/warehouse?country=${watchCountry}&place_id=${watchPlaceId}`}
          getOptionLabel={(option) =>
            `${option.port_name}-(${option.port_code})`
          }
          valueSetterCallback={(port) => {
            const { port_name, port_code, place_id } = port
            setValue('delivery_location', {
              port_name,
              port_code,
              place_id,
            })
          }}
        /> */}
        <Label>Warehouse</Label>
        <Input
          value={inputText}
          placeholder="fill origin section first"
          className="placeholder:text-xs placeholder:text-red-600"
          readOnly
        />
      </div>
    </>
  )
}
