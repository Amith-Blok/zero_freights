'use client'
import { DataType } from '@/types/quotes'
import { inFormater, usFormater } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import { useMemo, useState } from 'react'

export const QuoteDataTable = ({
  data,
  totalAmount,
  subTotal,
  gstFive,
  gstFifteen,
}: {
  data: DataType[]
  totalAmount: number
  subTotal: number
  gstFive: number
  gstFifteen: number
}) => {
  const [paginationState] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  const quoteColumn: ColumnDef<DataType>[] = useMemo(
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
        accessorKey: 'cost_usd',
        header: 'Rate(USD)',
        cell: ({ row }) => usFormater.format(row.original.cost_usd),
      },
      {
        accessorKey: 'cost_inr',
        header: 'Rate(INR)',
        cell: ({ row }) => inFormater.format(row.original.cost_inr),
      },
      {
        accessorKey: 'gst_percentage',
        header: '%',
      },
      {
        accessorKey: 'gst_amount',
        header: 'Amount',
        cell: ({ row }) => inFormater.format(row.original.gst_amount),
      },
      {
        accessorKey: 'total_amount',
        header: 'Total Amount',
        cell: ({ row }) => inFormater.format(row.original.total_amount),
        footer: () => (
          <div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">Subtotal:</span>
              <span>{inFormater.format(subTotal)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">GST (5%):</span>
              <span>{inFormater.format(gstFive)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">GST (15%):</span>
              <span>{inFormater.format(gstFifteen)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>{inFormater.format(totalAmount)}</span>
            </div>
          </div>
        ),
      },
    ],
    [totalAmount, subTotal, gstFifteen, gstFive]
  )

  return (
    <DataTable
      columns={quoteColumn}
      data={data}
      paginationState={paginationState}
    />
  )
}
