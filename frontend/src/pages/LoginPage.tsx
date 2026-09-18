import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertCircle, ArrowRight, LogIn } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { ApiError, getUserMessage } from "@/types/api"

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate(redirect, { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const errors: Record<string, string> = {}
    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address"
    }

    if (!password) {
      errors.password = "Password is required"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setError(null)
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      navigate(redirect, { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.validationErrors && err.validationErrors.length > 0) {
        const backendErrors: Record<string, string> = {}
        for (const item of err.validationErrors) {
          backendErrors[item.field] = item.message
        }
        setFieldErrors(backendErrors)
      }
      setError(getUserMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Sign in to your account to continue bidding
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-sm"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }))
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full bg-transparent border px-4 py-3.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
                fieldErrors.email
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-foreground"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[12px] text-destructive flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }))
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`w-full bg-transparent border px-4 py-3.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
                fieldErrors.password
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-foreground"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-[12px] text-destructive flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-foreground text-background py-4 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors hover:bg-foreground/85 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-3.5 w-3.5 border-t-2 border-r-2 border-background rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="inline-flex items-center gap-1 text-foreground font-medium underline underline-offset-4 hover:text-accent transition-colors"
            >
              Create one
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
