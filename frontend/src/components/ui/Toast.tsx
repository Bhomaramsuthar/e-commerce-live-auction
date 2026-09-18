import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/context/ToastContext"
import { cn } from "@/utils/cn"
import type { ToastVariant } from "@/context/ToastContext"

const icons: Record<ToastVariant, typeof AlertCircle> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const variantStyles: Record<ToastVariant, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-accent/30 bg-accent/10 text-accent",
}

/**
 * Renders the floating toast stack in the bottom-right corner.
 * Mount once in `main.tsx` inside the ToastProvider.
 */
export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.variant]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 border px-4 py-3 shadow-lg backdrop-blur-sm",
                variantStyles[toast.variant],
              )}
            >
              <Icon className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs mt-0.5 opacity-80">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
