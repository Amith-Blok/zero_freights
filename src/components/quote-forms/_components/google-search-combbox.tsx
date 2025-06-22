/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
'use client'

import React, { useState, ComponentProps } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import {
  getGoogleLocationByPlaceId,
  googleAutoByInput,
} from '@/actions/google-place'
import { useFormContext, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AutoCompleteOption {
  description: string
  matched_substrings: string[]
  place_id: string
  reference: string
  structured_formatting: object
  terms: string[]
  types: string[]
}

type GoogleSearchProps = {
  label: string
  labelClass?: ComponentProps<'label'>['className']
  divClass?: ComponentProps<'div'>['className']
  fieldName: string
  watchCountry: string
  resetString?: string
  getOptionLabel: (option: AutoCompleteOption) => string
}

export const GoogleSearch = ({
  label,
  labelClass,
  divClass,
  fieldName,
  watchCountry,
  // resetString,
  // getOptionLabel,
}: GoogleSearchProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const [options, setOptions] = useState<AutoCompleteOption[]>([])
  const [inputValue, setInputValue] = useState('')
  const handleSelect = async (address: string, id: string) => {
    if (address && id) {
      const location = await getGoogleLocationByPlaceId(id)
      if (location) {
        const { lat, lng } = location
        setValue(fieldName, {
          address: address,
          lat: lat,
          lng: lng,
          type: 'address',
        })
      } else {
        setValue(fieldName, {
          address: '',
          lat: null,
          lng: null,
          type: '',
        })
      }
    } else {
      setValue(fieldName, {
        address: '',
        lat: null,
        lng: null,
        type: '',
      })
    }
  }

  const handleInputChange = (input: string) => {
    if (input) {
      setInputValue(input)
      // console.log({ input });
      googleAutoByInput(input, watchCountry).then((value) => {
        if (value) {
          // console.log({ value });
          setOptions(value)
        }
      })
    }
  }

  return (
    <div className={cn('w-full', divClass)}>
      <Label className={cn('required mb-2 w-full', labelClass)}>{label}</Label>
      <Controller
        name={fieldName}
        control={control}
        defaultValue={undefined}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            options={inputValue ? options : []}
            autoComplete={false}
            getOptionLabel={(option) => `${option.description}`}
            disabled={!watchCountry}
            isOptionEqualToValue={(option, value) =>
              option.description === value?.description
            }
            value={value || null}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) =>
              handleInputChange(newInputValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter Address or Zipcode"
                autoComplete="new-password"
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: false,
                  style: { transform: 'translate(14px, 12px) scale(1)' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      boxShadow: '0 0 0 2px black',
                      borderColor: 'transparent',
                    },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    borderColor: 'lightgray',
                  },
                  '& .MuiInputBase-input': {
                    padding: '4px',
                    fontSize: '14px',
                    height: '10px',
                  },
                }}
              />
            )}
            onChange={(_, selectedOption) => {
              if (selectedOption) {
                const { description, place_id } = selectedOption
                setInputValue(description)
                handleSelect(description, place_id)
                onChange({
                  address: description,
                  lat: null,
                  lng: null,
                  type: 'address',
                })
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.description}>
                <p>{option.description}</p>
              </li>
            )}
          />
        )}
      />
      {errors[fieldName] && (
        <span className="text-sm text-red-500">
          {errors[fieldName].message as string}
        </span>
      )}
    </div>
  )
}
