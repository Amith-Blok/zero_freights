'use client'
import { Label } from '@/components/ui/label'
import MultiSelect from '@/components/ui/multi-select'
import { KG_LBS } from '@/constants'
import { STDContainerType } from '@/models/offer/shared-types'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InputSelect } from './input-select'
import { OOG_CONTAINER_TYPE_OPTION } from '@/constants/sea-oog-form'

interface SeaIgLoadFormWrapperProps {
  prefix?: string
}

export function SeaIgLoadFormWrapper({
  prefix = 'ig',
}: SeaIgLoadFormWrapperProps) {
  const {
    control,
    register,
    resetField,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext()

  const containerTypeField = `${prefix}_container_type`
  const quantitiesField = `${prefix}_quantities`
  const weightsField = `${prefix}_weights`
  const unitField = `${prefix}_unit`

  const containerType = watch(containerTypeField)
  const quantities = watch(quantitiesField)
  const weights = watch(weightsField)
  const unit = watch(unitField)

  const totalSelectedQty =
    containerType?.reduce((acc: number, id: string) => {
      const qty = quantities?.[id]
      const validQty = typeof qty === 'number' && !isNaN(qty) ? qty : 0
      return acc + validQty
    }, 0) ?? 0

  const totalSelectedWeight =
    containerType?.reduce((acc: number, id: string) => {
      const wt = weights?.[id]
      const validWt = typeof wt === 'number' && !isNaN(wt) ? wt : 0
      return acc + validWt
    }, 0) ?? 0

  return (
    <>
      <div className="mt-2 flex flex-col gap-2">
        <Label htmlFor="container-types" className="required">
          Container Types
        </Label>
        <Controller
          control={control}
          name={containerTypeField}
          render={({ field }) => (
            <MultiSelect
              placeholder="Select container types"
              options={OOG_CONTAINER_TYPE_OPTION}
              value={field.value ?? []}
              onChange={(next) => {
                const previousIds = field.value ?? []
                const nextIds = next as STDContainerType[]
                field.onChange(nextIds)

                const currentQuantities = getValues(quantitiesField)

                // Set newly selected quantities to 1 if currently 0 for convenience
                nextIds.forEach((id) => {
                  if ((currentQuantities?.[id] ?? 0) === 0) {
                    setValue(`${quantitiesField}.${id}`, 1, {
                      shouldDirty: true,
                    })
                  }
                })

                // Set quantities and weights to 0 for removed containers
                const removedIds = previousIds.filter(
                  (id: STDContainerType) => !nextIds.includes(id)
                )
                removedIds.forEach((id: string) => {
                  setValue(`${quantitiesField}.${id}`, 0, { shouldDirty: true })
                  setValue(`${weightsField}.${id}`, 0, { shouldDirty: true })
                })
              }}
            />
          )}
        />
        {errors[containerTypeField] && (
          <p className="text-sm text-destructive" role="alert">
            {(errors[containerTypeField] as any)?.message}
          </p>
        )}
      </div>

      {containerType?.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div className="space-y-3">
            <div className="flex flex-col gap-3">
              {containerType.map((id: string) => {
                const errMsg = (errors[quantitiesField] as any)?.[id]
                  ?.message as string | undefined
                const weightErrMsg = (errors[weightsField] as any)?.[id]
                  ?.message as string | undefined
                return (
                  <div key={id} className="flex flex-col gap-1">
                    <div
                      className={cn(
                        'flex flex-col gap-2 lg:flex-row lg:items-center'
                      )}
                    >
                      <Label htmlFor={'qty-' + id} className="w-[5ch] text-xs">
                        {id}
                      </Label>
                      <div className="flex w-full flex-wrap items-start gap-3 sm:flex-nowrap">
                        <div className="flex flex-1 flex-col gap-1">
                          <Input
                            id={'qty-' + id}
                            inputMode="numeric"
                            type="number"
                            placeholder="Qty"
                            className="no-arrows placeholder:text-xs"
                            min={0}
                            step={1}
                            aria-invalid={!!errMsg}
                            {...register(`${quantitiesField}.${id}` as const, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                          <InputSelect
                            inputProps={{
                              type: 'number',
                              placeholder: 'Weight',
                              step: 0.01,
                            }}
                            className="no-arrows placeholder:text-xs"
                            inputField={`${weightsField}.${id}` as const}
                            selectField={unitField}
                            isInputValueAsNumber={true}
                            data={[...KG_LBS]}
                          />
                        </div>
                      </div>
                    </div>
                    {errMsg && (
                      <p className="text-xs text-destructive" role="alert">
                        {errMsg}
                      </p>
                    )}
                    {weightErrMsg && (
                      <p className="text-xs text-destructive" role="alert">
                        {weightErrMsg}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Total quantity:{' '}
                <span className="font-medium text-foreground">
                  {totalSelectedQty ?? 0}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Total weight:{' '}
                <span className="font-medium text-foreground">
                  {totalSelectedWeight ?? 0}
                </span>{' '}
                <span className="font-medium uppercase text-foreground">
                  {unit}
                </span>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                resetField(containerTypeField, { defaultValue: [] })
              }}
            >
              Clear
            </Button>
          </div>

          {/* Refined error for overall quantities rule */}
          {errors[quantitiesField] &&
            !containerType.some(
              (id: string) => (errors[quantitiesField] as any)[id]
            ) && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {(errors[quantitiesField] as any)?.message ??
                  'Please adjust quantities so that at least one selected type is greater than 0.'}
              </div>
            )}
          {errors[weightsField] &&
            !containerType.some(
              (id: string) => (errors[weightsField] as any)[id]
            ) && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {(errors[weightsField] as any)?.message ??
                  'Please adjust weights so that at least one selected type is greater than 0.'}
              </div>
            )}
        </div>
      )}
    </>
  )
}
