import mongoose, { Document } from 'mongoose'

import { LocationSchema } from '../location'
import { ExchangeSchema } from '../exchange'
import {
  AirOffer,
  LandOffer,
  Offer,
  SeaFclOffer,
  SeaLclOffer,
  WarehouseOffer,
  ServiceType,
} from './shared-types'
import {
  getOrCreateDiscriminator,
  LabeledCostSchema,
  SeaFclOfferSchema,
  TotalCostSchema,
} from './common-schema'
import { transform } from '@/lib/mongoose-transform'

//TODO: move to common
const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    _id: false,
  }
)

export interface OfferDocument extends Offer, Document {}
export interface WarehouseOfferDocument extends WarehouseOffer, Document {}
export interface AirOfferDocument extends AirOffer, Document {}
export interface LandOfferDocument extends LandOffer, Document {}
export interface SeaFclOfferDocument extends SeaFclOffer, Document {}
export interface SeaLclOfferDocument extends SeaLclOffer, Document {}

export const OfferSchema = new mongoose.Schema<OfferDocument>(
  {
    form_id: { type: String, required: true },
    blok_id: { type: String, required: true },
    user: { type: UserSchema, required: true },
    subject: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    bill_to: { type: String, required: true },
    mode: {
      type: String,
      enum: ['WAR', 'AIR', 'LAND', 'SEA_LCL', 'SEA_FCL'],
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
