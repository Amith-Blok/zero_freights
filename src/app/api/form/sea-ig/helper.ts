import { LinesChargesType } from '@/models/lines_charges'
import { IgQuantitiesType } from '@/schema/sea-schema'
import { filterHaulageRateByWeight } from '../helper/india-haulage-rate'
import { getAllIndiaOutboundHaulageRatesByCode } from '@/data/india-outbound-haulage'
import { IncotermsType } from '@/schema/sea-schema'
import { HsSixType } from '@/models/hs-six'
import { getDutyByHsCodeCountry } from '@/data/duties'

const IG_ADDITIONAL_FREIGHT_MULTIPLIER = 2.5
const IG_FR_45_MULTIPLIER = 1.5 * 2.5
export function IgLineFormatter({
  linesRates,
  igQuantities,
}: {
  linesRates: LinesChargesType
  igQuantities: IgQuantitiesType
}) {
  const totalQuantity =
    (igQuantities['OT20'] || 0) +
    (igQuantities['OT40'] || 0) +
    (igQuantities['FR20'] || 0) +
    (igQuantities['FR40'] || 0) +
    (igQuantities['FR45'] || 0)

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
            (igQuantities['OT20'] || 0) *
            IG_ADDITIONAL_FREIGHT_MULTIPLIER
          const ot4 =
            item.d4 *
            (igQuantities['OT40'] || 0) *
            IG_ADDITIONAL_FREIGHT_MULTIPLIER
          const fr2 =
            item.d2 *
            (igQuantities['FR20'] || 0) *
            IG_ADDITIONAL_FREIGHT_MULTIPLIER
          const fr4 =
            item.d4 *
            (igQuantities['FR40'] || 0) *
            IG_ADDITIONAL_FREIGHT_MULTIPLIER
          const fr5 =
            item.d5 * (igQuantities['FR45'] || 0) * IG_FR_45_MULTIPLIER
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
          let ot2 = (igQuantities['OT20'] || 0) > 0 ? item.d2 : 0
          let ot4 = (igQuantities['OT40'] || 0) > 0 ? item.d4 : 0
          let fr2 = (igQuantities['FR20'] || 0) > 0 ? item.d2 : 0
          let fr4 = (igQuantities['FR40'] || 0) > 0 ? item.d4 : 0
          let fr5 = (igQuantities['FR45'] || 0) > 0 ? item.d5 : 0
          let total = 0

          if (multipleByTotalQuantityCode.includes(item.code)) {
            total = item.d2 * totalQuantity
          } else if (multipleBySpecificQuantityCode.includes(item.code)) {
            ot2 = ot2 * (igQuantities['OT20'] || 0)
            ot4 = ot4 * (igQuantities['OT40'] || 0)
            fr2 = fr2 * (igQuantities['FR20'] || 0)
            fr4 = fr4 * (igQuantities['FR40'] || 0)
            fr5 = fr5 * (igQuantities['FR45'] || 0)
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

export async function getIgRailCost({
  ori_country,
  ori_port_rail,
  des_country,
  des_port_rail,
  ori_port_if_rail,
  des_port_if_rail,
  unit,
  weights,
  quantities,
}: any) {
  const indianRail =
    ori_country == 'IN' && ori_port_rail.type == 'RAIL'
      ? ori_port_rail
      : des_country == 'IN' && des_port_rail.type == 'RAIL'
        ? des_port_rail
        : undefined
  const indianPortForRail =
    !!indianRail && (ori_country == 'IN' ? ori_port_if_rail : des_port_if_rail)

  if (indianRail && indianPortForRail) {
    const IndiaOutboundHaulageRates =
      await getAllIndiaOutboundHaulageRatesByCode({
        start_code: indianRail.port_code,
        end_code: indianPortForRail.port_code,
      })
    const map: Record<string, string> = {
      OT20: '20STD',
      OT40: '40STD',
      FR20: '20STD',
      FR40: '40STD',
      FR45: '40HC',
    }
    const dmap: Record<string, 'd2' | 'd4' | 'd5'> = {
      OT20: 'd2',
      OT40: 'd4',
      FR20: 'd2',
      FR40: 'd4',
      FR45: 'd5',
    }
    let iterList = Object.keys(map)
    let tempRates: any = {}
    for (let key of iterList) {
      let weight = weights[key]
      let quantity = quantities[key]
      let haulageRate = filterHaulageRateByWeight({
        haulageRates: IndiaOutboundHaulageRates,
        weights: { [map[key] as string]: weight },
        unit,
        quantities: { [map[key] as string]: quantity },
      })
      tempRates[key] = haulageRate[dmap[key] as keyof typeof haulageRate]
    }

    const indianRailRate = {
      ot2: tempRates['OT20'] || 0,
      ot4: tempRates['OT40'] || 0,
      fr2: tempRates['FR20'] || 0,
      fr4: tempRates['FR40'] || 0,
      fr5: tempRates['FR45'] || 0,
      total:
        (tempRates['OT20'] || 0) +
        (tempRates['OT40'] || 0) +
        (tempRates['FR20'] || 0) +
        (tempRates['FR40'] || 0) +
        (tempRates['FR45'] || 0),
    }

    if (!indianRailRate.total && indianRailRate.total !== 0) {
      throw Error("Couldn't find rail rate. Please try with other port")
    }

    return { indianRail, indianPortForRail, indianRailRate }
  }

  return undefined
}

export async function getIgDutyIfNeeded({
  incoterms,
  hsn,
  des_country,
  value,
  totalQuantity,
}: {
  incoterms: IncotermsType
  hsn: HsSixType
  des_country: string
  value: number
  totalQuantity: number
}) {
  if (incoterms !== 'DAP') {
    const duty = await getDutyByHsCodeCountry(hsn.code, des_country).catch(
      (error) => {
        console.log({ error })
        return undefined
      }
    )
    console.log({ duty })
    if (typeof duty === 'number') {
      return {
        label: `Duty ${duty.toFixed(2)}%`,
        currency: 'USD',
        additional_notes: `Duty:${duty}%`,
        ot2: (duty * value) / 100,
        ot4: (duty * value) / 100,
        fr2: (duty * value) / 100,
        fr4: (duty * value) / 100,
        fr5: (duty * value) / 100,
        total: ((duty * value) / 100) * totalQuantity,
        tag: `HS: ${hsn.code}`,
        valueTag: `${value} USD`,
        dutyTag: `DUTY: ${duty.toFixed(2)}%`,
      }
    }
  }
  return null
}
