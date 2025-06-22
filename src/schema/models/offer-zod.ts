import { z } from 'zod'

// Sub-schemas

export const LocationZodSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  type: z.enum(['door', 'port', 'rail']),
})

export const ExchangeSchema = z.object({
  usd_to_inr: z.number(),
  inr_to_usd: z.number(),
  eur_to_inr: z.number(),
  eur_to_usd: z.number(),
})

export const ContainerCostSchema = z.object({
  d2: z.number(),
  d4: z.number(),
  d5: z.number(),
})

export const RateByContainerSchema = z.object({
  label: z.string(),
  currency: z.string(),
  additional_notes: z.string().optional().default(''),
  d2: z.number(),
  d4: z.number(),
  d5: z.number(),
})

export const MultiCurrencyCostSchema = z.object({
  inr: ContainerCostSchema,
  usd: ContainerCostSchema,
})

export const SeaFreightSchema = z.object({
  line_name: z.string(),
  port_to_days: z.number(),
  estimated_days: z.number(),
  total_cost: MultiCurrencyCostSchema,
  valid_to: z.string().optional(),
  data: z.array(RateByContainerSchema),
})

export const OfferDataSchema = z.object({
  sea_freights: z.array(SeaFreightSchema),
  local_charges: z.array(RateByContainerSchema),
})

// Final Offer Schema

export const OfferZodSchema = z.object({
  form_id: z.string(),
  offer_id: z.string(),
  user_id: z.string(),
  user_email: z.string(),
  user_name: z.string(),
  user_company: z.string(),
  user_phone: z.string().optional(),
  subject: z.string(),
  place_of_supply: z.string(),
  bill_to: z.string(),
  tag: z.string(),
  start_code: z.string(),
  end_code: z.string(),
  container_type: z.string(),
  exchanges: ExchangeSchema,
  delivery_type: z.enum([
    'door_to_door',
    'door_to_port',
    'port_to_door',
    'port_to_port',
  ]),
  locations: z.array(LocationZodSchema),
  offers: OfferDataSchema,
  created_at: z.date(),
})

// Type Inference

export type OfferType = z.infer<typeof OfferZodSchema>
export type SeaFreightType = z.infer<typeof SeaFreightSchema>
export type RateByContainerType = z.infer<typeof RateByContainerSchema>
export type LocationType = z.infer<typeof LocationZodSchema>
