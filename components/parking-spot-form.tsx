"use client"

import type React from "react"

import { useState } from "react"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ParkingSpot } from "@/types/parking"

interface ParkingSpotFormProps {
  spot?: ParkingSpot
  onSave: (spot: ParkingSpot) => void
  onCancel: () => void
}

export default function ParkingSpotForm({ spot, onSave, onCancel }: ParkingSpotFormProps) {
  const [formData, setFormData] = useState<Partial<ParkingSpot>>(
    spot || {
      id: crypto.randomUUID(),
      name: "",
      address: "",
      lat: 40.7128,
      lng: -74.006,
      total: 10,
      available: 10,
      hourlyRate: 5,
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "lat" || name === "lng" || name === "total" || name === "available" || name === "hourlyRate"
          ? Number.parseFloat(value)
          : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as ParkingSpot)
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Parking Spot Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              name="lat"
              type="number"
              step="0.000001"
              value={formData.lat}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              name="lng"
              type="number"
              step="0.000001"
              value={formData.lng}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total">Total Spots</Label>
            <Input
              id="total"
              name="total"
              type="number"
              min="1"
              value={formData.total}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available">Available Spots</Label>
            <Input
              id="available"
              name="available"
              type="number"
              min="0"
              max={formData.total}
              value={formData.available}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Parking Spot</Button>
      </CardFooter>
    </form>
  )
}
