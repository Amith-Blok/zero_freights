'use client'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { CargoAllForm } from '../_components/cargo-all-form'
// import { DevTool } from '@hookform/devtools';

import { useRouter } from 'next/navigation'
import { AirFormTypes } from '@/schema/air-schema'
import { AIR_DEFAULT_VALUES } from '@/constants/air-form'
import { AirFormSchema } from '@/schema/air-schema'
import { CardWrapper } from '@/components/shared/card-wrapper'
import { OriginAirForm } from './origin-air-form'
import { DestinationAirForm } from './destination-air-form'
import { LoadAirForm } from './load-air-form'
import { useTransition } from 'react'
import { useToast } from '@/hooks/use-toast'
import { FormMetaProvider } from '@/provider'

export const AirForm = () => {
  const airForm = useForm<AirFormTypes>({
    resolver: zodResolver(AirFormSchema),
    defaultValues: AIR_DEFAULT_VALUES,
  })

  const [loading, startTransition] = useTransition()
  const { toast } = useToast()

  const onHandleSubmit = (data: AirFormTypes) => {
    // console.log({ data });
    startTransition(async () => {
      const response = await fetch(`/api/form/air`, {
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

  return (
    <FormMetaProvider.Provider value={{ loading }}>
      <FormProvider {...airForm}>
        <form onSubmit={airForm.handleSubmit(onHandleSubmit)}>
          <div className="flex w-full flex-col gap-2 bg-white lg:flex-row">
            <CardWrapper
              cardTitle="Load"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <LoadAirForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Origin"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <OriginAirForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Destination"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <DestinationAirForm />
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
        {/* <DevTool control={airForm.control} /> */}
      </FormProvider>
    </FormMetaProvider.Provider>
  )
}
