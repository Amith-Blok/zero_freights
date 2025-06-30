import { convertDToStdContainer } from '@/lib/container'
import { currencyConverter } from '@/lib/exchange'
import { fclContainerToDContainer } from '@/lib/utils'
import {
  ContainerCostZodType,
  LineContainerCostZodType,
} from '@/schema/models/common-zod'

export const getTableFromSeaFcl = ({
  offers,
  line_name,
  container_type,
}: {
  offers: {
    line_charges: LineContainerCostZodType[]
    local_charges: ContainerCostZodType[]
  }
  line_name: string
  container_type: string
}) => {
  const linesFreightRates = offers.line_charges
  const allowedTypes = ['d2', 'd4', 'd5'] as const
  const containerType = allowedTypes.includes(
    container_type.toLowerCase() as any
  )
    ? (container_type.toLowerCase() as 'd2' | 'd4' | 'd5')
    : (fclContainerToDContainer(container_type).toLowerCase() as
        | 'd2'
        | 'd4'
        | 'd5')
  const containerLabel = convertDToStdContainer(containerType)

  const userSelectedLinesFreightRates = linesFreightRates.find(
    (line) => line.line_name == line_name.toLowerCase()
  )

  if (!userSelectedLinesFreightRates) {
    throw Error('invalid request cant find line_name')
  }

  const lineCharge = [userSelectedLinesFreightRates.data].map((rate) => ({
    label: rate.label,
    inr: currencyConverter({
      cost: rate[containerType],
      sourceCurrency: rate.currency as any,
      targetCurrency: 'INR',
    }),
    usd: currencyConverter({
      cost: rate[containerType],
      sourceCurrency: rate.currency as any,
      targetCurrency: 'USD',
    }),
  }))
  const localsRates = offers.local_charges

  const filteredLocalCharges = localsRates.map((rate) => ({
    label: rate.label,
    inr: currencyConverter({
      cost: rate[containerType],
      sourceCurrency: rate.currency as any,
      targetCurrency: 'INR',
    }),
    usd: currencyConverter({
      cost: rate[containerType],
      sourceCurrency: rate.currency as any,
      targetCurrency: 'USD',
    }),
  }))

  const data = [...lineCharge, ...filteredLocalCharges]
  return {
    data,
    containerLabel,
    lineName: userSelectedLinesFreightRates.line_name,
    tranistTime: userSelectedLinesFreightRates.port_to_days ?? 40,
  }
}
