/* eslint-disable no-unused-vars */
'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
  independentFooter?: boolean // New prop to control footer behavior
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
  setFilter,
  rowSelection,
  setRowSelection,
  isRowSelection = false,
  rowId,
  independentFooter = false,
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
    // Removed getPaginationRowModel() - pagination is  server-side
    state: {
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
        {/* Column-dependent footer (original behavior) */}
        {!independentFooter && (
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
        )}
      </Table>

      {/* Independent footer (new behavior) */}
      {independentFooter && (
        <div className="mt-0 w-full">
          {table.getFooterGroups().map((footerGroup) => {
            // Find the footer content from columns that have footer defined
            const footerContent = footerGroup.headers
              .map((footer, index) => {
                if (!footer.isPlaceholder && footer.column.columnDef.footer) {
                  return (
                    <div key={footer.id || index}>
                      {flexRender(
                        footer.column.columnDef.footer,
                        footer.getContext()
                      )}
                    </div>
                  )
                }
                return null
              })
              .filter(Boolean)

            return footerContent.length > 0 ? (
              <div key={footerGroup.id} className="w-full">
                {footerContent}
              </div>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

export default DataTable
