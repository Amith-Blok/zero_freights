'use client'
import { inFormater, usFormater } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import { useMemo, useState } from 'react'

export const QuoteDataTable = ({
  data,
  containerType,
  total,
  independentFooter = false,
}: {
  data: {
    label: string
    usd: number
    inr: number
  }[]
  containerType: string
  total: number
  independentFooter?: boolean
}) => {
  const [paginationState] = useState({
    pageIndex: 0,
    pageSize: 30,
  })

  const quoteColumn: ColumnDef<{
    label: string
    usd: number
    inr: number
  }>[] = useMemo(
    () => [
      {
        id: '#',
        header: '#',
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'label',
        header: 'Items & Descriptions',
      },
      {
        accessorKey: 'usd',
        header: `${containerType} USD`,
        cell: ({ row }) => {
          return usFormater.format(row.original.usd)
        },
      },
      {
        accessorKey: 'inr',
        header: `${containerType} INR`,
        cell: ({ row }) => {
          return inFormater.format(row.original.inr)
        },
        footer: () => (
          <div className="mt-4 flex items-end justify-end gap-5 text-lg font-bold">
            <span>Total Amount:</span>
            <span>{inFormater.format(total)}</span>
          </div>
        ),
      },
    ],
    [containerType, total]
  )

  return (
    <DataTable
      columns={quoteColumn}
      data={data}
      paginationState={paginationState}
      independentFooter={independentFooter}
    />
  )
}
