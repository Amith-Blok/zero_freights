/* eslint-disable react-hooks/exhaustive-deps */
import { Label } from '../../ui/label'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { CheckBoxWrapper } from '../_components/form-wrapper/check-box-wrapper'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { COUNTRIES_LIST } from '@/constants'
import { AllDataCombobox } from '../_components/all-data-combobox'
import { SeaPortsType } from '@/models/sea-ports'
import { FilteredCombobox } from '../_components/filtered-combobox'
import { Prediction } from '@/types/google'

export const OriginSeaForm = () => {
  const { watch, setValue, control } = useFormContext()
  const watchMode = watch('modes')
  const watchPick = watch('pickup_check')
  const watchOriCountry = useWatch({ control, name: 'ori_country' })
  const watchOriPortRail = useWatch({ control, name: 'ori_port_rail' })
  const watchPlaceId = useWatch({ control, name: 'pickup_location.place_id' })
  const { port_code: watchCode, type: watchType } = watchOriPortRail ?? {}

  return (
    <>
      <CheckBoxWrapper
        label="Do you want pick up trucking service?"
        field="pickup_check"
        disable={watchMode == 'LCL'}
      />
      <div className="mt-5 flex flex-col items-start justify-center gap-2 md:flex-row">
        <SelectWrapper
          label="Country"
          field="ori_country"
          labelClass="required"
          data={COUNTRIES_LIST}
          divClass={`w-full ${watchPick && 'md:w-1/3'} `}
        />

        {watchPick && (
          <FilteredCombobox<Prediction>
            label="Pickup Location"
            placeHolder="Enter pincode or address"
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
      <AllDataCombobox<SeaPortsType>
        key={`${watchOriCountry}-${watchPlaceId}`}
        resetString={`${watchOriCountry}`}
        label={
          watchMode == 'LCL'
            ? `${watchPick ? 'Nearest ' : ''}Port`
            : `${watchPick ? 'Nearest ' : ''}Port | Inland Port`
        }
        placeHolder="Enter port name or port code"
        fieldName="ori_port_rail"
        labelClass="required"
        fetchUrl={`/api/autos/sea-ports?country=${watchOriCountry}&place_id=${watchPlaceId ?? ''}`}
        getOptionLabel={(option) => `${option.port_name}-(${option.port_code})`}
        valueSetterCallback={(port) => {
          const { port_name, port_code, location, port_type } = port
          setValue('ori_port_rail', {
            port_name,
            port_code,
            type: port_type,
            lat: location?.coordinates[1],
            lng: location?.coordinates[0],
          })
        }}
      />

      {watchType == 'RAIL' && watchOriCountry == 'IN' && (
        <AllDataCombobox<SeaPortsType>
          key={`${watchOriCountry}-${watchCode}`}
          resetString={`${watchOriCountry}-${watchCode}`}
          label="Origin Port"
          placeHolder="Enter port name or port code"
          fieldName="ori_port_if_rail"
          fetchUrl={`/api/autos/sea-ports/near?country=${watchOriCountry}&haulage=EXPORT&port=${watchCode}`}
          getOptionLabel={(option) =>
            `${option.port_name}-(${option.port_code})`
          }
          valueSetterCallback={(port) => {
            const { port_name, port_code } = port
            setValue('ori_port_if_rail', {
              port_name,
              port_code,
            })
          }}
        />
      )}

      {watch('modes') === 'FCL' &&
        watch('ori_country') === 'IN' &&
        watch('pickup_check') && (
          <div className="mt-5 flex space-x-2">
            <div className="flex items-center space-x-2">
              <Controller
                name="trucking"
                control={control} // `control` comes from `useFormContext`
                defaultValue={'FAC'}
                render={({ field: { onChange, value } }) => (
                  <>
                    <input
                      type="radio"
                      id="r2"
                      value="FAC"
                      checked={value === 'FAC'} // Make sure the correct option is selected
                      onChange={(e) => onChange(e.target.value)} // Updates the form state
                      className="custom-radio"
                    />
                    <Label htmlFor="r2">Factory Stuffing</Label>
                  </>
                )}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="trucking"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <input
                      type="radio"
                      id="r1"
                      value="CFS"
                      checked={value === 'CFS'} // Make sure the correct option is selected
                      onChange={(e) => onChange(e.target.value)} // Updates the form state
                      className="custom-radio"
                    />
                    <Label htmlFor="r1">CFS Stuffing</Label>
                  </>
                )}
              />
            </div>
          </div>
        )}
    </>
  )
}
