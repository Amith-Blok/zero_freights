'use client'

import { useMemo } from 'react'
import OffsetPaginatedDataTable from './offset-paginated-data-table'
import { generateColumnDef } from './generate-col-def'
import { MetaType } from '@/types/data-table'
import { Location, ServiceType } from '@/models/offer/shared-types'
import IconLink from './_component/icon-link'

interface Quote {
  _id: string
  blok_id: string
  locations: Location[]
  service_type: ServiceType
  tags: string[]
  createdAt: string
}
export default function AllQuoteDataTable() {
  const AllQuoteColumns = useMemo(() => {
    const columns = generateColumnDef<Quote>(META_TYPE)
    columns.unshift({
      id: 'id',
      header: 'Id',
      cell: ({ row }) => {
        return (
          <IconLink
            label={row.original.blok_id}
            href={`/offer/${row.original._id}`}
          />
        )
      },
    })
    columns.splice(1, 0, {
      id: 'service_type',
      header: 'Service Type',
      cell: ({ row }) => {
        return <p>{row.original.service_type}</p>
      },
    })
    columns.splice(2, 0, {
      id: 'locations',
      header: 'Location',
      cell: ({ row }) => {
        const locations = row.original.locations
        return (
          <p>
            {locations[0].name} - {locations[locations.length - 1].name}
          </p>
        )
      },
    })

    return columns
  }, [])

  return (
    <div className="container mx-auto py-10">
      <OffsetPaginatedDataTable
        columns={AllQuoteColumns}
        apiEndpoint="/api/offer/pagination"
        defaultPageSize={10}
      />
    </div>
  )
}

const META_TYPE: MetaType[] = [
  {
    key: 'tags',
    header: 'tags',
    type: 'list',
  },
  {
    key: 'created_at',
    header: 'Created At',
    type: 'date',
  },
]
