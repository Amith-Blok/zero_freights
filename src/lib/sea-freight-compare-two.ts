export type SeaFreightRaw = {
  containerType: string
  rates: Array<{
    lineName: string
    amount: number
    currency: string
  }>
}

export type SeaFreightRow = {
  label: string
  d2: number
  d4: number
  d5: number
  currency: string
}

export function formatRatesByLine(
  seaFreightRates: SeaFreightRaw[],
  selectedCurrency: 'USD' | 'INR',
  currencyRates: { usdToInr: number }
): Array<{ lineName: string; data: SeaFreightRow }> {
  const lines = Array.from(
    new Set(seaFreightRates.flatMap((c) => c.rates.map((r) => r.lineName)))
  )

  return lines.map((line) => {
    let tableData: SeaFreightRow = {
      label: 'Ocean Freight',
      currency: selectedCurrency,
      d2: 0,
      d4: 0,
      d5: 0,
    }

    for (let containers of seaFreightRates) {
      for (let rates of containers.rates) {
        if (rates.lineName !== line) continue

        let amount = rates.amount ?? 0
        let rateCurrency = rates.currency ?? 'USD'

        if (rateCurrency !== selectedCurrency) {
          if (rateCurrency === 'USD' && selectedCurrency === 'INR') {
            amount *= currencyRates.usdToInr
          } else if (rateCurrency === 'INR' && selectedCurrency === 'USD') {
            amount /= currencyRates.usdToInr
          }
        }

        if (containers.containerType === '22GP') tableData.d2 = amount
        if (containers.containerType === '42GP') tableData.d4 = amount
        if (containers.containerType === '45GP') tableData.d5 = amount
      }
    }

    return { lineName: line, data: tableData }
  })
}
// src/utils/formatSectionCharges.ts
export type SectionRaw = {
  name: string // e.g. "EXPORT_SURCHARGES"
  label: string // e.g. "Export Surcharges"
  data: Array<{
    name: string // e.g. "Terminal Handling Charge Orig."
    code: string // e.g. "THO"
    currency: string // "USD" or "INR"
    containers: Array<{
      containerType: string // "22GP" / "42GP" / "45GP"
      amount: number
    }>
  }>
}

export type SectionRow = {
  label: string
  d2: number
  d4: number
  d5: number
  currency: string
}

export function flattenSections(
  sections: SectionRaw[],
  selectedCurrency: 'USD' | 'INR',
  currencyRates: { usdToInr: number }
): SectionRow[] {
  const rows: SectionRow[] = []

  sections.forEach((section) => {
    section.data.forEach((item) => {
      let d2 = 0,
        d4 = 0,
        d5 = 0
      let currency = item.currency
      item.containers.forEach((container) => {
        let amount = container.amount

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
        if (container.containerType == '22GP') d2 = amount ?? 0
        if (container.containerType == '42GP') d4 = amount ?? 0
        if (container.containerType == '45GP') d5 = amount ?? 0
      })
      rows.push({
        label: item.name,
        currency,
        d2,
        d4,
        d5,
      })
    })
  })

  return rows
}
