/* eslint-disable react-hooks/exhaustive-deps */
import { useFormContext, useWatch } from 'react-hook-form'
import { CheckBoxWrapper } from '../_components/form-wrapper/check-box-wrapper'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { COUNTRIES_LIST_WAREHOUSE } from '@/constants'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { SeaPortsType } from '@/models/sea-ports'
import { FilteredCombobox } from '../_components/filtered-combobox'
import { Prediction } from '@/types/google'
export const OriginWarehouseForm = () => {
  const { watch, setValue, control } = useFormContext()
  const watchMode = watch('modes')
  const watchGoogleCheck = watch('is_google_location')
  const watchCountry = useWatch({ control: control, name: 'country' })
  const airportLink = `/api/autos/air-ports/all?country=${watchCountry}`
  const seaportLink = `/api/autos/sea-ports?country=${watchCountry}`
  const googleLink = `/api/autos/google?country=${watchCountry}`
  const fetchUrl = watchMode === 'LTL_WAREHOUSE' ? airportLink : seaportLink
  return (
    <>
      <CheckBoxWrapper
        label="Zipcode or city name instead of port icd rail ramp input?"
        field="is_google_location"
        labelClass="font-normal"
      />
      <div className="mt-5 flex flex-col items-center gap-2 md:flex-row">
        <SelectWrapper
          label="Country"
          field="country"
          data={COUNTRIES_LIST_WAREHOUSE}
          divClass={`w-full md:w-1/3 `}
        />

        {watchGoogleCheck ? (
          <FilteredCombobox<Prediction>
            label="Pickup Location"
            placeHolder="pincode or address"
            fieldName="pickup_location"
            getOptionLabel={(option) => option.description}
            fetchUrl={googleLink}
            valueSetterCallback={(location) => {
              setValue('pickup_location', {
                description: location.description,
                place_id: location.place_id,
              })
            }}
          />
        ) : (
          <AllDataCombobox<SeaPortsType>
            key={`${watchMode}-${watchCountry}`}
            resetString={`${watchMode}-${watchCountry}`}
            label={
              watchMode == 'LTL_WAREHOUSE'
                ? 'Airport'
                : ' Port | ICD | Rail Ramp'
            }
            placeHolder="Port name or Port code"
            fieldName="pickup_location"
            fetchUrl={fetchUrl}
            getOptionLabel={(option) =>
              `${option.port_name}-(${option.port_code})`
            }
            valueSetterCallback={(port) => {
              const { port_name, port_code, place_id } = port
              setValue('pickup_location', {
                port_code,
                port_name,
                place_id,
              })
            }}
          />
        )}
      </div>
    </>
  )
}
