import { LinesChargesType } from '@/models/lines_charges'
import {
  FclQuantitiesType,
  FclWeightsType,
  FclWeightUnitType,
  IgQuantitiesType,
  IgWeightsType,
  OogLoadType,
  PortIfRailType,
  PortType,
} from '@/schema/sea-schema'
import {
  calculateHaulageCostByWeight,
  getBaseHaulageRatesByWeight,
} from '../helper/india-haulage-rate'
import { getAllIndiaOutboundHaulageRatesByCode } from '@/data/india-outbound-haulage'
import { IncotermsType } from '@/schema/sea-schema'
import { HsSixType } from '@/models/hs-six'
import { getDutyByHsCodeCountry } from '@/data/duties'
import { IgContainerUpperCase, STDContainerType } from '@/types/containers'
import { lbsToKg } from '@/lib/utils'
import { BLOK_RAIL_PROFIT } from '@/constants/profit'

const IG_ADDITIONAL_FREIGHT_MULTIPLIER = 2.5
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
            item.d5 *
            (igQuantities['FR45'] || 0) *
            IG_ADDITIONAL_FREIGHT_MULTIPLIER
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
}: {
  ori_country: string
  des_country: string
  des_port_rail: PortType
  ori_port_rail: PortType
  ori_port_if_rail: PortIfRailType
  des_port_if_rail: PortIfRailType
  unit: FclWeightUnitType
  weights: IgWeightsType
  quantities: IgQuantitiesType
}) {
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
    const map: Record<IgContainerUpperCase, STDContainerType> = {
      OT20: '20STD',
      OT40: '40STD',
      FR20: '20STD',
      FR40: '40STD',
      FR45: '40HC',
    }

    let igLoad = Object.entries(quantities).map(([key, qty]) => ({
      type: key as IgContainerUpperCase,
      qty,
      weight: weights[key as IgContainerUpperCase],
    }))

    let fclWeight = {} as FclWeightsType,
      fclQuantities = {} as FclQuantitiesType
    igLoad.forEach((load) => {
      ;((fclWeight[map[load.type]] = load.weight),
        (fclQuantities[map[load.type]] = load.qty))
    })

    let filteredHaulageRateCost = getBaseHaulageRatesByWeight({
      haulageRates: IndiaOutboundHaulageRates,
      weights: fclWeight,
      unit,
    })

    let ot2 = 0,
      ot4 = 0,
      fr2 = 0,
      fr4 = 0,
      fr5 = 0
    const IG_MULTIPILER = 2.5
    const calc = ({
      rate,
      type,
    }: {
      rate: number
      type: IgContainerUpperCase
    }) => {
      const cost =
        (rate * IG_MULTIPILER + BLOK_RAIL_PROFIT) * (quantities[type] ?? 0)
      return cost
    }
    igLoad.forEach((load) => {
      switch (load.type) {
        case 'OT20':
          ot2 = calc({ rate: filteredHaulageRateCost.d2, type: load.type })
          break
        case 'OT40':
          ot4 = calc({ rate: filteredHaulageRateCost.d4, type: load.type })
          break
        case 'FR20':
          fr2 = calc({ rate: filteredHaulageRateCost.d2, type: load.type })
          break
        case 'FR40':
          fr4 = calc({ rate: filteredHaulageRateCost.d4, type: load.type })
          break
        case 'FR45':
          fr5 = calc({ rate: filteredHaulageRateCost.d5, type: load.type })
          break
      }
    })
    const indianRailRate = {
      ot2,
      ot4,
      fr2,
      fr4,
      fr5,
      total: ot2 + ot4 + fr2 + fr4 + fr5,
    }

    if (!indianRailRate.total && indianRailRate.total !== 0) {
      throw Error("Couldn't find rail rate. Please try with other port")
    }

    return { indianRail, indianPortForRail, indianRailRate }
  }

  return undefined
}

export async function getOogRailCost({
  ori_country,
  ori_port_rail,
  des_country,
  des_port_rail,
  ori_port_if_rail,
  des_port_if_rail,
  oog_load,
}: {
  ori_country: string
  ori_port_rail: PortType
  des_country: string
  des_port_rail: PortType
  ori_port_if_rail: PortIfRailType
  des_port_if_rail: PortIfRailType
  oog_load: OogLoadType
}) {
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
    const map: Record<IgContainerUpperCase, STDContainerType> = {
      OT20: '20STD',
      OT40: '40STD',
      FR20: '20STD',
      FR40: '40STD',
      FR45: '40HC',
    }
    let fclWeight = {} as FclWeightsType,
      fclWeightUnit = {} as FclWeightUnitType,
      fclQuantities = {} as FclQuantitiesType

    fclWeightUnit = 'KG'
    oog_load.forEach((load) => {
      fclQuantities[map[load.oog_type]] = load.oog_qty
      fclWeight[map[load.oog_type]] =
        load.oog_weight_unit == 'KG'
          ? load.oog_weight
          : lbsToKg(load.oog_weight)
    })
    let filteredHaulageRateCost = calculateHaulageCostByWeight({
      haulageRates: IndiaOutboundHaulageRates,
      weights: fclWeight,
      unit: fclWeightUnit,
      quantities: fclQuantities,
    })
    let ot2 = 0,
      ot4 = 0,
      fr2 = 0,
      fr4 = 0,
      fr5 = 0
    const OOG_MULTIPILER = 4
    oog_load.forEach((load) => {
      switch (load.oog_type) {
        case 'OT20':
          ot2 = filteredHaulageRateCost.d2 * OOG_MULTIPILER
          break
        case 'OT40':
          ot4 = filteredHaulageRateCost.d4 * OOG_MULTIPILER
          break
        case 'FR20':
          fr2 = filteredHaulageRateCost.d2 * OOG_MULTIPILER
          break
        case 'FR40':
          fr4 = filteredHaulageRateCost.d4 * OOG_MULTIPILER
          break
        case 'FR45':
          fr5 = filteredHaulageRateCost.d5 * OOG_MULTIPILER
          break
      }
    })

    const indianRailRate = {
      ot2,
      ot4,
      fr2,
      fr4,
      fr5,
      total: ot2 + ot4 + fr2 + fr4 + fr5,
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
      let dutyValue = (duty * value) / 100
      let dutyLabel = `DUTY: ${duty.toFixed(2)}`
      if (des_country == 'US') {
        dutyValue = dutyValue + value * 0.1
        dutyLabel += ' + 10% Tariff'
      }
      const dutyData = {
        label: dutyLabel,
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
      return dutyData
    }
  }
  return null
}
