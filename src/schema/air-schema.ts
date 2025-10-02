import { incoterms, KG_LBS, IN_CM } from '@/constants'
import { AIR_COUNTRIES } from '@/constants/air-form'
import * as z from 'zod'

export const AirFormSchema = z.object({
  ori_country: z.string().refine(
    (value) => {
      return AIR_COUNTRIES.includes(value as any)
    },
    {
      message: 'No data available for this country.',
    }
  ),
  ori_airport: z
    .object(
      {
        port_name: z.string(),
        port_code: z.string(),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        type: z.string(),
      },
      {
        invalid_type_error: 'Invalid airport',
      }
    )
    .refine(
      (value) => {
        return (
          value.port_name &&
          value.port_code &&
          value.lat &&
          value.lng &&
          value.type
        )
      },
      {
        message: 'Invalid airport',
      }
    ),

  pickup_check: z.boolean(),
  pickup_location: z
    .object(
      {
        description: z.string(),
        place_id: z.string(),
      },
      {
        invalid_type_error: 'Invalid location',
      }
    )
    .optional(),
  des_country: z.string().refine(
    (value) => {
      return AIR_COUNTRIES.includes(value as any)
    },
    {
      message: 'No data available for this country',
    }
  ),
  des_airport: z
    .object(
      {
        port_name: z.string(),
        port_code: z.string(),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        type: z.string(),
      },
      {
        invalid_type_error: 'Invalid airport',
      }
    )
    .refine(
      (value) => {
        return (
          value.port_name &&
          value.port_code &&
          value.lat &&
          value.lng &&
          value.type
        )
      },
      {
        message: 'Invalid airport.',
      }
    ),
  delivery_check: z.boolean(),
  delivery_location: z
    .object(
      {
        description: z.string(),
        place_id: z.string(),
      },
      { invalid_type_error: 'Invalid location' }
    )
    .optional(),
  air_load: z.array(
    z.object({
      air_wid: z.coerce.number(),
      air_hgt: z.coerce.number(),
      air_lgt: z.coerce.number(),
      air_volume_unit: z.enum(IN_CM),
      air_quantity: z.coerce.number(),
      air_weight: z.coerce.number(),
      air_weight_unit: z.enum(KG_LBS),
    })
  ),
  air_cbm_ton: z
    .object({
      cbm: z.number(),
      ton: z.number(),
      kg: z.number(),
    })
    .required(),
  hsn: z.object({
    code: z.string(),
    chapter: z.string(),
    heading: z.string(),
    subheading: z.string(),
  }),
  value: z.coerce.number({ invalid_type_error: 'Invalid value' }).min(1),
  date: z.coerce.date(),
  incoterms: z.enum(incoterms),
})

export type AirFormTypes = z.infer<typeof AirFormSchema>
