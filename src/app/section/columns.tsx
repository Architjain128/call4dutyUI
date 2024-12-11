"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Circle, SquareArrowOutUpLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

function getPriorityColor(value:String) {
  if(value==="Critical") return "red";
  if(value==="High") return "orange";
  if(value==="Medium") return "purple";
  return "blue";
}

export type Incidents = {
  id: string
  title: string
  service: string
  createdAt: string
  priority: string
  team: string
  status: "Acknowleded" | "Resolved" | "Escalated" | "Unknown"
}


export const columns: ColumnDef<Incidents>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div
        onClick={()=>{
          window.location.pathname = "/postmartum/"+row.getValue("id")
        }}
      >
        <SquareArrowOutUpLeftIcon/>
      </div>
  
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const priority:String = row.getValue("priority")
      const color:string = getPriorityColor(priority)
      return (
        <div>
          <div className={`font-medium text-center bg-${color}-500`}>{priority}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = parseFloat(row.getValue("createdAt"))
      const formatted = new Date(createdAt).toUTCString()
 
      return <div className="font-medium">{formatted}</div>
    },
  },
]

export const readOnlyColumns: ColumnDef<Incidents>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div
        onClick={()=>{
          window.location.pathname = "/postmartum/"+row.getValue("id")
        }}
      >
        <SquareArrowOutUpLeftIcon/>
      </div>
  
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority:String = row.getValue("priority")
      const color:string = getPriorityColor(priority)
      return (
        <div>
          <div className={`font-medium text-center bg-${color}-500`}>{priority}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = parseFloat(row.getValue("createdAt"))
      const formatted = new Date(createdAt).toUTCString()
 
      return <div className="font-medium">{formatted}</div>
    },
  },
]
