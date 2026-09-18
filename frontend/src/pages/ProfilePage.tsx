import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { User, Mail, Phone, Shield, Calendar, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-[85vh] py-12 px-5 max-w-[1000px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="w-full"
      >
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / Quick Info */}
          <div className="col-span-1 flex flex-col gap-6">
            <div className="border border-border p-6 bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-foreground text-background rounded-full flex items-center justify-center text-xl font-bold uppercase tracking-widest">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{user.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Shield className="h-3.5 w-3.5" />
                    {user.role === "ADMIN" ? "Administrator" : "BidCraft Member"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined recently</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
            <div className="border border-border p-6 md:p-8 bg-card/30 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    Full Name
                  </label>
                  <div className="px-4 py-3 border border-border bg-background/50 font-medium">
                    {user.name}
                  </div>
                </div>
                
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 border border-border bg-background/50 font-medium">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    Phone Number
                  </label>
                  <div className="px-4 py-3 border border-border bg-background/50 font-medium">
                    {user.phoneNumber || "Not provided"}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                    Account Role
                  </label>
                  <div className="px-4 py-3 border border-border bg-background/50 font-medium flex items-center gap-2">
                    {user.role}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <button disabled className="bg-foreground text-background px-6 py-3 text-[12px] font-medium uppercase tracking-[0.1em] opacity-50 cursor-not-allowed">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Dashboard Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border p-6 bg-card/30 backdrop-blur-sm flex flex-col h-full">
                <h3 className="text-lg font-bold mb-3">My Auctions</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  Manage your active listings, view bids, and check your earnings.
                </p>
                <button onClick={() => navigate('/auctions')} className="border border-foreground px-6 py-3 text-[12px] font-medium uppercase tracking-[0.1em] hover:bg-foreground hover:text-background transition-colors w-full mt-auto">
                  Go to Listings
                </button>
              </div>
              
              <div className="border border-border p-6 bg-card/30 backdrop-blur-sm flex flex-col h-full">
                <h3 className="text-lg font-bold mb-3">Bidding History</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  You haven't participated in any auctions yet. Start exploring active items.
                </p>
                <button onClick={() => navigate('/auctions')} className="border border-foreground px-6 py-3 text-[12px] font-medium uppercase tracking-[0.1em] hover:bg-foreground hover:text-background transition-colors w-full mt-auto">
                  Explore Auctions
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
