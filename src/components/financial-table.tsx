import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { BadgeDollarSign, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import type { Schedule } from '@/api/get-schedule'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function FinancialTable({ data }: { data: Schedule[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: 'patientName',
      header: 'Paciente',
      cell: ({ row }) => (
        <div className="w-48">
          <Label>{row.getValue('patientName')}</Label>
        </div>
      ),
    },
    {
      accessorKey: 'dateHour',
      header: 'Data e hora',
      cell: ({ row }) => {
        const dateHour = row.getValue<string>('dateHour')
        const formattedDate = dateHour
          ? format(new Date(dateHour), "dd/MM/yyyy 'às' HH:mm")
          : 'Data inválida'

        return <Label>{formattedDate}</Label>
      },
    },
    {
      accessorKey: 'value',
      header: 'Valor',
      cell: ({ row }) => (
        <div className="flex gap-8">
          <Label>{row.getValue('value')}</Label>
          <Label className="text-primary">PAGO</Label>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <BadgeDollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Financeiro</h1>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Consulte seu histórico financeiro
      </p>

      <div>
        <div className="w-full">
          <div className="flex items-center justify-end pb-4">
            <div className="inline-flex gap-2 text-sm font-medium text-muted-foreground sm:text-base">
              Registros
              <span className="items-center rounded-sm bg-primary px-3 text-white">
                {table.getFilteredRowModel().rows.length}
              </span>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum resultado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <Label className="text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount() > 0 ? table.getPageCount() : 1}
            </Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
