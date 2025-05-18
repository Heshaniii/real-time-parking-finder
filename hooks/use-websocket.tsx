"use client"

import { useState, useEffect } from "react"
import type { ParkingSpot } from "@/types/parking"

// Mock data for parking spots
const initialParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "Downtown Parking Garage",
    address: "123 Main St, Downtown",
    lat: 40.7128,
    lng: -74.006,
    total: 150,
    available: 42,
    hourlyRate: 8.5,
  },
  {
    id: "2",
    name: "Central Park Parking",
    address: "456 Park Ave, Midtown",
    lat: 40.7736,
    lng: -73.9566,
    total: 80,
    available: 5,
    hourlyRate: 12.0,
  },
  {
    id: "3",
    name: "Riverside Parking Lot",
    address: "789 River Rd, Westside",
    lat: 40.7258,
    lng: -74.0111,
    total: 60,
    available: 0,
    hourlyRate: 6.75,
  },
  {
    id: "4",
    name: "East Village Garage",
    address: "101 E 7th St, East Village",
    lat: 40.7267,
    lng: -73.984,
    total: 45,
    available: 12,
    hourlyRate: 10.0,
  },
  {
    id: "5",
    name: "SoHo Parking Center",
    address: "200 Broadway, SoHo",
    lat: 40.7248,
    lng: -74.002,
    total: 95,
    available: 23,
    hourlyRate: 15.5,
  },
]

export function useWebSocket() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(initialParkingSpots)
  const [isConnected, setIsConnected] = useState(true)

  // Simulate WebSocket connection and real-time updates
  useEffect(() => {
    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected(true)
    }, 5000)

    // Simulate random updates to parking spots
    const updateInterval = setInterval(() => {
      setParkingSpots((currentSpots) => {
        return currentSpots.map((spot) => {
          // Randomly update availability (10% chance)
          if (Math.random() < 0.1) {
            const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
            const newAvailable = Math.max(0, Math.min(spot.total, spot.available + change))

            return {
              ...spot,
              available: newAvailable,
            }
          }
          return spot
        })
      })
    }, 3000)

    // Listen for edit events
    const handleEdit = (event: CustomEvent) => {
      const spotToEdit = event.detail
      setParkingSpots((currentSpots) => currentSpots.map((spot) => (spot.id === spotToEdit.id ? spotToEdit : spot)))
    }

    // Listen for delete events
    const handleDelete = (event: CustomEvent) => {
      const spotIdToDelete = event.detail
      setParkingSpots((currentSpots) => currentSpots.filter((spot) => spot.id !== spotIdToDelete))
    }

    window.addEventListener("edit-spot", handleEdit as EventListener)
    window.addEventListener("delete-spot", handleDelete as EventListener)

    return () => {
      clearInterval(connectionInterval)
      clearInterval(updateInterval)
      window.removeEventListener("edit-spot", handleEdit as EventListener)
      window.removeEventListener("delete-spot", handleDelete as EventListener)
    }
  }, [])

  // Function to update a parking spot
  const updateParkingSpot = (updatedSpot: ParkingSpot) => {
    setParkingSpots((currentSpots) => {
      const exists = currentSpots.some((spot) => spot.id === updatedSpot.id)

      if (exists) {
        return currentSpots.map((spot) => (spot.id === updatedSpot.id ? updatedSpot : spot))
      } else {
        return [...currentSpots, updatedSpot]
      }
    })
  }

  return {
    parkingSpots,
    isConnected,
    updateParkingSpot,
  }
}
