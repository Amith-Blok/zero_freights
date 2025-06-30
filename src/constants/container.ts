import {
  DContainerTypeSmallCase,
  DVContainerType,
  STDContainerType,
} from '@/types/containers'

export const D_TO_STD_CONTAINER_MAPPER: Record<
  DContainerTypeSmallCase,
  STDContainerType
> = {
  d2: '20STD',
  d4: '40STD',
  d5: '40HC',
}

export const DV_TO_STD_CONTAINER_MAPPER: Record<
  DVContainerType,
  STDContainerType
> = {
  '20DV': '20STD',
  '40DV': '40STD',
  '40HC': '40HC',
}
