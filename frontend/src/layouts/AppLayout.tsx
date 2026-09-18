import { Outlet } from "react-router-dom"
import { AnnouncementBar } from "@/components/layout/AnnouncementBar"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
