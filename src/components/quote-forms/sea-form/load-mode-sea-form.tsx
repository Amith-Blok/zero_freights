'use client'
import {
  BULK_TYPE_LIST,
  IN_CM,
  KG_LBS,
  KG_LBS_DAY,
  LCL_PACKAGE_TYPE_LIST,
} from '@/constants'
import { InputSelect } from '@/components/quote-forms/_components/form-wrapper/input-select'
import { SelectWrapper } from '../_components/form-wrapper/select-wrapper'
import { FieldArrayLoadComp } from '../_components/fieldarray-load-comp'
import { CbmComponent } from '../_components/cbm-comp'
import MultiSelectWrapper from '../_components/form-wrapper/multi-select-wrapper'

export const LoadFclForm = () => {
  return (
    <>
      <MultiSelectWrapper />
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

export const LoadBulkForm = () => {
  return (
    <div>
      <div className="flex flex-col sm:space-y-2">
        <SelectWrapper
          label="Ship type"
          field="bullk_type"
          data={BULK_TYPE_LIST}
        />
        {/* NOTE:lm is custom screen size */}
        <div className="flex w-full gap-2 sm:flex-row lg:flex-row lm:flex-col">
          <InputSelect
            label="Loading Rate"
            inputProps={{ type: 'number', placeholder: '2', step: 0.01 }}
            inputField="bulk_loading_rate"
            selectField="bulk_loading_unit"
            data={[...KG_LBS_DAY]}
          />
          <InputSelect
            label="Discharge Rate"
            inputProps={{ type: 'number', placeholder: '2', step: 0.01 }}
            inputField="bulk_discharge_rate"
            selectField="bulk_discharge_unit"
            data={[...KG_LBS_DAY]}
          />
        </div>
      </div>
      <FieldArrayLoadComp
        fieldArrayName="bulk_load"
        dimLabel="Volume"
        dimInputFieldOne="bulk_lgt"
        dimInputFieldTwo="bulk_hgt"
        dimInputFieldThree="bulk_wid"
        dimSelectField="bulk_volume_unit"
        dimSelectData={[...IN_CM]}
        inputField="bulk_quantity"
        inputSelectFieldOne="bulk_weight"
        inputSelectFieldTwo="bulk_weight_unit"
        inputSelecFieldData={[...KG_LBS]}
      />
      <CbmComponent
        fieldArrayName="bulk_load"
        cbmField="bulk_cbm_ton"
        widthField="bulk_wid"
        lengthField="bulk_lgt"
        heightField="bulk_hgt"
        weightField="bulk_weight"
        quantityField="bulk_quantity"
        volumeUnitField="bulk_volume_unit"
        weightUnitField="bulk_weight_unit"
      />
    </div>
  )
}
