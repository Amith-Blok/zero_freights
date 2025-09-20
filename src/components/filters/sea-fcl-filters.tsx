'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export interface FilterState {
  sort: 'cheapest' | 'highest' | 'shortest' | 'longest'
  carrier: 'all' | string
  currency: 'USD' | 'INR'
}

export interface SeaFclFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableCarriers: string[]
  offersCount: number
}

export function SeaFclFilters({
  filters,
  onFiltersChange,
  availableCarriers,
  offersCount,
}: SeaFclFiltersProps) {
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const resetFilters = () => {
    onFiltersChange({
      sort: 'cheapest',
      carrier: 'all',
      currency: 'USD',
    })
  }

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Sort:</Label>
          <Select
            value={filters.sort}
            onValueChange={(value: FilterState['sort']) =>
              updateFilters({ sort: value })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cheapest">Cheapest</SelectItem>
              <SelectItem value="highest">High cost</SelectItem>
              <SelectItem value="shortest">Shortest</SelectItem>
              <SelectItem value="longest">Longest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Carrier */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Carrier:</Label>
          <Select
            value={filters.carrier}
            onValueChange={(value) => updateFilters({ carrier: value })}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {availableCarriers.map((carrier) => (
                <SelectItem key={carrier} value={carrier}>
                  {carrier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

      {/* Active Filters Display */}
      {filters.carrier !== 'all' && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.carrier !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer">
              Carrier: {filters.carrier}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
