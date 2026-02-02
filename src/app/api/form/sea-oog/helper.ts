import { LinesChargesType } from '@/models/lines_charges'
import { IgQuantitiesType } from '@/schema/sea-schema'

const OOG_ADDITIONAL_FREIGHT_MULTIPLIER = 4
//OOG Handling Charge Multiplier
const OOG_ADDITIONAL_THO_MULTIPLIER = 4
export function OogLineFormatter({
  linesRates,
  oogQuantities,
}: {
  linesRates: LinesChargesType
  oogQuantities: IgQuantitiesType
}) {
  const totalQuantity =
    (oogQuantities['OT20'] || 0) +
    (oogQuantities['OT40'] || 0) +
    (oogQuantities['FR20'] || 0) +
    (oogQuantities['FR40'] || 0) +
    (oogQuantities['FR45'] || 0)

  let sea_freights_records = []
  let locals = []
  let sea_freights = []

  const lines = linesRates.lines
  for (let [idx, line] of lines.entries()) {
    const lineName = line.line_name
    const portToDays = line.estimated_days > 1 ? line.estimated_days : 40
    const validTo =
      line.valid_to ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    for (let section of line.sections) {
      for (let item of section.data) {
        if (item.code == 'SEA') {
          // Map d2 to ot2 and fr2, d4 to ot4 and fr4, d5 to f5
          const ot2 =
            item.d2 *
            (oogQuantities['OT20'] || 0) *
            OOG_ADDITIONAL_FREIGHT_MULTIPLIER
          const ot4 =
            item.d4 *
            (oogQuantities['OT40'] || 0) *
            OOG_ADDITIONAL_FREIGHT_MULTIPLIER
          const fr2 =
            item.d2 *
            (oogQuantities['FR20'] || 0) *
            OOG_ADDITIONAL_FREIGHT_MULTIPLIER
          const fr4 =
            item.d4 *
            (oogQuantities['FR40'] || 0) *
            OOG_ADDITIONAL_FREIGHT_MULTIPLIER
          const fr5 =
            item.d5 *
            (oogQuantities['FR45'] || 0) *
            OOG_ADDITIONAL_FREIGHT_MULTIPLIER
          const total = ot2 + ot4 + fr2 + fr4 + fr5

          sea_freights.push({
            label: item.name,
            currency: item.currency,
            additional_notes: item?.additional_notes || '',
            ot2: ot2,
            ot4: ot4,
            fr2: fr2,
            fr4: fr4,
            fr5: fr5,
            total: total,
          })
          continue
        }
        // Local charges - only process once (idx == 0)
        if (idx == 0 && item.is_considered_for_total) {
          const multipleByTotalQuantityCode = ['MDF', 'ESF', 'BLF']
          const multipleBySpecificQuantityCode = ['THO']
          let ot2 = (oogQuantities['OT20'] || 0) > 0 ? item.d2 : 0
          let ot4 = (oogQuantities['OT40'] || 0) > 0 ? item.d4 : 0
          let fr2 = (oogQuantities['FR20'] || 0) > 0 ? item.d2 : 0
          let fr4 = (oogQuantities['FR40'] || 0) > 0 ? item.d4 : 0
          let fr5 = (oogQuantities['FR45'] || 0) > 0 ? item.d5 : 0
          let total = 0

          //Multiple THO by 2 for oog
          if (item.code == 'THO') {
            ot2 = ot2 * OOG_ADDITIONAL_THO_MULTIPLIER
            ot4 = ot4 * OOG_ADDITIONAL_THO_MULTIPLIER
            fr2 = fr2 * OOG_ADDITIONAL_THO_MULTIPLIER
            fr4 = fr4 * OOG_ADDITIONAL_THO_MULTIPLIER
            fr5 = fr5 * OOG_ADDITIONAL_THO_MULTIPLIER
          }

          if (multipleByTotalQuantityCode.includes(item.code)) {
            total = item.d2 * totalQuantity
          } else if (multipleBySpecificQuantityCode.includes(item.code)) {
            ot2 = ot2 * (oogQuantities['OT20'] || 0)
            ot4 = ot4 * (oogQuantities['OT40'] || 0)
            fr2 = fr2 * (oogQuantities['FR20'] || 0)
            fr4 = fr4 * (oogQuantities['FR40'] || 0)
            fr5 = fr5 * (oogQuantities['FR45'] || 0)
            total = ot2 + ot4 + fr2 + fr4 + fr5
          } else {
            total = ot2 + ot4 + fr2 + fr4 + fr5
          }

          locals.push({
            label: item.name,
            currency: item.currency,
            additional_notes: item?.additional_notes || '',
            ot2: ot2,
            ot4: ot4,
            fr2: fr2,
            fr4: fr4,
            fr5: fr5,
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
