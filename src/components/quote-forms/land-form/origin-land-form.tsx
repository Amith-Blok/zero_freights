/* eslint-disable react-hooks/exhaustive-deps */
import { COUNTRIES_LAND_OPTIONS } from '@/constants'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { SeaPortsType } from '@/models/sea-ports'
import {
  FieldValues,
  useFormContext,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form'
import { PredictionWithZipcode } from '@/types/google'
import { FilteredCombobox } from '../_components/filtered-combobox'
import { AirPortsType } from '@/models/air-ports'
import { CountryCombobox } from '../_components/form-wrapper/country-combobox'
export const OriginLandForm = () => {
  const { control, setValue } = useFormContext()
  const watchMode = useWatch({ control, name: 'modes' })
  const watchCountry = useWatch({ control, name: 'country' })

  return (
    <>
      {watchMode == 'SEAPORT_TRUCKING' && (
        <SeaPortOriginForm
          watchCountry={watchCountry}
          watchMode={watchMode}
          setValue={setValue}
        />
      )}
      {watchMode == 'DOMESTIC_TRUCKING' && (
        <DomesticOriginForm watchCountry={watchCountry} setValue={setValue} />
      )}
      {watchMode == 'AIRPORT_TRUCKING' && (
        <AirportOriginForm
          watchCountry={watchCountry}
          watchMode={watchMode}
          setValue={setValue}
        />
      )}
    </>
  )
}

const SeaPortOriginForm = ({
  watchCountry,
  watchMode,
  setValue,
}: {
  watchCountry: string
  watchMode: string
  setValue: UseFormSetValue<FieldValues>
}) => {
  return (
    <>
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <CountryCombobox
          field="country"
          label="Country"
          countries={COUNTRIES_LAND_OPTIONS}
          divClass={`w-full md:w-1/4 `}
          labelClass="required"
        />
        <AllDataCombobox<SeaPortsType>
          key={`${watchCountry}`}
          resetString={`${watchMode}-${watchCountry}`}
          divClass="w-full md:w-3/4 flex-col"
          labelClass="required"
          label={watchMode == 'LCL' ? 'Port' : ' Port | ICD | Rail Ramp'}
          placeHolder="Enter port name or code"
          fieldName="pickup_location"
          fetchUrl={`/api/autos/sea-ports?country=${watchCountry}`}
          getOptionLabel={(option) =>
            `${option.port_name}-(${option.port_code})`
          }
          valueSetterCallback={(port) => {
            const { port_name, port_code, location } = port
            setValue('pickup_location', {
              // description: port_name,
              // place_id: port_code,
              port_name,
              port_code,
              lat: location?.coordinates[1],
              lng: location?.coordinates[0],
            })
          }}
        />
      </div>
    </>
  )
}
const DomesticOriginForm = ({
  watchCountry,
  setValue,
}: {
  watchCountry: string
  setValue: UseFormSetValue<FieldValues>
}) => {
  const OriLocationUrl = `/api/autos/google?country=${watchCountry}`
  return (
    <>
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <CountryCombobox
          field="country"
          label="Country"
          countries={COUNTRIES_LAND_OPTIONS}
          divClass={`w-full md:w-1/4 `}
          labelClass="required"
        />
        <FilteredCombobox<PredictionWithZipcode>
          label="Pickup Location"
          placeHolder="Enter pincode or address"
          fieldName="pickup_location"
          getOptionLabel={(option) =>
            `${option.description}${option.zipcode ? ' (' + option.zipcode + ')' : ''}`
          }
          fetchUrl={OriLocationUrl}
          divClass="w-full md:w-3/4"
          valueSetterCallback={(location) => {
            setValue('pickup_location', {
              description: location.description,
              place_id: location.place_id,
              zipcode: location.zipcode,
            })
          }}
        />
      </div>
    </>
  )
}

const AirportOriginForm = ({
  watchCountry,
  watchMode,
  setValue,
}: {
  watchCountry: string
  watchMode: string
  setValue: UseFormSetValue<FieldValues>
}) => {
  return (
    <div className="flex flex-col items-center gap-2 md:flex-row">
      <CountryCombobox
        field="country"
        label="Country"
        countries={COUNTRIES_LAND_OPTIONS}
        divClass={`w-full md:w-1/4 `}
        labelClass="required"
      />

      <AllDataCombobox<AirPortsType>
        key={`${watchCountry}`}
        resetString={`${watchMode}-${watchCountry}`}
        label="Airport"
        placeHolder="Enter airport name or code"
        divClass="w-full md:w-3/4"
        fieldName="pickup_location"
        fetchUrl={`/api/autos/air-ports/all?country=${watchCountry}`}
        getOptionLabel={(option) => `${option.port_name}-(${option.port_code})`}
        valueSetterCallback={(port) => {
          const { port_name, port_code, location, port_type } = port
          setValue('pickup_location', {
            port_name: port_name,
            port_code,
            type: port_type,
            lat: location?.coordinates[1],
            lng: location?.coordinates[0],
          })
        }}
      />
    </div>
  )
}
