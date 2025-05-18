"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, User, ShieldCheck } from "lucide-react"

export default function RoleSelection() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="h-6 w-6 text-primary" />
            <span>ParkFinder</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome to ParkFinder</h1>
            <p className="mt-4 text-muted-foreground text-lg">Please select your role to continue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Vehicle Owner</CardTitle>
                <CardDescription>Find and reserve parking spots</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Access the map to find available parking spots, make reservations, and manage your account.</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" asChild>
                  <Link href="/login/vehicle-owner">Login as Vehicle Owner</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup/vehicle-owner">Sign Up as Vehicle Owner</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Administrator</CardTitle>
                <CardDescription>Manage parking locations</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Access the admin dashboard to manage parking spots, view analytics, and handle settings.</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" asChild>
                  <Link href="/login/admin">Login as Administrator</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup/admin">Sign Up as Administrator</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ParkFinder. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
