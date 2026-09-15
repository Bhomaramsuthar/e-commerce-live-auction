import { Link, useLocation } from "react-router-dom"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { useUIStore } from "@/stores/uiStore"
import { cn } from "@/utils/cn"

const navLinks = [
  { name: "New Arrivals", path: "/new-arrivals" },
  { name: "Auctions", path: "/auctions" },
  { name: "Designers", path: "/designers" },
  { name: "Editorial", path: "/editorial" },
]

export function Navbar() {
  const scrollY = useScrollPosition()
  const location = useLocation()
  const { isMobileMenuOpen, toggleMobileMenu, closeAll } = useUIStore()
  const isScrolled = scrollY > 40

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-border/50 bg-background/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 items-center justify-between px-5 md:h-16 md:px-8 lg:px-10 max-w-[1400px]">
          {/* Left: mobile menu + desktop nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={toggleMobileMenu}
              className="text-muted-foreground hover:text-foreground transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "relative text-[12px] font-medium uppercase tracking-[0.14em] transition-colors",
                    location.pathname === link.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-[19px] left-0 right-0 h-px bg-foreground"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <Link to="/" onClick={closeAll} className="absolute left-1/2 -translate-x-1/2">
            <span className="font-heading text-lg font-bold tracking-[-0.04em] md:text-xl">
              BIDCRAFT
            </span>
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-4 md:gap-5">
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-[17px] w-[17px]" />
            </button>
            <button
              className="hidden text-muted-foreground hover:text-foreground transition-colors sm:block"
              aria-label="Account"
            >
              <User className="h-[17px] w-[17px]" />
            </button>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[17px] w-[17px]" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground">
                0
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/50 lg:hidden"
              onClick={closeAll}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] as const }}
              className="fixed top-0 left-0 z-[80] flex h-dvh w-[280px] flex-col border-r border-border bg-background lg:hidden"
            >
              <div className="flex h-14 items-center justify-between px-5 border-b border-border/50">
                <span className="font-heading text-base font-bold tracking-[-0.04em]">
                  BIDCRAFT
                </span>
                <button
                  onClick={closeAll}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-1 px-3 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeAll}
                    className={cn(
                      "px-3 py-3 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors",
                      location.pathname === link.path
                        ? "text-foreground bg-card"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border/50 px-5 py-4 flex items-center gap-5">
                <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Account">
                  <User className="h-5 w-5" />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
