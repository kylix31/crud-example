"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { funcCreateCustomEvent } from "@/components/helpers/function-custom-events"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Supply = {
  id: string
  email: string
  name: string
  supplierCode: number
  postalCode: string
}

export function suppliesColumns(
  id?: string,
  type?: string,
  related?: string
): ColumnDef<Supply>[] {
  const isRelatedSection = Boolean(id && type && related)

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      // header: () => <div className="text-right">PhantasyName</div>,
      // cell: ({ row }) => {
      //   const amount = parseFloat(row.getValue("amount"))
      //   const formatted = new Intl.NumberFormat("en-US", {
      //     style: "currency",
      //     currency: "USD",
      //   }).format(amount)
      //
      //   return <div className="text-right font-medium">{formatted}</div>
      // },
    },
    {
      accessorKey: "supplierCode",
      header: "SupplierCode",
    },
    {
      accessorKey: "postalCode",
      header: "PostalCode",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const currentRow = row.original

        const handleDelete = () => {
          axios
            .delete(
              isRelatedSection
                ? `http://localhost:8080/companies/${id}/supplies/${currentRow.id}`
                : `http://localhost:8080/supplies/${currentRow.id}`
            )
            .catch((err) => console.error(err))

          funcCreateCustomEvent("delete", { id: currentRow.id })
        }

        const handleAddRelated = () =>
          funcCreateCustomEvent("related", { id: currentRow.id })

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isRelatedSection ? (
                <DropdownMenuItem onClick={handleDelete}>
                  Delete supplier
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuLabel>Relations</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/supplies/${currentRow.id}/companies?name=${currentRow.name}`}
                    >
                      See all related companies
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleDelete}>
                    Delete supplier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddRelated}>
                    Add company
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

// export const suppliesColumns: ColumnDef<Supply>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "id",
//     header: "ID",
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0"
//         >
//           Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     // header: () => <div className="text-right">PhantasyName</div>,
//     // cell: ({ row }) => {
//     //   const amount = parseFloat(row.getValue("amount"))
//     //   const formatted = new Intl.NumberFormat("en-US", {
//     //     style: "currency",
//     //     currency: "USD",
//     //   }).format(amount)
//     //
//     //   return <div className="text-right font-medium">{formatted}</div>
//     // },
//   },
//   {
//     accessorKey: "supplierCode",
//     header: "SupplierCode",
//   },
//   {
//     accessorKey: "postalCode",
//     header: "PostalCode",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const supplier = row.original
//
//       const handleDelete = () => {
//         axios
//           .delete(`http://localhost:8080/supplies/${supplier.id}`)
//           .catch((err) => console.error(err))
//
//         funcCreateCustomEvent("delete", { id: supplier.id })
//       }
//
//       const handleAddRelated = () =>
//         funcCreateCustomEvent("related", { id: supplier.id })
//
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Relations</DropdownMenuLabel>
//             <DropdownMenuItem asChild>
//               <Link
//                 href={`/supplies/${supplier.id}/companies?name=${supplier.name}`}
//               >
//                 See all related companies
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={handleDelete}>
//               Delete supplier
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleAddRelated}>
//               Add company
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]
