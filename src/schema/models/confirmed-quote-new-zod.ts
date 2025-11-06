import { z } from 'zod'

// ============================================================================
// Enums and Basic Types
// ============================================================================

export const ServiceTypeEnum = z.enum([
  'SEA FCL',
  'SEA LCL',
  'SEA DG',
  'SEA RF',
  'SEA IG',
  'SEA OOG',
  'AIR',
  'DOMESTIC TRUCKING',
  'SEAPORT TRUCKING',
  'AIRPORT TRUCKING',
  'FCL WAR',
  'LCL WAR',
  'LTL WAR',
])

export const OfferModeTypesEnum = z.enum([
  'WAR',
  'AIR',
  'LAND',
  'SEA_LCL',
  'SEA_FCL',
  'SEA_DG',
  'SEA_RF',
  'SEA_IG',
  'SEA_OOG',
])

export const WeightUnitEnum = z.enum(['KG', 'LBS'])

export const LocationTypeEnum = z.enum([
  'door',
  'port',
  'rail',
  'air',
  'warehouse',
])

// ============================================================================
// Common Schemas
// ============================================================================

export const ExchangeSchema = z.object({
  usd_to_inr: z.number(),
  inr_to_usd: z.number(),
  eur_to_inr: z.number(),
  eur_to_usd: z.number(),
})

export const LocationSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  type: LocationTypeEnum,
})

export const TotalCostSchema = z.object({
  inr: z.number(),
  usd: z.number(),
})

export const LabeledCostSchema = z.object({
  label: z.string(),
  inr: z.number(),
  usd: z.number(),
})

// ============================================================================
// Container-related Schemas
// ============================================================================

export const ContainerDetailsItemSchema = z.object({
  quantity: z.number(),
  weight: z.number(),
})

export const ContainerDetailsTypeSchema = z.object({
  d2: ContainerDetailsItemSchema.nullable().optional(),
  d4: ContainerDetailsItemSchema.nullable().optional(),
  d5: ContainerDetailsItemSchema.nullable().optional(),
})

export const IgContainerDetailsTypeSchema = z.object({
  ot2: ContainerDetailsItemSchema.nullable().optional(),
  ot4: ContainerDetailsItemSchema.nullable().optional(),
  fr2: ContainerDetailsItemSchema.nullable().optional(),
  fr4: ContainerDetailsItemSchema.nullable().optional(),
  fr5: ContainerDetailsItemSchema.nullable().optional(),
})

export const ContainerCostSchema = z.object({
  label: z.string(),
  currency: z.string(),
  additional_notes: z.string().optional().default(''),
  d2: z.number(),
  d4: z.number(),
  d5: z.number(),
  total: z.number(),
})

export const IgContainerCostSchema = z.object({
  label: z.string(),
  currency: z.string(),
  additional_notes: z.string().optional().default(''),
  ot2: z.number(),
  ot4: z.number(),
  fr2: z.number(),
  fr4: z.number(),
  fr5: z.number(),
  total: z.number(),
})

// ============================================================================
// Total Cost By Container Type Schemas
// ============================================================================

const CostByContainerTypeSchema = z.object({
  d2: z.number(),
  d4: z.number(),
  d5: z.number(),
  total: z.number(),
})

const IgCostByContainerTypeSchema = z.object({
  ot2: z.number(),
  ot4: z.number(),
  fr2: z.number(),
  fr4: z.number(),
  fr5: z.number(),
  total: z.number(),
})

export const TotalCostByContainerTypeSchema = z.object({
  freight_cost: z.object({
    inr: CostByContainerTypeSchema,
    usd: CostByContainerTypeSchema,
  }),
  local_cost: z.object({
    inr: CostByContainerTypeSchema,
    usd: CostByContainerTypeSchema,
  }),
  total_cost: z.object({
    inr: CostByContainerTypeSchema,
    usd: CostByContainerTypeSchema,
  }),
})

export const IgTotalCostByContainerTypeSchema = z.object({
  freight_cost: z.object({
    inr: IgCostByContainerTypeSchema,
    usd: IgCostByContainerTypeSchema,
  }),
  local_cost: z.object({
    inr: IgCostByContainerTypeSchema,
    usd: IgCostByContainerTypeSchema,
  }),
  total_cost: z.object({
    inr: IgCostByContainerTypeSchema,
    usd: IgCostByContainerTypeSchema,
  }),
})

// ============================================================================
// Base Confirmed Quote Schema
// ============================================================================

const BaseConfirmedQuoteSchema = z.object({
  form_id: z.string(),
  blok_id: z.string(),
  offer_id: z.string(),
  offer_date: z.string(),
  user_id: z.string(),
  subject: z.string(),
  place_of_supply: z.string(),
  bill_to: z.string(),
  service_type: ServiceTypeEnum,
  start_code: z.string(),
  end_code: z.string(),
  exchanges: ExchangeSchema,
  tags: z.array(z.string()),
  locations: z.array(LocationSchema),
})

// ============================================================================
// Discriminated Union Schemas
// ============================================================================

export const WarehouseConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_WAR'),
  carrier: z.string(),
  package_type: z.string(),
  transit_days: z.number(),
  total_cost: TotalCostSchema,
  data: z.array(LabeledCostSchema),
})

export const AirConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_AIR'),
  carrier: z.string(),
  package_type: z.string(),
  transit_days: z.number(),
  total_cost: TotalCostSchema,
  data: z.array(LabeledCostSchema),
})

export const LandConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_LAND'),
  carrier: z.string(),
  package_type: z.string(),
  total_cost: TotalCostSchema,
  data: z.array(LabeledCostSchema),
})

export const SeaLclConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_SEA_LCL'),
  carrier: z.string(),
  package_type: z.string(),
  total_cost: TotalCostSchema,
  data: z.array(LabeledCostSchema),
})

export const SeaFclConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_SEA_FCL'),
  carrier: z.string(),
  port_to_days: z.number(),
  estimated_days: z.number(),
  valid_to: z.string(),
  container_types: z.array(z.string()),
  container_details: ContainerDetailsTypeSchema,
  weight_unit: WeightUnitEnum,
  total_cost: TotalCostByContainerTypeSchema,
  data: z.array(ContainerCostSchema),
})

export const SeaDgConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_SEA_DG'),
  carrier: z.string(),
  port_to_days: z.number(),
  estimated_days: z.number(),
  valid_to: z.string(),
  container_types: z.array(z.string()),
  container_details: ContainerDetailsTypeSchema,
  weight_unit: WeightUnitEnum,
  dg_class: z.string(),
  total_cost: TotalCostByContainerTypeSchema,
  data: z.array(ContainerCostSchema),
})

export const SeaRfConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_SEA_RF'),
  carrier: z.string(),
  port_to_days: z.number(),
  estimated_days: z.number(),
  valid_to: z.string(),
  container_types: z.array(z.string()),
  container_details: ContainerDetailsTypeSchema,
  weight_unit: WeightUnitEnum,
  temperature: z.number(),
  humidity: z.number(),
  total_cost: TotalCostByContainerTypeSchema,
  data: z.array(ContainerCostSchema),
})

export const SeaIgConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_SEA_IG'),
  carrier: z.string(),
  port_to_days: z.number(),
  estimated_days: z.number(),
  valid_to: z.string(),
  container_types: z.array(z.string()),
  container_details: IgContainerDetailsTypeSchema,
  weight_unit: WeightUnitEnum,
  total_cost: IgTotalCostByContainerTypeSchema,
  data: z.array(IgContainerCostSchema),
})

export const SeaOogConfirmedQuoteSchema = BaseConfirmedQuoteSchema.extend({
  mode: z.literal('CONFIRMED_SEA_OOG'),
  carrier: z.string(),
  port_to_days: z.number(),
  estimated_days: z.number(),
  valid_to: z.string(),
  container_types: z.array(z.string()),
  container_details: IgContainerDetailsTypeSchema,
  weight_unit: WeightUnitEnum,
  total_cost: IgTotalCostByContainerTypeSchema,
  data: z.array(IgContainerCostSchema),
})

// ============================================================================
// Discriminated Union
// ============================================================================

export const ConfirmedQuoteSchema = z.discriminatedUnion('mode', [
  WarehouseConfirmedQuoteSchema,
  AirConfirmedQuoteSchema,
  LandConfirmedQuoteSchema,
  SeaLclConfirmedQuoteSchema,
  SeaFclConfirmedQuoteSchema,
  SeaDgConfirmedQuoteSchema,
  SeaRfConfirmedQuoteSchema,
  SeaIgConfirmedQuoteSchema,
  SeaOogConfirmedQuoteSchema,
])

// ============================================================================
// Type Exports
// ============================================================================
export type BaseConfirmedQuote = z.infer<typeof BaseConfirmedQuoteSchema>
export type Exchange = z.infer<typeof ExchangeSchema>
export type Location = z.infer<typeof LocationSchema>
export type TotalCost = z.infer<typeof TotalCostSchema>
export type LabeledCost = z.infer<typeof LabeledCostSchema>
export type ContainerDetailsType = z.infer<typeof ContainerDetailsTypeSchema>
export type IgContainerDetailsType = z.infer<
  typeof IgContainerDetailsTypeSchema
>
export type ContainerCost = z.infer<typeof ContainerCostSchema>
export type IgContainerCost = z.infer<typeof IgContainerCostSchema>
export type TotalCostByContainerType = z.infer<
  typeof TotalCostByContainerTypeSchema
>
export type IgTotalCostByContainerType = z.infer<
  typeof IgTotalCostByContainerTypeSchema
>

export type WarehouseConfirmedQuote = z.infer<
  typeof WarehouseConfirmedQuoteSchema
>
export type AirConfirmedQuote = z.infer<typeof AirConfirmedQuoteSchema>
export type LandConfirmedQuote = z.infer<typeof LandConfirmedQuoteSchema>
export type SeaLclConfirmedQuote = z.infer<typeof SeaLclConfirmedQuoteSchema>
export type SeaFclConfirmedQuote = z.infer<typeof SeaFclConfirmedQuoteSchema>
export type SeaDgConfirmedQuote = z.infer<typeof SeaDgConfirmedQuoteSchema>
export type SeaRfConfirmedQuote = z.infer<typeof SeaRfConfirmedQuoteSchema>
export type SeaIgConfirmedQuote = z.infer<typeof SeaIgConfirmedQuoteSchema>
export type SeaOogConfirmedQuote = z.infer<typeof SeaOogConfirmedQuoteSchema>

export type ConfirmedQuote = z.infer<typeof ConfirmedQuoteSchema>

export type ServiceType = z.infer<typeof ServiceTypeEnum>
export type OfferModeTypes = z.infer<typeof OfferModeTypesEnum>
export type WeightUnit = z.infer<typeof WeightUnitEnum>
export type LocationType = z.infer<typeof LocationTypeEnum>
