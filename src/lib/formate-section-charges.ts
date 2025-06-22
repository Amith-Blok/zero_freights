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
  sectionName: string // e.g. "EXPORT_SURCHARGES"
  sectionLabel: string // e.g. "Export Surcharges"
  chargeName: string // e.g. "Terminal Handling Charge Orig."
  code: string // e.g. "THO"
  containerType: string // e.g. "22GP"
  amount: number
  currency: string // "USD" or "INR"
}

export function flattenSections(
  sections: SectionRaw[],
  selectedCurrency: 'USD' | 'INR',
  currencyRates: { usdToInr: number }
): SectionRow[] {
  const rows: SectionRow[] = []

  sections.forEach((section) => {
    section.data.forEach((item) => {
      item.containers.forEach((container) => {
        let amount = container.amount
        let currency = item.currency

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

        rows.push({
          sectionName: section.name,
          sectionLabel: section.label,
          chargeName: item.name,
          code: item.code,
          containerType: container.containerType,
          amount,
          currency,
        })
      })
    })
  })

  return rows
}
