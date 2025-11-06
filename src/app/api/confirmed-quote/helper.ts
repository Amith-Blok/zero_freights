import {
  AirOffer,
  LandOffer,
  Offer,
  SeaDgOffer,
  SeaFclOffer,
  SeaIgOffer,
  SeaLclOffer,
  SeaOogOffer,
  SeaRfOffer,
  WarehouseOffer,
} from '@/schema/models/offer'
import { generateConfirmedQuoteId } from '../form/helper/lib'
import { createWarehouseConfirmedQuote } from '@/data/confirmed-quotes/warehouse-confirmed-quotes'
import { User } from '@/models/user'
import { createAirConfirmedQuote } from '@/data/confirmed-quotes/air-confirmed-quote'
import { createLandConfirmedQuote } from '@/data/confirmed-quotes/land-confirmed-quote'
import { createSeaLclConfirmedQuote } from '@/data/confirmed-quotes/sea-lcl-confirmed-quote'
import { createSeaFclConfirmedQuote } from '@/data/confirmed-quotes/sea-fcl-confirmed-quote'
import { createSeaDgConfirmedQuote } from '@/data/confirmed-quotes/sea-dg-confirmed-quote'
import { createSeaRfConfirmedQuote } from '@/data/confirmed-quotes/sea-rf-confirmed-quote'
import { createSeaIgConfirmedQuote } from '@/data/confirmed-quotes/sea-ig-confirmed-quote'
import { createSeaOogConfirmedQuote } from '@/data/confirmed-quotes/sea-oog-confirmed-quote'

export const generateConfirmedQuoteBase = async (params: Offer) => {
  const confirmedQuoteId = await generateConfirmedQuoteId()
  return {
    form_id: params.form_id,
    blok_id: confirmedQuoteId,
    offer_id: params.blok_id,
    offer_date: params.created_at?.toISOString() ?? '',
    user_id: params.user_id,
    subject: params.subject,
    place_of_supply: params.place_of_supply,
    bill_to: params.bill_to,
    service_type: params.service_type,
    start_code: params.start_code,
    end_code: params.end_code,
    exchanges: params.exchanges,
    tags: params.tags,
    locations: params.locations,
  }
}

export const generateConfirmedQuoteWarehouse = async (
  params: WarehouseOffer & { user: User }
): Promise<string> => {
  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_WAR',
    carrier: params.carrier,
    package_type: params.package_type,
    transit_days: params.estimated_days,
    total_cost: params.total_cost,
    data: params.offers,
  }
  console.log(
    'Warehouse confirmed quote generated successfully',
    confirmedQuote
  )
  const id = await createWarehouseConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}

export const generateConfirmedQuoteAir = async (
  params: AirOffer & { user: User }
): Promise<string> => {
  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_AIR',
    carrier: params.carrier,
    package_type: params.package_type,
    transit_days: params.estimated_days,
    total_cost: params.total_cost,
    data: params.offers,
  }
  console.log('Air confirmed quote generated successfully', confirmedQuote)
  const id = await createAirConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}

export const generateConfirmedQuoteLand = async (
  params: LandOffer & { user: User }
): Promise<string> => {
  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_LAND',
    carrier: params.carrier,
    package_type: params.package_type,
    total_cost: params.total_cost,
    data: params.offers,
  }
  console.log('Land confirmed quote generated successfully', confirmedQuote)
  const id = await createLandConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}

export const generateConfirmedQuoteSeaLcl = async (
  params: SeaLclOffer & { user: User }
): Promise<string> => {
  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_SEA_LCL',
    carrier: params.carrier,
    package_type: params.package_type,
    total_cost: params.total_cost,
    data: params.offers,
  }
  console.log('Sea LCL confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaLclConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}
export const generateConfirmedQuoteSeaFcl = async (
  params: SeaFclOffer & { user: User; lineName: string }
): Promise<string> => {
  const { lineName, offers, container_types, container_details, weight_unit } =
    params
  const lineOffer = offers.line_charges.find(
    (line) => line.line_name === lineName
  )
  if (!lineOffer) {
    throw new Error(`Line offer not found for line name: ${lineName}`)
  }
  const lineOfferData = [lineOffer.data, ...offers.local_charges]

  const { port_to_days, estimated_days, valid_to, cost_breakdown } = lineOffer

  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_SEA_FCL',
    carrier: lineOffer.line_name.toUpperCase(),
    port_to_days: port_to_days,
    estimated_days: estimated_days,
    valid_to: valid_to,
    container_types: container_types,
    container_details: container_details,
    weight_unit: weight_unit,
    total_cost: cost_breakdown,
    data: lineOfferData,
  }
  console.log('Sea FCL confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaFclConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}

export const generateConfirmedQuoteSeaDg = async (
  params: SeaDgOffer & { user: User; lineName: string }
): Promise<string> => {
  const {
    lineName,
    offers,
    container_types,
    container_details,
    weight_unit,
    dg_class,
  } = params
  const lineOffer = offers.line_charges.find(
    (line) => line.line_name === lineName
  )
  if (!lineOffer) {
    throw new Error(`Line offer not found for line name: ${lineName}`)
  }
  const lineOfferData = [lineOffer.data, ...offers.local_charges]

  const { port_to_days, estimated_days, valid_to, cost_breakdown } = lineOffer

  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_SEA_DG',
    carrier: lineOffer.line_name.toUpperCase(),
    port_to_days: port_to_days,
    estimated_days: estimated_days,
    valid_to: valid_to,
    container_types: container_types,
    container_details: container_details,
    weight_unit: weight_unit,
    dg_class: dg_class,
    total_cost: cost_breakdown,
    data: lineOfferData,
  }
  console.log('Sea DG confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaDgConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}

export const generateConfirmedQuoteSeaRf = async (
  params: SeaRfOffer & { user: User; lineName: string }
): Promise<string> => {
  const {
    lineName,
    offers,
    container_types,
    container_details,
    weight_unit,
    temperature,
    humidity,
  } = params
  const lineOffer = offers.line_charges.find(
    (line) => line.line_name === lineName
  )
  if (!lineOffer) {
    throw new Error(`Line offer not found for line name: ${lineName}`)
  }
  const lineOfferData = [lineOffer.data, ...offers.local_charges]

  const { port_to_days, estimated_days, valid_to, cost_breakdown } = lineOffer

  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_SEA_RF',
    carrier: lineOffer.line_name.toUpperCase(),
    port_to_days: port_to_days,
    estimated_days: estimated_days,
    valid_to: valid_to,
    container_types: container_types,
    container_details: container_details,
    weight_unit: weight_unit,
    temperature: temperature,
    humidity: humidity,
    total_cost: cost_breakdown,
    data: lineOfferData,
  }
  console.log('Sea RF confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaRfConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}

export const generateConfirmedQuoteSeaIg = async (
  params: SeaIgOffer & { user: User; lineName: string }
): Promise<string> => {
  const { lineName, offers, container_types, container_details, weight_unit } =
    params
  const lineOffer = offers.line_charges.find(
    (line) => line.line_name === lineName
  )
  if (!lineOffer) {
    throw new Error(`Line offer not found for line name: ${lineName}`)
  }
  const lineOfferData = [lineOffer.data, ...offers.local_charges]

  const { port_to_days, estimated_days, valid_to, cost_breakdown } = lineOffer

  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_SEA_IG',
    carrier: lineOffer.line_name.toUpperCase(),
    port_to_days: port_to_days,
    estimated_days: estimated_days,
    valid_to: valid_to,
    container_types: container_types,
    container_details: container_details,
    weight_unit: weight_unit,
    total_cost: cost_breakdown,
    data: lineOfferData,
  }
  console.log('Sea RF confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaIgConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}

export const generateConfirmedQuoteSeaOog = async (
  params: SeaOogOffer & { user: User; lineName: string }
): Promise<string> => {
  const { lineName, offers, container_types, container_details, weight_unit } =
    params
  const lineOffer = offers.line_charges.find(
    (line) => line.line_name === lineName
  )
  if (!lineOffer) {
    throw new Error(`Line offer not found for line name: ${lineName}`)
  }
  const lineOfferData = [lineOffer.data, ...offers.local_charges]

  const { port_to_days, estimated_days, valid_to, cost_breakdown } = lineOffer

  const confirmedQuoteBase = await generateConfirmedQuoteBase(params)
  const confirmedQuote = {
    ...confirmedQuoteBase,
    mode: 'CONFIRMED_SEA_OOG',
    carrier: lineOffer.line_name.toUpperCase(),
    port_to_days: port_to_days,
    estimated_days: estimated_days,
    valid_to: valid_to,
    container_types: container_types,
    container_details: container_details,
    weight_unit: weight_unit,
    total_cost: cost_breakdown,
    data: lineOfferData,
  }
  console.log('Sea RF confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaOogConfirmedQuote(confirmedQuote)

  console.log('Confirmed quote created successfully', id)

  // await sendQuoteInfoToZeroFreight({
  //   userName: params.user?.name ?? '',
  //   userEmail: params.user?.email ?? '',
  //   userPhone: params.user?.phone ?? '',
  //   userCompany: params.user?.companyName ?? '',
  //   subject: params.subject,
  //   tag: params.service_type.toString(),
  //   containerType: params.package_type,
  //   total: params.total_cost.inr,
  //   detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
  //   destination: params.locations.at(-1)?.name || 'N/A',
  //   origin: params.locations[0].name,
  //   transitInfo: params.estimated_days ? `Est. ${params.estimated_days} days port to port` : 'N/A',
  //   carrier: params.carrier.toUpperCase(),
  // })
  return id.toString()
}
