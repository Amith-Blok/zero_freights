export const US_LTL_FLAT_RATES_BY_MILES = [
  { min: 0, max: 10, rate: 125 },
  { min: 11, max: 25, rate: 150 },
  { min: 26, max: 50, rate: 200 },
  { min: 51, max: 100, rate: 300 },
]
export const FREIGHT_CLASS_RATES = [
  { class: 'Class 50', minDensity: 50.01, maxDensity: Infinity, rate: 28 },
  { class: 'Class 55', minDensity: 35, maxDensity: 50, rate: 30 },
  { class: 'Class 60', minDensity: 30, maxDensity: 34.99, rate: 31 },
  { class: 'Class 65', minDensity: 25, maxDensity: 29.99, rate: 32 },
  { class: 'Class 70', minDensity: 20, maxDensity: 24.99, rate: 34 },
  { class: 'Class 77.5', minDensity: 15, maxDensity: 19.99, rate: 36 },
  { class: 'Class 85', minDensity: 12, maxDensity: 14.99, rate: 38 },
  { class: 'Class 92.5', minDensity: 10, maxDensity: 11.99, rate: 40 },
  { class: 'Class 100', minDensity: 9, maxDensity: 9.99, rate: 42 },
  { class: 'Class 110', minDensity: 8, maxDensity: 8.99, rate: 44 },
  { class: 'Class 125', minDensity: 7, maxDensity: 7.99, rate: 46 },
  { class: 'Class 150', minDensity: 6, maxDensity: 6.99, rate: 48 },
  { class: 'Class 175', minDensity: 5, maxDensity: 5.99, rate: 50 },
  { class: 'Class 200', minDensity: 4, maxDensity: 4.99, rate: 52 },
  { class: 'Class 250', minDensity: 3, maxDensity: 3.99, rate: 55 },
  { class: 'Class 300', minDensity: 2, maxDensity: 2.99, rate: 58 },
  { class: 'Class 400', minDensity: 1, maxDensity: 1.99, rate: 60 },
  { class: 'Class 500', minDensity: 0, maxDensity: 0.99, rate: 65 },
]

export const FORWARD_AIR_FUEL_SURCHARGE_PERCENTAGE = 0.26
