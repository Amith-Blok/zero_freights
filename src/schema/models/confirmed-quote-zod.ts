import { z } from 'zod'

const ExchangeZodSchema = z.object({
  usd_to_inr: z.number(),
  inr_to_usd: z.number(),
  eur_to_inr: z.number(),
  eur_to_usd: z.number(),
})

const ConfirmedQuoteDataZodSchema = z.object({
  label: z.string(),
  inr: z.number(),
  usd: z.number(),
})

const LocationZodSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  type: z.enum(['door', 'port', 'rail']),
})

const UserZodSchema = z.object({
  user_id: z.string(),
  user_name: z.string(),
  user_email: z.string(),
  user_company: z.string(),
  user_phone: z.string(),
})

export const TotalCostZodSchema = z.object({
  inr: z.number(),
  usd: z.number(),
})

export const ConfirmedQuoteZodSchema = z.object({
  form_id: z.string(),
  offer_id: z.string(),
  offer_date: z.date(),
  user: UserZodSchema,
  subject: z.string(),
  place_of_supply: z.string(),
  bill_to: z.string(),
  tag: z.string(),
  start_code: z.string(),
  end_code: z.string(),
  container_type: z.string(),
  exchanges: ExchangeZodSchema,
  total_cost: TotalCostZodSchema,
  delivery_type: z.enum([
    'door_to_door',
    'door_to_port',
    'port_to_door',
    'port_to_port',
  ]),
  carrier: z.string(),
  transit_time: z.number(),
  locations: z.array(LocationZodSchema),
  confirmed_quote: z.array(ConfirmedQuoteDataZodSchema),
  created_at: z.date(),
})

export type ConfirmedQuoteZodType = z.infer<typeof ConfirmedQuoteZodSchema>
export type TotalCostZodType = z.infer<typeof TotalCostZodSchema>
