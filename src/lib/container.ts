import {
  D_TO_STD_CONTAINER_MAPPER,
  DV_TO_STD_CONTAINER_MAPPER,
} from '@/constants/container'
import { DContainerTypeSmallCase, DVContainerType } from '@/types/containers'

export const convertDToStdContainer = (contianer: DContainerTypeSmallCase) => {
  return D_TO_STD_CONTAINER_MAPPER[contianer]
}

export const convertFclToStdContainer = (contianer: DVContainerType) => {
  return DV_TO_STD_CONTAINER_MAPPER[contianer]
}
