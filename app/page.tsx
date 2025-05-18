"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import RoleSelection from "@/components/role-selection"

export default function HomePage() {
  const { isAuthenticated, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to the appropriate dashboard
    if (isAuthenticated) {
      if (role === "admin") {
        router.push("/admin")
      } else if (role === "vehicle-owner") {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, role, router])

  // Show role selection if not authenticated
  return <RoleSelection />
}
