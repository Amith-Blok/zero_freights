'use client'
import { Check, ChevronsUpDown } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ComponentPropsWithoutRef } from 'react'
import { Country } from '@/types/common'

type CountryComboboxProps = {
  field: string
  label?: string
  showError?: boolean
  countries: Country[]
  placeholder?: string
  className?: string
  divClass?: string
  labelClass?: string
  errorClass?: string
  defaultValue?: string
} & ComponentPropsWithoutRef<'div'>

export function CountryCombobox({
  field,
  label,
  showError = true,
  countries,
  placeholder = 'Select country...',
  className,
  divClass,
  labelClass,
  errorClass,
  defaultValue,
  ...divProps
}: CountryComboboxProps) {
  const [open, setOpen] = useState(false)
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className={cn('w-full', divClass)} {...divProps}>
      {label && (
        <Label className={cn('required mb-2', labelClass)}>{label}</Label>
      )}
      <Controller
        name={field}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => {
          const selectedCountry = countries.find(
            (country) => country.value === value
          )

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn('w-full justify-between', className)}
                >
                  {selectedCountry ? (
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <ReactCountryFlag
                        countryCode={selectedCountry.value}
                        svg
                        style={{
                          width: '24px',
                          height: '18px',
                        }}
                        className="flex-shrink-0 rounded-sm"
                      />
                      <span className="min-w-0 truncate font-normal uppercase">
                        {selectedCountry.label}
                      </span>
                    </div>
                  ) : (
                    placeholder
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={`${country.label} ${country.value}`}
                          onSelect={() => {
                            onChange(
                              country.value === value ? '' : country.value
                            )
                            setOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <ReactCountryFlag
                              countryCode={country.value}
                              svg
                              style={{
                                width: '24px',
                                height: '18px',
                              }}
                              className="rounded-sm"
                            />
                            <span className="font-normal uppercase">
                              {country.label}
                            </span>
                          </div>
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              value === country.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )
        }}
      />
      {errors[field] && showError && (
        <span className={cn('text-sm text-red-500', errorClass)}>
          {errors[field]?.message as string}
        </span>
      )}
    </div>
  )
}
