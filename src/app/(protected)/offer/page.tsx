import AllQuoteDataTable from '@/components/data-table/all-quote-data-table'
import { CardWrapper } from '@/components/shared/card-wrapper'
import TableSkeleton from '@/components/ui/table-skeleton'
import React, { Suspense } from 'react'

export default function OfferPage() {
  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Quotes"
        cardDescription="View and manage all your quotes"
        titleClass="text-2xl"
        cardClass="my-5 md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        <Suspense
          fallback={
            <div className="container mx-auto py-10">
              <TableSkeleton columns={3} rows={10} />
            </div>
          }
        >
          <AllQuoteDataTable />
        </Suspense>
      </CardWrapper>
    </div>
  )
}
