"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import type { ParkingSpot } from "@/types/parking"
import { Search } from "lucide-react"

interface DataTableProps {
  columns: {
    id: string
    header: string
    cell: (spot: ParkingSpot) => React.ReactNode
  }[]
  data: ParkingSpot[]
  onEdit: (spot: ParkingSpot) => void
}

export function DataTable({ columns, data, onEdit }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = data.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search parking spots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((spot) => (
                <TableRow key={spot.id}>
                  {columns.map((column) => (
                    <TableCell key={`${spot.id}-${column.id}`}>{column.cell(spot)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
