"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import ParkingSpotList from "@/components/parking-spot-list"
import { useWebSocket } from "@/hooks/use-websocket"
import { useAuth } from "@/contexts/auth-context"
import type { ParkingSpot } from "@/types/parking"
import UserHeader from "@/components/user-header"

// Dynamically import the map component with no SSR
const ParkingMap = dynamic(() => import("@/components/parking-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted">
      <p>Loading map...</p>
    </div>
  ),
})

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const { isAuthenticated, role } = useAuth()
  const router = useRouter()

  // Get parking spots from WebSocket
  const { parkingSpots, isConnected } = useWebSocket()

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Filter spots based on search query
  const filteredSpots = parkingSpots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex h-screen flex-col">
      <UserHeader />

      <div className="container py-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Find Parking</h1>
          <Button size="sm" variant="outline" onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}>
            {viewMode === "map" ? "List View" : "Map View"}
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for parking spots..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-1 md:grid-cols-3">
          <div
            className={`${viewMode === "list" || selectedSpot ? "block" : "hidden"} md:block overflow-auto p-4 md:col-span-1 border-r`}
          >
            <ParkingSpotList spots={filteredSpots} selectedSpotId={selectedSpot?.id} onSelectSpot={setSelectedSpot} />
          </div>

          <div
            className={`${viewMode === "map" && !selectedSpot ? "block" : "hidden"} md:block md:col-span-2 h-full relative`}
          >
            <ParkingMap spots={filteredSpots} selectedSpot={selectedSpot} onSelectSpot={setSelectedSpot} />
          </div>

          {selectedSpot && (
            <div
              className={`${viewMode === "map" ? "block" : "hidden"} md:hidden absolute bottom-0 left-0 right-0 p-4 z-10`}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{selectedSpot.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedSpot.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            selectedSpot.available > 5
                              ? "success"
                              : selectedSpot.available > 0
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {selectedSpot.available} spots available
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />${selectedSpot.hourlyRate}/hour
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setSelectedSpot(null)}>
                      Close
                    </Button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1">Reserve Spot</Button>
                    <Button variant="outline" className="flex-1">
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
