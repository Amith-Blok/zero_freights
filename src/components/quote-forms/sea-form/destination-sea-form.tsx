import React from 'react'
import { CheckBoxWrapper } from '../_components/form-wrapper/check-box-wrapper'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { useFormContext, useWatch } from 'react-hook-form'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { SeaPortsType } from '@/models/sea-ports'
import { FilteredCombobox } from '../_components/filtered-combobox'
import { PredictionWithZipcode } from '@/types/google'
import { COUNTRIES_SEA_FCL_LCL_LIST } from '@/constants'

export const DestinationSeaForm = () => {
  const { watch, setValue, control } = useFormContext()

  const watchMode = watch('modes')
  const watchPick = watch('delivery_check')
  const watchPlaceId = useWatch({ control, name: 'delivery_location.place_id' })
  const watchDesCountry = useWatch({ control, name: 'des_country' })
  const watchDesPortRail = useWatch({ control, name: 'des_port_rail' })
  const { port_code: watchCode, type: watchType } = watchDesPortRail ?? {}

  return (
    <>
      <CheckBoxWrapper
        label="Do you want delivery trucking service?"
        field="delivery_check"
        disable={watchMode == 'LCL'}
      />
      <div className="mt-5 flex flex-col items-start justify-between gap-2 md:flex-row">
        <SelectWrapper
          label="Country"
          field="des_country"
          labelClass="required"
          defaulValue="US"
          data={COUNTRIES_SEA_FCL_LCL_LIST}
          divClass={`w-full ${watchPick && 'md:w-1/3'} `}
        />

        {watchPick && (
          <FilteredCombobox<PredictionWithZipcode>
            label="Delivery Location"
            getOptionLabel={(option) => option.description}
            fieldName="delivery_location"
            placeHolder="Enter pincode or address"
            fetchUrl={`/api/autos/google?country=${watchDesCountry}`}
            valueSetterCallback={(location) => {
              setValue('delivery_location', {
                description: location.description,
                place_id: location.place_id,
                zipcode: location.zipcode,
              })
            }}
          />
        )}
      </div>
      <AllDataCombobox<SeaPortsType>
        key={`$${watchDesCountry}-${watchPlaceId}`}
        resetString={`$${watchDesCountry}-${watchPlaceId}}`}
        label={
          watchMode == 'LCL'
            ? `${watchPick ? 'Nearest ' : ''}Port`
            : `${watchPick ? 'Nearest ' : ''}Port | Inland Port`
        }
        placeHolder="Enter port name or port code"
        fieldName="des_port_rail"
        labelClass="required"
        fetchUrl={`/api/autos/sea-ports?country=${watchDesCountry}&place_id=${watchPlaceId ?? ''}&mode=${watchMode}`}
        getOptionLabel={(option) => `${option.port_name}-(${option.port_code})`}
        valueSetterCallback={(port) => {
          const { port_name, port_code, location, port_type } = port
          setValue('des_port_rail', {
            port_name,
            port_code,
            type: port_type,
            lat: location?.coordinates[1],
            lng: location?.coordinates[0],
          })
        }}
      />

      {watchType == 'RAIL' && watchDesCountry == 'IN' && (
        <AllDataCombobox<SeaPortsType>
          key={`${watchMode}-${watchDesCountry}-${watchCode}`}
          resetString={`${watchMode}-${watchDesCountry}-${watchCode}`}
          label="Detination Port"
          placeHolder="Enter port name or port code"
          fieldName="des_port_if_rail"
          fetchUrl={`/api/autos/sea-ports/near?country=${watchDesCountry}&haulage=EXPORT&port=${watchCode}`}
          getOptionLabel={(option) =>
            `${option.port_name}-(${option.port_code})`
          }
          valueSetterCallback={(port) => {
            const { port_name, port_code } = port
            setValue('des_port_if_rail', {
              port_name: port_name,
              port_code: port_code,
            })
          }}
        />
      )}
    </>
  )
}
