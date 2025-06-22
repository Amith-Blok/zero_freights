import { inFormater, usFormater } from '@/lib/utils'
import { DataType } from '@/types/quotes'
import { ColumnDef } from '@tanstack/react-table'

export const quoteColumn: ColumnDef<DataType>[] = [
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
    footer: 'hello',
  },
]
