import axios from "axios"

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

// ── Request interceptor: attach JWT token if present ──
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("bidcraft_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: normalise error shape ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred"

    console.error(`[API Error] ${error.config?.url}: ${message}`)
    return Promise.reject(error)
  },
)
