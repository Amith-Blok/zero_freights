'use client'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { InputSelect } from './form-wrapper/input-select'
import { InputWrapper } from './form-wrapper/input-wrapper'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { DimensionSelect } from './form-wrapper/dimension-select'
type FieldArrayLoadCompProps = {
  fieldArrayName: string
  dimLabel: string
  dimInputFieldOne: string
  dimInputFieldTwo: string
  dimInputFieldThree: string
  dimSelectField: string
  dimSelectData: string[]
  inputField: string
  //NOTE: input field name of input-select.tsx
  inputSelectFieldOne: string
  //NOTE: select field name of input-select.tsx
  inputSelectFieldTwo: string
  inputSelecFieldData: string[]
}
export const FieldArrayLoadComp = ({
  fieldArrayName,
  dimLabel,
  dimInputFieldOne,
  dimInputFieldTwo,
  dimInputFieldThree,
  dimSelectField,
  dimSelectData,
  inputField,
  inputSelectFieldOne,
  inputSelectFieldTwo,
  inputSelecFieldData,
}: FieldArrayLoadCompProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: fieldArrayName,
    control,
  })
  // console.log({ errors });
  return (
    <>
      {fields.map((_field, index) => {
        return (
          <div
            key={index}
            className="border-soq my-2 flex w-full flex-col rounded-md border-2 border-slate-100 p-2 sm:space-y-2"
          >
            <DimensionSelect
              label={dimLabel}
              inputFieldOne={
                `${fieldArrayName + '.' + index + '.' + dimInputFieldOne}` as const
              }
              inputFieldTwo={
                `${fieldArrayName + '.' + index + '.' + dimInputFieldTwo}` as const
              }
              inputFieldThree={
                `${fieldArrayName + '.' + index + '.' + dimInputFieldThree}` as const
              }
              selectField={`${fieldArrayName + '.' + index + '.' + dimSelectField}`}
              data={dimSelectData}
            />
            <div className="flex w-full items-center justify-center gap-2">
              <InputWrapper
                label="Quantity"
                inputProps={{ type: 'number', placeholder: 'qty' }}
                field={
                  `${fieldArrayName + '.' + index + '.' + inputField}` as const
                }
                isInputValueAsNumber={true}
              />
              <InputSelect
                label="Weight"
                inputProps={{
                  type: 'number',
                  placeholder: 'wgt',
                  step: 0.01,
                }}
                inputField={
                  `${fieldArrayName + '.' + index + '.' + inputSelectFieldOne}` as const
                }
                selectField={`${fieldArrayName + '.' + index + '.' + inputSelectFieldTwo}`}
                data={inputSelecFieldData}
                isInputValueAsNumber
              />

              {index !== 0 && (
                <Button
                  variant="outline"
                  className="mt-5 text-red-400"
                  onClick={() => remove(index)}
                >
                  <Trash size={15} />
                </Button>
              )}
            </div>
            {(errors?.[fieldArrayName] as any)?.[index] &&
              typeof (errors[fieldArrayName] as any)[index] === 'object' && (
                <div className="mt-2 space-y-1 text-sm text-red-500">
                  Required
                </div>
              )}
          </div>
        )
      })}
      <div>
        <Button
          type="button"
          variant="link"
          onClick={() =>
            append({
              [dimInputFieldOne]: undefined,
              [dimInputFieldTwo]: undefined,
              [dimInputFieldThree]: undefined,
              [dimSelectField]: 'CM',
              [inputField]: undefined,
              [inputSelectFieldOne]: undefined,
              [inputSelectFieldTwo]: 'KG',
            })
          }
        >
          + Add
        </Button>
      </div>
    </>
  )
}
