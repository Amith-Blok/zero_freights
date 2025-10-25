import { getGoogleLocationByPlaceId } from '../helper/google-map'
import { inLtlTruckingCost, newUsLtlTruckingCost } from '../helper/trucking'

const pickupLTLBase = {
  label: 'Pickup LTL',
  currency: 'INR', // Will be overwritten in POST
  usd: 0,
  inr: 0,
}
const destinationLTLBase = {
  label: 'Destination LTL',
  currency: 'USD', // Will be overwritten in POST
  usd: 0,
  inr: 0,
}
// --- Refactored LTL cost calculation helper ---
type LtlCostParams = {
  pickup_check: boolean
  pickup_location: { place_id: string } | null
  delivery_check: boolean
  delivery_location: { place_id: string } | null
  ori_country: string
  des_country: string
  ori_port_rail: { lat: number; lng: number }
  des_port_rail: { lat: number; lng: number }
  ton: number
  cbm: number
  kg: number
  INR_TO_USD: number
  USD_TO_INR: number
}

export async function calculateLtlCost({
  pickup_check,
  pickup_location,
  delivery_check,
  delivery_location,
  ori_country,
  ori_port_rail,
  des_port_rail,
  ton,
  cbm,
  kg,
  INR_TO_USD,
  USD_TO_INR,
}: LtlCostParams) {
  let pickupLTL = { ...pickupLTLBase }
  let destinationLTL = { ...destinationLTLBase }

  if (ori_country === 'IN') {
    if (pickup_check && pickup_location) {
      const { lat, lng } = await getGoogleLocationByPlaceId(
        pickup_location.place_id
      )
      pickupLTL.inr = await inLtlTruckingCost({
        start_latitude: lat,
        start_longitude: lng,
        end_latitude: ori_port_rail.lat,
        end_longitude: ori_port_rail.lng,
        ton,
        cbm,
      })
      pickupLTL.usd = pickupLTL.inr * INR_TO_USD
    }
    if (delivery_check && delivery_location) {
      const { lat, lng } = await getGoogleLocationByPlaceId(
        delivery_location.place_id
      )
      const usLtl = await newUsLtlTruckingCost({
        start_latitude: des_port_rail.lat,
        start_longitude: des_port_rail.lng,
        end_latitude: lat,
        end_longitude: lng,
        weight: kg,
        unit: 'KG',
        cbm,
      })
      destinationLTL.usd = usLtl ?? 0
      destinationLTL.inr = destinationLTL.usd * USD_TO_INR
    }
  } else {
    if (pickup_check && pickup_location) {
      const { lat, lng } = await getGoogleLocationByPlaceId(
        pickup_location.place_id
      )
      pickupLTL.usd = await newUsLtlTruckingCost({
        start_latitude: lat,
        start_longitude: lng,
        end_latitude: ori_port_rail.lat,
        end_longitude: ori_port_rail.lng,
        weight: kg,
        unit: 'KG',
        cbm,
      })
      pickupLTL.inr = pickupLTL.usd * USD_TO_INR
    }
    if (delivery_check && delivery_location) {
      const { lat, lng } = await getGoogleLocationByPlaceId(
        delivery_location.place_id
      )
      destinationLTL.inr = await inLtlTruckingCost({
        start_latitude: des_port_rail.lat,
        start_longitude: des_port_rail.lng,
        end_latitude: lat,
        end_longitude: lng,
        ton,
        cbm,
      })
      destinationLTL.usd = destinationLTL.inr * INR_TO_USD
    }
  }
  return { pickupLTL, destinationLTL }
}
// --- End helper ---
