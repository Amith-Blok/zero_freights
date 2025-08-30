'use client'
import { inFormater, usFormater } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMemo, useState } from 'react'

type DataType = {
  label: string
  d2: number
  d4: number
  d5: number
  total: number
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
            <div className="font-medium">{usFormater.format(item.d2)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">INR</div>
            <div className="font-medium">{inFormater.format(item.d2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export const OfferSeaFclDataTable = ({
  data,
  containerLabels,
  grandTotal,
  currency = 'INR',
  independentFooter = true,
}: {
  data: DataType[]
  grandTotal: number
  containerLabels: {
    d2?: string | null
    d4?: string | null
    d5?: string | null
  }
  currency: 'INR' | 'USD'
  independentFooter?: boolean
}) => {
  const [paginationState] = useState({
    pageIndex: 0,
    pageSize: 30,
  })

  const quoteColumn: ColumnDef<DataType>[] = useMemo(() => {
    const curencyFormater = currency === 'INR' ? inFormater : usFormater
    let columns: ColumnDef<DataType>[] = [
      {
        id: '#',
        header: '#',
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'label',
        header: 'Items & Descriptions',
      },
    ]

    if (containerLabels?.d2) {
      columns.push({
        accessorKey: 'd2',
        header: `${containerLabels.d2}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.d2)}
            </p>
          )
        },
      })
    }

    if (containerLabels?.d4) {
      columns.push({
        accessorKey: 'd4',
        header: `${containerLabels.d4}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.d4)}
            </p>
          )
        },
      })
    }

    if (containerLabels?.d5) {
      columns.push({
        accessorKey: 'd5',
        header: `${containerLabels.d5}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.d5)}
            </p>
          )
        },
      })
    }

    columns.push({
      accessorKey: 'total',
      header: 'TOTAL',
      cell: ({ row }) => {
        return (
          <p className="text-left font-semibold text-zinc-700">
            {curencyFormater.format(row.original.total)}
          </p>
        )
      },
      footer: () => {
        return (
          <div className="mt-6 w-full pt-4">
            <div className="flex items-baseline justify-end gap-4 px-4 py-2">
              <span className="text-lg font-semibold text-gray-700">
                Grand Total
              </span>
              <span className="text-2xl font-bold tracking-tight text-green-700">
                {curencyFormater.format(grandTotal)}
              </span>
            </div>
          </div>
        )
      },
    })

    return columns
  }, [currency, containerLabels, grandTotal])
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
          independentFooter={independentFooter}
        />
      </div>
    </div>
  )
}
