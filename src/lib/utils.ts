import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SelectDataType } from '@/types/global'
import { FclWeightUnitType } from '@/schema/sea-schema'
import { DContainerType } from '@/types/sea'
import { KG_TO_LBS } from '@/constants/weight'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Quote estimate / expiry dates ---
// Dates are worked out in Indian time (IST, UTC+5:30), not the server's clock.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Formats a calendar date as e.g. "23 Nov 2026"
const formatCalendarDate = (year: number, month: number, day: number) => {
  // Date.UTC handles month overflow (e.g. December + 1 -> January next year)
  const date = new Date(Date.UTC(year, month, day))
  return `${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

/**
 * Returns the quote's estimate date and expiry date as readable text.
 *
 * Expiry rule (based on the day the quote was created, in IST):
 * - All months except February:
 *   1st-12th  -> 15th of the same month
 *   13th-27th -> 30th of the same month
 *   28th-end  -> 15th of the next month
 * - February:
 *   1st-12th  -> 15th February
 *   13th-25th -> last day of February (28th, or 29th in a leap year)
 *   26th-end  -> 15th March
 */
export const getQuoteDates = (
  createdAt?: Date | null
): { estimateDate: string; expiryDate: string } => {
  if (!createdAt) return { estimateDate: '', expiryDate: '' }

  const istDate = new Date(createdAt.getTime() + IST_OFFSET_MS)
  const year = istDate.getUTCFullYear()
  const month = istDate.getUTCMonth() // 0 = January, 1 = February
  const day = istDate.getUTCDate()

  const isFebruary = month === 1
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const midPeriodEnd = isFebruary ? 25 : 27
  const midPeriodExpiryDay = isFebruary ? lastDayOfMonth : 30

  let expiryDate: string
  if (day <= 12) {
    expiryDate = formatCalendarDate(year, month, 15)
  } else if (day <= midPeriodEnd) {
    expiryDate = formatCalendarDate(year, month, midPeriodExpiryDay)
  } else {
    expiryDate = formatCalendarDate(year, month + 1, 15)
  }

  return { estimateDate: formatCalendarDate(year, month, day), expiryDate }
}

export const arrayToSelectData = (data: string[]): SelectDataType => {
  return data.map((x) => {
    return {
      label: x.toUpperCase(),
      value: x,
    }
  })
}

export function addParamsToRelativeUrl(
  relativeUrl: string,
  params: Object,
  baseUrl = 'http://localhost'
) {
  // Combine the base URL and relative URL
  const urlObj = new URL(relativeUrl, baseUrl)

  // Loop through each key-value pair in the Gparams` object
  for (const [key, value] of Object.entries(params)) {
    // Set or update the query parameter
    urlObj.searchParams.set(key, value)
  }

  // Return the updated relative URL
  return urlObj.pathname + urlObj.search
}

export const fclContainerToDContainer = (
  fclContainer: string
): DContainerType => {
  const FclToDContainerMap: Record<string, DContainerType> = {
    '20DV': 'D2',
    '40DV': 'D4',
    '40HC': 'D5',
  }
  return FclToDContainerMap[fclContainer]
}

export const weightTOMetricTon = ({
  weight,
  unit,
}: {
  weight: number
  unit: FclWeightUnitType
}): number => {
  return unit == 'KG' ? weight / 1000 : weight / 2204.62
}
export const meterToMile = (distance: number): number => {
  return distance / 1609.34
}

export const meterToKilometer = (distance: number): number => {
  return distance / 1000
}
export const lbsToKg = (lbs: number) => {
  return lbs * 0.45359237
}
export const usFormater = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
export const inFormater = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPhoneNumber(raw: string): string {
  if (!raw.startsWith('+')) return raw

  const cleaned = raw.replace(/\D/g, '') // Only digits
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    // India: +91 XXXXXXXXXX => +91 XXXXX YYYYY
    const cc = '+91'
    const number = cleaned.slice(2)
    return `${cc} ${number.slice(0, 5)} ${number.slice(5)}`
  }

  if (cleaned.startsWith('1') && cleaned.length === 11) {
    // India: +91 XXXXXXXXXX => +91 XXXXX YYYYY
    // USA/Canada: +1 XXXXXXXXXX => +1 (XXX) XXX-XXXX
    const cc = '+1'
    const number = cleaned.slice(1)
    return `${cc} (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`
  }

  // India: +91 XXXXXXXXXX => +91 XXXXX YYYYY
  // Fallback: just group every 3 digits
  const ccMatch = cleaned.match(/^(\d{1,3})/)
  const cc = ccMatch ? '+' + ccMatch[1] : '+'
  const rest = cleaned.slice(cc.length - 1)
  const grouped = rest.match(/.{1,3}/g) || []

  return `${cc} ${grouped.join(' ')}`
}
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function calculateCWT({
  value,
  unit,
}: {
  value: number
  unit: FclWeightUnitType
}): number {
  return unit === 'KG' ? (value * KG_TO_LBS) / 100 : value / 100
}
