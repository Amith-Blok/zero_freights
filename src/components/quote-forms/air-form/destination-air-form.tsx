import React, { useMemo } from 'react'
import { CheckBoxWrapper } from '../_components/form-wrapper/check-box-wrapper'
import { FilteredCombobox } from '../_components/filtered-combobox'
// import { COUNTRIES_LIST } from '@/constants'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { useFormContext, useWatch } from 'react-hook-form'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { AirPortsType } from '@/models/air-ports'
import { Prediction } from '@/types/google'

export const DestinationAirForm = () => {
  const { watch, setValue, control } = useFormContext()
  const watchDesPick = watch('delivery_check') as boolean
  const watchDesCountry = useWatch({ control, name: 'des_country' }) as string
  const watchDesPlaceId = useWatch({
    control,
    name: 'delivery_location.place_id',
  }) as string
  const resetString = useMemo(() => {
    return `${watchDesCountry}-${watchDesPlaceId}`
  }, [watchDesCountry, watchDesPlaceId])

  return (
    <>
      <CheckBoxWrapper
        label="Do you want pick up trucking service?"
        field="pickup_check"
        disable
      />
      <div className="mt-5 flex flex-col items-center gap-2 md:flex-row">
        <SelectWrapper
          label="Country"
          field="des_country"
          data={[{ value: 'US', label: 'US' }]}
          divClass={`w-full ${watchDesPick && 'md:w-1/3'} `}
        />

        {watchDesPick && (
          <FilteredCombobox<Prediction>
            label=" Location"
            placeHolder="pincode or address"
            fieldName="delivery_location"
            getOptionLabel={(option) => `${option.description}`}
            fetchUrl={`/api/autos/google?country=${watchDesCountry}`}
            valueSetterCallback={(location) => {
              setValue('delivery_location', {
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
        fieldName="des_airport"
        fetchUrl={`/api/autos/air-ports?country=${watchDesCountry}&place_id=${watchDesPlaceId}`}
        getOptionLabel={(option) => `${option.port_name}-(${option.port_code})`}
        valueSetterCallback={(port) => {
          const { port_name, port_code, location, port_type } = port
          setValue('des_airport', {
            port_name,
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
