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
  sort: 'cheapest' | 'fastest' | 'shortest' | 'longest'
  container: 'all' | '20STD' | '40STD' | '40HC'
  carrier: 'all' | string
  currency: 'USD' | 'INR'
  priceRange: [number, number]
  transitTime: 'all' | 'fastest' | 'standard' | 'economy'
  quickFilters: {
    cheapest: boolean
    fastest: boolean
    twentyFtOnly: boolean
    fortyFtOnly: boolean
  }
}

export interface SeaFclFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableCarriers: string[]
  priceMin: number
  priceMax: number
  offersCount: number
}

export function SeaFclFilters({
  filters,
  onFiltersChange,
  availableCarriers,
  priceMin,
  priceMax,
  offersCount,
}: SeaFclFiltersProps) {
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const resetFilters = () => {
    onFiltersChange({
      sort: 'cheapest',
      container: 'all',
      carrier: 'all',
      currency: 'USD',
      priceRange: [priceMin, priceMax],
      transitTime: 'all',
      quickFilters: {
        cheapest: false,
        fastest: false,
        twentyFtOnly: false,
        fortyFtOnly: false,
      },
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
              <SelectItem value="fastest">Fastest</SelectItem>
              <SelectItem value="shortest">Shortest</SelectItem>
              <SelectItem value="longest">Longest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Container */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Container:</Label>
          <Select
            value={filters.container}
            onValueChange={(value: FilterState['container']) =>
              updateFilters({ container: value })
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="20STD">20 STD</SelectItem>
              <SelectItem value="40STD">40 STD</SelectItem>
              <SelectItem value="40HC">40 HC</SelectItem>
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

      {/* Second Row - Transit and Quick Filters */}
      {/* <div className="flex flex-wrap items-center gap-3">


                {/* Quick Filter Label */}
      {/* <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Quick:</Label>
                </div> */}

      {/* Quick Filter Buttons */}
      {/* <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant={filters.quickFilters.cheapest ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateQuickFilters('cheapest')}
                        className='font-normal'
                    >
                        Cheapest
                    </Button>
                    <Button
                        variant={filters.quickFilters.fastest ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateQuickFilters('fastest')}
                    >
                        Fastest
                    </Button>
                    <Button
                        variant={filters.quickFilters.twentyFtOnly ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateQuickFilters('twentyFtOnly')}
                    >
                        20FT Only
                    </Button>
                    <Button
                        variant={filters.quickFilters.fortyFtOnly ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateQuickFilters('fortyFtOnly')}
                    >
                        40FT Only
                    </Button>
                </div>
            </div> */}

      {/* Active Filters Display */}
      {(filters.container !== 'all' ||
        filters.carrier !== 'all' ||
        filters.transitTime !== 'all' ||
        Object.values(filters.quickFilters).some(Boolean)) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.container !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer">
              Container: {filters.container}
            </Badge>
          )}
          {filters.carrier !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer">
              Carrier: {filters.carrier}
            </Badge>
          )}
          {filters.transitTime !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer">
              Transit: {filters.transitTime}
            </Badge>
          )}
          {Object.entries(filters.quickFilters).map(
            ([key, value]) =>
              value && (
                <Badge key={key} variant="secondary" className="cursor-pointer">
                  {key === 'twentyFtOnly'
                    ? '20FT Only'
                    : key === 'fortyFtOnly'
                      ? '40FT Only'
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                </Badge>
              )
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
