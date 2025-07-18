'use client'
import {
  BULK_TYPE_LIST,
  FCL_CONTAINER_TYPE_LIST,
  IN_CM,
  KG_LBS,
  // KG_LBS_DAY,
  LCL_PACKAGE_TYPE_LIST,
} from '@/constants'
import { InputSelect } from '@/components/quote-forms/_components/form-wrapper/input-select'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { InputWrapper } from '../_components/form-wrapper/input-wrapper'
import { FieldArrayLoadComp } from '../_components/fieldarray-load-comp'
import { CbmComponent } from '../_components/cbm-comp'
import { CheckBoxWrapper } from '../_components/form-wrapper/check-box-wrapper'

export const LoadFclWarehouseForm = () => {
  return (
    <>
      <div className="my-2 flex gap-2">
        <CheckBoxWrapper label="DG Cargo" field="dg" labelClass="font-normal" />
        <CheckBoxWrapper
          label="Floor Loaded"
          field="floor"
          labelClass="font-normal"
        />
      </div>
      <InputWrapper
        label="Storage days"
        field="storage_days"
        inputProps={{ type: 'number', placeholder: 'Enter storage days' }}
      />
      <div className="sm:flex sm:space-x-4">
        <SelectWrapper
          label="Container type"
          field="fcl_container_type"
          data={FCL_CONTAINER_TYPE_LIST}
          divClass="sm:w-1/2 my-2"
        />
        <InputWrapper
          inputProps={{ type: 'number', placeholder: 'Enter quantity' }}
          field="fcl_quantity"
          label="Quantity"
          divClass="sm:w-1/2 my-2"
        />
      </div>
      <InputSelect
        label="Weight"
        inputProps={{
          type: 'number',
          step: 0.01,
          placeholder: 'Enter weight',
        }}
        inputField="fcl_weight"
        selectField="fcl_unit"
        data={[...KG_LBS]}
      />
      <FieldArrayLoadComp
        fieldArrayName="fcl_load"
        dimLabel="Volumne"
        dimInputFieldOne="fcl_lgt"
        dimInputFieldTwo="fcl_hgt"
        dimInputFieldThree="fcl_wid"
        dimSelectField="fcl_volume_unit"
        dimSelectData={[...IN_CM]}
        inputField="fcl_quantity"
        inputSelectFieldOne="fcl_weight"
        inputSelectFieldTwo="fcl_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
      <CbmComponent
        fieldArrayName="fcl_load"
        cbmField="fcl_cbm_ton"
        widthField="fcl_wid"
        lengthField="fcl_lgt"
        heightField="fcl_hgt"
        weightField="fcl_weight"
        quantityField="fcl_quantity"
        volumeUnitField="fcl_volume_unit"
        weightUnitField="fcl_weight_unit"
      />
    </>
  )
}

export const LoadLclWarehouseForm = () => {
  return (
    <div>
      <div className="my-2 flex gap-2">
        <CheckBoxWrapper label="DG Cargo" field="dg" labelClass="font-normal" />
        <CheckBoxWrapper
          label="Floor Loaded"
          field="floor"
          labelClass="font-normal"
        />
      </div>
      <InputWrapper
        label="Storage days"
        field="storage_days"
        inputProps={{ type: 'number', placeholder: 'Enter storage days' }}
      />
      <SelectWrapper
        label="LCL Container Type"
        field="lcl_container_type"
        data={LCL_PACKAGE_TYPE_LIST}
      />
      <FieldArrayLoadComp
        fieldArrayName="lcl_load"
        dimLabel="Volumne"
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

export const LoadLtlWarehouseForm = () => {
  return (
    <div>
      <div className="my-2 flex gap-2">
        <CheckBoxWrapper label="DG Cargo" field="dg" labelClass="font-normal" />
        <CheckBoxWrapper
          label="Floor Loaded"
          field="floor"
          labelClass="font-normal"
        />
      </div>
      <InputWrapper
        label="Storage days"
        field="storage_days"
        inputProps={{ type: 'number', placeholder: 'Enter storage days' }}
      />
      <SelectWrapper label="Ship type" field="ltl_type" data={BULK_TYPE_LIST} />
      <FieldArrayLoadComp
        fieldArrayName="ltl_load"
        dimLabel="Volume"
        dimInputFieldOne="ltl_lgt"
        dimInputFieldTwo="ltl_hgt"
        dimInputFieldThree="ltl_wid"
        dimSelectField="ltl_volume_unit"
        dimSelectData={[...IN_CM]}
        inputField="ltl_quantity"
        inputSelectFieldOne="ltl_weight"
        inputSelectFieldTwo="ltl_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
      <CbmComponent
        fieldArrayName="ltl_load"
        cbmField="ltl_cbm_ton"
        widthField="ltl_wid"
        lengthField="ltl_lgt"
        heightField="ltl_hgt"
        weightField="ltl_weight"
        quantityField="ltl_quantity"
        volumeUnitField="ltl_volume_unit"
        weightUnitField="ltl_weight_unit"
      />
    </div>
  )
}
