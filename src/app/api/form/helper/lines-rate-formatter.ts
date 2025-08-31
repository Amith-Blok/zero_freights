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
    fclQuantities['20STD'] + fclQuantities['40STD'] + fclQuantities['40HC']
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
          const d2 = item.d2 * fclQuantities['20STD']
          const d4 = item.d4 * fclQuantities['40STD']
          const d5 = item.d5 * fclQuantities['40HC']
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
          let d2 = item.d2
          let d4 = item.d4
          let d5 = item.d5
          let total = 0
          if (multipleByTotalQuantityCode.includes(item.code)) {
            total = (d2 + d4 + d5) * totalQuantity
          } else if (multipleBySpecificQuantityCode.includes(item.code)) {
            d2 = d2 * fclQuantities['20STD']
            d4 = d4 * fclQuantities['40STD']
            d5 = d5 * fclQuantities['40HC']
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
