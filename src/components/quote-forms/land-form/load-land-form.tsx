import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { LAND_MODES } from '@/constants'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { LoadAirportForm } from './load-mode-land-form'
import { LoadDomesticForm } from './load-mode-land-form'
import { LoadSeaportForm } from './load-mode-land-form'
export const LoadLandForm = () => {
  const { watch, setValue } = useFormContext()
  const watchMode = watch('modes')
  useEffect(() => {
    if (watchMode == 'DOMESTIC_TRUCKING') {
      const defaultDomesticLandLoad = [
        {
          domestic_wid: undefined,
          domestic_hgt: undefined,
          domestic_lgt: undefined,
          domestic_volume_unit: 'CM',
          domestic_quantity: undefined,
          domestic_weight: undefined,
          domestic_weight_unit: 'KG',
        },
      ]
      setValue('domestic_load', defaultDomesticLandLoad)
    }
    if (watchMode == 'AIRPORT_TRUCKING') {
      const defaultAirportTruckingLandLoad = [
        {
          airport_wid: undefined,
          airport_hgt: undefined,
          airport_lgt: undefined,
          airport_volume_unit: 'CM',
          airport_quantity: undefined,
          airport_weight: undefined,
          airport_weight_unit: 'KG',
        },
      ]
      setValue('airport_load', defaultAirportTruckingLandLoad)
    }
  }, [setValue, watchMode])
  return (
    <>
      <SelectWrapper
        label="Modes of Transporation"
        field="modes"
        data={LAND_MODES}
      />
      {watchMode === 'SEAPORT_TRUCKING' && <LoadSeaportForm />}
      {watchMode === 'DOMESTIC_TRUCKING' && <LoadDomesticForm />}
      {watchMode === 'AIRPORT_TRUCKING' && <LoadAirportForm />}
    </>
  )
}
