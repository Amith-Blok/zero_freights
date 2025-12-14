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
import { sendQuoteInfoToZeroFreight } from '@/lib/mail'
import {
  BookingTrackingAdditionalData,
  createTrackingFromBooking,
} from '@/data/tracking'
import { getFormById } from '@/data/form'
import { WarehouseFormSchema } from '@/schema/warehouse-schema'
import {
  ContainerDetails,
  MilestoneType,
  TrackingStatus,
} from '@/models/tracking/tracking-types'
import { createMilestone } from '@/models/tracking/tracking-utils'
import {
  convertDToStdContainer,
  convertIgToStdIgContainer,
} from '@/lib/container'
import {
  DContainerTypeSmallCase,
  IgContainerSmallCase,
} from '@/types/containers'
import { AirFormSchema } from '@/schema/air-schema'
import { LandFormSchema } from '@/schema/land-schema'
import { SeaFormSchema } from '@/schema/sea-schema'
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
  console.log('Confirmed quote generated successfully', confirmedQuote)

  const formData = await getFormById(params.form_id)
  if (!formData) {
    throw new Error('Form not found')
  }
  const { data } = formData
  console.log({ rawFormData: JSON.stringify(formData, null, 2) })
  // Extract the actual form data from the nested structure
  const actualFormData =
    typeof data === 'object' && data !== null && 'data' in data
      ? data.data
      : data
  const parsedData = WarehouseFormSchema.parse(actualFormData)
  console.log({ unparsedData: JSON.stringify(parsedData, null, 2) })
  if (!parsedData) {
    throw new Error('Invalid form data')
  }

  let additionalData: BookingTrackingAdditionalData = {
    package_type: params.package_type,
    total_packages: 0,
    total_weight: 0,
    total_volume: 0,
    weight_unit: 'TON',
    volume_unit: 'CBM',
    cargo_description: `${params.subject}`,
    carrier_name: params.carrier,
    booking_date: new Date(new Date().toISOString()),
    warehouse_location: params.locations.at(-1)?.name || '',
  }

  if (parsedData.modes === 'FCL_WAREHOUSE') {
    const { fcl_load, fcl_cbm_ton } = parsedData
    const { cbm, ton } = fcl_cbm_ton
    additionalData.total_volume = cbm
    additionalData.total_weight = ton
    for (const load of fcl_load) {
      additionalData.total_packages =
        (additionalData.total_packages || 0) + load.fcl_quantity
    }
  } else if (parsedData.modes === 'LCL_WAREHOUSE') {
    const { lcl_load, lcl_cbm_ton } = parsedData
    const { cbm, ton } = lcl_cbm_ton
    additionalData.total_volume = cbm
    additionalData.total_weight = ton
    for (const load of lcl_load) {
      additionalData.total_packages =
        (additionalData.total_packages || 0) + load.lcl_quantity
    }
  } else if (parsedData.modes === 'LTL_WAREHOUSE') {
    const { ltl_load, ltl_cbm_ton } = parsedData
    const { cbm, ton } = ltl_cbm_ton
    additionalData.total_volume = cbm
    additionalData.total_weight = ton
    for (const load of ltl_load) {
      additionalData.total_packages =
        (additionalData.total_packages || 0) + load.ltl_quantity
    }
  }
  const confirmedWarehouseQuote =
    await createWarehouseConfirmedQuote(confirmedQuote)
  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedWarehouseQuote,
    additionalData: { bookingTrackingAdditionalData: additionalData },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })
  const id = confirmedWarehouseQuote.id
  console.log('Confirmed quote created successfully', id)
  console.log('Sending quote info to ZeroFreight')
  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.package_type,
    total: params.total_cost.inr,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: params.estimated_days
      ? `Est. ${params.estimated_days} days port to port`
      : 'N/A',
    carrier: params.carrier.toUpperCase(),
  })
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

  const formData = await getFormById(params.form_id)
  if (!formData) {
    throw new Error('Form not found')
  }
  const { data } = formData
  console.log({ rawFormData: JSON.stringify(formData, null, 2) })
  // Extract the actual form data from the nested structure
  const actualFormData =
    typeof data === 'object' && data !== null && 'data' in data
      ? data.data
      : data
  const parsedData = AirFormSchema.parse(actualFormData)
  console.log({ unparsedData: JSON.stringify(parsedData, null, 2) })
  if (!parsedData) {
    throw new Error('Invalid form data')
  }

  const { air_cbm_ton, air_load } = parsedData
  const { ton, cbm } = air_cbm_ton
  let additionalData: BookingTrackingAdditionalData = {
    package_type: params.package_type,
    total_packages: 0,
    total_weight: ton,
    total_volume: cbm,
    weight_unit: 'TON',
    volume_unit: 'CBM',
    cargo_description: `${params.subject}`,
    carrier_name: params.carrier,
    booking_date: new Date(new Date().toISOString()),
    warehouse_location: params.locations.at(-1)?.name || '',
  }
  for (let { air_quantity } of air_load) {
    additionalData.total_packages =
      (additionalData.total_packages || 0) + air_quantity
  }
  const id = await createAirConfirmedQuote(confirmedQuote)
  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: { bookingTrackingAdditionalData: additionalData },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })
  console.log('Confirmed quote created successfully', id)

  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.package_type,
    total: params.total_cost.inr,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: params.estimated_days
      ? `Est. ${params.estimated_days} days port to port`
      : 'N/A',
    carrier: params.carrier.toUpperCase(),
  })
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
  const formData = await getFormById(params.form_id)
  if (!formData) {
    throw new Error('Form not found')
  }
  const { data } = formData
  console.log({ rawFormData: JSON.stringify(formData, null, 2) })
  // Extract the actual form data from the nested structure
  const actualFormData =
    typeof data === 'object' && data !== null && 'data' in data
      ? data.data
      : data
  const parsedData = LandFormSchema.parse(actualFormData)
  console.log({ unparsedData: JSON.stringify(parsedData, null, 2) })
  if (!parsedData) {
    throw new Error('Invalid form data')
  }
  let additionalData: BookingTrackingAdditionalData = {
    package_type: params.package_type,
    total_packages: 0,
    total_weight: 0,
    total_volume: 0,
    weight_unit: 'TON',
    volume_unit: 'CBM',
    cargo_description: `${params.subject}`,
    carrier_name: params.carrier,
    booking_date: new Date(new Date().toISOString()),
  }
  const { modes } = parsedData
  if (modes === 'SEAPORT_TRUCKING') {
    const { sea_unit, sea_weight, sea_quantity } = parsedData
    additionalData.total_weight = sea_weight
    additionalData.weight_unit = sea_unit
    additionalData.volume_unit = undefined
    additionalData.total_packages = sea_quantity
  } else if (modes === 'DOMESTIC_TRUCKING') {
    const { domestic_load, domestic_cbm_ton } = parsedData
    const { cbm, ton } = domestic_cbm_ton
    additionalData.total_volume = cbm
    additionalData.total_weight = ton
    for (let { domestic_quantity } of domestic_load) {
      additionalData.total_packages =
        (additionalData.total_packages || 0) + domestic_quantity
    }
  } else if (modes === 'AIRPORT_TRUCKING') {
    const { airport_load, airport_cbm_ton } = parsedData
    const { cbm, ton } = airport_cbm_ton
    additionalData.total_volume = cbm
    additionalData.total_weight = ton
    for (let { airport_quantity } of airport_load) {
      additionalData.total_packages =
        (additionalData.total_packages || 0) + (airport_quantity || 0)
    }
  }
  const id = await createLandConfirmedQuote(confirmedQuote)
  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: { bookingTrackingAdditionalData: additionalData },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })
  console.log('Land confirmed quote generated successfully', confirmedQuote)
  console.log('Confirmed quote created successfully', id)
  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.package_type,
    total: params.total_cost.inr,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: 'N/A',
    carrier: params.carrier.toUpperCase(),
  })
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

  const formData = await getFormById(params.form_id)
  if (!formData) {
    throw new Error('Form not found')
  }
  const { data } = formData
  console.log({ rawFormData: JSON.stringify(formData, null, 2) })
  // Extract the actual form data from the nested structure
  const actualFormData =
    typeof data === 'object' && data !== null && 'data' in data
      ? data.data
      : data
  const parsedData = SeaFormSchema.parse(actualFormData)
  console.log({ unparsedData: JSON.stringify(parsedData, null, 2) })
  if (!parsedData) {
    throw new Error('Invalid form data')
  }
  let additionalData: BookingTrackingAdditionalData = {
    package_type: params.package_type,
    total_packages: 0,
    total_weight: 0,
    total_volume: 0,
    weight_unit: 'TON',
    volume_unit: 'CBM',
    cargo_description: `${params.subject}`,
    carrier_name: params.carrier,
    booking_date: new Date(new Date().toISOString()),
  }
  const { modes } = parsedData
  if (modes === 'LCL') {
    const { lcl_load, lcl_cbm_ton } = parsedData
    const { cbm, ton } = lcl_cbm_ton
    additionalData.total_volume = cbm
    additionalData.total_weight = ton
    for (const load of lcl_load) {
      additionalData.total_packages =
        (additionalData.total_packages || 0) + load.lcl_quantity
    }
  }
  const id = await createSeaLclConfirmedQuote(confirmedQuote)
  console.log('Confirmed quote created successfully', id)

  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: { bookingTrackingAdditionalData: additionalData },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })

  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.package_type,
    total: params.total_cost.inr,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: 'N/A',
    carrier: params.carrier.toUpperCase(),
  })
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

  let containerDetails: ContainerDetails[] = []
  let flatContainersDimensions: {
    container_type: string
    weight: number
    weight_unit: 'KG' | 'LBS'
  }[] = []

  console.log(
    'Processing container details:',
    JSON.stringify(container_details, null, 2)
  )

  for (let [key, value] of Object.entries(container_details)) {
    const times = value?.quantity ?? 0
    console.log(
      `Container type ${key}: quantity=${times}, weight=${value?.weight}`
    )
    for (let i = 0; i < times; i++) {
      flatContainersDimensions.push({
        container_type: key,
        weight: value?.weight ?? 0,
        weight_unit: weight_unit || 'KG',
      })
    }
  }

  console.log(
    `Created ${flatContainersDimensions.length} flat container dimensions`
  )

  for (let [index, container] of flatContainersDimensions.entries()) {
    const containerId = `CONT${(index + 1).toString().padStart(5, '0')}`
    containerDetails.push({
      container_type: convertDToStdContainer(
        container.container_type as DContainerTypeSmallCase
      ),
      weight: container.weight,
      weight_unit: container.weight_unit,
      cargo_description: `${params.subject}`,
      status: TrackingStatus.BOOKING_CONFIRMED,
      milestones: [
        createMilestone(
          MilestoneType.BOOKING_CREATED,
          TrackingStatus.BOOKING_CONFIRMED,
          'Booking created'
        ),
      ],
      container_id: containerId,
    })
  }
  const total_containers = containerDetails.length

  console.log(`Total containers created: ${total_containers}`)
  console.log({ containerDetails: JSON.stringify(containerDetails, null, 2) })

  // Validate that we have containers before creating tracking
  if (total_containers === 0) {
    console.error(
      'No containers found! Container details:',
      JSON.stringify(container_details, null, 2)
    )
    throw new Error(
      'Cannot create tracking: No containers found in container details. Please ensure at least one container has a quantity > 0.'
    )
  }

  const id = await createSeaFclConfirmedQuote(confirmedQuote)
  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: {
      containerTrackingAdditionalData: {
        containers: containerDetails,
        carrier_name: confirmedQuote.carrier,
        total_containers: total_containers,
        booking_date: new Date(new Date().toISOString()),
      },
    },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })

  console.log('Confirmed quote created successfully', id)

  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.container_types.join(', '),
    total: lineOffer.cost_breakdown.total_cost.inr.total,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: lineOffer.estimated_days
      ? `Est. ${lineOffer.estimated_days} days port to port`
      : 'N/A',
    carrier: lineOffer.line_name.toUpperCase(),
  })
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

  let containerDetails: ContainerDetails[] = []
  let flatContainersDimensions: {
    container_type: string
    weight: number
    weight_unit: 'KG' | 'LBS'
  }[] = []

  console.log(
    'Processing container details:',
    JSON.stringify(container_details, null, 2)
  )

  for (let [key, value] of Object.entries(container_details)) {
    const times = value?.quantity ?? 0
    console.log(
      `Container type ${key}: quantity=${times}, weight=${value?.weight}`
    )
    for (let i = 0; i < times; i++) {
      flatContainersDimensions.push({
        container_type: key,
        weight: value?.weight ?? 0,
        weight_unit: weight_unit || 'KG',
      })
    }
  }

  console.log(
    `Created ${flatContainersDimensions.length} flat container dimensions`
  )

  for (let [index, container] of flatContainersDimensions.entries()) {
    const containerId = `CONT${(index + 1).toString().padStart(5, '0')}`
    containerDetails.push({
      container_type: convertDToStdContainer(
        container.container_type as DContainerTypeSmallCase
      ),
      weight: container.weight,
      weight_unit: container.weight_unit,
      cargo_description: `${params.subject}`,
      status: TrackingStatus.BOOKING_CONFIRMED,
      milestones: [
        createMilestone(
          MilestoneType.BOOKING_CREATED,
          TrackingStatus.BOOKING_CONFIRMED,
          'Booking created'
        ),
      ],
      container_id: containerId,
    })
  }
  const total_containers = containerDetails.length

  console.log(`Total containers created: ${total_containers}`)
  console.log({ containerDetails: JSON.stringify(containerDetails, null, 2) })

  // Validate that we have containers before creating tracking
  if (total_containers === 0) {
    console.error(
      'No containers found! Container details:',
      JSON.stringify(container_details, null, 2)
    )
    throw new Error(
      'Cannot create tracking: No containers found in container details. Please ensure at least one container has a quantity > 0.'
    )
  }
  const id = await createSeaDgConfirmedQuote(confirmedQuote)
  console.log('Confirmed quote created successfully', id)

  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: {
      containerTrackingAdditionalData: {
        containers: containerDetails,
        carrier_name: confirmedQuote.carrier,
        total_containers: total_containers,
        booking_date: new Date(new Date().toISOString()),
      },
    },
  })

  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })

  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.container_types.join(', '),
    total: lineOffer.cost_breakdown.total_cost.inr.total,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: lineOffer.estimated_days
      ? `Est. ${lineOffer.estimated_days} days port to port`
      : 'N/A',
    carrier: lineOffer.line_name.toUpperCase(),
  })
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
  let containerDetails: ContainerDetails[] = []
  let flatContainersDimensions: {
    container_type: string
    weight: number
    weight_unit: 'KG' | 'LBS'
  }[] = []
  console.log(
    'Processing container details:',
    JSON.stringify(container_details, null, 2)
  )
  for (let [key, value] of Object.entries(container_details)) {
    const times = value?.quantity ?? 0
    console.log(
      `Container type ${key}: quantity=${times}, weight=${value?.weight}`
    )
    for (let i = 0; i < times; i++) {
      flatContainersDimensions.push({
        container_type: key,
        weight: value?.weight ?? 0,
        weight_unit: weight_unit || 'KG',
      })
    }
  }

  console.log(
    `Created ${flatContainersDimensions.length} flat container dimensions`
  )

  for (let [index, container] of flatContainersDimensions.entries()) {
    const containerId = `CONT${(index + 1).toString().padStart(5, '0')}`
    containerDetails.push({
      container_type: convertDToStdContainer(
        container.container_type as DContainerTypeSmallCase
      ),
      weight: container.weight,
      weight_unit: container.weight_unit,
      cargo_description: `${params.subject}`,
      status: TrackingStatus.BOOKING_CONFIRMED,
      milestones: [
        createMilestone(
          MilestoneType.BOOKING_CREATED,
          TrackingStatus.BOOKING_CONFIRMED,
          'Booking created'
        ),
      ],
      container_id: containerId,
    })
  }
  const total_containers = containerDetails.length

  console.log(`Total containers created: ${total_containers}`)
  console.log({ containerDetails: JSON.stringify(containerDetails, null, 2) })

  // Validate that we have containers before creating tracking
  if (total_containers === 0) {
    console.error(
      'No containers found! Container details:',
      JSON.stringify(container_details, null, 2)
    )
    throw new Error(
      'Cannot create tracking: No containers found in container details. Please ensure at least one container has a quantity > 0.'
    )
  }
  console.log('Sea RF confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaRfConfirmedQuote(confirmedQuote)
  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: {
      containerTrackingAdditionalData: {
        containers: containerDetails,
        carrier_name: confirmedQuote.carrier,
        total_containers: total_containers,
        booking_date: new Date(new Date().toISOString()),
      },
    },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })

  console.log('Confirmed quote created successfully', id)

  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.container_types.join(', '),
    total: lineOffer.cost_breakdown.total_cost.inr.total,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: lineOffer.estimated_days
      ? `Est. ${lineOffer.estimated_days} days port to port`
      : 'N/A',
    carrier: lineOffer.line_name.toUpperCase(),
  })
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

  let containerDetails: ContainerDetails[] = []
  let flatContainersDimensions: {
    container_type: string
    weight: number
    weight_unit: 'KG' | 'LBS'
  }[] = []

  console.log(
    'Processing container details:',
    JSON.stringify(container_details, null, 2)
  )

  for (let [key, value] of Object.entries(container_details)) {
    const times = value?.quantity ?? 0
    console.log(
      `Container type ${key}: quantity=${times}, weight=${value?.weight}`
    )
    for (let i = 0; i < times; i++) {
      flatContainersDimensions.push({
        container_type: key,
        weight: value?.weight ?? 0,
        weight_unit: weight_unit || 'KG',
      })
    }
  }

  console.log(
    `Created ${flatContainersDimensions.length} flat container dimensions`
  )

  for (let [index, container] of flatContainersDimensions.entries()) {
    const containerId = `CONT${(index + 1).toString().padStart(5, '0')}`
    containerDetails.push({
      container_type: convertIgToStdIgContainer(
        container.container_type as IgContainerSmallCase
      ),
      weight: container.weight,
      weight_unit: container.weight_unit,
      cargo_description: `${params.subject}`,
      status: TrackingStatus.BOOKING_CONFIRMED,
      milestones: [
        createMilestone(
          MilestoneType.BOOKING_CREATED,
          TrackingStatus.BOOKING_CONFIRMED,
          'Booking created'
        ),
      ],
      container_id: containerId,
    })
  }
  const total_containers = containerDetails.length

  console.log(`Total containers created: ${total_containers}`)
  console.log({ containerDetails: JSON.stringify(containerDetails, null, 2) })

  // Validate that we have containers before creating tracking
  if (total_containers === 0) {
    console.error(
      'No containers found! Container details:',
      JSON.stringify(container_details, null, 2)
    )
    throw new Error(
      'Cannot create tracking: No containers found in container details. Please ensure at least one container has a quantity > 0.'
    )
  }

  console.log('Sea IG confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaIgConfirmedQuote(confirmedQuote)
  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: {
      containerTrackingAdditionalData: {
        containers: containerDetails,
        carrier_name: confirmedQuote.carrier,
        total_containers: total_containers,
        booking_date: new Date(new Date().toISOString()),
      },
    },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })

  console.log('Confirmed quote created successfully', id)
  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.container_types.join(', '),
    total: lineOffer.cost_breakdown.total_cost.inr.total,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: lineOffer.estimated_days
      ? `Est. ${lineOffer.estimated_days} days port to port`
      : 'N/A',
    carrier: lineOffer.line_name.toUpperCase(),
  })
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
  let containerDetails: ContainerDetails[] = []
  let flatContainersDimensions: {
    container_type: string
    weight: number
    weight_unit: 'KG' | 'LBS'
  }[] = []

  console.log(
    'Processing container details:',
    JSON.stringify(container_details, null, 2)
  )

  for (let [key, value] of Object.entries(container_details)) {
    const times = value?.quantity ?? 0
    console.log(
      `Container type ${key}: quantity=${times}, weight=${value?.weight}`
    )
    for (let i = 0; i < times; i++) {
      flatContainersDimensions.push({
        container_type: key,
        weight: value?.weight ?? 0,
        weight_unit: weight_unit || 'KG',
      })
    }
  }

  console.log(
    `Created ${flatContainersDimensions.length} flat container dimensions`
  )

  for (let [index, container] of flatContainersDimensions.entries()) {
    const containerId = `CONT${(index + 1).toString().padStart(5, '0')}`
    containerDetails.push({
      container_type: convertIgToStdIgContainer(
        container.container_type as IgContainerSmallCase
      ),
      weight: container.weight,
      weight_unit: container.weight_unit,
      cargo_description: `${params.subject}`,
      status: TrackingStatus.BOOKING_CONFIRMED,
      milestones: [
        createMilestone(
          MilestoneType.BOOKING_CREATED,
          TrackingStatus.BOOKING_CONFIRMED,
          'Booking created'
        ),
      ],
      container_id: containerId,
    })
  }
  const total_containers = containerDetails.length

  console.log(`Total containers created: ${total_containers}`)
  console.log({ containerDetails: JSON.stringify(containerDetails, null, 2) })

  // Validate that we have containers before creating tracking
  if (total_containers === 0) {
    console.error(
      'No containers found! Container details:',
      JSON.stringify(container_details, null, 2)
    )
    throw new Error(
      'Cannot create tracking: No containers found in container details. Please ensure at least one container has a quantity > 0.'
    )
  }

  console.log('Sea OOG confirmed quote generated successfully', confirmedQuote)
  const id = await createSeaOogConfirmedQuote(confirmedQuote)
  const tracking = await createTrackingFromBooking({
    confirmedQuote: confirmedQuote,
    additionalData: {
      containerTrackingAdditionalData: {
        containers: containerDetails,
        carrier_name: confirmedQuote.carrier,
        total_containers: total_containers,
        booking_date: new Date(new Date().toISOString()),
      },
    },
  })
  console.log('Tracking created successfully')
  console.log({
    tracking: JSON.stringify(tracking.toObject({ getters: true }), null, 2),
  })
  console.log('Confirmed quote created successfully', id)

  await sendQuoteInfoToZeroFreight({
    userName: params.user?.name ?? '',
    userEmail: params.user?.email ?? '',
    userPhone: params.user?.phone ?? '',
    userCompany: params.user?.companyName ?? '',
    subject: params.subject,
    tag: params.service_type.toString(),
    containerType: params.container_types.join(', '),
    total: lineOffer.cost_breakdown.total_cost.inr.total,
    detailPageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmed-quote/${id}`,
    destination: params.locations.at(-1)?.name || 'N/A',
    origin: params.locations[0].name,
    transitInfo: lineOffer.estimated_days
      ? `Est. ${lineOffer.estimated_days} days port to port`
      : 'N/A',
    carrier: lineOffer.line_name.toUpperCase(),
  })
  return id.toString()
}
