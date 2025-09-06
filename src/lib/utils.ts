import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SelectDataType } from '@/types/global'
import { FclWeightUnitType } from '@/schema/sea-schema'
import { DContainerType } from '@/types/sea'
import { KG_TO_LBS } from '@/constants/weight'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
