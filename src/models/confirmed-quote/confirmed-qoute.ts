import mongoose, { Document, InferSchemaType } from 'mongoose'
import { ServiceType } from '../offer/shared-types'
import {
  ConfirmedQuoteData,
  ExchangeSchema,
  LocationSchema,
  TotalCostSchema,
} from './common-schema'
import {
  ConfirmedQuote,
  WarehouseConfirmedQuote,
  LandConfirmedQuote,
  SeaLclConfirmedQuote,
  SeaFclConfirmedQuote,
  SeaDgConfirmedQuote,
  SeaRfConfirmedQuote,
  SeaIgConfirmedQuote,
  SeaOogConfirmedQuote,
  AirConfirmedQuote,
} from './shared-types'
import { transform } from '@/lib/mongoose-transform'
import {
  ContainerCostSchema,
  IgContainerCostSchema,
  IgTotalCostByContainerTypeSchema,
  TotalCostByContainerTypeSchema,
} from '../offer/common-schema'
import { getOrCreateDiscriminator } from '../offer/common-schema'

export interface ConfirmedQuoteDocument extends ConfirmedQuote, Document {}
export interface WarehouseConfirmedQuoteDocument
  extends WarehouseConfirmedQuote,
    Document {}
export interface AirConfirmedQuoteDocument
  extends AirConfirmedQuote,
    Document {}
export interface LandConfirmedQuoteDocument
  extends LandConfirmedQuote,
    Document {}
export interface SeaLclConfirmedQuoteDocument
  extends SeaLclConfirmedQuote,
    Document {}
export interface SeaFclConfirmedQuoteDocument
  extends SeaFclConfirmedQuote,
    Document {}
export interface SeaDgConfirmedQuoteDocument
  extends SeaDgConfirmedQuote,
    Document {}
export interface SeaRfConfirmedQuoteDocument
  extends SeaRfConfirmedQuote,
    Document {}
export interface SeaIgConfirmedQuoteDocument
  extends SeaIgConfirmedQuote,
    Document {}
export interface SeaOogConfirmedQuoteDocument
  extends SeaOogConfirmedQuote,
    Document {}

export const ConfirmedQuoteSchema = new mongoose.Schema<ConfirmedQuoteDocument>(
  {
    form_id: { type: String, required: true },
    blok_id: { type: String, required: true },
    offer_id: { type: String, required: true },
    offer_date: { type: String, required: true },
    user_id: { type: String, required: true },
    subject: { type: String, required: true },
    place_of_supply: { type: String, required: true },
    bill_to: { type: String, required: true },
    service_type: {
      type: String,
      required: true,
      enum: Object.values(ServiceType),
    },
    mode: {
      type: String,
      required: true,
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
    },

    start_code: { type: String, required: true },
    end_code: { type: String, required: true },
    exchanges: { type: ExchangeSchema, require: true },
    tags: { type: [String], required: true },
    locations: { type: [LocationSchema], required: true },
  },
  {
    _id: true,
    collection: 'confirmed_quotes',
    timestamps: { createdAt: 'created_at', updatedAt: false },
    discriminatorKey: 'mode',
    toJSON: { transform: transform },
  }
)

export type ConfirmedQuoteType = InferSchemaType<typeof ConfirmedQuoteSchema>
export const ConfirmedQuoteModel =
  (mongoose.models.ConfirmedQuote as mongoose.Model<ConfirmedQuoteDocument>) ||
  mongoose.model<ConfirmedQuoteDocument>('ConfirmedQuote', ConfirmedQuoteSchema)

export const WarehouseConfirmedQuoteModel =
  getOrCreateDiscriminator<WarehouseConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'WAR',
    new mongoose.Schema<WarehouseConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      package_type: { type: String, required: true },
      total_cost: { type: TotalCostSchema, required: true },
      data: { type: [ConfirmedQuoteData], required: true },
    })
  )

export const AirConfirmedQuoteModel =
  getOrCreateDiscriminator<AirConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'AIR',
    new mongoose.Schema<AirConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      package_type: { type: String, required: true },
      total_cost: { type: TotalCostSchema, required: true },
      data: { type: [ConfirmedQuoteData], required: true },
    })
  )

export const LandConfirmedQuoteModel =
  getOrCreateDiscriminator<LandConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'LAND',
    new mongoose.Schema<LandConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      package_type: { type: String, required: true },
      total_cost: { type: TotalCostSchema, required: true },
      data: { type: [ConfirmedQuoteData], required: true },
    })
  )

export const SeaLclConfirmedQuoteModel =
  getOrCreateDiscriminator<SeaLclConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'SEA_LCL',
    new mongoose.Schema<SeaLclConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      package_type: { type: String, required: true },
      total_cost: { type: TotalCostSchema, required: true },
      data: { type: [ConfirmedQuoteData], required: true },
    })
  )

export const SeaFclConfirmedQuoteModel =
  getOrCreateDiscriminator<SeaFclConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'SEA_FCL',
    new mongoose.Schema<SeaFclConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      port_to_days: { type: Number, required: true },
      estimated_days: { type: Number, required: true },
      valid_to: { type: String, required: true },
      container_types: { type: [String], required: true },
      container_details: { type: Object, required: true },
      weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
      total_cost: { type: TotalCostByContainerTypeSchema, required: true },
      data: { type: [ContainerCostSchema], required: true },
    })
  )
export const SeaDgConfirmedQuoteModel =
  getOrCreateDiscriminator<SeaDgConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'SEA_DG',
    new mongoose.Schema<SeaDgConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      port_to_days: { type: Number, required: true },
      estimated_days: { type: Number, required: true },
      valid_to: { type: String, required: true },
      container_types: { type: [String], required: true },
      container_details: { type: Object, required: true },
      weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
      dg_class: { type: String, required: true },
      total_cost: { type: TotalCostByContainerTypeSchema, required: true },
      data: { type: [ContainerCostSchema], required: true },
    })
  )
export const SeaRfConfirmedQuoteModel =
  getOrCreateDiscriminator<SeaRfConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'SEA_RF',
    new mongoose.Schema<SeaRfConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      port_to_days: { type: Number, required: true },
      estimated_days: { type: Number, required: true },
      valid_to: { type: String, required: true },
      container_types: { type: [String], required: true },
      container_details: { type: Object, required: true },
      weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      total_cost: { type: TotalCostByContainerTypeSchema, required: true },
      data: { type: [ContainerCostSchema], required: true },
    })
  )

export const SeaIgConfirmedQuoteModel =
  getOrCreateDiscriminator<SeaIgConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'SEA_IG',
    new mongoose.Schema<SeaIgConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      port_to_days: { type: Number, required: true },
      estimated_days: { type: Number, required: true },
      valid_to: { type: String, required: true },
      container_types: { type: [String], required: true },
      container_details: { type: Object, required: true },
      weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
      total_cost: {
        type: IgTotalCostByContainerTypeSchema,
        required: true,
      },
      data: { type: [IgContainerCostSchema], required: true },
    })
  )
export const SeaOogConfirmedQuoteModel =
  getOrCreateDiscriminator<SeaOogConfirmedQuoteDocument>(
    ConfirmedQuoteModel,
    'SEA_OOG',
    new mongoose.Schema<SeaOogConfirmedQuoteDocument>({
      carrier: { type: String, required: true },
      port_to_days: { type: Number, required: true },
      estimated_days: { type: Number, required: true },
      valid_to: { type: String, required: true },
      container_types: { type: [String], required: true },
      container_details: { type: Object, required: true },
      weight_unit: { type: String, required: true, enum: ['KG', 'LBS'] },
      total_cost: { type: IgTotalCostByContainerTypeSchema, required: true },
      data: { type: [IgContainerCostSchema], required: true },
    })
  )
