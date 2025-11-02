import {
  ALL_COUNTRIES,
  incoterms,
  IN_CM,
  KG_LBS,
  LCL_PACKAGE_TYPE,
  TRUCKING_TYPE,
} from '@/constants'
import { DG_CLASSES } from '@/constants/sea-dg-form'
import { z } from 'zod'

// COMMON SCHEMA
const CommonSchema = z.object({
  ori_country: z
    .string()
    .refine((value) => ALL_COUNTRIES.includes(value as any), {
      message:
        'No Data for this country.Please select from the available country options.',
    }),
  pickup_check: z.boolean(),
  pickup_location: z
    .object(
      {
        description: z.string().min(1, { message: 'required' }),
        place_id: z.string().min(1, { message: 'required' }),
      },
      { invalid_type_error: 'Invalid location' }
    )
    .nullish(),
  ori_port_rail: z.object(
    {
      port_name: z.string(),
      port_code: z.string(),
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      type: z.string(),
    },
    { invalid_type_error: 'Invalid port' }
  ),
  ori_port_if_rail: z
    .object(
      {
        port_name: z.string(),
        port_code: z.string(),
      },
      { invalid_type_error: 'Invalid port' }
    )
    .nullish(),
  //NOTE: Trucking login is only applies for india
  trucking: z.enum(TRUCKING_TYPE).optional(),

  des_country: z
    .string()
    .refine((value) => ALL_COUNTRIES.includes(value as any), {
      message:
        'No Data for this country.Please select from the available country options.',
    }),
  delivery_check: z.boolean(),
  delivery_location: z
    .object(
      {
        description: z.string().min(1, { message: 'required' }),
        place_id: z.string().min(1, { message: 'required' }),
      },
      { invalid_type_error: 'Invalid location' }
    )
    .nullish(),
  des_port_rail: z.object(
    {
      port_name: z.string(),
      port_code: z.string(),
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      type: z.string(),
    },
    { invalid_type_error: 'Invalid port' }
  ),
  des_port_if_rail: z
    .object(
      {
        port_name: z.string(),
        port_code: z.string(),
      },
      { invalid_type_error: 'Invalid port' }
    )
    .nullish(),

  hsn: z.object(
    {
      code: z.string(),
      chapter: z.string(),
      heading: z.string(),
      subheading: z.string(),
    },
    { invalid_type_error: 'Invalid hsn' }
  ),
  value: z.coerce.number({ invalid_type_error: 'Invalid value' }).min(1),
  date: z.coerce.date(),
  incoterms: z.enum(incoterms),
})

//FCL SCHEMA
// TODO: put this different file
export const FCL_CONTAINER_ENUM = z.enum(['20STD', '40STD', '40HC'])
export const IG_CONTAINER_ENUM = z.enum([
  'OT20',
  'OT40',
  'FR20',
  'FR40',
  'FR45',
])
export const DG_CONTAINER_ENUM = z.enum(['20STD', '40STD', '40HC'])
export const RF_CONTAINER_ENUM = z.enum(['20STD', '40STD', '40HC'])
export const FclSchema = z
  .object({
    modes: z.literal('FCL'),
    fcl_container_type: z
      .array(FCL_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    //NOTE: Multiple container type is allowed
    fcl_quantities: z.object({
      '20STD': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional()
        .describe('Number of 20STD containers. Max 50'),
      '40STD': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional()
        .describe('Number of 40STD containers. Max 50'),
      '40HC': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional()
        .describe('Number of 40HC containers. Max 50'),
    }),
    fcl_weights: z.object({
      '20STD': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional()
        .describe('Weight of 20STD containers. Max 40000'),
      '40STD': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(1, 'Must be 1 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional()
        .describe('Weight of 40STD containers. Max 40000'),
      '40HC': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional()
        .describe('Weight of 40HC containers. Max 40000'),
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

//DG SCHEMA
const DgSchema = z
  .object({
    modes: z.literal('DG'),
    dg_class: z.enum(DG_CLASSES),
    dg_container_type: z
      .array(DG_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    dg_quantities: z.object({
      '20STD': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional()
        .describe('Number of 20STD containers. Max 50'),
      '40STD': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional()
        .describe('Number of 40STD containers. Max 50'),
      '40HC': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional()
        .describe('Number of 40HC containers. Max 50'),
    }),
    dg_weights: z.object({
      '20STD': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional()
        .describe('Weight of 20STD containers. Max 40000'),
      '40STD': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional()
        .describe('Weight of 40STD containers. Max 40000'),
      '40HC': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional()
        .describe('Weight of 40HC containers. Max 40000'),
    }),
    dg_unit: z.enum(KG_LBS),
  })
  .merge(CommonSchema)

//REEFER SCHEMA
const RFSchema = z
  .object({
    modes: z.literal('RF'),
    rf_container_type: z
      .array(RF_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    rf_quantities: z.object({
      '20STD': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      '40STD': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      '40HC': z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
    }),
    rf_weights: z.object({
      '20STD': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      '40STD': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      '40HC': z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
    }),
    rf_unit: z.enum(KG_LBS),
    rf_temperture: z.coerce
      .number({ invalid_type_error: 'Invalid temperature' })
      .min(-20, 'Must be greater than -20.')
      .max(20, 'Must be less than 20.'),
    rf_humidity: z.coerce
      .number({ invalid_type_error: 'Invalid humidity' })
      .min(0, 'Must be greater than 0.')
      .max(100, 'Must be less than 100.'),
  })
  .merge(CommonSchema)

// Ingauge Schema
export const IgSchema = z
  .object({
    modes: z.literal('IG'),
    ig_container_type: z
      .array(IG_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    ig_quantities: z.object({
      OT20: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      OT40: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      FR20: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      FR40: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      FR45: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
    }),
    ig_weights: z.object({
      OT20: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      OT40: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      FR20: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      FR40: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      FR45: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
    }),
    ig_unit: z.enum(KG_LBS),
  })
  .merge(CommonSchema)

// Outgauge Schema
export const OogSchema = z
  .object({
    modes: z.literal('OOG'),
    oog_container_type: z
      .array(IG_CONTAINER_ENUM)
      .nonempty('Select at least one container type.'),
    oog_quantities: z.object({
      OT20: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      OT40: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      FR20: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      FR40: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
      FR45: z.coerce
        .number({ invalid_type_error: 'Invalid quantity' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .optional(),
    }),
    oog_weights: z.object({
      OT20: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      OT40: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      FR20: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      FR40: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
      FR45: z.coerce
        .number({ invalid_type_error: 'Invalid weight' })
        .int('Must be an a whole number.')
        .min(0, 'Must be 0 or more.')
        .max(40000, 'Must be less than 40000.')
        .optional(),
    }),
    oog_unit: z.enum(KG_LBS),
  })
  .merge(CommonSchema)

export const SeaFormSchema = z
  .discriminatedUnion('modes', [
    FclSchema,
    LclSchema,
    DgSchema,
    RFSchema,
    OogSchema,
    IgSchema,
  ])
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
    if (data.modes === 'DG') {
      const total = data.dg_container_type.reduce(
        (sum, id) => sum + (data.dg_quantities[id] ?? 0),
        0
      )
      if (total <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Provide a quantity greater than 0 for at least one selected type.',
          path: ['dg_quantities'],
        })
      }
      const totalWeight = data.dg_container_type.reduce(
        (sum, id) => sum + (data.dg_weights?.[id] ?? 0),
        0
      )
      if (totalWeight <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Provide a weight greater than 0 for at least one selected type.',
          path: ['dg_weights'],
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
    if (data.modes === 'RF') {
      if (data.rf_temperture === undefined || data.rf_humidity === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'temperature and humidity are required',
          path: ['rf_temperture', 'rf_humidity'],
        })
      }
    }
    if (data.modes === 'IG') {
      if (data.ig_container_type.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'container type is required',
          path: ['ig_container_type'],
        })
      }
    }
    if (data.modes === 'OOG') {
      if (data.oog_container_type.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'container type is required',
          path: ['oog_container_type'],
        })
      }
    }
  })

export type SeaFormType = z.infer<typeof SeaFormSchema>
export type FclContainerType = z.infer<typeof FclSchema>['fcl_container_type']
export type FclQuantitiesType = z.infer<typeof FclSchema>['fcl_quantities']
export type IgQuantitiesType = z.infer<typeof IgSchema>['ig_quantities']
export type IgWeightsType = z.infer<typeof IgSchema>['ig_weights']
export type IgUnitType = z.infer<typeof IgSchema>['ig_unit']
export type FclWeightUnitType = z.infer<typeof FclSchema>['fcl_unit']
export type FclWeightsType = z.infer<typeof FclSchema>['fcl_weights']
export type PickupDeliveryLocationType = z.infer<
  typeof SeaFormSchema
>['pickup_location']
export type PortType = z.infer<typeof SeaFormSchema>['ori_port_rail']
export type IncotermsType = z.infer<typeof SeaFormSchema>['incoterms']
export type ModesType = z.infer<typeof SeaFormSchema>['modes']
