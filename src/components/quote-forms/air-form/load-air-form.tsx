import { IN_CM, KG_LBS } from '@/constants'
import { useEffect } from 'react'
import { FieldArrayLoadComp } from '../_components/fieldarray-load-comp'
import { useFormContext } from 'react-hook-form'
import { CbmComponent } from '../_components/cbm-comp'

export const LoadAirForm = () => {
  const { setValue } = useFormContext()
  useEffect(() => {
    setValue('air_load', [
      {
        air_wid: undefined,
        air_hgt: undefined,
        air_lgt: undefined,
        air_volume_unit: 'CM',
        air_quantity: undefined,
        air_weight: undefined,
        air_weight_unit: 'KG',
      },
    ])
  }, [setValue])

  return (
    <>
      <FieldArrayLoadComp
        fieldArrayName="air_load"
        dimLabel="Volume"
        dimInputFieldOne="air_lgt"
        dimInputFieldTwo="air_hgt"
        dimInputFieldThree="air_wid"
        dimSelectField="air_volume_unit"
        dimSelectData={[...IN_CM]}
        inputField="air_quantity"
        inputSelectFieldOne="air_weight"
        inputSelectFieldTwo="air_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
      <CbmComponent
        fieldArrayName="air_load"
        cbmField="air_cbm_ton"
        widthField="air_wid"
        lengthField="air_lgt"
        heightField="air_hgt"
        weightField="air_weight"
        quantityField="air_quantity"
        volumeUnitField="air_volume_unit"
        weightUnitField="air_weight_unit"
      />
    </>
  )
}
