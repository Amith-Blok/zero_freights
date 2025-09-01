'use client'
import { Label } from '@/components/ui/label'
import MultiSelect from '@/components/ui/multi-select'
import { FCL_CONTAINER_TYPE_LIST, KG_LBS } from '@/constants'
import { STDContainerType } from '@/models/offer/shared-types'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InputSelect } from './input-select'

export function SeaFclLoadFormWrapper() {
  const {
    control,
    register,
    resetField,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext()
  const fclContainerType = watch('fcl_container_type')
  const fclQuantities = watch('fcl_quantities')
  const fclWeights = watch('fcl_weights')
  const fclUnit = watch('fcl_unit')

  const totalSelectedQty =
    fclContainerType?.reduce((acc: number, id: string) => {
      const qty = fclQuantities?.[id]
      const validQty = typeof qty === 'number' && !isNaN(qty) ? qty : 0
      return acc + validQty
    }, 0) ?? 0

  const totalSelectedWeight =
    fclContainerType?.reduce((acc: number, id: string) => {
      const wt = fclWeights?.[id]
      const validWt = typeof wt === 'number' && !isNaN(wt) ? wt : 0
      return acc + validWt
    }, 0) ?? 0

  return (
    <>
      <div className="mt-2 flex flex-col gap-2">
        <Label htmlFor="container-types">Container Types</Label>
        <Controller
          control={control}
          name="fcl_container_type"
          render={({ field }) => (
            <MultiSelect
              aria-label="Container types"
              options={FCL_CONTAINER_TYPE_LIST}
              value={field.value ?? []}
              onChange={(next) => {
                const previousIds = field.value ?? []
                const nextIds = next as STDContainerType[]
                field.onChange(nextIds)

                const currentQuantities = getValues('fcl_quantities')
                // const currentWeights = getValues('fcl_weights')

                // Set newly selected quantities to 1 if currently 0 for convenience
                nextIds.forEach((id) => {
                  if ((currentQuantities?.[id] ?? 0) === 0) {
                    setValue(`fcl_quantities.${id}`, 1, { shouldDirty: true })
                  }
                })

                // Set quantities and weights to 0 for removed containers
                const removedIds = previousIds.filter(
                  (id: STDContainerType) => !nextIds.includes(id)
                )
                removedIds.forEach((id: string) => {
                  setValue(`fcl_quantities.${id}`, 0, { shouldDirty: true })
                  setValue(`fcl_weights.${id}`, 0, { shouldDirty: true })
                })
              }}
              placeholder="Select container types"
            />
          )}
        />
        {errors.fcl_container_type && (
          <p className="text-sm text-destructive" role="alert">
            {(errors.fcl_container_type as any)?.message}
          </p>
        )}
      </div>

      {fclContainerType.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div className="space-y-3">
            <div className="flex flex-col gap-3">
              {fclContainerType.map((id: string) => {
                const errMsg = (errors.fcl_quantities as any)?.[id]?.message as
                  | string
                  | undefined
                const weightErrMsg = (errors.fcl_weights as any)?.[id]
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
                            className="placeholder:text-xs"
                            min={0}
                            step={1}
                            aria-invalid={!!errMsg}
                            {...register(`fcl_quantities.${id}` as const, {
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
                            className="placeholder:text-xs"
                            inputField={`fcl_weights.${id}` as const}
                            selectField="fcl_unit"
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
                  {fclUnit}
                </span>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                resetField('fcl_container_type', { defaultValue: [] })
              }}
            >
              Reset
            </Button>
          </div>

          {/* Refine error for overall quantities rule */}
          {errors.fcl_quantities &&
            !fclContainerType.some(
              (id: string) => (errors.fcl_quantities as any)[id]
            ) && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {(errors.fcl_quantities as any)?.message ??
                  'Please adjust quantities so that at least one selected type is greater than 0.'}
              </div>
            )}
          {errors.fcl_weights &&
            !fclContainerType.some(
              (id: string) => (errors.fcl_weights as any)[id]
            ) && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {(errors.fcl_weights as any)?.message ??
                  'Please adjust weights so that at least one selected type is greater than 0.'}
              </div>
            )}
        </div>
      )}
    </>
  )
}
