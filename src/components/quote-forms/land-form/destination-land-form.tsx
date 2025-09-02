import { COUNTRIES_LAND_OPTIONS } from '@/constants'
import {
  useFormContext,
  FieldValues,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form'
import { Prediction } from '@/types/google'
import { FilteredCombobox } from '../_components/filtered-combobox'
import { CountryCombobox } from '../_components/form-wrapper/country-combobox'
import { LAND_AIRPORT_MODE_COUNTRIES_OPTIONS } from '@/constants/land-constant'
export const DestinationLandForm = () => {
  const { setValue, control } = useFormContext()

  const watchCountry = useWatch({ control, name: 'country' })
  const watchMode = useWatch({ control, name: 'modes' })
  return (
    <>
      {watchMode == 'SEAPORT_TRUCKING' && (
        <SeaPortDestinationForm
          watchCountry={watchCountry}
          watchMode={watchMode}
          setValue={setValue}
        />
      )}
      {watchMode == 'DOMESTIC_TRUCKING' && (
        <DomesticDestinationForm
          watchCountry={watchCountry}
          setValue={setValue}
        />
      )}
      {watchMode == 'AIRPORT_TRUCKING' && (
        <AirportDestinationForm
          watchCountry={watchCountry}
          setValue={setValue}
        />
      )}
    </>
  )
}

const SeaPortDestinationForm = ({
  watchCountry,
  // _watchMode,
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
        <FilteredCombobox<Prediction>
          label="Destination Location"
          placeHolder="Enter pincode or address"
          fieldName="delivery_location"
          getOptionLabel={(option) => option.description}
          fetchUrl={`/api/autos/google?country=${watchCountry}`}
          divClass="w-full md:w-3/4"
          valueSetterCallback={(location) => {
            setValue('delivery_location', {
              description: location.description,
              place_id: location.place_id,
            })
          }}
        />
      </div>
    </>
  )
}

const DomesticDestinationForm = ({
  watchCountry,
  setValue,
}: {
  watchCountry: string
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
        <FilteredCombobox<Prediction>
          label="Destination Location"
          placeHolder="Enter pincode or address"
          fieldName="delivery_location"
          getOptionLabel={(option) => option.description}
          fetchUrl={`/api/autos/google?country=${watchCountry}`}
          divClass="w-full md:w-3/4"
          valueSetterCallback={(location) => {
            setValue('delivery_location', {
              description: location.description,
              place_id: location.place_id,
            })
          }}
        />
      </div>
    </>
  )
}

const AirportDestinationForm = ({
  watchCountry,
  setValue,
}: {
  watchCountry: string
  setValue: UseFormSetValue<FieldValues>
}) => {
  return (
    <>
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <CountryCombobox
          field="country"
          label="Country"
          countries={LAND_AIRPORT_MODE_COUNTRIES_OPTIONS}
          divClass={`w-full md:w-1/4 `}
          labelClass="required"
        />
        <FilteredCombobox<Prediction>
          label="Destination Location"
          placeHolder="Enter pincode or address"
          fieldName="delivery_location"
          getOptionLabel={(option) => option.description}
          fetchUrl={`/api/autos/google?country=${watchCountry}`}
          divClass="w-full md:w-3/4"
          valueSetterCallback={(location) => {
            setValue('delivery_location', {
              description: location.description,
              place_id: location.place_id,
            })
          }}
        />
      </div>
    </>
  )
}
