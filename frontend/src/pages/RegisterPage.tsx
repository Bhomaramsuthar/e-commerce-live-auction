import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertCircle, ArrowRight, UserPlus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { ApiError, getUserMessage } from "@/types/api"


export function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    navigate("/", { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Record<string, string> = {}
    if (!name.trim()) {
      errors.name = "Full name is required"
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!email.trim()) {
      errors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (phoneNumber.trim() && !/^\+?[0-9\s-]{7,15}$/.test(phoneNumber.trim())) {
      errors.phoneNumber = "Please enter a valid phone number"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setError(null)
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        password,
        confirmPassword,
        role: "CUSTOMER",
      })
      navigate("/", { replace: true })
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
    <div className="min-h-[85vh] flex items-center justify-center px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Join BidCraft to start bidding on exclusive items
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <label htmlFor="register-name" className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }))
              }}
              placeholder="John Doe"
              autoComplete="name"
              className={`w-full bg-transparent border px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
                fieldErrors.name
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-foreground"
              }`}
            />
            {fieldErrors.name && (
              <p className="text-[12px] text-destructive flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }))
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full bg-transparent border px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
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
            <label htmlFor="register-phone" className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Phone Number <span className="text-muted-foreground/60 lowercase">(optional)</span>
            </label>
            <input
              id="register-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                if (fieldErrors.phoneNumber) setFieldErrors((prev) => ({ ...prev, phoneNumber: "" }))
              }}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              className={`w-full bg-transparent border px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
                fieldErrors.phoneNumber
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-foreground"
              }`}
            />
            {fieldErrors.phoneNumber && (
              <p className="text-[12px] text-destructive flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.phoneNumber}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }))
              }}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`w-full bg-transparent border px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-confirm" className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Confirm Password
            </label>
            <input
              id="register-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }))
              }}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`w-full bg-transparent border px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-colors ${
                fieldErrors.confirmPassword
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-foreground"
              }`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-[12px] text-destructive flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.confirmPassword}
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
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-foreground font-medium underline underline-offset-4 hover:text-accent transition-colors"
            >
              Sign in
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
