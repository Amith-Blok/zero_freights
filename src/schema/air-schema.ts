import { ICOTERMS, KG_LBS, IN_CM, COUNTRIES } from '@/constants'
import * as z from 'zod'

export const AirFormSchema = z.object({
  ori_country: z.enum(COUNTRIES),
  ori_airport: z.object({
    port_name: z.string(),
    port_code: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    type: z.string(),
  }),

  pickup_check: z.boolean(),
  pickup_location: z.object({
    description: z.string(),
    place_id: z.string(),
    zipcode: z.string().optional(),
  }),
  des_country: z.enum(COUNTRIES),
  des_airport: z.object({
    port_name: z.string(),
    port_code: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    type: z.string(),
  }),
  delivery_check: z.boolean(),
  delivery_location: z.object({
    description: z.string(),
    place_id: z.string(),
    zipcode: z.string().optional(),
  }),
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
    hsn_code: z.string(),
    hsn_des: z.string(),
  }),
  value: z.coerce.number().min(1),
  date: z.coerce.date(),
  icoterms: z.enum(ICOTERMS),
  phone: z.string(),
  email: z.string().email(),
  company_name: z.string().min(1, { message: 'Required' }),
  user_name: z.string().min(1, { message: 'Required' }),
})

export type AirFormTypes = z.infer<typeof AirFormSchema>
