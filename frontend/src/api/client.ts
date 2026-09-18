import axios from "axios"
import { parseApiError } from "@/types/api"

/**
 * Axios client pre-configured for the Spring Cloud Gateway.
 * All microservice calls route through the gateway on port 8080.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Custom event dispatched when the API returns 401.
 * AuthContext listens for this to clear user state and redirect,
 * avoiding a direct import of `logout()` (which would create a
 * circular dependency between client.ts ↔ auth.ts).
 */
export const AUTH_ERROR_EVENT = "bidcraft:auth-error"

// ── Request interceptor: attach JWT token if present ──
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("bidcraft_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: transform errors into typed ApiError ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = parseApiError(error)

    // Global 401 handler: notify the app that auth has failed
    if (apiError.code === "UNAUTHORIZED") {
      window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT))
    }

    return Promise.reject(apiError)
  },
)
