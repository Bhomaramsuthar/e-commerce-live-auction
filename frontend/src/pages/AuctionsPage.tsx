import { Link } from "react-router-dom"
import { useAuctions } from "@/hooks/queries/useAuctions"
import { Gavel, ChevronRight } from "lucide-react"

export function AuctionsPage() {
  const { data: auctions, isLoading, isError } = useAuctions()

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8 pb-24 md:pt-16 flex items-center justify-center">
        <div className="animate-pulse flex gap-2">
          <div className="w-4 h-4 bg-foreground/20 rounded-full"></div>
          <div className="w-4 h-4 bg-foreground/20 rounded-full"></div>
          <div className="w-4 h-4 bg-foreground/20 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-8 pb-24 md:pt-16 flex items-center justify-center">
        <p className="text-destructive font-medium">Failed to load auctions.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-8 pb-24 md:pt-16">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Live & Upcoming Auctions</h1>

        {auctions?.length === 0 ? (
          <div className="bg-muted border border-border p-8 text-center text-muted-foreground">
            No auctions available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions?.map((auction) => (
              <Link
                key={auction.auctionId}
                to={`/auction/${auction.auctionId}`}
                className="group border border-border bg-card overflow-hidden hover:border-foreground/50 transition-colors flex flex-col"
              >
                <div className="p-5 flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${
                      auction.status === "LIVE" ? "bg-green-500/10 text-green-500" :
                      auction.status === "SCHEDULED" ? "bg-amber-500/10 text-amber-500" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {auction.status}
                    </span>
                    {auction.status === "LIVE" && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2">Product: {auction.productId}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Seller: {auction.sellerId}</p>

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                        Highest Bid
                      </p>
                      <p className="font-heading font-bold text-xl">
                        ${auction.currentHighestBid.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                    <Gavel className="w-3.5 h-3.5" /> Join Auction
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
