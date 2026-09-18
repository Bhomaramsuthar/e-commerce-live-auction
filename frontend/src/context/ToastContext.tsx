import { createContext, useContext, useState, useCallback, useRef } from "react"
import type { ReactNode } from "react"

export type ToastVariant = "success" | "error" | "info"

export interface Toast {
  id: string
  variant: ToastVariant
  title: string
  message?: string
}

interface ToastContextValue {
  toasts: Toast[]
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const addToast = useCallback(
    (variant: ToastVariant, title: string, message?: string) => {
      const id = `toast-${++counterRef.current}`
      const toast: Toast = { id, variant, title, message }

      // Keep at most 3 toasts visible
      setToasts((prev) => [...prev.slice(-2), toast])

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        success: (title, msg) => addToast("success", title, msg),
        error: (title, msg) => addToast("error", title, msg),
        info: (title, msg) => addToast("info", title, msg),
        dismiss,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return ctx
}
