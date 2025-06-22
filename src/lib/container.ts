import { D_TO_STD_CONTAINER_MAPPER } from '@/constants/container'
import { DContainerTypeSmallCase } from '@/types/containers'

export const convertDToStdContainer = (contianer: DContainerTypeSmallCase) => {
  return D_TO_STD_CONTAINER_MAPPER[contianer]
}
