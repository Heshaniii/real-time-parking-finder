"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { ParkingSpot } from "@/types/parking"
import { Button } from "@/components/ui/button"

// Fix Leaflet marker icon issue
const createMarkerIcon = (available: number, total: number) => {
  const fillColor =
    available === 0
      ? "#ef4444" // Red for no spots
      : available < total * 0.2
        ? "#f97316" // Orange for low availability
        : "#22c55e" // Green for good availability

  return L.divIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 text-sm font-bold" style="border-color: ${fillColor}; color: ${fillColor}">
        ${available}
      </div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

interface ParkingMapProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSelectSpot: (spot: ParkingSpot | null) => void
}

// Component to handle map center changes when a spot is selected
function MapController({ spot }: { spot: ParkingSpot | null }) {
  const map = useMap()

  useEffect(() => {
    if (spot) {
      map.setView([spot.lat, spot.lng], 16)
    }
  }, [map, spot])

  return null
}

export default function ParkingMap({ spots, selectedSpot, onSelectSpot }: ParkingMapProps) {
  // Default center (will be overridden if spots are available)
  const [center, setCenter] = useState<[number, number]>([40.7128, -74.006]) // NYC default

  // Set center to first spot or user location
  useEffect(() => {
    if (spots.length > 0) {
      setCenter([spots[0].lat, spots[0].lng])
    } else {
      // Try to get user's location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude])
        },
        () => {
          // Keep default if geolocation fails
        },
      )
    }
  }, [spots])

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createMarkerIcon(spot.available, spot.total)}
          eventHandlers={{
            click: () => {
              onSelectSpot(spot)
            },
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">{spot.name}</h3>
              <p className="text-sm">{spot.address}</p>
              <p className="text-sm mt-1">
                <span className="font-semibold">{spot.available}</span> of{" "}
                <span className="font-semibold">{spot.total}</span> spots available
              </p>
              <p className="text-sm">${spot.hourlyRate}/hour</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="w-full">
                  Reserve
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapController spot={selectedSpot} />
    </MapContainer>
  )
}
