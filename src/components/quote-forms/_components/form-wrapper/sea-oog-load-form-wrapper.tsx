'use client'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { DimensionSelect } from './dimension-select'
import { InputSelect } from './input-select'
import { InputWrapper } from './input-wrapper'
import { Label } from '@/components/ui/label'
import MultiSelect from '@/components/ui/multi-select'
import { OOG_CONTAINER_TYPE_OPTION } from '@/constants/sea-oog-form'
import { Input } from '@/components/ui/input'
type FieldArrayOogLoadCompProps = {
  fieldArrayName: string
  dimLabel: string
  dimInputFieldOne: string
  dimInputFieldTwo: string
  dimInputFieldThree: string
  dimSelectField: string
  dimSelectData: string[]
  inputFieldOne: string
  inputFieldTwo: string
  //NOTE: input field name of input-select.tsx
  inputSelectFieldOne: string
  //NOTE: select field name of input-select.tsx
  inputSelectFieldTwo: string
  inputSelecFieldData: string[]
}
export const FieldArrayOogLoadComp = ({
  fieldArrayName,
  dimLabel,
  dimInputFieldOne,
  dimInputFieldTwo,
  dimInputFieldThree,
  dimSelectField,
  dimSelectData,
  inputFieldOne,
  inputFieldTwo,
  inputSelectFieldOne,
  inputSelectFieldTwo,
  inputSelecFieldData,
}: FieldArrayOogLoadCompProps) => {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: fieldArrayName,
    control,
  })
  // console.log({ errors });
  return (
    <>
      <Label className="mt-2">Container Type</Label>
      <Controller
        control={control}
        name={'oog_container_type'}
        render={({ field }) => (
          <MultiSelect
            options={OOG_CONTAINER_TYPE_OPTION}
            value={field.value ?? []}
            onChange={(next) => {
              const prev = field.value as string[]
              field.onChange(next)

              //add new
              next
                .filter((cnt) => !prev.includes(cnt))
                .forEach((cnt) =>
                  append({
                    [dimInputFieldOne]: undefined,
                    [dimInputFieldTwo]: undefined,
                    [dimInputFieldThree]: undefined,
                    [dimSelectField]: 'CM',
                    [inputFieldOne]: undefined,
                    [inputFieldTwo]: cnt,
                    [inputSelectFieldOne]: undefined,
                    [inputSelectFieldTwo]: 'KG',
                  })
                )

              //remove
              prev
                .filter((v) => !next.includes(v))
                .forEach((type) => {
                  const index = getValues('oog_load').findIndex(
                    (c: { oog_type: string }) => c.oog_type === type
                  )
                  if (index !== -1) remove(index)
                })
            }}
          />
        )}
      />

      {fields.map((_field, index) => {
        return (
          <div
            key={index}
            className="border-soq my-2 flex w-full flex-col rounded-md border-2 border-slate-100 p-2 sm:space-y-2"
          >
            <Label className="font-semibold">
              {getValues(
                `${fieldArrayName + '.' + index + '.' + inputFieldTwo}`
              )}{' '}
              Container
            </Label>
            {/* <Input className=''{...register(`${fieldArrayName + '.' + index + '.' + inputFieldTwo}`)}/> */}

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
                  `${fieldArrayName + '.' + index + '.' + inputFieldOne}` as const
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

              <Button
                variant="outline"
                className="mt-5 text-red-400"
                onClick={() => {
                  const containerType = getValues(
                    'oog_container_type'
                  ) as string[]
                  const oog_load = getValues('oog_load') as {
                    oog_type: string
                  }[]
                  const removedContainerType = oog_load[index].oog_type
                  const newContainType = containerType.filter(
                    (cnt) => cnt != removedContainerType
                  )
                  setValue('oog_container_type', newContainType, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                  remove(index)
                }}
              >
                <Trash size={15} />
              </Button>
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
    </>
  )
}
