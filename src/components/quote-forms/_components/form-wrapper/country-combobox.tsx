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
            (country) => country.code === value
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
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag
                        countryCode={selectedCountry.code}
                        svg
                        style={{
                          width: '24px',
                          height: '18px',
                        }}
                        className="rounded-sm"
                      />
                      <span className="truncate font-normal uppercase">
                        {selectedCountry.name}
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
                          key={country.code}
                          value={`${country.name} ${country.code}`}
                          onSelect={() => {
                            onChange(country.code === value ? '' : country.code)
                            setOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <ReactCountryFlag
                              countryCode={country.code}
                              svg
                              style={{
                                width: '24px',
                                height: '18px',
                              }}
                              className="rounded-sm"
                            />
                            <span className="font-normal uppercase">
                              {country.name}
                            </span>
                          </div>
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              value === country.code
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
      {errors[field] && (
        <span className={cn('text-sm text-red-500', errorClass)}>
          {errors[field]?.message as string}
        </span>
      )}
    </div>
  )
}
