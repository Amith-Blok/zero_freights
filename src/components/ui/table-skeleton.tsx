import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TableSkeletonProps {
  columns?: number
  rows?: number
  showPagination?: boolean
}

export function TableSkeleton({
  columns = 3,
  rows = 10,
  showPagination = true,
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="mb-2 max-w-full overflow-x-auto rounded-md border">
        <Table className="border-separate border-spacing-0">
          <TableHeader className="border-x-none border-[1px] border-zinc-200 bg-muted">
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead
                  key={i}
                  className="border-b border-zinc-200 bg-muted p-2"
                >
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="border-[1px] border-zinc-200 bg-white p-3"
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-[70px]" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      )}
    </div>
  )
}

export default TableSkeleton
