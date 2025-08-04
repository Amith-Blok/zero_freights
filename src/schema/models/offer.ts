import { z } from 'zod'
import {
  ContainerCostZodSchema,
  ExchangeZodSchema,
  LabeledCostZodSchema,
  LineContainerCostZodSchema,
  LocationZodSchema,
  UserZodSchema,
} from './common-zod'
import { TotalCostZodSchema } from './confirmed-quote-zod'
import { ServiceType } from '@/models/offer/shared-types'

const OfferBaseSchema = z.object({
  form_id: z.string(),
  blok_id: z.string(),
  user: UserZodSchema,
  subject: z.string(),
  place_of_supply: z.string(),
  bill_to: z.string(),
  service_type: z.nativeEnum(ServiceType),
  start_code: z.string(),
  end_code: z.string(),
  package_type: z.string(),
  exchanges: ExchangeZodSchema,
  locations: z.array(LocationZodSchema),
  tags: z.array(z.string()),
  created_at: z.date().optional(),
})

const WarOfferSchema = z
  .object({
    mode: z.literal('WAR'),
    carrier: z.string(),
    estimated_days: z.number(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)

const AirOfferSchema = z
  .object({
    mode: z.literal('AIR'),
    carrier: z.string(),
    estimated_days: z.number(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)

const LandOfferSchema = z
  .object({
    mode: z.literal('LAND'),
    carrier: z.string(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)
const SeaLclOfferSchema = z
  .object({
    mode: z.literal('SEA_LCL'),
    carrier: z.string(),
    total_cost: TotalCostZodSchema,
    offers: z.array(LabeledCostZodSchema),
  })
  .merge(OfferBaseSchema)

const SeaFclOfferSchema = z
  .object({
    mode: z.literal('SEA_FCL'),
    container_type: z.string(),
    offers: z.object({
      line_charges: z.array(LineContainerCostZodSchema),
      local_charges: z.array(ContainerCostZodSchema),
    }),
  })
  .merge(OfferBaseSchema)
export const OfferZodSchema = z.discriminatedUnion('mode', [
  WarOfferSchema,
  AirOfferSchema,
  LandOfferSchema,
  SeaFclOfferSchema,
  SeaLclOfferSchema,
])
