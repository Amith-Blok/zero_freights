'use client'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { CardWrapper } from '../../shared/card-wrapper'
import { SeaFormSchema, SeaFormType } from '@/schema/sea-schema'
import { LoadSeaForm } from './load-sea-form'
import { OriginSeaForm } from './origin-sea-form'
import { DestinationSeaForm } from './destination-sea-form'
import { CargoAllForm } from '../_components/cargo-all-form'
import { SEA_DEFAULT_VALUES } from '@/constants'
import { DevTool } from '@hookform/devtools'
import { SeaFormResetStore } from '@/store/form-restore'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { FormMetaProvider } from '@/provider'
import {
  AlertDialogWrapper,
  useAlertDialog,
  AlertTypes,
} from '../_components/alert-dialog-wrapper'
import { getApiRouteStringForSeaFormByMode } from '../helper'

export const SeaForm = () => {
  const seaForm = useForm<SeaFormType>({
    resolver: zodResolver(SeaFormSchema),
    defaultValues: SEA_DEFAULT_VALUES,
  })
  const router = useRouter()
  const [loading, startTransition] = useTransition()
  const { open, type, customConfig, showAlert, onOpenChange } = useAlertDialog()

  const onHandleSubmit = (data: SeaFormType) => {
    console.log({ data })
    const apiRouteString = getApiRouteStringForSeaFormByMode(data.modes)

    if (!apiRouteString) {
      showAlert(AlertTypes.INFO, {
        title: 'Feature Under Development',
        description:
          'This shipping mode is currently under development. Please try FCL or LCL modes for now.',
        primaryAction: {
          label: 'Got it',
          onClick: () => {},
        },
      })
      return
    }

    const resetData = {
      label: `${data.ori_port_rail.port_code}-${data.des_port_rail.port_code}`,
      data,
    }
    SeaFormResetStore.getState().addSea(resetData)
    startTransition(async () => {
      const response = await fetch(`/api/form/${apiRouteString}`, {
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
        showAlert(AlertTypes.ERROR, {
          title: 'Submission Failed',
          description:
            errorResponse.error ||
            'An error occurred while processing your request. Please try again.',
          primaryAction: {
            label: 'Try Again',
            onClick: () => {},
          },
          secondaryAction: {
            label: 'Contact Support',
            onClick: () => {
              window.location.href = 'https://www.bloksupplychain.com/contact'
            },
          },
        })
        return
      }
      const result = await response.json()
      if (result.offer_id) {
        // router.push(`/offer/${result.offer_id}`)
      }
      console.log({ result })
    })
  }
  // const restoreData = SeaFormResetStore((state) => state.sea)

  // function restoreByIdx(idx: number) {
  //   // console.log({ idx });
  //   seaForm.reset(restoreData[idx].data)
  // }
  return (
    <FormMetaProvider.Provider value={{ loading }}>
      <FormProvider {...seaForm}>
        <form onSubmit={seaForm.handleSubmit(onHandleSubmit)}>
          {/* restore history */}
          {/* <Select
            onValueChange={async (idx) => {
              restoreByIdx(+idx)
              await new Promise((resolve) => setTimeout(resolve, 400))
              restoreByIdx(+idx)
            }}
          >
            <SelectTrigger className="mb-2 w-fit">
              <SelectValue placeholder="Select a history" />
            </SelectTrigger>
            <SelectContent className=" ">
              {restoreData.length > 0 ? (
                restoreData.map((x, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {x.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="nill">No History</SelectItem>
              )}
            </SelectContent>
          </Select> */}
          <div className="flex w-full flex-col gap-2 bg-white lg:flex-row">
            <CardWrapper
              cardTitle="Load"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <LoadSeaForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Origin"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <OriginSeaForm />
            </CardWrapper>
            <CardWrapper
              cardTitle="Destination"
              titleClass="font-medium"
              cardClass="w-full bg-white"
            >
              <DestinationSeaForm />
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
        <DevTool control={seaForm.control} />

        {/* Alert Dialog */}
        <AlertDialogWrapper
          open={open}
          onOpenChange={onOpenChange}
          type={type}
          customConfig={customConfig}
        />
      </FormProvider>
    </FormMetaProvider.Provider>
  )
}
