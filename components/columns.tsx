"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ParkingSpot } from "@/types/parking"
import { Edit2, Trash2 } from "lucide-react"

export const columns = [
  {
    id: "name",
    header: "Name",
    cell: (spot: ParkingSpot) => (
      <div>
        <div className="font-medium">{spot.name}</div>
        <div className="text-sm text-muted-foreground">{spot.address}</div>
      </div>
    ),
  },
  {
    id: "capacity",
    header: "Capacity",
    cell: (spot: ParkingSpot) => (
      <div className="text-center">
        <div className="font-medium">{spot.total}</div>
        <div className="text-sm text-muted-foreground">total spots</div>
      </div>
    ),
  },
  {
    id: "availability",
    header: "Availability",
    cell: (spot: ParkingSpot) => {
      const percentage = Math.round((spot.available / spot.total) * 100)
      let variant: "default" | "success" | "warning" | "destructive" = "default"

      if (percentage > 50) variant = "success"
      else if (percentage > 20) variant = "warning"
      else if (percentage === 0) variant = "destructive"

      return (
        <div className="flex flex-col items-center">
          <Badge variant={variant}>
            {spot.available}/{spot.total} ({percentage}%)
          </Badge>
        </div>
      )
    },
  },
  {
    id: "rate",
    header: "Hourly Rate",
    cell: (spot: ParkingSpot) => <div className="text-center font-medium">${spot.hourlyRate.toFixed(2)}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: (spot: ParkingSpot) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.dispatchEvent(new CustomEvent("edit-spot", { detail: spot }))}
        >
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => {
            if (confirm("Are you sure you want to delete this parking spot?")) {
              window.dispatchEvent(new CustomEvent("delete-spot", { detail: spot.id }))
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    ),
  },
]
