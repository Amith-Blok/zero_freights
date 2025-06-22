import { LinesChargesType } from '@/models/lines_charges'

export const formatLines = ({
  linesCharges,
}: {
  linesCharges: LinesChargesType
}) => {
  let sea_freights_records = []
  let locals = []
  let sea_freights = []

  const lines = linesCharges.lines
  for (let [idx, line] of lines.entries()) {
    const lineName = line.line_name
    const portToDays = line.estimated_days > 1 ? line.estimated_days : 40
    const validTo = line.valid_to || ''

    for (let section of line.sections) {
      for (let item of section.data) {
        if (item.code == 'SEA') {
          sea_freights.push({
            label: item.name,
            currency: item.currency,
            additional_notes: item?.additional_notes || '',
            d2: item.d2,
            d4: item.d4,
            d5: item.d5,
          })
          continue
        }
        if (idx == 0 && item.is_considered_for_total) {
          locals.push({
            label: item.name,
            currency: item.currency,
            additional_notes: item?.additional_notes || '',
            d2: item.d2,
            d4: item.d4,
            d5: item.d5,
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
  return { sea_freights: sea_freights_records, local_charges: locals }
}
