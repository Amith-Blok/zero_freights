'use client'
import { arrayToSelectData } from '@/lib/utils'
import { SelectWrapper } from './form-wrapper/select-wrapper'
import { ICOTERMS } from '@/constants'
import { CalendarWrapper } from './form-wrapper/calendar-wrapper'
import { FilteredCombobox } from './filtered-combobox'
import { HsnType } from '@/models/hsn'
import { useFormContext, useWatch } from 'react-hook-form'
import SumbitButton from '@/components/shared/button-loading'
import { FormMetaProvider } from '@/provider'
import { useContext } from 'react'
import { InputWrapper } from './form-wrapper/input-wrapper'
import PhoneInputWrapper from '@/components/shared/phone-input-wrapper'
export const CargoAllForm = () => {
  const { setValue, control } = useFormContext()
  const { loading } = useContext(FormMetaProvider)
  // console.log({ errors })
  const watchModes = useWatch({ control, name: 'modes' })
  const isWarehouse = watchModes.includes('WAREHOUSE')
  return (
    <>
      <FilteredCombobox<HsnType>
        label="Commodity Code"
        placeHolder="Enter hsn code or description"
        fieldName="hsn"
        getOptionLabel={(option) => `${option.hsn_des}(${option.hsn_code})`}
        fetchUrl="/api/autos/hsn"
        valueSetterCallback={(hsn) => {
          setValue('hsn', {
            hsn_code: hsn.hsn_code.toString(),
            hsn_des: hsn.hsn_des,
          })
        }}
      />
      <div className="flex w-full flex-col items-center justify-center space-x-2 md:flex-row">
        <InputWrapper
          label="Value"
          field="value"
          inputProps={{ type: 'number', placeholder: 'Enter value in usd' }}
        />
        {!isWarehouse && <CalendarWrapper label="Ready to Load" field="date" />}
        {isWarehouse && (
          <InputWrapper
            label="Your Name"
            field="user_name"
            inputProps={{
              type: 'text',
              placeholder: 'Enter your name',
              autoComplete: 'name',
            }}
          />
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center space-x-2 md:flex-row">
        {!isWarehouse && (
          <>
            <SelectWrapper
              label="Icoterms"
              field="icoterms"
              data={arrayToSelectData([...ICOTERMS])}
            />
            <InputWrapper
              label="Your Name"
              field="user_name"
              inputProps={{
                type: 'text',
                placeholder: 'Enter your name',
                autoComplete: 'name',
              }}
            />
          </>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center space-x-2 md:flex-row">
        <InputWrapper
          label="email"
          field="email"
          inputProps={{
            type: 'text',
            placeholder: 'Enter your email',
            autoComplete: 'email',
          }}
        />
        <InputWrapper
          label="Company Name"
          field="company_name"
          inputProps={{
            type: 'text',
            placeholder: 'Enter company name',
            autoComplete: 'organization',
          }}
        />
      </div>
      <PhoneInputWrapper fieldName="phone" label="Phone Number" />
      <div className="mt-5 flex w-full justify-end">
        <SumbitButton loading={loading} text="Submit" />
      </div>
    </>
  )
}
