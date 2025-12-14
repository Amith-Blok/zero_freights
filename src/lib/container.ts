import {
  D_TO_STD_CONTAINER_MAPPER,
  DV_TO_STD_CONTAINER_MAPPER,
  IG_CONTAINER_TO_Std_IG_CONTAINER_MAPPER,
} from '@/constants/container'
import {
  DContainerTypeSmallCase,
  DVContainerType,
  IgContainerSmallCase,
} from '@/types/containers'

export const convertDToStdContainer = (contianer: DContainerTypeSmallCase) => {
  return D_TO_STD_CONTAINER_MAPPER[contianer]
}

export const convertFclToStdContainer = (contianer: DVContainerType) => {
  return DV_TO_STD_CONTAINER_MAPPER[contianer]
}

export const convertIgToStdIgContainer = (contianer: IgContainerSmallCase) => {
  return IG_CONTAINER_TO_Std_IG_CONTAINER_MAPPER[contianer]
}
