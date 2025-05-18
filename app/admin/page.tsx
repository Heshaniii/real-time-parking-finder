"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, BarChart3, Settings, Users, Car, MapPin } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"
import { useAuth } from "@/contexts/auth-context"
import type { ParkingSpot } from "@/types/parking"
import ParkingSpotForm from "@/components/parking-spot-form"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"
import UserHeader from "@/components/user-header"

export default function AdminPage() {
  const { parkingSpots, updateParkingSpot } = useWebSocket()
  const [isAddingSpot, setIsAddingSpot] = useState(false)
  const [editingSpot, setEditingSpot] = useState<ParkingSpot | null>(null)
  const { user, isAuthenticated, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated) {
      router.push("/")
    } else if (role !== "admin") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, role, router])

  const handleSaveSpot = (spot: ParkingSpot) => {
    updateParkingSpot(spot)
    setIsAddingSpot(false)
    setEditingSpot(null)
  }

  const totalSpots = parkingSpots.reduce((acc, spot) => acc + spot.total, 0)
  const availableSpots = parkingSpots.reduce((acc, spot) => acc + spot.available, 0)
  const occupiedSpots = totalSpots - availableSpots
  const occupancyRate = totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0
  const totalRevenue = parkingSpots.reduce((acc, spot) => {
    return acc + (spot.total - spot.available) * spot.hourlyRate
  }, 0)

  if (!isAuthenticated || role !== "admin") {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.username}</p>
          </div>
          <Button onClick={() => setIsAddingSpot(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Parking Spot
          </Button>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="spots">
              <MapPin className="mr-2 h-4 w-4" />
              Parking Spots
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSpots}</div>
                  <p className="text-xs text-muted-foreground">Across {parkingSpots.length} locations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availableSpots}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((availableSpots / totalSpots) * 100) || 0}% of total capacity
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{occupancyRate}%</div>
                  <p className="text-xs text-muted-foreground">{occupiedSpots} spots currently occupied</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Revenue</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Based on current occupancy</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Monitor real-time parking activity across all your locations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parkingSpots.slice(0, 5).map((spot) => (
                    <div key={spot.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{spot.name}</p>
                        <p className="text-sm text-muted-foreground">{spot.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {spot.available}/{spot.total} available
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((spot.available / spot.total) * 100)}% free
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#spots">View All Parking Spots</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="spots">
            <Card>
              <CardHeader>
                <CardTitle>Manage Parking Spots</CardTitle>
                <CardDescription>View and manage all your parking locations.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={parkingSpots} onEdit={setEditingSpot} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Username</Label>
                  <Input id="name" defaultValue={user?.username || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={user?.phone || ""} />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {(isAddingSpot || editingSpot) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingSpot ? "Edit Parking Spot" : "Add New Parking Spot"}</CardTitle>
              <CardDescription>
                {editingSpot
                  ? "Update the details for this parking location."
                  : "Enter the details for a new parking location."}
              </CardDescription>
            </CardHeader>
            <ParkingSpotForm
              spot={editingSpot || undefined}
              onSave={handleSaveSpot}
              onCancel={() => {
                setIsAddingSpot(false)
                setEditingSpot(null)
              }}
            />
          </Card>
        </div>
      )}
    </div>
  )
}
