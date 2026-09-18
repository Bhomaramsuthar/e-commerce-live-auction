import { apiClient } from "./client"

export type Role = "USER" | "ADMIN" | "CUSTOMER"

export interface AuthUser {
  id: string
  name: string
  email: string
  phoneNumber?: string
  role: Role
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber?: string
  role: Role
}

/**
 * Registers a new user with the auth service.
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/register", credentials)
  storeToken(data.token)
  return data
}

/**
 * Authenticates a user with the auth service.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/login", credentials)
  storeToken(data.token)
  return data
}

/**
 * Fetches the current user profile using the stored JWT.
 */
export async function getProfile(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/api/auth/profile")
  return data
}

export function logout(): void {
  localStorage.removeItem("bidcraft_token")
}

export function storeToken(token: string): void {
  localStorage.setItem("bidcraft_token", token)
}

export function getStoredToken(): string | null {
  return localStorage.getItem("bidcraft_token")
}
