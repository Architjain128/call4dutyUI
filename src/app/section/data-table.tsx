"use client"
import * as React from "react"

import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  readonly: Boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  readonly
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [pageIndex, setPageIndex] = React.useState(1)
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

  return (
    <div>
        {!readonly?
            <div className="flex justify-between items-center py-4 gap-2">
                <div className="flex items-center py-4 gap-2">
                    <div>
                        <Label>Title</Label>
                        <Input
                            placeholder="Filter title..."
                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("title")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div>
                        <Label>Service</Label>
                        <Input
                            placeholder="Filter Service..."
                            value={(table.getColumn("service")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("service")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div>
                        <Label>Team</Label>
                        <Input
                            placeholder="Filter Team..."
                            value={(table.getColumn("team")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("team")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                </div>
                <div className="flex items-center py-4 gap-2">
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {}}
                        >
                            Resolve
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {}}
                        >
                            Acknowledge
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {}}
                        >
                            Escalate
                        </Button>
                    </div>
                </div>
            </div>:null
}

        <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
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
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
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
            </Table>

        </div>

        <div className="flex justify-center items-center">
            {!readonly?
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>:<div className="flex-1 text-sm text-muted-foreground"></div>}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        table.previousPage()
                        setPageIndex(pageIndex-1)
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                Previous
                </Button>
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {pageIndex} of {table.getPageCount()}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        table.nextPage()
                        setPageIndex(pageIndex+1)
                    }}
                    disabled={!table.getCanNextPage()}
                >
                Next
                </Button>
            </div>
        </div>
    </div>
  )
}
