import {
  DContainerTypeSmallCase,
  DVContainerType,
  IgContainerSmallCase,
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

export const IG_CONTAINER_TO_Std_IG_CONTAINER_MAPPER: Record<
  IgContainerSmallCase,
  string
> = {
  ot2: 'OT20',
  ot4: 'OT40',
  fr2: 'FR20',
  fr4: 'FR40',
  fr5: 'FR45',
}
