import { Search } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface EmptyStateProps {
  title: string
  message: string
  /** Custom icon — defaults to a Search icon. */
  icon?: ReactNode
  /** Optional CTA button rendered below the message. */
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * Reusable empty state component.
 * Renders a centered message with an optional action button,
 * using the existing dashed-border design language.
 */
export function EmptyState({
  title,
  message,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/40",
        className,
      )}
    >
      {icon || <Search className="h-8 w-8 text-muted-foreground/30 mb-4" />}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 text-[12px] font-medium uppercase tracking-[0.1em] underline underline-offset-4 hover:text-muted-foreground transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
