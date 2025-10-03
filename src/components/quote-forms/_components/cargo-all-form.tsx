'use client'
import { arrayToSelectData } from '@/lib/utils'
import { SelectWrapper } from './form-wrapper/select-wrapper'
import { incoterms } from '@/constants'
import { CalendarWrapper } from './form-wrapper/calendar-wrapper'
import { FilteredCombobox } from './filtered-combobox'
import { useFormContext, useWatch } from 'react-hook-form'
import SumbitButton from '@/components/shared/button-loading'
import { FormMetaProvider } from '@/provider'
import { useContext } from 'react'
import { HsSixType } from '@/models/hs-six'
import InputInlineAddonWrapper from './form-wrapper/input-inline-addon-wrapper'

export const CargoAllForm = () => {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext()
  const { loading } = useContext(FormMetaProvider)
  console.log({ errors })
  const watchModes = useWatch({ control, name: 'modes' }) ?? ''
  const isWarehouse = watchModes.includes('WAREHOUSE')
  return (
    <>
      <FilteredCombobox<HsSixType>
        label="Commodity Code"
        placeHolder="Enter six digit hs code or description"
        fieldName="hsn"
        getOptionLabel={(option) =>
          `${option.chapter} - ${option.heading} - ${option.subheading} (${option.code})`
        }
        fetchUrl="/api/autos/hsn"
        valueSetterCallback={(hsn) => {
          setValue('hsn', {
            code: hsn.code,
            chapter: hsn.chapter,
            heading: hsn.heading,
            subheading: hsn.subheading,
          })
        }}
      />
      <div className="flex w-full flex-col items-center justify-center space-x-2 md:flex-row">
        {/* <InputWrapper
          label="Value"
          field="value"
          inputProps={{ type: 'number', placeholder: 'Enter value in usd' }}
        /> */}
        <InputInlineAddonWrapper
          field="value"
          label="Value"
          addonBack="$"
          inputProps={{
            type: 'number',
            placeholder: '0.00',
            className: ' no-arrows',
          }}
        />
        {!isWarehouse && <CalendarWrapper label="Ready to Load" field="date" />}
      </div>
      <div className="flex w-full flex-col items-center justify-center space-x-2 md:flex-row">
        {!isWarehouse && (
          <>
            <SelectWrapper
              label="Incoterms"
              field="incoterms"
              data={arrayToSelectData([...incoterms])}
            />
          </>
        )}
      </div>

      <div className="mt-5 flex w-full justify-end">
        <SumbitButton loading={loading} text="Submit" />
      </div>
    </>
  )
}
