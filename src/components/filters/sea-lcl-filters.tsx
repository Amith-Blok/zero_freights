'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export interface FilterState {
  currency: 'USD' | 'INR'
}

export interface SeaLclFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  offersCount: number
}

export function SeaLclFilters({
  filters,
  onFiltersChange,
  offersCount,
}: SeaLclFiltersProps) {
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const resetFilters = () => {
    onFiltersChange({
      currency: 'USD',
    })
  }

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Currency */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Currency:</Label>
          <Select
            value={filters.currency}
            onValueChange={(value: FilterState['currency']) =>
              updateFilters({ currency: value })
            }
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Offers Count */}
        <div className="ml-auto text-sm text-gray-600">
          {offersCount} offers found
        </div>
      </div>
    </div>
  )
}
