import mongoose, { Document } from 'mongoose'

import { LocationSchema } from '../location'
import { ExchangeSchema } from '../exchange'
import {
  AirOffer,
  LandOffer,
  Offer,
  SeaFclOffer,
  SeaLclOffer,
  SeaDgOffer,
  SeaRfOffer,
  SeaIgOffer,
  SeaOogOffer,
  WarehouseOffer,
  ServiceType,
} from './shared-types'
import {
  getOrCreateDiscriminator,
  LabeledCostSchema,
  SeaFclOfferSchema,
  SeaIgOfferSchema,
  TotalCostSchema,
} from './common-schema'
import { transform } from '@/lib/mongoose-transform'

export interface OfferDocument extends Offer, Document {}
export interface WarehouseOfferDocument extends WarehouseOffer, Document {}
export interface AirOfferDocument extends AirOffer, Document {}
export interface LandOfferDocument extends LandOffer, Document {}
export interface SeaFclOfferDocument extends SeaFclOffer, Document {}
export interface SeaLclOfferDocument extends SeaLclOffer, Document {}
export interface SeaDgOfferDocument extends SeaDgOffer, Document {}
export interface SeaRfOfferDocument extends SeaRfOffer, Document {}
export interface SeaIgOfferDocument extends SeaIgOffer, Document {}
export interface SeaOogOfferDocument extends SeaOogOffer, Document {}

export const OfferSchema = new mongoose.Schema<OfferDocument>(
  {
    form_id: { type: String, required: true },
    blok_id: { type: String, required: true },
    user_id: { type: String, required: true },
    subject: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    bill_to: { type: String, required: true },
    mode: {
      type: String,
      enum: [
        'WAR',
        'AIR',
        'LAND',
        'SEA_LCL',
        'SEA_FCL',
        'SEA_DG',
        'SEA_RF',
        'SEA_IG',
        'SEA_OOG',
      ],
      required: true,
    },
    service_type: {
      type: String,
      required: true,
      enum: Object.values(ServiceType),
    },
    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    exchanges: { type: ExchangeSchema, required: true },
    tags: {
      type: [String],
      required: true,
    },
    locations: { type: [LocationSchema], required: true },
  },
  {
    _id: true,
    collection: 'offers',
    timestamps: { createdAt: 'created_at', updatedAt: false },
    discriminatorKey: 'mode',
    toJSON: { transform: transform },
  }
)

export const OfferModel =
  (mongoose.models.Offer as mongoose.Model<OfferDocument>) ||
  mongoose.model<OfferDocument>('Offer', OfferSchema)

export const WarehouseOfferModel =
  getOrCreateDiscriminator<WarehouseOfferDocument>(
    OfferModel,
    'WAR',
    new mongoose.Schema<WarehouseOfferDocument>({
      carrier: { type: String, required: true },
      package_type: { type: String, required: true },
      estimated_days: { type: Number, required: true },
      total_cost: { type: TotalCostSchema, required: true },
      offers: { type: [LabeledCostSchema], required: true },
    })
  )
export const AirOfferModel = getOrCreateDiscriminator<AirOfferDocument>(
  OfferModel,
  'AIR',
  new mongoose.Schema<AirOfferDocument>({
    carrier: { type: String, required: true },
    package_type: { type: String, required: true },
    estimated_days: { type: Number, required: true },
    total_cost: { type: TotalCostSchema, required: true },
    offers: { type: [LabeledCostSchema], required: true },
  })
)

export const LandOfferModel = getOrCreateDiscriminator<LandOfferDocument>(
  OfferModel,
  'LAND',
  new mongoose.Schema({
    carrier: { type: String, required: true },
    package_type: { type: String, required: true },
    total_cost: { type: TotalCostSchema, required: true },
    offers: { type: [LabeledCostSchema], required: true },
  })
)
export const SeaLclOfferModel = getOrCreateDiscriminator<SeaLclOfferDocument>(
  OfferModel,
  'SEA_LCL',
  new mongoose.Schema({
    carrier: { type: String, required: true },
    package_type: { type: String, required: true },
    total_cost: { type: TotalCostSchema, required: true },
    offers: { type: [LabeledCostSchema], required: true },
  })
)
export const SeaFclOfferModel = getOrCreateDiscriminator<SeaFclOfferDocument>(
  OfferModel,
  'SEA_FCL',
  new mongoose.Schema({
    container_types: { type: [String], required: true },
    container_details: { type: Object, required: true },
    weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
    offers: { type: SeaFclOfferSchema, required: true },
  })
)

export const SeaDgOfferModel = getOrCreateDiscriminator<SeaDgOfferDocument>(
  OfferModel,
  'SEA_DG',
  new mongoose.Schema({
    container_types: { type: [String], required: true },
    container_details: { type: Object, required: true },
    weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
    dg_class: { type: String, required: true },
    offers: { type: SeaFclOfferSchema, required: true },
  })
)

export const SeaRfOfferModel = getOrCreateDiscriminator<SeaRfOfferDocument>(
  OfferModel,
  'SEA_RF',
  new mongoose.Schema({
    container_types: { type: [String], required: true },
    container_details: { type: Object, required: true },
    weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    offers: { type: SeaFclOfferSchema, required: true },
  })
)

export const SeaIgOfferModel = getOrCreateDiscriminator<SeaIgOfferDocument>(
  OfferModel,
  'SEA_IG',
  new mongoose.Schema({
    container_types: { type: [String], required: true },
    container_details: { type: Object, required: true },
    weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
    offers: { type: SeaIgOfferSchema, required: true },
  })
)

export const SeaOogOfferModel = getOrCreateDiscriminator<SeaOogOfferDocument>(
  OfferModel,
  'SEA_OOG',
  new mongoose.Schema({
    carrier: { type: String, required: true },
    package_type: { type: String, required: true },
    total_cost: { type: TotalCostSchema, required: true },
    offers: { type: [LabeledCostSchema], required: true },
  })
)
