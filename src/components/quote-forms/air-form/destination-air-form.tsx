import React, { useEffect, useMemo } from 'react'
import { CheckBoxWrapper } from '../_components/form-wrapper/check-box-wrapper'
import { FilteredCombobox } from '../_components/filtered-combobox'
import { useFormContext, useWatch } from 'react-hook-form'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { AirPortsType } from '@/models/air-ports'
import { Prediction } from '@/types/google'
import { AIR_DESTINATION_COUNTRIES_OPTIONS } from '@/constants/air-form'
import { CountryCombobox } from '../_components/form-wrapper/country-combobox'

export const DestinationAirForm = () => {
  const { watch, setValue, resetField, control } = useFormContext()
  const watchDesPick = watch('delivery_check') as boolean
  useEffect(() => {
    if (!watchDesPick) {
      resetField('des_airport')
      resetField('delivery_location')
    }
  }, [watchDesPick, resetField])

  const watchDesCountry = useWatch({ control, name: 'des_country' }) as string
  const watchDesPlaceId = useWatch({
    control,
    name: 'delivery_location.place_id',
  }) as string
  const resetString = useMemo(() => {
    return `${watchDesCountry}-${watchDesPlaceId}-${watchDesPick}`
  }, [watchDesCountry, watchDesPlaceId, watchDesPick])

  const airportApi = watchDesPick
    ? `/api/autos/air-ports?country=${watchDesCountry}&place_id=${watchDesPlaceId}`
    : `/api/autos/air-ports/all?country=${watchDesCountry}`
  console.log({ airportApi })

  return (
    <>
      <CheckBoxWrapper
        label="Do you want pick up trucking service?"
        field="delivery_check"
      />
      <div className="mt-5 flex flex-col items-center gap-2 md:flex-row">
        <CountryCombobox
          field="des_country"
          label="Country"
          countries={AIR_DESTINATION_COUNTRIES_OPTIONS}
          divClass={`w-full ${watchDesPick && 'md:w-1/4'} `}
          labelClass="required"
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
        placeHolder="Enter airport name or code"
        fieldName="des_airport"
        fetchUrl={airportApi}
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
