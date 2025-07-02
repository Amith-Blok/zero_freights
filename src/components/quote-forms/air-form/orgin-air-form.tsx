import React, { useMemo } from 'react'
import { CheckBoxWrapper } from '../_components/form-wrapper/check-box-wrapper'
import { FilteredCombobox } from '../_components/filtered-combobox'
// import { COUNTRIES_LIST } from '@/constants'
import { Prediction } from '@/types/google'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { useFormContext, useWatch } from 'react-hook-form'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { AirPortsType } from '@/models/air-ports'
export const OriginAirForm = () => {
  const { watch, setValue, control } = useFormContext()

  const watchPick = watch('pickup_check') as boolean
  const watchOriCountry = useWatch({ control, name: 'ori_country' }) as string
  const watchPlaceId = useWatch({
    control,
    name: 'pickup_location.place_id',
  }) as string
  const resetString = useMemo(() => {
    return `${watchOriCountry}-${watchPlaceId}`
  }, [watchOriCountry, watchPlaceId])

  return (
    <>
      <CheckBoxWrapper
        label="Do you want pick up trucking service?"
        field="pickup_check"
      />
      <div className="mt-5 flex flex-col items-center gap-2 md:flex-row">
        <SelectWrapper
          label="Country"
          field="ori_country"
          data={[{ label: 'IND', value: 'IN' }]}
          divClass={`w-full ${watchPick && 'md:w-1/3'} `}
        />

        {watchPick && (
          <FilteredCombobox<Prediction>
            label="Pickup Location"
            placeHolder="pincode or address"
            fieldName="pickup_location"
            getOptionLabel={(option) => option.description}
            fetchUrl={`/api/autos/google?country=${watchOriCountry}`}
            valueSetterCallback={(location) => {
              setValue('pickup_location', {
                description: location.description,
                place_id: location.place_id,
              })
            }}
          />
        )}
      </div>
      <AllDataCombobox<AirPortsType>
        key={resetString}
        resetString={resetString}
        label="Airport"
        placeHolder="Airport name or Airport code"
        fieldName="ori_airport"
        fetchUrl={`/api/autos/air-ports?country=${watchOriCountry}&place_id=${watchPlaceId}`}
        getOptionLabel={(option) => `${option.port_name}-(${option.port_code})`}
        valueSetterCallback={(port) => {
          const { port_name, port_code, location, port_type } = port
          setValue('ori_airport', {
            port_name: port_name,
            port_code,
            type: port_type,
            lat: location?.coordinates[1],
            lng: location?.coordinates[0],
          })
        }}
      />
    </>
  )
}
