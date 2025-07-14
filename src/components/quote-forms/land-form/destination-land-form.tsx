import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { COUNTRIES_LAND_LIST } from '@/constants'
import {
  useFormContext,
  FieldValues,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form'
import { Prediction } from '@/types/google'
import { FilteredCombobox } from '../_components/filtered-combobox'
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
        <SelectWrapper
          label="Country"
          field="country"
          data={COUNTRIES_LAND_LIST}
          divClass={`w-full md:w-1/4 `}
          labelClass="required block"
        />
        <FilteredCombobox<Prediction>
          label="Destination Location"
          placeHolder="pincode or address"
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
        <SelectWrapper
          label="Country"
          field="country"
          data={COUNTRIES_LAND_LIST}
          divClass={`w-full md:w-1/4 `}
          labelClass="required block"
        />
        <FilteredCombobox<Prediction>
          label="Destination Location"
          placeHolder="pincode or address"
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
        <SelectWrapper
          label="Country"
          field="country"
          data={[{ label: 'US', value: 'US' }]}
          divClass={`w-full md:w-1/4 `}
          labelClass="required block"
        />
        <FilteredCombobox<Prediction>
          label="Destination Location"
          placeHolder="pincode or address"
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
