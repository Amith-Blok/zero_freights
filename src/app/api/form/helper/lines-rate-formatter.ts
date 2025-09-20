import { LinesChargesType } from '@/models/lines_charges'
import { FclQuantitiesType } from '@/schema/sea-schema'

export const formatLines = ({
  linesCharges,
  fclQuantities,
}: {
  linesCharges: LinesChargesType
  fclQuantities: FclQuantitiesType
}) => {
  const totalQuantity =
    (fclQuantities['20STD'] || 0) +
    (fclQuantities['40STD'] || 0) +
    (fclQuantities['40HC'] || 0)
  let sea_freights_records = []
  let locals = []
  let sea_freights = []

  const lines = linesCharges.lines
  for (let [idx, line] of lines.entries()) {
    const lineName = line.line_name
    const portToDays = line.estimated_days > 1 ? line.estimated_days : 40
    const validTo =
      line.valid_to ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    for (let section of line.sections) {
      for (let item of section.data) {
        if (item.code == 'SEA') {
          const d2 = item.d2 * (fclQuantities['20STD'] || 0)
          const d4 = item.d4 * (fclQuantities['40STD'] || 0)
          const d5 = item.d5 * (fclQuantities['40HC'] || 0)
          const total = d2 + d4 + d5

          sea_freights.push({
            label: item.name,
            currency: item.currency,
            additional_notes: item?.additional_notes || '',
            d2: d2,
            d4: d4,
            d5: d5,
            total: total,
          })
          continue
        }
        //NOTE: local is gonna be same for all lines thus only one time is needed
        if (idx == 0 && item.is_considered_for_total) {
          const multipleByTotalQuantityCode = ['MDF', 'ESF', 'BLF']
          const multipleBySpecificQuantityCode = ['THO']
          let d2 = (fclQuantities['20STD'] || 0) > 0 ? item.d2 : 0
          let d4 = (fclQuantities['40STD'] || 0) > 0 ? item.d4 : 0
          let d5 = (fclQuantities['40HC'] || 0) > 0 ? item.d5 : 0
          let total = 0

          if (multipleByTotalQuantityCode.includes(item.code)) {
            total = item.d2 * totalQuantity
          } else if (multipleBySpecificQuantityCode.includes(item.code)) {
            d2 = d2 * (fclQuantities['20STD'] || 0)
            d4 = d4 * (fclQuantities['40STD'] || 0)
            d5 = d5 * (fclQuantities['40HC'] || 0)
            total = d2 + d4 + d5
          } else {
            total = d2 + d4 + d5
          }

          locals.push({
            label: item.name,
            currency: item.currency,
            additional_notes: item?.additional_notes || '',
            d2: d2,
            d4: d4,
            d5: d5,
            total: total,
          })
        }
      }
    }
    sea_freights_records.push({
      line_name: lineName,
      port_to_days: portToDays,
      valid_to: validTo,
      data: sea_freights[idx],
    })
  }
  return { line_charges: sea_freights_records, local_charges: locals }
}
