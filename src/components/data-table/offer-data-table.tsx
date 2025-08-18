'use client'
import { inFormater, usFormater } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMemo, useState } from 'react'

type DataType = {
  label: string
  usd: number
  inr: number
}
// Mobile Card Component for individual rows
const MobileDataCard = ({ item, index }: { item: DataType; index: number }) => {
  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle className="text-lg">
          {index + 1}. {item.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">USD</div>
            <div className="font-medium">{usFormater.format(item.usd)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">INR</div>
            <div className="font-medium">{inFormater.format(item.inr)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export const OfferDataTable = ({
  data,
  containerType,
  total,
  currency = 'INR',
}: {
  data: DataType[]
  containerType: string
  total: number
  currency?: 'INR' | 'USD'
}) => {
  const [paginationState] = useState({
    pageIndex: 0,
    pageSize: 30,
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
          <div className="mt-6 border-t-2 border-gray-300 bg-gray-50/50 pt-4">
            <div className="flex items-baseline justify-end gap-4 px-4 py-2">
              <span className="text-lg font-semibold text-gray-700">
                Total Amount
              </span>
              <span className="text-2xl font-bold tracking-tight text-green-700">
                {currency === 'INR'
                  ? inFormater.format(total)
                  : usFormater.format(total)}
              </span>
            </div>
          </div>
        ),
      },
    ],
    [containerType, total, currency]
  )

  return (
    <div className="w-full">
      {/* Mobile View - Cards */}
      <div className="block md:hidden">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pricing Details
          </h3>
          <p className="text-sm text-gray-600">Breakdown by container type</p>
        </div>
        {data.map((item, index) => (
          <MobileDataCard key={index} item={item} index={index} />
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <DataTable
          columns={quoteColumn}
          data={data}
          paginationState={paginationState}
        />
      </div>
    </div>
  )
}
