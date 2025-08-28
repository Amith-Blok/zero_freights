import {
  ALL_COUNTRY_CODES,
  BULK_TYPE,
  incoterms,
  IN_CM,
  KG_LBS,
  KG_LBS_DAY,
  LCL_PACKAGE_TYPE,
  TRUCKING_TYPE,
  COUNTRIES,
} from '@/constants'
import { z } from 'zod'

// COMMON SCHEMA
const CommonSchema = z.object({
  //TODO: different modes have different countries list
  ori_country: z.enum(COUNTRIES),
  pickup_check: z.boolean(),
  pickup_location: z
    .object({
      description: z.string().min(1, { message: 'required' }),
      place_id: z.string().min(1, { message: 'required' }),
    })
    .nullish(),
  ori_port_rail: z.object({
    port_name: z.string(),
    port_code: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    type: z.string(),
  }),
  ori_port_if_rail: z
    .object({
      port_name: z.string(),
      port_code: z.string(),
    })
    .nullish(),
  //NOTE: Trucking login is only applies for india
  trucking: z.enum(TRUCKING_TYPE).optional(),

  des_country: z.enum(ALL_COUNTRY_CODES),
  delivery_check: z.boolean(),
  delivery_location: z
    .object({
      description: z.string().min(1, { message: 'required' }),
      place_id: z.string().min(1, { message: 'required' }),
    })
    .nullish(),
  des_port_rail: z.object({
    port_name: z.string(),
    port_code: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    type: z.string(),
  }),
  des_port_if_rail: z
    .object({
      port_name: z.string(),
      port_code: z.string(),
    })
    .nullish(),

  hsn: z.object({
    code: z.string(),
    chapter: z.string(),
    heading: z.string(),
    subheading: z.string(),
  }),
  value: z.coerce.number().min(1),
  date: z.coerce.date(),
  incoterms: z.enum(incoterms),
  phone: z.string(),
  email: z.string().email(),
  company_name: z.string().min(1, { message: 'Required' }),
  user_name: z.string().min(1, { message: 'Required' }),
})

//FCL SCHEMA
// TODO: put this different file
export const FCL_CONTAINER_ENUM = z.enum(['20STD', '40STD', '40HC'])
export const FclSchema = z
  .object({
    modes: z.literal('FCL'),
    fcl_container_type: z
      .array(FCL_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    //NOTE: Multiple container type is allowed
    fcl_quantities: z.object({
      '20STD': z.coerce.number().min(0, 'Must be 0 or more.'),
      '40STD': z
        .number({ invalid_type_error: 'Enter a number.' })
        .min(0, 'Must be 0 or more.'),
      '40HC': z.coerce.number().min(0, 'Must be 0 or more.'),
    }),
    // Per-container weights (same unit for all)
    fcl_weights: z.object({
      '20STD': z.coerce.number().min(0, 'Must be 0 or more.'),
      '40STD': z
        .number({ invalid_type_error: 'Enter a number.' })
        .min(0, 'Must be 0 or more.'),
      '40HC': z.coerce.number().min(0, 'Must be 0 or more.'),
    }),
    fcl_unit: z.enum(KG_LBS),
  })
  .merge(CommonSchema)

//LCL SCHEMA
const LclSchema = z
  .object({
    modes: z.literal('LCL'),
    lcl_container_type: z.enum(LCL_PACKAGE_TYPE),
    lcl_load: z.array(
      z.object({
        lcl_wid: z.coerce.number(),
        lcl_hgt: z.coerce.number(),
        lcl_lgt: z.coerce.number(),
        lcl_volume_unit: z.enum(IN_CM),
        lcl_quantity: z.coerce.number(),
        lcl_weight: z.coerce.number(),
        lcl_weight_unit: z.enum(KG_LBS),
      })
    ),

    lcl_cbm_ton: z.object({
      cbm: z.number(),
      ton: z.number(),
      kg: z.number(),
    }),
  })
  .merge(CommonSchema)

//BULK SCHEMA
const BulkSchema = z
  .object({
    modes: z.literal('BULK'),
    bulk_type: z.enum(BULK_TYPE),
    bulk_load: z.array(
      z.object({
        bulk_wid: z.coerce.number(),
        bulk_hgt: z.coerce.number(),
        bulk_lgt: z.coerce.number(),
        bulk_volume_unit: z.enum(IN_CM),
        bulk_quantity: z.coerce.number(),
        bulk_weight: z.coerce.number(),
        bulk_weight_unit: z.enum(KG_LBS),
      })
    ),
    bulk_loading_rate: z.coerce.number(),
    bulk_loading_unit: z.enum(KG_LBS_DAY),
    bulk_discharge_rate: z.coerce.number(),
    bulk_discharge_unit: z.enum(KG_LBS_DAY),
    bulk_cbm_ton: z.object({
      cbm: z.number(),
      ton: z.number(),
      kg: z.number(),
    }),
  })
  .merge(CommonSchema)

export const SeaFormSchema = z
  .discriminatedUnion('modes', [FclSchema, LclSchema, BulkSchema])
  .superRefine((data, ctx) => {
    if (data.modes === 'FCL') {
      const total = data.fcl_container_type.reduce(
        (sum, id) => sum + (data.fcl_quantities[id] ?? 0),
        0
      )
      if (total <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Provide a quantity greater than 0 for at least one selected type.',
          path: ['fcl_quantities'],
        })
      }
      const totalWeight = data.fcl_container_type.reduce(
        (sum, id) => sum + (data.fcl_weights?.[id] ?? 0),
        0
      )
      if (totalWeight <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Provide a weight greater than 0 for at least one selected type.',
          path: ['fcl_weights'],
        })
      }
      if (data.pickup_check && data.pickup_location === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pickup location is required when pickup_check is true',
          path: ['pickup_location'],
        })
      }
      if (data.delivery_check && data.delivery_location === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'delivery location is required when delivery_check is true',
          path: ['delivery_location'],
        })
      }
      if (
        data.ori_country == 'IN' &&
        data.ori_port_rail.type !== 'PORT' &&
        data.ori_port_if_rail === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Origin port is required when ori_port_icd_rail.type is 'rail' or 'icd'",
          path: ['ori_port_if_rail'],
        })
      }
      if (
        data.des_country == 'IN' &&
        data.des_port_rail.type !== 'PORT' &&
        data.des_port_if_rail === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "destination_port is required when ori_port_icd_rail.type is 'rail' or 'icd'",
          path: ['des_port_if_rail'],
        })
      }
      if (data.des_country == data.ori_country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'same origin country and destination',
          path: ['des_country'],
        })
      }
    }
    if (data.modes === 'LCL') {
      if (data.des_country == data.ori_country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'same origin country and destination',
          path: ['des_country'],
        })
      }
    }
  })

export type SeaFormType = z.infer<typeof SeaFormSchema>
export type FclContainerType = z.infer<typeof FclSchema>['fcl_container_type']
export type FclQuantitiesType = z.infer<typeof FclSchema>['fcl_quantities']
export type FclWeightUnitType = z.infer<typeof FclSchema>['fcl_unit']
export type FclWeightsType = z.infer<typeof FclSchema>['fcl_weights']
export type PickupDeliveryLocationType = z.infer<
  typeof SeaFormSchema
>['pickup_location']
export type PortType = z.infer<typeof SeaFormSchema>['ori_port_rail']
export type IncotermsType = z.infer<typeof SeaFormSchema>['incoterms']
