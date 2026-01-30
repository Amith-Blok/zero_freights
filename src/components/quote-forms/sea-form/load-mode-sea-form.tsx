'use client'
import { IN_CM, KG_LBS, LCL_PACKAGE_TYPE_LIST } from '@/constants'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { FieldArrayLoadComp } from '../_components/fieldarray-load-comp'
import { CbmComponent } from '../_components/cbm-comp'
import { SeaFclLoadFormWrapper } from '../_components/form-wrapper/sea-fcl-load-form-wrapper'
import { DG_CLASSES_OPTIONS } from '@/constants/sea-dg-form'
import InputInlineAddonWrapper from '../_components/form-wrapper/input-inline-addon-wrapper'
import { SeaIgLoadFormWrapper } from '../_components/form-wrapper/sea-ig-load-form-wrapper'
import { InputWrapper } from '../_components/form-wrapper/input-wrapper'
import { ChangeEvent } from 'react'
import { FieldArrayOogLoadComp } from '../_components/form-wrapper/sea-oog-load-form-wrapper'

export const LoadFclForm = () => {
  return (
    <>
      <SeaFclLoadFormWrapper prefix="fcl" />
    </>
  )
}

export const LoadLclForm = () => {
  return (
    <div className="mt-2">
      <SelectWrapper
        label="LCL Container Type"
        field="lcl_container_type"
        data={LCL_PACKAGE_TYPE_LIST}
        divClass="w-full my-2"
      />
      <FieldArrayLoadComp
        fieldArrayName="lcl_load"
        dimLabel="Volume"
        dimInputFieldOne="lcl_lgt"
        dimInputFieldTwo="lcl_hgt"
        dimInputFieldThree="lcl_wid"
        dimSelectField="lcl_volume_unit"
        dimSelectData={[...IN_CM]}
        inputField="lcl_quantity"
        inputSelectFieldOne="lcl_weight"
        inputSelectFieldTwo="lcl_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
      <CbmComponent
        fieldArrayName="lcl_load"
        cbmField="lcl_cbm_ton"
        widthField="lcl_wid"
        lengthField="lcl_lgt"
        heightField="lcl_hgt"
        weightField="lcl_weight"
        quantityField="lcl_quantity"
        volumeUnitField="lcl_volume_unit"
        weightUnitField="lcl_weight_unit"
      />
    </div>
  )
}

export const LoadDgForm = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col space-x-2 md:flex-row">
        <SelectWrapper
          label="DG Class"
          field="dg_class"
          data={DG_CLASSES_OPTIONS}
        />
        <InputWrapper
          label="UN Number"
          field="dg_un"
          inputProps={{
            placeholder: '1002',
            type: 'text',
            inputMode: 'numeric',
            onInput: (e: ChangeEvent<HTMLInputElement>) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '')
            },
          }}
        />
      </div>
      <SeaFclLoadFormWrapper prefix="dg" />
    </div>
  )
}

export const LoadRfForm = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col md:flex-row md:space-x-2">
        <InputInlineAddonWrapper
          field="rf_temperture"
          label="Temperture"
          inputProps={{ placeholder: 'temp' }}
          addonBack="°C"
          divClass="w-full md:w-1/2"
        />
        <InputInlineAddonWrapper
          field="rf_humidity"
          label="Humidity"
          inputProps={{ placeholder: 'humidity' }}
          addonBack="%"
          divClass="w-full md:w-1/2"
        />
      </div>
      <SeaFclLoadFormWrapper prefix="rf" />
    </div>
  )
}
export const LoadIgForm = () => {
  return (
    <div className="flex flex-col space-y-2">
      <SeaIgLoadFormWrapper prefix="ig" />
    </div>
  )
}
export const LoadOogForm = () => {
  return (
    <div className="flex flex-col space-y-2">
      <FieldArrayOogLoadComp
        fieldArrayName="oog_load"
        dimLabel="Volume"
        dimInputFieldOne="oog_lgt"
        dimInputFieldTwo="oog_hgt"
        dimInputFieldThree="oog_wid"
        dimSelectField="oog_volume_unit"
        dimSelectData={[...IN_CM]}
        inputFieldOne="oog_qty"
        inputFieldTwo="oog_type"
        inputSelectFieldOne="oog_weight"
        inputSelectFieldTwo="oog_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
    </div>
  )
}
