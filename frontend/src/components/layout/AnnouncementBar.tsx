import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-[60] border-b border-border/40 bg-card"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-center px-6 py-2 lg:px-10">
          <p className="text-center text-[11px] tracking-wide text-muted-foreground">
            Autumn Auction Week —{" "}
            <Link
              to="/auctions"
              className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
            >
              View live lots
            </Link>
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 text-muted-foreground transition-colors hover:text-foreground lg:right-10"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
