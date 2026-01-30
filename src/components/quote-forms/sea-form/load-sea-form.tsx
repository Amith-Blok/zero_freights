'use client'
import { useEffect } from 'react'
import {
  LoadDgForm,
  LoadFclForm,
  LoadIgForm,
  LoadLclForm,
  LoadOogForm,
  LoadRfForm,
} from './load-mode-sea-form'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { useFormContext } from 'react-hook-form'
import { ModesType } from '@/schema/sea-schema'
import { SEA_MODES } from '@/constants/sea-form'

export const LoadSeaForm = () => {
  const { watch, setValue } = useFormContext()

  const watchMode: ModesType = watch('modes')
  useEffect(() => {
    if (watchMode == 'LCL') {
      const defaultLclLoad = [
        {
          lcl_wid: undefined,
          lcl_hgt: undefined,
          lcl_lgt: undefined,
          lcl_volume_unit: 'CM',
          lcl_quantity: undefined,
          lcl_weight: undefined,
          lcl_weight_unit: 'KG',
        },
      ]
      setValue('lcl_load', defaultLclLoad)
    }
    if (watchMode == 'OOG') {
      const defaultOogLoad = [
        {
          oog_type: 'OT40',
          oog_wid: undefined,
          oog_hgt: undefined,
          oog_lgt: undefined,
          oog_volume_unit: 'CM',
          oog_qty: undefined,
          oog_weight: undefined,
          oog_weight_unit: 'KG',
        },
      ]
      setValue('oog_load', defaultOogLoad)
      setValue('oog_container_type', ['OT40'])
    }
  }, [watchMode, setValue])
  return (
    <>
      <SelectWrapper
        label="Modes of Transporation"
        field="modes"
        data={SEA_MODES}
      />
      {watchMode === 'FCL' && <LoadFclForm />}
      {watchMode === 'LCL' && <LoadLclForm />}
      {watchMode === 'DG' && <LoadDgForm />}
      {watchMode === 'RF' && <LoadRfForm />}
      {watchMode === 'IG' && <LoadIgForm />}
      {watchMode === 'OOG' && <LoadOogForm />}
    </>
  )
}
