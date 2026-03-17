import { NextResponse } from 'next/server'
import { calculateHaulageCostByWeight } from '../helper/india-haulage-rate'
import { getAllIndiaOutboundHaulageRatesByCode } from '@/data/india-outbound-haulage'
import { inTrucking, usTrucking } from '../helper/trucking'
import { Location as LocationType } from '@/models/offer/shared-types'
import { toTitleCase } from '@/lib/utils'
import { IncotermsType } from '@/schema/sea-schema'
import { HsSixType } from '@/models/hs-six'
import { getDutyByHsCodeCountry } from '@/data/duties'

// --- Helper Functions ---
export function errorResponse(message: string, status = 400, details?: any) {
  if (details) console.log({ error: message, details })
  else console.log({ error: message })
  return NextResponse.json({ error: message, details }, { status })
}

export function selectPorts({
  ori_country,
  ori_port_rail,
  ori_port_if_rail,
  des_port_rail,
  des_port_if_rail,
}: any) {
  let startSeaPort, endSeaPort
  if (ori_country === 'IN') {
    startSeaPort =
      ori_port_rail.type === 'RAIL' ? ori_port_if_rail : ori_port_rail
    endSeaPort = des_port_rail
  } else {
    startSeaPort = ori_port_rail
    endSeaPort = des_port_rail.type == 'RAIL' ? des_port_if_rail : des_port_rail
  }
  return { startSeaPort, endSeaPort }
}

export async function getRailCost({
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
  let indianRailRate = undefined
  if (indianRail && indianPortForRail) {
    const IndiaOutboundHaulageRates =
      await getAllIndiaOutboundHaulageRatesByCode({
        start_code: indianRail.port_code,
        end_code: indianPortForRail.port_code,
      })
    indianRailRate = calculateHaulageCostByWeight({
      haulageRates: IndiaOutboundHaulageRates,
      weights,
      unit,
      quantities,
    })
    if (!indianRailRate)
      throw Error("Couldn't find rail rate. Please try with other port")
  }
  return { indianRail, indianPortForRail, indianRailRate }
}

export async function getTruckingCost({
  country,
  start,
  end,
  MetricTon,
  stuffingTimes,
}: any) {
  if (country == 'IN') {
    return await inTrucking({
      start_latitude: start.lat,
      start_longitude: start.lng,
      end_latitude: end.lat,
      end_longitude: end.lng,
      ton: MetricTon,
      times: stuffingTimes,
    })
  } else {
    return await usTrucking({
      start_latitude: start.lat,
      start_longitude: start.lng,
      end_latitude: end.lat,
      end_longitude: end.lng,
    })
  }
}

export function buildLocations({
  pickup_check,
  pickup_location,
  ori_country,
  ori_port_rail,
  ori_port_if_rail,
  des_port_rail,
  des_port_if_rail,
  des_country,
  delivery_check,
  delivery_location,
}: any): LocationType[] {
  let locations: LocationType[] = []
  if (pickup_check) {
    locations.push({
      name: toTitleCase(pickup_location?.description ?? ''),
      code: ori_country.toUpperCase(),
      type: 'door',
    })
  }
  locations.push({
    name: toTitleCase(ori_port_rail.port_name.toUpperCase()),
    code: ori_port_rail.port_code.toUpperCase(),
    type: `${ori_port_rail.type === 'PORT' ? 'port' : 'rail'}`,
  })
  if (ori_port_rail.type == 'RAIL' && !!ori_port_if_rail?.port_name) {
    locations.push({
      name: toTitleCase(ori_port_if_rail?.port_name ?? ''),
      code: ori_port_if_rail?.port_code.toUpperCase() ?? '',
      type: 'port',
    })
  }
  if (des_port_rail.type == 'RAIL' && !!des_port_if_rail?.port_name) {
    locations.push({
      name: toTitleCase(des_port_if_rail?.port_name.toUpperCase() ?? ''),
      code: des_port_if_rail?.port_code.toUpperCase() ?? '',
      type: 'port',
    })
  }
  locations.push({
    name: toTitleCase(des_port_rail.port_name.toUpperCase()),
    code: des_port_rail.port_code.toUpperCase(),
    type: `${des_port_rail.type === 'PORT' ? 'port' : 'rail'}`,
  })
  if (delivery_check) {
    locations.push({
      name: delivery_location?.description ?? '',
      code: des_country,
      type: 'door',
    })
  }
  return locations
}

export async function getDutyIfNeeded({
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
    console.log({ duty, des_country })
    if (typeof duty === 'number') {
      let dutyValue = (duty * value) / 100
      let dutyLabel = `DUTY: ${duty.toFixed(2)}%`
      if (des_country == 'US') {
        dutyValue = dutyValue + value * 0.1
        dutyLabel += ' + 10% Tariff'
        console.log('inside condition')
        console.log({ dutyLabel })
      }
      const dutyData = {
        label: dutyLabel,
        currency: 'USD',
        additional_notes: `Duty:${duty}%`,
        d2: dutyValue,
        d4: dutyValue,
        d5: dutyValue,
        total: dutyValue * totalQuantity,
        tag: `HS: ${hsn.code}`,
        valueTag: `${value} USD`,
        dutyTag: `DUTY: ${duty.toFixed(2)}%`,
      }
      console.log({ dutyData })
      return dutyData
    }
  }
  return null
}
