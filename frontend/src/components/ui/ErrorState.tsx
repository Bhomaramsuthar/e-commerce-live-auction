import { AlertCircle, WifiOff, ServerCrash, ShieldAlert, RefreshCcw } from "lucide-react"
import type { ApiErrorCode } from "@/types/api"
import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface ErrorStateProps {
  /** Override the auto-detected title. */
  title?: string
  /** Override the auto-detected message. */
  message?: string
  /** When provided, selects a preset icon + title + message for the code. */
  code?: ApiErrorCode
  /** Show a retry button that calls this callback. */
  onRetry?: () => void
  /** Override the preset icon. */
  icon?: ReactNode
  className?: string
}

const ERROR_CONFIGS: Record<
  string,
  { icon: typeof AlertCircle; title: string; message: string }
> = {
  NETWORK_ERROR: {
    icon: WifiOff,
    title: "Connection Failed",
    message:
      "Cannot connect to the server. Please check your connection and try again.",
  },
  SERVICE_UNAVAILABLE: {
    icon: ServerCrash,
    title: "Service Unavailable",
    message:
      "This service is temporarily unavailable. Please try again later.",
  },
  UNAUTHORIZED: {
    icon: ShieldAlert,
    title: "Session Expired",
    message: "Your session has expired. Please sign in again.",
  },
  FORBIDDEN: {
    icon: ShieldAlert,
    title: "Access Denied",
    message: "You do not have permission to view this content.",
  },
  NOT_FOUND: {
    icon: AlertCircle,
    title: "Not Found",
    message: "The requested resource could not be found.",
  },
  SERVER_ERROR: {
    icon: ServerCrash,
    title: "Something Went Wrong",
    message:
      "We encountered an unexpected error. Please try again later.",
  },
}

/**
 * Reusable error state component.
 * Accepts an optional `code` to auto-select an appropriate icon and message,
 * or explicit `title` / `message` overrides.
 */
export function ErrorState({
  title,
  message,
  code,
  onRetry,
  icon,
  className,
}: ErrorStateProps) {
  const config = code ? ERROR_CONFIGS[code] : undefined
  const IconComponent = config?.icon || AlertCircle
  const displayTitle = title || config?.title || "Error"
  const displayMessage =
    message || config?.message || "An unexpected error occurred."

  return (
    <div
      className={cn(
        "py-16 flex flex-col items-center justify-center text-center",
        className,
      )}
    >
      {icon || <IconComponent className="h-10 w-10 text-destructive mb-4" />}
      <h3 className="text-lg font-medium mt-2">{displayTitle}</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-sm">
        {displayMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-[12px] font-medium uppercase tracking-[0.1em] text-background transition-colors hover:bg-foreground/85"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

/**
 * Extracts an `ApiErrorCode` from a caught error for use with `ErrorState`.
 */
export function getErrorCode(error: unknown): ApiErrorCode | undefined {
  if (error && typeof error === "object" && "code" in error) {
    return (error as { code: ApiErrorCode }).code
  }
  return undefined
}
