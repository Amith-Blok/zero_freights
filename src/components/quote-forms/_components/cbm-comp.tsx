/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

type CbmComponentProps = {
  fieldArrayName: string
  cbmField: string
  widthField: string
  heightField: string
  lengthField: string
  quantityField: string
  weightField: string
  volumeUnitField: string
  weightUnitField: string
}

export const CbmComponent = ({
  fieldArrayName,
  cbmField,
  widthField,
  heightField,
  lengthField,
  quantityField,
  weightField,
  volumeUnitField,
  weightUnitField,
}: CbmComponentProps) => {
  const { control, setValue } = useFormContext()
  const formValues =
    useWatch({
      name: fieldArrayName,
      control,
    }) || []

  const [totals, setTotals] = useState({ cbm: 0, ton: 0, kg: 0 })

  useEffect(() => {
    if (formValues.length === 0) return

    let totalVolume = 0
    let totalWeight = 0

    formValues.forEach((current: any) => {
      const width = current[widthField] || 1
      const height = current[heightField] || 1
      const length = current[lengthField] || 1
      const quantity = current[quantityField] || 0
      const weight = current[weightField] || 0

      totalVolume += width * height * length * quantity
      totalWeight += weight * quantity
    })

    const volumeUnit = formValues[0]?.[volumeUnitField]
    const weightUnit = formValues[0]?.[weightUnitField]

    const cbm =
      volumeUnit === 'CM' ? totalVolume / 1000000 : totalVolume / 61024
    const ton =
      weightUnit === 'KG' ? totalWeight / 1000 : totalWeight / 2204.62262
    const kg = weightUnit === 'KG' ? totalWeight : totalWeight * 2204.62262

    setTotals({ cbm, ton, kg })

    setValue(cbmField, {
      kg: kg ?? 0,
      cbm: cbm ?? 0,
      ton: ton ?? 0,
    })
  }, [
    formValues,
    widthField,
    heightField,
    lengthField,
    quantityField,
    weightField,
    volumeUnitField,
    weightUnitField,
    cbmField,
    setValue,
  ])

  return (
    <div>
      <p>
        Total cbm & ton: {totals.cbm.toFixed(2)} m<sup>3</sup> &nbsp;&&nbsp;
        {totals.ton.toFixed(2)} ton
      </p>
    </div>
  )
}
