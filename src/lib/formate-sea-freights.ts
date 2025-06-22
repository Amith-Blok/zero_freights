// src/utils/formatSeaFreightRates.ts
export type SeaFreightRaw = {
  containerType: string
  rates: Array<{
    lineName: string
    amount: number
    currency: string
  }>
}

export type SeaFreightRow = {
  containerType: string
  amount: number
  currency: string
}

export function formatRatesByLine(
  seaFreightRates: SeaFreightRaw[],
  selectedCurrency: 'USD' | 'INR',
  currencyRates: { usdToInr: number }
): Array<{ lineName: string; data: SeaFreightRow[] }> {
  const lines = Array.from(
    new Set(seaFreightRates.flatMap((c) => c.rates.map((r) => r.lineName)))
  )

  return lines.map((line) => {
    const tableData: SeaFreightRow[] = seaFreightRates.map((container) => {
      const rateInfo = container.rates.find((r) => r.lineName === line)
      let amount = rateInfo?.amount ?? 0
      let currency = rateInfo?.currency ?? selectedCurrency

      // Convert currency if needed
      if (currency !== selectedCurrency) {
        if (currency === 'USD' && selectedCurrency === 'INR') {
          amount = amount * currencyRates.usdToInr
          currency = 'INR'
        } else if (currency === 'INR' && selectedCurrency === 'USD') {
          amount = amount / currencyRates.usdToInr
          currency = 'USD'
        }
      }

      return {
        containerType: container.containerType,
        amount,
        currency,
      }
    })

    return { lineName: line, data: tableData }
  })
}
