import { DG_CLASS_CODE_MAPPER } from '@/constants/sea-dg-form'
import { DgClassCodeType } from '@/types/sea-dg'

export const getDgClassLabelFromCode = (code: DgClassCodeType) => {
  return DG_CLASS_CODE_MAPPER[code]
}
