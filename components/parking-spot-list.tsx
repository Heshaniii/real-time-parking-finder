"use client"

import type { ParkingSpot } from "@/types/parking"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Car } from "lucide-react"

interface ParkingSpotListProps {
  spots: ParkingSpot[]
  selectedSpotId?: string
  onSelectSpot: (spot: ParkingSpot) => void
}

export default function ParkingSpotList({ spots, selectedSpotId, onSelectSpot }: ParkingSpotListProps) {
  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Car className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No parking spots found</h3>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or zoom out on the map.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Parking Spots ({spots.length})</h2>

      {spots.map((spot) => (
        <Card
          key={spot.id}
          className={`cursor-pointer transition-colors ${selectedSpotId === spot.id ? "border-primary" : ""}`}
          onClick={() => onSelectSpot(spot)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">{spot.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {spot.address}
                </div>
              </div>
              <Badge variant={spot.available > 5 ? "success" : spot.available > 0 ? "warning" : "destructive"}>
                {spot.available}/{spot.total}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-sm">
                <Clock className="h-3 w-3 mr-1" />${spot.hourlyRate}/hour
              </div>
              <Button size="sm">Reserve</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
