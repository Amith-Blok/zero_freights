import {
  FCL_CONTAINER_TYPE,
  IN_CM,
  KG_LBS,
  LCL_PACKAGE_TYPE,
} from '@/constants'
import * as z from 'zod'

const googleSchema = z.object({
  description: z.string(),
  place_id: z.string(),
})
const portSchema = z.object({
  port_name: z.string(),
  port_code: z.string(),
  place_id: z.string(),
})
export const CommonSchema = z.object({
  country: z.enum(['US']),
  is_google_location: z.boolean(),
  dg: z.boolean().optional(),
  floor: z.boolean().optional(),
  pickup_location: z.union([googleSchema, portSchema]),
  delivery_location: z.object({
    port_code: z.string(),
    port_name: z.string(),
    place_id: z.string(),
  }),
  hsn: z.object({
    hsn_code: z.string(),
    hsn_des: z.string(),
  }),
  storage_days: z.coerce
    .number()
    .min(1, { message: 'min one day is required' }),
  value: z.coerce.number().min(1),
  phone: z.string(),
  email: z.string().email(),
  company_name: z.string().min(1, { message: 'Required' }),
  user_name: z.string().min(1, { message: 'Required' }),
})

export const FclWarehouseSchema = z
  .object({
    modes: z.literal('FCL_WAREHOUSE'),

    fcl_container_type: z.enum(FCL_CONTAINER_TYPE),
    fcl_quantity: z.coerce.number().min(1).max(32767),
    fcl_weight: z.coerce.number().min(1),
    fcl_unit: z.enum(KG_LBS),
    fcl_load: z
      .array(
        z.object({
          fcl_wid: z.coerce.number(),
          fcl_hgt: z.coerce.number(),
          fcl_lgt: z.coerce.number(),
          fcl_volume_unit: z.enum(IN_CM),
          fcl_quantity: z.coerce.number(),
          fcl_weight: z.coerce.number(),
          fcl_weight_unit: z.enum(KG_LBS),
        })
      )
      .refine(
        (data) =>
          data.every(
            (load) =>
              load.fcl_quantity !== null &&
              load.fcl_quantity !== undefined &&
              load.fcl_quantity >= 1
          ),
        {
          message: 'Quantity must be at least 1',
          path: ['fcl_load'], // path to the field
        }
      ),
    fcl_cbm_ton: z
      .object({
        cbm: z.number(),
        ton: z.number(),
        kg: z.number(),
      })
      .required(),
  })
  .merge(CommonSchema)
const LclWarehouseSchema = z
  .object({
    modes: z.literal('LCL_WAREHOUSE'),

    fcl_container_type: z.enum(FCL_CONTAINER_TYPE),
    lcl_container_type: z.enum(LCL_PACKAGE_TYPE),
    lcl_load: z
      .array(
        z.object({
          lcl_wid: z.coerce.number(),
          lcl_hgt: z.coerce.number(),
          lcl_lgt: z.coerce.number(),
          lcl_volume_unit: z.enum(IN_CM),
          lcl_quantity: z.coerce.number(),
          lcl_weight: z.coerce.number(),
          lcl_weight_unit: z.enum(KG_LBS),
        })
      )
      .refine(
        (data) =>
          data.every(
            (load) =>
              load.lcl_quantity !== null &&
              load.lcl_quantity !== undefined &&
              load.lcl_quantity >= 1
          ),
        {
          message: 'Quantity must be at least 1',
          path: ['lcl_load', 'lcl_quantity'], // path to the field
        }
      ),
    lcl_cbm_ton: z
      .object({
        cbm: z.number(),
        ton: z.number(),
        kg: z.number(),
      })
      .required(),
  })
  .merge(CommonSchema)
const LtlWarehouseSchema = z
  .object({
    modes: z.literal('LTL_WAREHOUSE'),
    ltl_load: z.array(
      z.object({
        ltl_wid: z.coerce.number(),
        ltl_hgt: z.coerce.number(),
        ltl_lgt: z.coerce.number(),
        ltl_volume_unit: z.enum(IN_CM),
        ltl_quantity: z.coerce.number(),
        ltl_weight: z.coerce.number(),
        ltl_weight_unit: z.enum(KG_LBS),
      })
    ),
    ltl_cbm_ton: z
      .object({
        cbm: z.number(),
        ton: z.number(),
        kg: z.number(),
      })
      .required(),
  })
  .merge(CommonSchema)

export const WarehouseFormSchema = z
  .discriminatedUnion('modes', [
    FclWarehouseSchema,
    LclWarehouseSchema,
    LtlWarehouseSchema,
  ])
  //TODO Add some vaildation
  // eslint-disable-next-line no-unused-vars
  .superRefine((data, ctx) => {
    const isGoogle = data.is_google_location
    const pickupLoation = data.pickup_location
    const isVaildPickup = isGoogle
      ? googleSchema.safeParse(pickupLoation).success
      : portSchema.safeParse(pickupLoation).success
    if (!isVaildPickup) {
      ctx.addIssue({
        path: ['pickup_location'],
        message: 'invalid',
        code: 'custom',
      })
    }
  })

export type WarehouseFormTypes = z.infer<typeof WarehouseFormSchema>
export type WarehouseModeType = WarehouseFormTypes['modes']
