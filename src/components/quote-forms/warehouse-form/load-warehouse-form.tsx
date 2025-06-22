'use client'
import { useEffect } from 'react'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { WAREHOUSE_MODES } from '@/constants'
import { useFormContext } from 'react-hook-form'
import { WarehouseModeType } from '@/schema/warehouse-schema'
import {
  LoadFclWarehouseForm,
  LoadLclWarehouseForm,
  LoadLtlWarehouseForm,
} from './load-mode-warehouse-form'

export const LoadWarehouseForm = () => {
  const { watch, setValue } = useFormContext()

  const watchMode: WarehouseModeType = watch('modes')
  useEffect(() => {
    if (watchMode == 'LCL_WAREHOUSE') {
      const defaultBulkLoad = [
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
      setValue('lcl_load', defaultBulkLoad)
    }
    if (watchMode == 'LTL_WAREHOUSE') {
      const defaultLclLoad = [
        {
          ltl_wid: undefined,
          ltl_hgt: undefined,
          ltl_lgt: undefined,
          ltl_volume_unit: 'CM',
          ltl_quantity: undefined,
          ltl_weight: undefined,
          ltl_weight_unit: 'KG',
        },
      ]
      setValue('ltl_load', defaultLclLoad)
    }
    setValue('is_google_location', false)
  }, [watchMode, setValue])
  return (
    <>
      <SelectWrapper
        label="Modes of Transporation"
        field="modes"
        data={WAREHOUSE_MODES}
      />
      {watchMode === 'FCL_WAREHOUSE' && <LoadFclWarehouseForm />}
      {watchMode === 'LCL_WAREHOUSE' && <LoadLclWarehouseForm />}
      {watchMode === 'LTL_WAREHOUSE' && <LoadLtlWarehouseForm />}
    </>
  )
}
