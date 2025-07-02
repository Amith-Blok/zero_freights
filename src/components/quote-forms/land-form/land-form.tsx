'use client'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardWrapper } from '../../shared/card-wrapper'
import { CargoAllForm } from '../_components/cargo-all-form'
import { DevTool } from '@hookform/devtools'
import { useRouter } from 'next/navigation'
import { LandFormSchema, LandFormType } from '@/schema/land-schema'
import { LoadLandForm } from './load-land-form'
import { OriginLandForm } from './origin-land-form'
import { DestinationLandForm } from './destination-land-form'
import { LAND_DEFAULT_VALUES } from '@/constants/land-constant'
import { useToast } from '@/hooks/use-toast'
import { useTransition } from 'react'
import { FormMetaProvider } from '@/provider'

export const LandForm = () => {
  const landForm = useForm<LandFormType>({
    resolver: zodResolver(LandFormSchema),
    defaultValues: LAND_DEFAULT_VALUES,
  })

  const [loading, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  const onHandleSubmit = (data: LandFormType) => {
    // console.log({ data });
    startTransition(async () => {
      const response = await fetch(`/api/form/land`, {
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

  return (
    <FormMetaProvider.Provider value={{ loading }}>
      <FormProvider {...landForm}>
        <form onSubmit={landForm.handleSubmit(onHandleSubmit)}>
          {/* restore history */}
          <div className="flex w-full flex-col gap-2 bg-white lg:flex-row">
            <CardWrapper
              cardTitle="Load"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <LoadLandForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Origin"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <OriginLandForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Destination"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <DestinationLandForm />
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
        <DevTool control={landForm.control} />
      </FormProvider>
    </FormMetaProvider.Provider>
  )
}
