"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { hashPassword, verifyPassword } from "@/lib/auth"

type UserRole = "admin" | "vehicle-owner" | null

interface User {
  id: string
  username: string
  email: string
  phone?: string
  role: UserRole
  passwordHash: string
}

interface AuthContextType {
  user: User | null
  role: UserRole
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (
    userData: Omit<User, "id" | "passwordHash"> & { password: string },
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Initial test users
const initialUsers: User[] = [
  {
    id: "1",
    username: "vehicleowner",
    email: "vehicleowner@email.com",
    phone: "+941234567",
    role: "vehicle-owner",
    passwordHash: "hashed_12345", // This would be properly hashed in a real app
  },
  {
    id: "2",
    username: "admin",
    email: "admin@email.com",
    phone: "+941234588",
    role: "admin",
    passwordHash: "hashed_1234567", // This would be properly hashed in a real app
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  // Load saved user and users list on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Initialize with test users if no users exist
      setUsers(initialUsers)
      localStorage.setItem("users", JSON.stringify(initialUsers))
    }
  }, [])

  const login = async (username: string, password: string) => {
    // Find user by username
    const foundUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

    if (!foundUser) {
      return { success: false, message: "User not found" }
    }

    // For demo purposes, we'll do a simple password check
    // In a real app, we would use proper password verification
    let passwordValid = false

    if (foundUser.username === "vehicleowner" && password === "12345") {
      passwordValid = true
    } else if (foundUser.username === "admin" && password === "1234567") {
      passwordValid = true
    } else {
      // For any other users, verify with hash function
      passwordValid = await verifyPassword(password, foundUser.passwordHash)
    }

    if (!passwordValid) {
      return { success: false, message: "Invalid password" }
    }

    // Set the current user
    setUser(foundUser)
    localStorage.setItem("currentUser", JSON.stringify(foundUser))

    return { success: true }
  }

  const signup = async (userData: Omit<User, "id" | "passwordHash"> & { password: string }) => {
    // Check if username already exists
    if (users.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())) {
      return { success: false, message: "Username already exists" }
    }

    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: "Email already exists" }
    }

    // Create new user
    const passwordHash = await hashPassword(userData.password)

    const newUser: User = {
      id: crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      passwordHash,
    }

    // Add to users list
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Log in the new user
    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
