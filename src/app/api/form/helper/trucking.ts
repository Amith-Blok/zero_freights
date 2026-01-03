import { calculateCWT, meterToKilometer, meterToMile } from '@/lib/utils'
import { calculateDistance } from './google-map'
import { getUsLtlCityByZipcode } from '@/data/us-ltl-cities'
import { getUsLtlBaseByFaZone } from '@/data/us-ltl-base'
import { getUsLtlAirportByStartEndCode } from '@/data/us-ltl-aiport'
import {
  IN_AVERAGE_SPEED_KPH,
  IN_DAILY_DRIVING_HOURS,
  US_AVERAGE_SPEED_MPH,
  US_DAILY_DRIVING_HOURS,
} from '@/constants/trucking'
import { FclWeightUnitType } from '@/schema/sea-schema'
import { CBM_TO_CFT, KG_TO_LBS } from '@/constants/weight'
import {
  FORWARD_AIR_FUEL_SURCHARGE_PERCENTAGE,
  FREIGHT_CLASS_RATES,
  US_LTL_FLAT_RATES_BY_MILES,
} from '../constant'

export async function usTrucking({
  start_latitude,
  start_longitude,
  end_latitude,
  end_longitude,
}: {
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
}): Promise<{ cost: number; estimatedDays: number }> {
  const distanceInMeter = await calculateDistance(
    { latitude: start_latitude, longitude: start_longitude },
    {
      latitude: end_latitude,
      longitude: end_longitude,
    }
  )
  const distance = meterToMile(distanceInMeter)
  const totalDistance = 2 * distance
  const estimatedDays = calcualteEstimatedDay({ country: 'US', totalDistance })
  const truckingCost = totalDistance * 3
  const profit = 250
  const grandTotal = Math.max(truckingCost + profit, 601)
  return { cost: grandTotal, estimatedDays }
}
export async function inTrucking({
  start_latitude,
  start_longitude,
  end_latitude,
  end_longitude,
  ton,
  times = 2,
}: {
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
  ton: number
  times?: number
}): Promise<{ cost: number; estimatedDays: number }> {
  const distanceInMeter = await calculateDistance(
    { latitude: start_latitude, longitude: start_longitude },
    {
      latitude: end_latitude,
      longitude: end_longitude,
    }
  )
  const distance = meterToKilometer(distanceInMeter)
  const totalDistance = times * distance
  const estimatedDays = calcualteEstimatedDay({ country: 'IND', totalDistance })
  const desielCost = (totalDistance / 2.5) * 110
  const tollCost = 1000
  const driverCost = Math.ceil(totalDistance / 300) * 1000
  const emiCost = 3500
  const overWeightCost = ton >= 19.5 ? Math.min(30 * totalDistance, 12000) : 0
  const sum = desielCost + tollCost + driverCost + emiCost + overWeightCost
  const profit = sum * 0.25
  const grandTotal = sum + profit
  return { cost: grandTotal, estimatedDays }
}

export function usLandFClTrucking(distance: number): number {
  const totalDistance = 2 * distance
  const truckingCost = totalDistance * 3.5
  const profit = 250
  const grandTotal = truckingCost + profit
  return grandTotal
}

export async function inLtlTruckingCost({
  start_latitude,
  start_longitude,
  end_latitude,
  end_longitude,
  ton,
  cbm,
}: {
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
  ton: number
  cbm: number
}) {
  //calculate indian trucking cost
  //step FTL trucking
  const inTruckingCost = await inTrucking({
    start_latitude,
    start_longitude,
    end_latitude,
    end_longitude,
    ton,
  })
  // console.log({ InTruckingCost });
  const oneUnit = Math.max(inTruckingCost.cost / 4, 11000)
  // console.log(oneUnit);
  //NOTE:INR Currenecy
  //BUG: if logic incorrect
  if (cbm <= 15) return oneUnit
  if (cbm <= 30) return oneUnit * 2
  if (cbm <= 45) return oneUnit * 3
  return oneUnit * 4
}

export async function usLtlTruckingCost({
  zipcode,
  airportCode,
  kg,
}: {
  zipcode: string
  airportCode?: string
  kg: number
}) {
  const deliveryCity = await getUsLtlCityByZipcode(zipcode).catch((error) => {
    console.log(error)
    return null
  })
  if (!deliveryCity) return null
  const { fa_station: faStation, zone } = deliveryCity

  const baseLtl = await getUsLtlBaseByFaZone({ faStation, zone })

  if (!baseLtl) return null
  const { cost: baseLtlCostPerKg, min: minBaseLtlCost } = baseLtl
  let baseLtlCost = baseLtlCostPerKg * kg
  baseLtlCost = Math.max(baseLtlCost, minBaseLtlCost)

  if (!airportCode) {
    //adding some profit
    return baseLtlCost * 0.335 + 250
  }
  const airportLtl = await getUsLtlAirportByStartEndCode({
    startCode: airportCode,
    endCode: faStation,
  })
  if (!airportLtl) return baseLtlCost * 0.335 + 250
  const {
    airport_pickup_cost: airportPickupCostPerKg,
    min_delivery_cost: minDeliveryCost,
    delivery_cost: deliveryCostPerKg,
  } = airportLtl
  const airportPickupCost = airportPickupCostPerKg * kg
  const deliveryCost = Math.max(deliveryCostPerKg, minDeliveryCost)

  return baseLtlCost + airportPickupCost + deliveryCost * 0.335 + 250
}

const calcualteEstimatedDay = ({
  country,
  totalDistance,
}: {
  country: 'US' | 'IND'
  totalDistance: number
}) => {
  // console.log({totalDistance})
  if (country == 'US') {
    //totalDistance in miles
    return Math.ceil(
      totalDistance / (US_AVERAGE_SPEED_MPH / US_DAILY_DRIVING_HOURS)
    )
  }
  //totalDistance in km
  return Math.ceil(
    totalDistance / IN_AVERAGE_SPEED_KPH / IN_DAILY_DRIVING_HOURS
  )
}

export async function newUsLtlTruckingCost({
  start_latitude,
  start_longitude,
  end_latitude,
  end_longitude,
  weight,
  unit,
  cbm,
}: {
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
  weight: number
  unit: FclWeightUnitType
  cbm: number
}) {
  // const BASE_RATE = 35
  const CWT = calculateCWT({ value: weight, unit })

  const distanceInMeter = await calculateDistance(
    {
      latitude: start_latitude,
      longitude: start_longitude,
    },
    {
      latitude: end_latitude,
      longitude: end_longitude,
    }
  )
  const distance = meterToMile(distanceInMeter)
  const volumenInCft = cbm * CBM_TO_CFT
  const lbsWeight = unit == 'KG' ? weight * KG_TO_LBS : weight
  const density = lbsWeight / volumenInCft

  // Freight Class

  const freightClass = FREIGHT_CLASS_RATES.find(
    (rate) => rate.minDensity <= density
  )
  const freightClassRatePerCWT = freightClass ? freightClass.rate * CWT : 0

  //BASE TRUCKING RATE

  const baseTrucking = US_LTL_FLAT_RATES_BY_MILES.find(
    (rate) => rate.min <= distance && rate.max >= distance
  )
  console.log({ baseTrucking })
  const baseTruckingRate = baseTrucking ? baseTrucking.rate : distance * 3
  //FORWARD AIR fuel surcharges
  const fuelSurcharges =
    baseTruckingRate * FORWARD_AIR_FUEL_SURCHARGE_PERCENTAGE
  const total = baseTruckingRate + freightClassRatePerCWT + fuelSurcharges
  console.log({
    CWT,
    distance,
    volumenInCft,
    lbsWeight,
    density,
    freightClass,
    freightClassRatePerCWT,
    baseTruckingRate,
    fuelSurcharges,
    total,
  })
  return total
}

/**
 *
 * @param start_latitude: number
 * @param start_longitude: number
 * @param end_latitude: number
 * @param end_longitude: number
 * @param ton: number
 * @param times?: number
 * @returns { cost: number; estimatedDays: number, distance: number }
 * cost: number in INR
 * estimatedDays: number
 * distance: number in km
 */
export async function inSeaRfTrucking({
  start_latitude,
  start_longitude,
  end_latitude,
  end_longitude,
  ton,
  times = 2,
}: {
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
  ton: number
  times?: number
}): Promise<{ cost: number; estimatedDays: number; distance: number }> {
  const distanceInMeter = await calculateDistance(
    { latitude: start_latitude, longitude: start_longitude },
    {
      latitude: end_latitude,
      longitude: end_longitude,
    }
  )
  const distance = meterToKilometer(distanceInMeter)
  const totalDistance = times * distance
  const estimatedDays = calcualteEstimatedDay({ country: 'IND', totalDistance })
  const desielCost = (totalDistance / 2.5) * 110
  const tollCost = 1000
  const driverCost = Math.ceil(totalDistance / 300) * 1000
  const emiCost = 3500
  const overWeightCost = ton >= 19.5 ? Math.min(30 * totalDistance, 12000) : 0
  const sum = desielCost + tollCost + driverCost + emiCost + overWeightCost
  const profit = sum * 0.25
  const grandTotal = sum + profit
  return { cost: grandTotal, estimatedDays, distance }
}

/**
 *
 * @param start_latitude: number
 * @param start_longitude: number
 * @param end_latitude: number
 * @param end_longitude: number
 * @returns { cost: number; estimatedDays: number, distance: number }
 * cost: number in USD
 * estimatedDays: number
 * distance: number in km
 */
export async function usSeaRfTrucking({
  start_latitude,
  start_longitude,
  end_latitude,
  end_longitude,
}: {
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
}): Promise<{ cost: number; estimatedDays: number; distance: number }> {
  const distanceInMeter = await calculateDistance(
    { latitude: start_latitude, longitude: start_longitude },
    {
      latitude: end_latitude,
      longitude: end_longitude,
    }
  )
  const distance = meterToMile(distanceInMeter)
  const totalDistance = 2 * distance
  const estimatedDays = calcualteEstimatedDay({ country: 'US', totalDistance })
  const truckingCost = totalDistance * 3
  const profit = 250
  const grandTotal = Math.max(truckingCost + profit, 601)
  return {
    cost: grandTotal,
    estimatedDays,
    distance: meterToKilometer(distanceInMeter),
  }
}
