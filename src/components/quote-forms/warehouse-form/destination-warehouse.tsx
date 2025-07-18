/* eslint-disable react-hooks/exhaustive-deps */
import { useFormContext, useWatch } from 'react-hook-form'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { COUNTRIES_LIST_WAREHOUSE } from '@/constants'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { SeaPortsType } from '@/models/sea-ports'
export const DestinationWarehouseForm = () => {
  const { watch, setValue, control } = useFormContext()
  // const watchMode = watch('modes');
  const watchCountry = watch('country')
  const watchPlaceId = useWatch({ control, name: 'pickup_location.place_id' })
  // console.log({ watchPlaceId })
  return (
    <>
      <div className="mt-0 flex flex-col items-start gap-2 md:mt-12">
        <SelectWrapper
          label="Country"
          field="country"
          data={COUNTRIES_LIST_WAREHOUSE}
          divClass={`w-full`}
        />

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
        />
      </div>
    </>
  )
}
