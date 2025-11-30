import mongoose, { Document, InferSchemaType } from 'mongoose'
import { ServiceType } from '../offer/shared-types'
import { transform } from '@/lib/mongoose-transform'
import {
  TrackingStatus,
  MilestoneType,
  ContainerTracking,
  BookingTracking,
} from './tracking-types'

export interface ContainerTrackingDocument
  extends ContainerTracking,
    Document {}
export interface BookingTrackingDocument extends BookingTracking, Document {}

/**
 * Location Schema
 */
const TrackingLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    city: { type: String },
    country: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { _id: false }
)

/**
 * Milestone Schema
 */
const TrackingMilestoneSchema = new mongoose.Schema(
  {
    milestone_type: {
      type: String,
      required: true,
      enum: Object.values(MilestoneType),
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TrackingStatus),
    },
    timestamp: { type: Date, required: true },
    location: { type: TrackingLocationSchema },
    description: { type: String, required: true },
    notes: { type: String },
    created_by: { type: String },
  },
  { _id: false }
)

/**
 * Base Tracking Schema
 * Common fields for all tracking types
 */
export const BaseTrackingSchema = new mongoose.Schema(
  {
    tracking_id: { type: String, required: true, unique: true, index: true },
    booking_id: { type: String, required: true, index: true },
    service_type: {
      type: String,
      required: true,
      enum: Object.values(ServiceType),
    },
    user_id: { type: String, required: true, index: true },
    current_status: {
      type: String,
      required: true,
      enum: Object.values(TrackingStatus),
      default: TrackingStatus.BOOKING_PENDING,
    },
    booking_date: { type: Date, required: true },
    estimated_delivery_date: { type: Date },
    actual_delivery_date: { type: Date },
    carrier: { type: String, required: true },
    carrier_reference: { type: String },
    origin: { type: TrackingLocationSchema, required: true },
    destination: { type: TrackingLocationSchema, required: true },
    milestones: { type: [TrackingMilestoneSchema], default: [] },
    special_instructions: { type: String },
    is_active: { type: Boolean, default: true, index: true },
  },
  {
    _id: true,
    collection: 'shipment_tracking',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    discriminatorKey: 'tracking_type',
    toJSON: { transform: transform },
  }
)

// Compound indexes for efficient queries
BaseTrackingSchema.index({ user_id: 1, current_status: 1 })
BaseTrackingSchema.index({ booking_id: 1, service_type: 1 })
BaseTrackingSchema.index({ carrier: 1, is_active: 1 })

export type BaseTrackingType = InferSchemaType<typeof BaseTrackingSchema>

export const ShipmentTrackingModel =
  (mongoose.models
    .ShipmentTracking as mongoose.Model<ContainerTrackingDocument>) ||
  mongoose.model<ContainerTrackingDocument>(
    'ShipmentTracking',
    BaseTrackingSchema
  )

/**
 * Container Identifiers Schema
 */
const ContainerIdentifiersSchema = new mongoose.Schema(
  {
    container_id: { type: String, required: true },
    container_number: { type: String },
    seal_number: { type: String },
    hbl_number: { type: String },
    mbl_number: { type: String },
  },
  { _id: false }
)

/**
 * Container Details Schema
 */
const ContainerDetailsSchema = new mongoose.Schema(
  {
    ...ContainerIdentifiersSchema.obj,
    container_type: { type: String, required: true },
    weight: { type: Number },
    weight_unit: { type: String, enum: ['KG', 'LBS', 'TON'] },
    volume: { type: Number },
    volume_unit: { type: String, enum: ['CBM', 'CFT'] },
    cargo_description: { type: String },
    status: {
      type: String,
      required: true,
      enum: Object.values(TrackingStatus),
      default: TrackingStatus.BOOKING_PENDING,
    },
    milestones: { type: [TrackingMilestoneSchema], default: [] },
    is_hazardous: { type: Boolean },
    dg_class: { type: String },
    temperature: { type: Number },
    humidity: { type: Number },
    is_oversized: { type: Boolean },
  },
  { _id: true }
)

/**
 * Container Tracking Schema
 * For FCL services that track individual containers
 */
export const ContainerTrackingSchema =
  new mongoose.Schema<ContainerTrackingDocument>({
    master_bl_number: { type: String, index: true },
    house_bl_number: { type: String, index: true },
    containers: { type: [ContainerDetailsSchema], required: true },
    total_containers: { type: Number, required: true },
    vessel_name: { type: String },
    voyage_number: { type: String },
    port_of_loading: { type: String },
    port_of_discharge: { type: String },
    final_destination: { type: String },
  })

// Index for container number search across all containers
ContainerTrackingSchema.index({ 'containers.container_number': 1 })
ContainerTrackingSchema.index({ 'containers.hbl_number': 1 })
ContainerTrackingSchema.index({ 'containers.mbl_number': 1 })

/**
 * Booking Identifiers Schema
 */
const BookingIdentifiersSchema = new mongoose.Schema(
  {
    airway_bill_number: { type: String },
    bill_of_lading_number: { type: String },
    consignment_note: { type: String },
    warehouse_receipt_number: { type: String },
    tracking_number: { type: String },
  },
  { _id: false }
)

/**
 * Booking Tracking Schema
 * For non-container services that track at booking level
 */
export const BookingTrackingSchema =
  new mongoose.Schema<BookingTrackingDocument>({
    identifiers: { type: BookingIdentifiersSchema, required: true },
    package_type: { type: String, required: true },
    total_packages: { type: Number },
    total_weight: { type: Number },
    weight_unit: { type: String, enum: ['KG', 'LBS', 'TON'] },
    total_volume: { type: Number },
    volume_unit: { type: String, enum: ['CBM', 'CFT'] },
    cargo_description: { type: String },
    flight_number: { type: String },
    flight_date: { type: Date },
    vessel_name: { type: String },
    voyage_number: { type: String },
    truck_number: { type: String },
    driver_info: {
      name: { type: String },
      phone: { type: String },
      license_number: { type: String },
    },
    warehouse_location: { type: String },
  })

// Indexes for various identifier searches
BookingTrackingSchema.index({ 'identifiers.airway_bill_number': 1 })
BookingTrackingSchema.index({ 'identifiers.bill_of_lading_number': 1 })
BookingTrackingSchema.index({ 'identifiers.consignment_note': 1 })
BookingTrackingSchema.index({ 'identifiers.tracking_number': 1 })

/**
 * Helper function to get or create discriminator
 */
function getOrCreateTrackingDiscriminator<T extends Document>(
  baseModel: mongoose.Model<any>,
  discriminatorName: string,
  schema: mongoose.Schema
): mongoose.Model<T> {
  // Check if discriminator already exists
  if (baseModel.discriminators && baseModel.discriminators[discriminatorName]) {
    return baseModel.discriminators[discriminatorName] as mongoose.Model<T>
  }
  // Create new discriminator if it doesn't exist
  try {
    return baseModel.discriminator<T>(discriminatorName, schema)
  } catch (error) {
    // If discriminator already registered, try to retrieve it
    if (baseModel.discriminators?.[discriminatorName]) {
      return baseModel.discriminators[discriminatorName] as mongoose.Model<T>
    }
    throw error
  }
}

/**
 * Container-Based Tracking Models
 */
export const SeaFclTrackingModel =
  getOrCreateTrackingDiscriminator<ContainerTrackingDocument>(
    ShipmentTrackingModel,
    'CONTAINER_SEA_FCL',
    ContainerTrackingSchema
  )

export const SeaDgTrackingModel =
  getOrCreateTrackingDiscriminator<ContainerTrackingDocument>(
    ShipmentTrackingModel,
    'CONTAINER_SEA_DG',
    ContainerTrackingSchema
  )

export const SeaRfTrackingModel =
  getOrCreateTrackingDiscriminator<ContainerTrackingDocument>(
    ShipmentTrackingModel,
    'CONTAINER_SEA_RF',
    ContainerTrackingSchema
  )

export const SeaIgTrackingModel =
  getOrCreateTrackingDiscriminator<ContainerTrackingDocument>(
    ShipmentTrackingModel,
    'CONTAINER_SEA_IG',
    ContainerTrackingSchema
  )

export const SeaOogTrackingModel =
  getOrCreateTrackingDiscriminator<ContainerTrackingDocument>(
    ShipmentTrackingModel,
    'CONTAINER_SEA_OOG',
    ContainerTrackingSchema
  )

/**
 * Booking-Based Tracking Models
 */
export const SeaLclTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_SEA_LCL',
    BookingTrackingSchema
  )

export const AirTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_AIR',
    BookingTrackingSchema
  )

export const DomesticTruckingTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_DOMESTIC_TRUCKING',
    BookingTrackingSchema
  )

export const SeaportTruckingTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_SEAPORT_TRUCKING',
    BookingTrackingSchema
  )

export const AirportTruckingTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_AIRPORT_TRUCKING',
    BookingTrackingSchema
  )

export const FclWarehouseTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_FCL_WAR',
    BookingTrackingSchema
  )

export const LclWarehouseTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_LCL_WAR',
    BookingTrackingSchema
  )

export const LtlWarehouseTrackingModel =
  getOrCreateTrackingDiscriminator<BookingTrackingDocument>(
    ShipmentTrackingModel,
    'BOOKING_LTL_WAR',
    BookingTrackingSchema
  )
