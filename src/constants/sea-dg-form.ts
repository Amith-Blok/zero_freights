import { DgClassCodeType } from '@/types/sea-dg'

export const DG_CLASS_CODE = [
  'C1',
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
  'C7',
  'C8',
  'C9',
] as const

export const DG_CLASSES_OPTIONS = [
  { label: 'Class 1: Explosives', value: 'C1' },
  { label: 'Class 2: Gases', value: 'C2' },
  { label: 'Class 3: Flammable Liquids', value: 'C3' },
  { label: 'Class 4: Flammable Solids', value: 'C4' },
  { label: 'Class 5: Oxidizing Substances and Organic Peroxides', value: 'C5' },
  { label: 'Class 6: Toxic and Infectious Substances', value: 'C6' },
  { label: 'Class 7: Radioactive Materials', value: 'C7' },
  { label: 'Class 8: Corrosive Substances', value: 'C8' },
  { label: 'Class 9: Miscellaneous Dangerous Goods', value: 'C9' },
]

export const DG_CLASS_CODE_MAPPER: Record<DgClassCodeType, string> = {
  C1: 'Class 1',
  C2: 'Class 2',
  C3: 'Class 3',
  C4: 'Class 4',
  C5: 'Class 5',
  C6: 'Class 6',
  C7: 'Class 7',
  C8: 'Class 8',
  C9: 'Class 9',
}
