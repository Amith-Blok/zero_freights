'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardWrapper } from '../../shared/card-wrapper'
import { DevTool } from '@hookform/devtools'
// import { useRouter } from 'next/navigation';

import { useTransition } from 'react'
import {
  WarehouseFormSchema,
  WarehouseFormTypes,
} from '@/schema/warehouse-schema'
import { CargoAllForm } from '../_components/cargo-all-form'
import { DestinationWarehouseForm } from './destination-warehouse'
import { LoadWarehouseForm } from './load-warehouse-form'
import { WAREHOUSE_DEFAULT } from '@/constants/warehosue'
import { OriginWarehouseForm } from './origin-warehouse-house'
import { FormMetaProvider } from '@/provider'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export const WarehouseForm = () => {
  const warehouseForm = useForm<WarehouseFormTypes>({
    resolver: zodResolver(WarehouseFormSchema),
    defaultValues: {
      ...WAREHOUSE_DEFAULT,
      fcl_load: [...WAREHOUSE_DEFAULT.fcl_load],
    },
  })

  const onHandleSubmit = async (data: WarehouseFormTypes) => {
    startTransition(async () => {
      const response = await fetch(`/api/form/warehouse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      // Check for HTTP errors
      if (!response.ok) {
        console.log({ message: 'Failed to fetch', status: response.status })
        const errorResponse = await response.json()
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: errorResponse.error,
        })
        return
      }

      const result = await response.json()
      if (result.offer_id) {
        router.push(`/offer/${result.offer_id}`)
      }
      // console.log({ result });
    })
  }

  const router = useRouter()
  const [loading, startTransition] = useTransition()

  return (
    <FormMetaProvider.Provider value={{ loading }}>
      <FormProvider {...warehouseForm}>
        <form onSubmit={warehouseForm.handleSubmit(onHandleSubmit)}>
          <div className="flex w-full flex-col gap-2 bg-white lg:flex-row">
            <CardWrapper
              cardTitle="Load"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <LoadWarehouseForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Origin"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <OriginWarehouseForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Destination"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <DestinationWarehouseForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Cargo"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <CargoAllForm />
            </CardWrapper>
          </div>
        </form>
        <DevTool control={warehouseForm.control} />
      </FormProvider>
    </FormMetaProvider.Provider>
  )
}
