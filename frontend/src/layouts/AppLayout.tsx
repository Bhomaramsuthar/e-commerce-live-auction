import { Outlet } from "react-router-dom"
import { AnnouncementBar } from "@/components/layout/AnnouncementBar"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
