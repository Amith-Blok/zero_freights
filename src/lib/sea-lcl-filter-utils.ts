import { LabeledCost } from '@/models/offer/shared-types'

interface IFilterState {
  currency: 'INR' | 'USD'
}
interface IData {
  label: string
  price: number
  currency: 'INR' | 'USD'
}
interface ISeaLclFilterAndSortProps {
  data: LabeledCost[]
  filterState: IFilterState
}
export const seaLclFilterAndSort = ({
  data,
  filterState,
}: ISeaLclFilterAndSortProps): IData[] => {
  const filteredData: IData[] = []

  data.forEach((d) => {
    const currency = filterState.currency
    filteredData.push({
      label: d.label,
      currency: currency == 'USD' ? 'USD' : 'INR',
      price: currency == 'USD' ? d.usd : d.inr,
    })
  })

  return filteredData
}
