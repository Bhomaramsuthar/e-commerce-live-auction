import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Search, ShoppingBag, User, Menu, X, LogOut, Package, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { useUIStore } from "@/stores/uiStore"
import { useAuth } from "@/context/AuthContext"
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
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const isScrolled = scrollY > 40

  // Escape key handler for user menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false)
    }
    if (isUserMenuOpen) document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isUserMenuOpen])

  // Escape key handler for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll()
    }
    if (isMobileMenuOpen) document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMobileMenuOpen, closeAll])

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
        <div className="mx-auto flex h-14 items-center justify-between px-5 md:h-16 md:px-6 lg:px-10 max-w-[1400px]">
          {/* Left: mobile menu + desktop nav */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              onClick={toggleMobileMenu}
              className="text-muted-foreground hover:text-foreground transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav className="hidden md:flex items-center gap-4 lg:gap-7">
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
          <Link to="/" onClick={closeAll} className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <span className="font-heading text-lg font-bold tracking-[-0.04em] md:text-xl">
              BIDCRAFT
            </span>
          </Link>
          <Link to="/" onClick={closeAll} className="block lg:hidden">
            <span className="font-heading text-lg font-bold tracking-[-0.04em] md:text-xl">
              BIDCRAFT
            </span>
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-4 md:gap-5">
            <Link
              to="/search"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-[17px] w-[17px]" />
            </Link>
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserMenuOpen((p) => !p)}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Account menu"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold uppercase">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 z-[70] w-48 border border-border bg-background shadow-lg"
                      >
                        <div className="px-4 py-3 border-b border-border/50">
                          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Signed in as</p>
                          <p className="text-sm font-medium truncate mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                            <User className="h-3.5 w-3.5" /> Profile
                          </Link>
                          <Link to="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                            <Package className="h-3.5 w-3.5" /> Orders
                          </Link>
                        </div>
                        <div className="border-t border-border/50 py-1">
                          <button onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/login'); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                            <LogOut className="h-3.5 w-3.5" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="h-[17px] w-[17px]" />
                Sign In
              </Link>
            )}
            <button
              className="text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[17px] w-[17px]" />
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

              <div className="border-t border-border/50 px-3 py-4 flex flex-col gap-1">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={closeAll} className="px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors flex items-center gap-2.5">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link to="/orders" onClick={closeAll} className="px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors flex items-center gap-2.5">
                      <Package className="h-4 w-4" /> Orders
                    </Link>
                    <button onClick={() => { logout(); closeAll(); navigate('/login'); }} className="px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2.5 w-full text-left">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeAll} className="px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors flex items-center gap-2.5">
                    <User className="h-4 w-4" /> Sign In
                  </Link>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
