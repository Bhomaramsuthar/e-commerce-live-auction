import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

// Lazy load pages for code splitting (B1)
const HomePage = lazy(() => import("@/pages/HomePage").then((module) => ({ default: module.HomePage })))
const SearchPage = lazy(() => import("@/pages/SearchPage").then((module) => ({ default: module.SearchPage })))
const AuctionsPage = lazy(() => import("@/pages/AuctionsPage").then((module) => ({ default: module.AuctionsPage })))
const AuctionDetailsPage = lazy(() => import("@/pages/AuctionDetailsPage").then((module) => ({ default: module.AuctionDetailsPage })))
const LoginPage = lazy(() => import("@/pages/LoginPage").then((module) => ({ default: module.LoginPage })))
const RegisterPage = lazy(() => import("@/pages/RegisterPage").then((module) => ({ default: module.RegisterPage })))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })))
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then((module) => ({ default: module.ProfilePage })))

// Placeholder pages for protected routes

const OrdersPage = lazy(() => import("@/pages/OrdersPage"));

function CheckoutPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-5">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <p className="text-muted-foreground text-sm">Checkout flow coming soon.</p>
    </div>
  )
}

// Minimal fallback for Suspense
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-8 w-8 border-t-2 border-r-2 border-foreground rounded-full animate-spin" />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/auctions" element={<AuctionsPage />} />
              <Route path="/auction/:id" element={<AuctionDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              
              {/* 404 Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

