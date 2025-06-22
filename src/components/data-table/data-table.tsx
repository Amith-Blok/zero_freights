/* eslint-disable no-unused-vars */
'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  Column,
  RowSelectionState,
  PaginationState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CSSProperties, Dispatch, SetStateAction } from 'react'
import { TableFooter } from '@mui/material'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  paginationState: PaginationState
  rowId?: string | undefined
  filter?: string
  setFilter?: (f: string) => void
  isRowSelection?: boolean
  rowSelection?: RowSelectionState
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>
}

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : '',
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : '',
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter,
  paginationState,
  setFilter,
  rowSelection,
  setRowSelection,
  isRowSelection = false,
  rowId,
}: DataTableProps<TData, TValue>) {
  const columnPinningState: any = {
    left: columns
      .filter((col: any) => col.meta?.pin === 'left')
      .map((col: any) => col.accessorKey as string),
    right: [],
  }

  const table = useReactTable({
    data,
    columns,
    getRowId: (originalRow, idx) =>
      rowId ? (originalRow as Record<string, any>)[rowId] : idx.toString(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: paginationState,
      globalFilter: filter,
      columnPinning: columnPinningState,
      rowSelection,
    },
    onGlobalFilterChange: setFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: isRowSelection,
  })

  return (
    <div className="mb-2 max-w-full overflow-x-auto rounded-md border">
      <Table
        className={`border-separate border-spacing-0`}
        style={{
          width: table.getTotalSize(),
          minWidth: '100%',
        }}
      >
        <TableHeader className="border-x-none border-[1px] border-zinc-200 bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const column = header.column

                return (
                  <TableHead
                    key={header.id}
                    style={{ ...getCommonPinningStyles(column) }}
                    className={`border-b border-zinc-200 bg-muted p-2 text-left`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const column = cell.column
                  const _isPinned = cell.column.getIsPinned()
                  return (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles(column),
                      }}
                      className={`border-[1px] border-zinc-200 bg-white p-3 text-sm`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((footer) => (
                <TableCell key={footer.id}>
                  {footer.isPlaceholder
                    ? null
                    : flexRender(
                        footer.column.columnDef.footer,
                        footer.getContext()
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
    </div>
  )
}

export default DataTable
