"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetcher } from "@/components/helpers/fetcher"
import LoadingSkeleton from "@/components/loading-sekeleton"

import CompanyForm from "./companies-form"
import { useCustomEventTrigger } from "./hooks/event-listener"
import SelectRelation from "./select-relation"
import SupplierForm from "./supplies-form"

interface DataTableProps {
  columns: any
  filterName: string
  fetch: "supplies" | "companies"
  filterBy: string
}

export function DataTable({
  columns,
  filterName,
  fetch,
  filterBy,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [shouldOpenSheet, setShouldOpenSheet] = React.useState(false)
  const [shouldOpenRelated, setShouldOpenRelated] = React.useState(false)
  const [currentDataId, setCurrentDataId] = React.useState(0)

  const { data, mutate, isLoading } = useSWR(
    `http://localhost:8080/${fetch}`,
    fetcher
  )
  const {
    data: relationData,
    mutate: relationMutate,
    isLoading: relationIsLoading,
  } = useSWR(
    `http://localhost:8080/${fetch === "supplies" ? "companies" : "supplies"}`,
    fetcher
  )

  useCustomEventTrigger("related", (event) => {
    setShouldOpenRelated(true)
    setCurrentDataId(event.id)
  })

  useCustomEventTrigger("toggleSheetRelated", () => {
    setShouldOpenRelated((prev) => !prev)
  })

  useCustomEventTrigger("toggleSheet", () => {
    setShouldOpenSheet((prev) => !prev)
  })

  useCustomEventTrigger("optimisticUiTrigger", (event) => {
    mutate([...data, event.values], {
      optimisticData: [...data, event],
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    }).catch((e) => console.error(e))
  })

  useCustomEventTrigger("delete", (event) => {
    const filterdData = data.filter((d: any) => d.id !== event.id)

    mutate(filterdData, {
      optimisticData: filterdData,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    }).catch((e) => console.error(e))
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={filterName}
          value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterBy)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => setShouldOpenSheet(true)}
        >
          Add
        </Button>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <Sheet
        open={shouldOpenSheet}
        onOpenChange={(bool) => setShouldOpenSheet(bool)}
      >
        <SheetContent position="right" size="content">
          <SheetHeader>
            <SheetTitle>
              Add {fetch === "supplies" ? "supply" : "company"}
            </SheetTitle>
            <SheetDescription>
              Add a new {fetch === "supplies" ? "supplier" : "company"} . Click
              on submit to save.
            </SheetDescription>
          </SheetHeader>
          {fetch === "supplies" ? <SupplierForm /> : <CompanyForm />}
        </SheetContent>
      </Sheet>
      <Sheet
        open={shouldOpenRelated}
        onOpenChange={(bool) => setShouldOpenRelated(bool)}
      >
        <SheetContent position="right" size="content">
          <SheetHeader>
            <SheetTitle>Add relation for the supply</SheetTitle>
            <SheetDescription>
              Add a new supplier. Click on submit to save.
            </SheetDescription>
          </SheetHeader>
          <SelectRelation
            dataId={currentDataId}
            relationData={relationData}
            isLoading={relationIsLoading}
            type={fetch}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
