'use client'
import {
  FCL_CONTAINER_TYPE_LIST,
  IN_CM,
  KG_LBS,
  LCL_PACKAGE_TYPE_LIST,
} from '@/constants'
import { InputSelect } from '@/components/quote-forms/_components/form-wrapper/input-select'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { InputWrapper } from '../_components/form-wrapper/input-wrapper'
import { FieldArrayLoadComp } from '../_components/fieldarray-load-comp'
import { CbmComponent } from '../_components/cbm-comp'

export const LoadSeaportForm = () => {
  return (
    <>
      <div className="sm:flex sm:space-x-4">
        <SelectWrapper
          label="Container type"
          field="sea_container_type"
          data={FCL_CONTAINER_TYPE_LIST}
          divClass="sm:w-1/2 my-2"
        />
        <InputWrapper
          inputProps={{ type: 'number', placeholder: 'qty' }}
          field="sea_quantity"
          label="Quantity"
          divClass="sm:w-1/2 my-2"
        />
      </div>
      <InputSelect
        label="Weight"
        inputProps={{ type: 'number', step: 0.01, placeholder: 'weight' }}
        inputField="sea_weight"
        selectField="sea_unit"
        data={[...KG_LBS]}
      />
    </>
  )
}

export const LoadDomesticForm = () => {
  return (
    <div className="mt-2">
      <SelectWrapper
        label="LCL Container Type"
        field="domestic_container_type"
        data={LCL_PACKAGE_TYPE_LIST}
      />
      <FieldArrayLoadComp
        fieldArrayName="domestic_load"
        dimLabel="Volumne"
        dimInputFieldOne="domestic_lgt"
        dimInputFieldTwo="domestic_hgt"
        dimInputFieldThree="domestic_wid"
        dimSelectField="domestic_volume_unit"
        dimSelectData={[...IN_CM]}
        inputField="domestic_quantity"
        inputSelectFieldOne="domestic_weight"
        inputSelectFieldTwo="domestic_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
      <CbmComponent
        fieldArrayName="domestic_load"
        cbmField="domestic_cbm_ton"
        widthField="domestic_wid"
        lengthField="domestic_lgt"
        heightField="domestic_hgt"
        weightField="domestic_weight"
        quantityField="domestic_quantity"
        volumeUnitField="domestic_volume_unit"
        weightUnitField="domestic_weight_unit"
      />
    </div>
  )
}

export const LoadAirportForm = () => {
  return (
    <div className="flex flex-col sm:space-y-2">
      <FieldArrayLoadComp
        fieldArrayName="airport_load"
        dimLabel="Volume"
        dimInputFieldOne="airport_lgt"
        dimInputFieldTwo="airport_hgt"
        dimInputFieldThree="airport_wid"
        dimSelectField="airport_volume_unit"
        dimSelectData={[...IN_CM]}
        inputField="airport_quantity"
        inputSelectFieldOne="airport_weight"
        inputSelectFieldTwo="airport_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
      <CbmComponent
        fieldArrayName="airport_load"
        cbmField="airport_cbm_ton"
        widthField="airport_wid"
        lengthField="airport_lgt"
        heightField="airport_hgt"
        weightField="airport_weight"
        quantityField="airport_quantity"
        volumeUnitField="airport_volume_unit"
        weightUnitField="airport_weight_unit"
      />
    </div>
  )
}
