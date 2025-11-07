'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table'
import { DataTable } from './data-table'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableSkeleton } from '@/components/ui/table-skeleton'

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ApiPaginationResponse {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface OffsetPaginatedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  apiEndpoint: string
  defaultPageSize?: number
  rowId?: string
  filter?: string
  setFilter?: (f: string) => void
  isRowSelection?: boolean
  rowSelection?: RowSelectionState
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>
  independentFooter?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
}

export function OffsetPaginatedDataTable<TData, TValue>({
  columns,
  apiEndpoint,
  defaultPageSize = 10,
  rowId,
  filter,
  setFilter,
  isRowSelection = false,
  rowSelection,
  setRowSelection,
  independentFooter = false,
  sortBy = 'created_at',
  sortOrder = 'desc',
  onSortChange: _onSortChange,
}: OffsetPaginatedDataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: (paginationState.pageIndex + 1).toString(),
        limit: paginationState.pageSize.toString(),
        sortBy: sortBy,
        sortOrder: sortOrder,
      })

      const response = await fetch(`${apiEndpoint}?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      console.log('_________Result_________')
      console.log(JSON.stringify(result, null, 2))

      setData(result.data || [])

      // Map API pagination response to component pagination info
      const apiPagination: ApiPaginationResponse = result.pagination || {
        total: 0,
        page: 1,
        limit: defaultPageSize,
        totalPages: 1,
      }

      setPaginationInfo({
        currentPage: apiPagination.page,
        totalPages: apiPagination.totalPages,
        totalItems: apiPagination.total,
        hasNextPage: apiPagination.page < apiPagination.totalPages,
        hasPrevPage: apiPagination.page > 1,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [
    apiEndpoint,
    paginationState.pageIndex,
    paginationState.pageSize,
    sortBy,
    sortOrder,
    defaultPageSize,
  ])

  // Fetch data when pagination or sorting changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePageChange = (newPage: number) => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: newPage,
    }))
  }

  const handlePageSizeChange = (newSize: number) => {
    setPaginationState({
      pageIndex: 0,
      pageSize: newSize,
    })
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton
          columns={columns.length}
          rows={paginationState.pageSize}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          paginationState={paginationState}
          rowId={rowId}
          filter={filter}
          setFilter={setFilter}
          isRowSelection={isRowSelection}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          independentFooter={independentFooter}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={paginationState.pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages} (
            {paginationInfo.totalItems} total)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(0)}
            disabled={!paginationInfo.hasPrevPage || loading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(paginationState.pageIndex - 1)}
            disabled={!paginationInfo.hasPrevPage || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(paginationState.pageIndex + 1)}
            disabled={!paginationInfo.hasNextPage || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(paginationInfo.totalPages - 1)}
            disabled={!paginationInfo.hasNextPage || loading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OffsetPaginatedDataTable
