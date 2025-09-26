import {
  ALL_COUNTRIES,
  FCL_CONTAINER_TYPE,
  incoterms,
  IN_CM,
  KG_LBS,
  LCL_PACKAGE_TYPE,
} from '@/constants'
import { z } from 'zod'

// COMMON SCHEMA
const CommonSchema = z.object({
  country: z.enum(ALL_COUNTRIES),

  delivery_location: z.object({
    description: z.string().min(1, { message: 'required' }),
    place_id: z.string().min(1, { message: 'required' }),
  }),
  hsn: z.object({
    code: z.string(),
    chapter: z.string(),
    heading: z.string(),
    subheading: z.string(),
  }),
  value: z.coerce.number().min(1),
  date: z.coerce.date(),
  incoterms: z.enum(incoterms),
})

//FCL SCHEMA
export const SeaPortTruckingSchema = z
  .object({
    modes: z.literal('SEAPORT_TRUCKING'),
    pickup_location: z.object({
      port_name: z.string(),
      port_code: z.string(),
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      type: z.string().optional(),
    }),
    sea_container_type: z.enum(FCL_CONTAINER_TYPE),
    //TODO: look what value is required for here
    sea_quantity: z.coerce.number().min(1).max(32767),
    sea_weight: z.coerce.number().min(1),
    sea_unit: z.enum(KG_LBS),
  })
  .merge(CommonSchema)

export const DomesticTruckingSchema = z
  .object({
    modes: z.literal('DOMESTIC_TRUCKING'),
    pickup_location: z.object({
      description: z.string().min(1, { message: 'required' }),
      place_id: z.string().min(1, { message: 'required' }),
    }),
    domestic_container_type: z.enum(LCL_PACKAGE_TYPE),
    domestic_load: z.array(
      z.object({
        domestic_wid: z.coerce.number(),
        domestic_hgt: z.coerce.number(),
        domestic_lgt: z.coerce.number(),
        domestic_volume_unit: z.enum(IN_CM),
        domestic_quantity: z.coerce.number(),
        domestic_weight: z.coerce.number(),
        domestic_weight_unit: z.enum(KG_LBS),
      })
    ),

    domestic_cbm_ton: z.object({
      cbm: z.number(),
      ton: z.number(),
      kg: z.number(),
    }),
  })
  .merge(CommonSchema)

export const AirportTruckingSchema = z
  .object({
    modes: z.literal('AIRPORT_TRUCKING'),
    pickup_location: z.object({
      port_name: z.string(),
      port_code: z.string(),
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      type: z.string(),
    }),
    airport_load: z.array(
      z.object({
        airport_wid: z.coerce.number().nullish(),
        airport_hgt: z.coerce.number().nullish(),
        airport_lgt: z.coerce.number().nullish(),
        airport_volume_unit: z.enum(IN_CM),
        airport_quantity: z.coerce.number().nullish(),
        airport_weight: z.coerce.number().nullish(),
        airport_weight_unit: z.enum(KG_LBS),
      })
    ),

    airport_cbm_ton: z.object({
      cbm: z.number(),
      ton: z.number(),
      kg: z.number(),
    }),
  })
  .merge(CommonSchema)

export const LandFormSchema = z.discriminatedUnion('modes', [
  SeaPortTruckingSchema,
  DomesticTruckingSchema,
  AirportTruckingSchema,
])

export type LandFormType = z.infer<typeof LandFormSchema>
