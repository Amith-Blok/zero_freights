'use client'
/* eslint-disable no-unused-vars */
import React, { ComponentProps, useContext, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useFormContext, Controller } from 'react-hook-form'
import useFetch from '@/hooks/use-fetch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FormMetaProvider } from '@/provider'

type AutoCompleteCompProps<T> = {
  label?: string
  divClass?: ComponentProps<'div'>['className']
  labelClass?: ComponentProps<'label'>['className']
  placeHolder: string
  fieldName: string
  fetchUrl: string
  getOptionLabel: (option: T) => string
  valueSetterCallback: (value: T) => void
  resetString?: string // reset trigger
}

export const AllDataCombobox = <T,>({
  label,
  divClass,
  labelClass,
  placeHolder,
  fieldName,
  getOptionLabel,
  valueSetterCallback,
  fetchUrl,
  resetString,
}: AutoCompleteCompProps<T>) => {
  const {
    control,
    formState: { errors },
    resetField,
    getValues,
  } = useFormContext()
  const { isPrefilling } = useContext(FormMetaProvider)

  const [inputValue, setInputValue] = useState('')
  const { data: options, loading } = useFetch<T>(fetchUrl)

  useEffect(() => {
    // Edit shipment: keep the saved value on first load and show its text
    if (isPrefilling?.current) {
      const savedValue = getValues(fieldName)
      if (savedValue && typeof savedValue === 'object') {
        setInputValue(getOptionLabel(savedValue as T))
        return
      }
    }
    // Clears both the internal field value and input display
    resetField(fieldName, { defaultValue: '' })
    setInputValue('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetString, fieldName, resetField, getValues, isPrefilling])

  return (
    <div className={cn('w-full', divClass)}>
      {label && (
        <Label className={cn('mb-2 w-full', labelClass)}>{label}</Label>
      )}
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            options={options ?? []}
            getOptionLabel={getOptionLabel}
            loading={loading}
            isOptionEqualToValue={(option, value) =>
              getOptionLabel(option) === getOptionLabel(value)
            }
            value={value || null}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeHolder}
                variant="outlined"
                autoComplete="off"
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
                    borderRadius: '8px',
                    borderColor: 'lightgray',
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px',
                    fontSize: '14px',
                    height: '10px',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    fontSize: '13px',
                  },
                }}
              />
            )}
            onChange={(_, selectedOption) => {
              if (selectedOption) {
                setInputValue(getOptionLabel(selectedOption))
                onChange(selectedOption)
                valueSetterCallback(selectedOption)
              } else {
                onChange(null)
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={getOptionLabel(option)}>
                <p>{getOptionLabel(option)}</p>
              </li>
            )}
          />
        )}
      />
      {errors[fieldName] && (
        <span className="text-sm text-red-500">
          {errors[fieldName]?.message as string}
        </span>
      )}
    </div>
  )
}
