/* eslint-disable no-unused-vars */
import React, { useContext, useState, ChangeEvent, ComponentProps } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useFormContext, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { addParamsToRelativeUrl, cn } from '@/lib/utils'
import { FormMetaProvider } from '@/provider'

type FilteredComboboxProps<T> = {
  label: string
  placeHolder: string
  fieldName: string
  fetchUrl: string
  showError?: boolean
  labelClass?: ComponentProps<'label'>['className']
  divClass?: ComponentProps<'div'>['className']
  getOptionLabel: (option: T) => string
  valueSetterCallback: (value: T) => void
}

export const FilteredCombobox = <T,>({
  label,
  placeHolder,
  labelClass,
  divClass,
  fieldName,
  showError = true,
  getOptionLabel,
  fetchUrl,
  valueSetterCallback,
}: FilteredComboboxProps<T>) => {
  const {
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useFormContext()
  const { isPrefilling } = useContext(FormMetaProvider)

  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState(() => {
    // Edit shipment: show the saved value's text on first load
    if (!isPrefilling?.current) return ''
    const savedValue = getValues(fieldName)
    return savedValue && typeof savedValue === 'object'
      ? getOptionLabel(savedValue as T)
      : ''
  })

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const query = event.target.value
    setInputValue(query)
    const url = addParamsToRelativeUrl(fetchUrl, { query })
    // console.log({ url });
    const response = await fetch(url)
    const result = await response.json()

    if (result.items) {
      const items = result.items as T[]
      setOptions(items)
    }

    setLoading(false)
  }

  return (
    <div className={cn('w-full', divClass)}>
      <Label className={cn('required mb-2 w-full', labelClass)}>{label}</Label>
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            options={inputValue ? options : []}
            getOptionLabel={getOptionLabel}
            loading={loading}
            isOptionEqualToValue={(option, value) =>
              getOptionLabel(option) === getOptionLabel(value)
            }
            value={value || null}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeHolder}
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                inputProps={{ ...params.inputProps, autoComplete: 'none' }}
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
                  '& .MuiInputBase-input::placeholder': {
                    fontSize: '13px',
                  },
                }}
              />
            )}
            onChange={(_, selectedOption) => {
              if (selectedOption) {
                setInputValue(getOptionLabel(selectedOption))
                onChange(selectedOption) // Update the form field value
                valueSetterCallback(selectedOption)
              } else {
                onChange('')
              }

              trigger(fieldName)
            }}
            renderOption={(props, option) => (
              <li {...props} key={getOptionLabel(option)}>
                <p>{getOptionLabel(option)}</p>
              </li>
            )}
          />
        )}
      />
      {errors[fieldName] && showError && (
        <span className="text-sm text-red-500">
          {errors[fieldName].message as string}
        </span>
      )}
    </div>
  )
}
