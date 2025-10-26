'use client'
import { inFormater, usFormater } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMemo, useState } from 'react'

type DataType = {
  label: string
  ot2: number
  ot4: number
  fr2: number
  fr4: number
  fr5: number
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
            <div className="font-medium">{usFormater.format(item.ot2)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">INR</div>
            <div className="font-medium">{inFormater.format(item.ot2)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">USD</div>
            <div className="font-medium">{usFormater.format(item.fr2)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">INR</div>
            <div className="font-medium">{inFormater.format(item.fr2)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">USD</div>
            <div className="font-medium">{usFormater.format(item.fr4)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">INR</div>
            <div className="font-medium">{inFormater.format(item.fr4)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">USD</div>
            <div className="font-medium">{usFormater.format(item.fr5)}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-sm text-gray-500">INR</div>
            <div className="font-medium">{inFormater.format(item.fr5)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export const OfferSeaGaugeDataTable = ({
  data,
  containerLabels,
  grandTotal,
  currency = 'INR',
  independentFooter = true,
}: {
  data: DataType[]
  grandTotal: number
  containerLabels: {
    ot2?: string | null
    ot4?: string | null
    fr2?: string | null
    fr4?: string | null
    fr5?: string | null
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
        size: 40,
        cell: ({ row }) => {
          return (
            <p className="w-fit text-left text-zinc-700">
              {row.original.label}
            </p>
          )
        },
      },
    ]

    if (containerLabels?.ot2) {
      columns.push({
        id: 'ot2',
        accessorKey: 'ot2',
        header: `${containerLabels.ot2}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.ot2)}
            </p>
          )
        },
      })
    }

    if (containerLabels?.ot4) {
      columns.push({
        id: 'ot4',
        accessorKey: 'ot4',
        header: `${containerLabels.ot4}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.ot4)}
            </p>
          )
        },
      })
    }

    if (containerLabels?.fr2) {
      columns.push({
        id: 'fr2',
        accessorKey: 'fr2',
        header: `${containerLabels.fr2}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.fr2)}
            </p>
          )
        },
      })
    }

    if (containerLabels?.fr4) {
      columns.push({
        id: 'fr4',
        accessorKey: 'fr4',
        header: `${containerLabels.fr4}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.fr4)}
            </p>
          )
        },
      })
    }

    if (containerLabels?.fr5) {
      columns.push({
        id: 'fr5',
        accessorKey: 'fr5',
        header: `${containerLabels.fr5}`,
        cell: ({ row }) => {
          return (
            <p className="text-left text-zinc-700">
              {curencyFormater.format(row.original.fr5)}
            </p>
          )
        },
      })
    }

    columns.push({
      id: 'total',
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
