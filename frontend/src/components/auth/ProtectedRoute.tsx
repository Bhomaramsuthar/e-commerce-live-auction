import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Wraps a route that requires authentication.
 * Redirects to /login with a ?redirect= param so we can bounce back after login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 border-t-2 border-r-2 border-foreground rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}
