import { ModesType } from '@/schema/sea-schema'

export function getApiRouteStringForSeaFormByMode(
  mode: ModesType
): string | null {
  switch (mode) {
    case 'FCL':
      return 'sea-fcl'
    case 'LCL':
      return 'sea-lcl'
    case 'DG':
      return 'sea-dg'
    case 'RF':
      return 'sea-rf'
    case 'IG':
      return 'sea-ig'
    case 'OOG':
      return 'sea-oog'
    default:
      return null
  }
}
