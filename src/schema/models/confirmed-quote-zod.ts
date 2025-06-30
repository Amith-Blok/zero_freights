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
  type: z.enum(['door', 'port', 'rail', 'air', 'warehouse']),
})

const UserZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  company: z.string(),
  phone: z.string(),
})

export const TotalCostZodSchema = z.object({
  inr: z.number(),
  usd: z.number(),
})

export const ConfirmedQuoteZodSchema = z.object({
  form_id: z.string(),
  offer_id: z.string(),
  offer_date: z.string(),
  user: UserZodSchema,
  subject: z.string(),
  place_of_supply: z.string(),
  bill_to: z.string(),
  tags: z.array(z.string()),
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
  data: z.array(ConfirmedQuoteDataZodSchema),
})

export type ConfirmedQuoteZodType = z.infer<typeof ConfirmedQuoteZodSchema>
export type TotalCostZodType = z.infer<typeof TotalCostZodSchema>
