import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

export function NotFoundPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 mb-8">
          <Search className="h-8 w-8 text-muted-foreground/50" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">Page Not Found</h1>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          We couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/"
          className="bg-foreground text-background px-8 py-4 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors hover:bg-foreground/85 inline-flex items-center justify-center"
        >
          Return to Homepage
        </Link>
      </motion.div>
    </div>
  )
}
