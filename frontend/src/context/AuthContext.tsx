import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getProfile,
  getStoredToken,
} from "@/api/auth"
import { AUTH_ERROR_EVENT } from "@/api/client"
import type { AuthUser, LoginCredentials, RegisterCredentials } from "@/api/auth"

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount, rehydrate from backend via getProfile
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken()
      if (token) {
        try {
          const profile = await getProfile()
          setUser(profile)
        } catch (error) {
          // If token is invalid/expired, the interceptor will trigger AUTH_ERROR_EVENT
          console.error("Session restoration failed", error)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  // Listen for 401 errors dispatched by the API client
  useEffect(() => {
    const handleAuthError = () => {
      apiLogout()
      setUser(null)
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }
    window.addEventListener(AUTH_ERROR_EVENT, handleAuthError)
    return () => window.removeEventListener(AUTH_ERROR_EVENT, handleAuthError)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: authUser } = await apiLogin(credentials)
    setUser(authUser)
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const { user: authUser } = await apiRegister(credentials)
    setUser(authUser)
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
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
