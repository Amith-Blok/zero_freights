import { Plane, Ship, Truck, WarehouseIcon } from 'lucide-react'

export const ALL_SERVICES = [
  {
    key: 'sea',
    title: 'Sea Freight',
    description:
      'FCL and LCL ocean freight solutions across major trade lanes.',
    icon: Ship,
    href: '/get-rates?mode=SEA',
    subServices: [
      { label: 'FCL', href: '/get-rates?mode=SEA' },
      { label: 'LCL', href: '/get-rates?mode=SEA' },
    ],
  },
  {
    key: 'air',
    title: 'Air Freight',
    description: 'Airport-to-airport and door options for urgent cargo.',
    icon: Plane,
    href: '/get-rates?mode=AIR',
    subServices: [{ label: 'Air Freight', href: '/get-rates?mode=AIR' }],
  },
  {
    key: 'land',
    title: 'Land Transportation',
    description:
      'Comprehensive trucking: seaport/ICD haulage, domestic door-to-door, and airport legs.',
    icon: Truck,
    href: '/get-rates?mode=LAND',
    subServices: [
      { label: 'Seaport Trucking', href: '/get-rates?mode=LAND' },
      { label: 'Domestic Trucking', href: '/get-rates?mode=LAND' },
      { label: 'Airport Trucking', href: '/get-rates?mode=LAND' },
    ],
  },
  {
    key: 'warehouse',
    title: 'Warehouse',
    description:
      'FCL, LTL, and airport handling with clear, predictable costing.',
    icon: WarehouseIcon,
    href: '/get-rates?mode=WAR',
    subServices: [
      { label: 'FCL Warehouse', href: '/get-rates?mode=WAR' },
      { label: 'LTL Warehouse', href: '/get-rates?mode=WAR' },
      { label: 'Airport Warehouse Costing', href: '/get-rates?mode=WAR' },
    ],
  },
]
