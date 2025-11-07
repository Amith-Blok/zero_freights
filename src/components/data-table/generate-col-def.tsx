'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import PopoverDataTableComp from './_component/popover-data-table-comp'
import JsonDataTableComp from './_component/json-data-table-comp'
import { MetaType } from '@/types/data-table'
import { ListDataTableComp } from './_component/list-data-table-comp'

export function generateColumnDef<T>(meta: MetaType[]): ColumnDef<T>[] {
  let column: ColumnDef<T>[] = []

  meta.forEach((m, idx) => {
    column.push({
      id: `${m.key}_${idx}`,
      accessorKey: m.key,
      // this  handle nested complex datas
      accessorFn: (row) => {
        const paths = m.key.split('.')
        let value = row as Record<string, any>
        for (const path of paths) {
          value = value?.[path]
        }
        return value
      },
      header: m.header,
      size: m.size ? m.size : 280,
      meta: m.meta
        ? { ...m.meta, headerText: m.header }
        : { headerText: m.header },
      cell: ({ getValue }) => {
        const rowData = getValue() ?? ''

        switch (m.type) {
          case 'string': {
            return (
              <PopoverDataTableComp
                content={rowData as string}
                shortContentLength={25}
                size={m.size ? m.size : 200}
              />
            )
          }

          case 'number': {
            return (
              <p style={{ width: m.size ? `${m.size}px` : 'auto' }}>
                {rowData !== null ? rowData.toString() : 'N/A'}
              </p>
            )
          }

          case 'boolean': {
            return (
              <Input type="checkbox" checked={rowData as boolean} readOnly />
            )
          }

          case 'date': {
            const date = rowData
              ? new Date(rowData as string).toLocaleString().toUpperCase()
              : '-'
            return (
              <p style={{ width: m.size ? `${m.size}px` : 'auto' }}>{date}</p>
            )
          }
          case 'json': {
            return <JsonDataTableComp fields={rowData} productLabel="View" />
          }
          case 'list': {
            return <ListDataTableComp options={rowData as string[]} />
          }

          default: {
            return (
              <p style={{ width: m.size ? `${m.size}px` : 'auto' }}>
                {rowData as string}
              </p>
            )
          }
        }
      },
    })
  })

  return column
}
