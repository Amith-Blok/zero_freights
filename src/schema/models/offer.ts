import { z } from 'zod'
import {
  ContainerCostZodSchema,
  ExchangeZodSchema,
  IgContainerCostZodSchema,
  IgLineContainerCostZodSchema,
  LabeledCostZodSchema,
  LineContainerCostZodSchema,
  LocationZodSchema,
} from './common-zod'
import { TotalCostZodSchema } from './confirmed-quote-zod'
import { ServiceType } from '@/models/offer/shared-types'
import { FCL_CONTAINER_ENUM, IG_CONTAINER_ENUM } from '../sea-schema'

const OfferBaseSchema = z.object({
  form_id: z.string(),
  blok_id: z.string(),
  user_id: z.string(),
  subject: z.string(),
  place_of_supply: z.string(),
  bill_to: z.string(),
  service_type: z.nativeEnum(ServiceType),
  start_code: z.string(),
  end_code: z.string(),
  exchanges: ExchangeZodSchema,
  locations: z.array(LocationZodSchema),
  tags: z.array(z.string()),
  created_at: z.date().optional(),
})

const WarOfferSchema = z
  .object({
    mode: z.literal('WAR'),
    carrier: z.string(),
    package_type: z.string(),
    estimated_days: z.number(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)

const AirOfferSchema = z
  .object({
    mode: z.literal('AIR'),
    carrier: z.string(),
    package_type: z.string(),
    estimated_days: z.number(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)

const LandOfferSchema = z
  .object({
    mode: z.literal('LAND'),
    carrier: z.string(),
    package_type: z.string(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)
const SeaLclOfferSchema = z
  .object({
    mode: z.literal('SEA_LCL'),
    carrier: z.string(),
    package_type: z.string(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)

const SeaFclContainerDetailsSchema = z.object({
  d2: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
  d4: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
  d5: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
})

const SeaIgContainerDetailsSchema = z.object({
  ot2: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
  ot4: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
  fr2: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
  fr4: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
  fr5: z.object({ quantity: z.number(), weight: z.number() }).nullish(),
})

const SeaFclOfferSchema = z
  .object({
    mode: z.literal('SEA_FCL'),
    container_types: z
      .array(FCL_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    container_details: SeaFclContainerDetailsSchema,
    weight_unit: z.enum(['KG', 'LBS']),
    offers: z.object({
      line_charges: z.array(LineContainerCostZodSchema),
      local_charges: z.array(ContainerCostZodSchema),
    }),
  })
  .merge(OfferBaseSchema)

const SeaDgOfferSchema = z
  .object({
    mode: z.literal('SEA_DG'),
    container_types: z
      .array(FCL_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    container_details: SeaFclContainerDetailsSchema,
    weight_unit: z.enum(['KG', 'LBS']),
    dg_class: z.string(),
    offers: z.object({
      line_charges: z.array(LineContainerCostZodSchema),
      local_charges: z.array(ContainerCostZodSchema),
    }),
  })
  .merge(OfferBaseSchema)

const SeaRfOfferSchema = z
  .object({
    mode: z.literal('SEA_RF'),
    container_types: z
      .array(FCL_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    container_details: SeaFclContainerDetailsSchema,
    weight_unit: z.enum(['KG', 'LBS']),
    temperature: z.number(),
    humidity: z.number(),
    offers: z.object({
      line_charges: z.array(LineContainerCostZodSchema),
      local_charges: z.array(ContainerCostZodSchema),
    }),
  })
  .merge(OfferBaseSchema)

const SeaIgOfferSchema = z
  .object({
    mode: z.literal('SEA_IG'),
    container_types: z
      .array(IG_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    container_details: SeaIgContainerDetailsSchema,
    weight_unit: z.enum(['KG', 'LBS']),
    offers: z.object({
      line_charges: z.array(IgLineContainerCostZodSchema),
      local_charges: z.array(IgContainerCostZodSchema),
    }),
  })
  .merge(OfferBaseSchema)

const SeaOogOfferSchema = z
  .object({
    mode: z.literal('SEA_OOG'),
    container_types: z
      .array(IG_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    container_details: SeaIgContainerDetailsSchema,
    weight_unit: z.enum(['KG', 'LBS']),
    offers: z.object({
      line_charges: z.array(IgLineContainerCostZodSchema),
      local_charges: z.array(IgContainerCostZodSchema),
    }),
  })
  .merge(OfferBaseSchema)

export const OfferZodSchema = z.discriminatedUnion('mode', [
  WarOfferSchema,
  AirOfferSchema,
  LandOfferSchema,
  SeaFclOfferSchema,
  SeaLclOfferSchema,
  SeaDgOfferSchema,
  SeaRfOfferSchema,
  SeaIgOfferSchema,
  SeaOogOfferSchema,
])

export type Offer = z.infer<typeof OfferZodSchema>
export type WarehouseOffer = z.infer<typeof WarOfferSchema>
export type AirOffer = z.infer<typeof AirOfferSchema>
export type LandOffer = z.infer<typeof LandOfferSchema>
export type SeaLclOffer = z.infer<typeof SeaLclOfferSchema>
export type SeaFclOffer = z.infer<typeof SeaFclOfferSchema>
export type SeaDgOffer = z.infer<typeof SeaDgOfferSchema>
export type SeaRfOffer = z.infer<typeof SeaRfOfferSchema>
export type SeaIgOffer = z.infer<typeof SeaIgOfferSchema>
export type SeaOogOffer = z.infer<typeof SeaOogOfferSchema>
