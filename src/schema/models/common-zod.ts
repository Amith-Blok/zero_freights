import { z } from 'zod'

export const ExchangeZodSchema = z.object({
  usd_to_inr: z.number(),
  inr_to_usd: z.number(),
  eur_to_inr: z.number(),
  eur_to_usd: z.number(),
})

export const LocationZodSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.enum(['door', 'port', 'rail', 'air', 'warehouse']),
})

export const LabeledCostZodSchema = z.object({
  label: z.string(),
  inr: z.number(),
  usd: z.number(),
})

export const TotalCostByContainerTypeZodSchema = z.object({
  d2: z.number(),
  d4: z.number(),
  d5: z.number(),
  total: z.number(),
})

export const MultiCurrencyContainerCostZodSchema = z.object({
  total_cost: z.object({
    inr: TotalCostByContainerTypeZodSchema,
    usd: TotalCostByContainerTypeZodSchema,
  }),
  freight_cost: z.object({
    inr: TotalCostByContainerTypeZodSchema,
    usd: TotalCostByContainerTypeZodSchema,
  }),
  local_cost: z.object({
    inr: TotalCostByContainerTypeZodSchema,
    usd: TotalCostByContainerTypeZodSchema,
  }),
})

export const IgTotalCostByContainerTypeZodSchema = z.object({
  ot2: z.number(),
  ot4: z.number(),
  fr2: z.number(),
  fr4: z.number(),
  fr5: z.number(),
  total: z.number(),
})
export const IgMultiCurrencyContainerCostZodSchema = z.object({
  total_cost: z.object({
    inr: IgTotalCostByContainerTypeZodSchema,
    usd: IgTotalCostByContainerTypeZodSchema,
  }),
  freight_cost: z.object({
    inr: IgTotalCostByContainerTypeZodSchema,
    usd: IgTotalCostByContainerTypeZodSchema,
  }),
  local_cost: z.object({
    inr: IgTotalCostByContainerTypeZodSchema,
    usd: IgTotalCostByContainerTypeZodSchema,
  }),
})
export const TotalCostZodSchema = z.object({
  usd: z.number(),
  inr: z.number(),
})

export const ContainerCostZodSchema = z.object({
  label: z.string(),
  currency: z.string(),
  additional_notes: z.string(),
  d2: z.number(),
  d4: z.number(),
  d5: z.number(),
  total: z.number(),
})
export const LineContainerCostZodSchema = z.object({
  line_name: z.string(),
  port_to_days: z.number(),
  valid_to: z.string(),
  estimated_days: z.number(),
  cost_breakdown: MultiCurrencyContainerCostZodSchema,
  data: ContainerCostZodSchema,
})

export const IgContainerCostZodSchema = z.object({
  label: z.string(),
  currency: z.string(),
  additional_notes: z.string(),
  ot2: z.number(),
  ot4: z.number(),
  fr2: z.number(),
  fr4: z.number(),
  fr5: z.number(),
  total: z.number(),
})
export const IgLineContainerCostZodSchema = z.object({
  line_name: z.string(),
  port_to_days: z.number(),
  valid_to: z.string(),
  estimated_days: z.number(),
  cost_breakdown: IgMultiCurrencyContainerCostZodSchema,
  data: IgContainerCostZodSchema,
})
export type LineContainerCostZodType = z.infer<
  typeof LineContainerCostZodSchema
>
export type ContainerCostZodType = z.infer<typeof ContainerCostZodSchema>
