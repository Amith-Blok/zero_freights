/**
 * Tracking Module - Main Export File
 *
 * This module provides a comprehensive tracking system for freight shipments
 * supporting both container-level tracking (FCL) and booking-level tracking (LCL, Air, etc.)
 */

// Types and Interfaces
export {
  TrackingStatus,
  MilestoneType,
  isContainerTracking,
  isBookingTracking,
} from './tracking-types'

export type {
  TrackingLocation,
  TrackingMilestone,
  BaseTracking,
  ContainerIdentifiers,
  ContainerDetails,
  ContainerTracking,
  BookingIdentifiers,
  BookingTracking,
  ShipmentTracking,
  TrackingQueryFilters,
} from './tracking-types'

// Mongoose Models
export {
  ShipmentTrackingModel,
  SeaFclTrackingModel,
  SeaDgTrackingModel,
  SeaRfTrackingModel,
  SeaIgTrackingModel,
  SeaOogTrackingModel,
  SeaLclTrackingModel,
  AirTrackingModel,
  DomesticTruckingTrackingModel,
  SeaportTruckingTrackingModel,
  AirportTruckingTrackingModel,
  FclWarehouseTrackingModel,
  LclWarehouseTrackingModel,
  LtlWarehouseTrackingModel,
} from './tracking'

export type {
  ContainerTrackingDocument,
  BookingTrackingDocument,
} from './tracking'

// Utility Functions
export {
  getTrackingModel,
  generateTrackingId,
  createMilestone,
  addMilestoneToTracking,
  addMilestoneToContainer,
  updateTrackingStatus,
  findTrackingByIdentifier,
  getUserTrackings,
  getBookingTrackings,
  getContainerByNumber,
  calculateTrackingProgress,
  getEstimatedDaysRemaining,
  isTrackingDelayed,
  getTrackingSummary,
  type TrackingSummary,
} from './tracking-utils'

// Examples (you can remove this in production)
export * as TrackingExamples from './tracking-examples'
