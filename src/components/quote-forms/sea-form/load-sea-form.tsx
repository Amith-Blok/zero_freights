'use client'
import { useEffect } from 'react'
import { LoadBulkForm, LoadFclForm, LoadLclForm } from './load-mode-sea-form'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { SEA_MODES } from '@/constants'
import { useFormContext } from 'react-hook-form'

export const LoadSeaForm = () => {
  const { watch, setValue } = useFormContext()

  const watchMode: 'FCL' | 'LCL' | 'BULK' = watch('modes')
  useEffect(() => {
    if (watchMode == 'BULK') {
      const defaultBulkLoad = [
        {
          bulk_wid: undefined,
          bulk_hgt: undefined,
          bulk_lgt: undefined,
          bulk_volume_unit: 'CM',
          bulk_quantity: undefined,
          bulk_weight: undefined,
          bulk_weight_unit: 'KG',
        },
      ]
      setValue('bulk_load', defaultBulkLoad)
    }
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
      setValue('pickup_check', true)
      setValue('delivery_check', true)
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
      {watchMode === 'BULK' && <LoadBulkForm />}
    </>
  )
}
