import { useState, useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Gavel, Clock, ArrowUpRight, AlertCircle, CheckCircle2 } from "lucide-react"

import { useProduct } from "@/hooks/queries/useProducts"
import { useAuction } from "@/hooks/queries/useAuctions"
import { usePlaceBid } from "@/hooks/queries/useBidding"
import { useAuctionStream } from "@/hooks/useAuctionStream"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { getUserMessage } from "@/types/api"
import { DetailPageSkeleton } from "@/components/ui/LoadingSkeleton"
import { ErrorState, getErrorCode } from "@/components/ui/ErrorState"
import watchImg from "@/assets/products/watch.jpg"
import { cn } from "@/utils/cn"

function useCountdown(targetDateStr: string | undefined) {
  const calc = useCallback(() => {
    if (!targetDateStr) return { hours: "00", minutes: "00", seconds: "00", isExpired: true }
    const target = new Date(targetDateStr)
    const diff = Math.max(0, target.getTime() - Date.now())
    const h = Math.floor(diff / 3_600_000)
    const m = Math.floor((diff % 3_600_000) / 60_000)
    const s = Math.floor((diff % 60_000) / 1000)
    return {
      hours: String(h).padStart(2, "0"),
      minutes: String(m).padStart(2, "0"),
      seconds: String(s).padStart(2, "0"),
      isExpired: diff === 0,
    }
  }, [targetDateStr])

  const [time, setTime] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [calc])

  return time
}


export function AuctionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const auctionId = id!

  const { user } = useAuth()
  const bidderId = user?.id || "anonymous"
  const toast = useToast()
  const bidMutation = usePlaceBid()

  const { data: auction, isLoading: isAuctionLoading, isError: isAuctionError, error: auctionError } = useAuction(auctionId)
  
  // Conditionally fetch product only when we know the productId
  const { data: product, isLoading: isProductLoading } = useProduct(auction?.productId || "")

  const { bids, status } = useAuctionStream(auctionId)

  const [bidAmount, setBidAmount] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const basePrice = auction?.currentHighestBid || auction?.startingPrice || 0
  const highestStreamBid = bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : 0
  const currentHighestBid = Math.max(basePrice, highestStreamBid)
  
  const countdown = useCountdown(auction?.endTime)

  const minNextBid = currentHighestBid + (auction?.minimumBidIncrement || 0)

  // Determine if our pending bid arrived via SSE
  const ourLatestBidInStream = bids.find(b => b.bidderId === bidderId)
  
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(bidAmount)
    if (isNaN(amount) || amount < minNextBid) {
      setErrorMsg(`Bid must be at least $${minNextBid}`)
      return
    }
    if (auction?.sellerId === bidderId) {
      setErrorMsg("You cannot bid on your own auction.")
      return
    }

    setErrorMsg(null)
    setIsSubmitting(true)

    bidMutation.mutate(
      { auctionId, request: { amount, bidderId } },
      {
        onSuccess: () => {
          setBidAmount("")
          toast.success("Bid placed", `Your bid of ${formatPrice(amount)} has been submitted.`)
        },
        onError: (err: unknown) => {
          setErrorMsg(getUserMessage(err))
          toast.error("Bid failed", getUserMessage(err))
        },
        onSettled: () => {
          setIsSubmitting(false)
        },
      },
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (isAuctionLoading || (auction && isProductLoading)) {
    return (
      <div className="min-h-screen pt-8 pb-24 md:pt-16">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 lg:px-10">
          <DetailPageSkeleton />
        </div>
      </div>
    )
  }

  if (isAuctionError || !auction) {
    return (
      <div className="min-h-[80vh]">
        <ErrorState
          title="Auction Not Found"
          message="The auction you are looking for does not exist or has been removed."
          code={getErrorCode(auctionError)}
        />
      </div>
    )
  }

  const isClosed = auction.status === "ENDED" || auction.status === "CANCELLED" || countdown.isExpired

  return (
    <div className="min-h-screen pt-8 pb-24 md:pt-16">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 lg:px-10">
        
        {/* Status indicator */}
        <div className="mb-6 flex items-center gap-2">
          <div className={cn(
            "h-2.5 w-2.5 rounded-full relative",
            status === "CONNECTED" ? "bg-green-500" :
            status === "CONNECTING" ? "bg-amber-500" : "bg-destructive"
          )}>
            {status === "CONNECTED" && (
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {status === "CONNECTED" ? "Live Connection" :
             status === "CONNECTING" ? "Reconnecting..." : "Disconnected"}
          </span>
          <span className="ml-auto text-[11px] font-bold uppercase tracking-widest px-2 py-1 bg-muted">
            {auction.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: Image */}
          <div className="lg:col-span-7">
            <div className="aspect-[4/5] bg-card overflow-hidden border border-border">
              <img
                src={product?.dynamicAttributes?.image || watchImg}
                alt={product?.name || "Product"}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Info & Bidding */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">
              Seller: {auction.sellerId}
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-6">{product?.name || auction.productId}</h1>
            
            <div className="bg-card border border-border p-6 md:p-8 flex flex-col gap-8 mb-8">
              
              {/* Current Bid & Countdown */}
              <div className="flex flex-col gap-4 border-b border-border/50 pb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Current Highest Bid</p>
                    <p className="text-3xl font-bold text-foreground transition-colors" key={currentHighestBid}>
                      {formatPrice(currentHighestBid)}
                    </p>
                  </div>
                  
                  {isClosed ? (
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-widest text-destructive font-bold mb-1">Auction Ended</p>
                      <p className="text-xl font-heading text-destructive tabular-nums">00:00:00</p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-end gap-1.5">
                        <Clock className="h-3 w-3" /> Ends in
                      </p>
                      <p className="text-xl font-heading text-foreground tabular-nums">
                        {countdown.hours}:{countdown.minutes}:{countdown.seconds}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bidding Form */}
              {!isClosed ? (
                <div className="flex flex-col gap-4">
                  <form onSubmit={handleBidSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                      <label htmlFor="bid-amount" className="sr-only">Bid amount</label>
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <input
                        id="bid-amount"
                        type="number"
                        step={auction.minimumBidIncrement || 1}
                        min={minNextBid}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`${minNextBid} or more`}
                        className="w-full bg-background border border-border py-3.5 pl-8 pr-4 font-medium focus:border-foreground focus:ring-0 transition-colors"
                        disabled={isSubmitting || status !== "CONNECTED" || auction.status !== "LIVE"}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || status !== "CONNECTED" || auction.status !== "LIVE" || !bidAmount || Number(bidAmount) < minNextBid}
                      className="w-full bg-foreground text-background font-medium uppercase tracking-[0.1em] text-[12px] py-4 transition-colors hover:bg-foreground/85 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-3 w-3 border-t-2 border-r-2 border-background rounded-full animate-spin" />
                          Placing Bid...
                        </>
                      ) : (
                        <>
                          <Gavel className="h-4 w-4" />
                          {auction.status === "SCHEDULED" ? "Starts Soon" : "Place Bid"}
                        </>
                      )}
                    </button>
                  </form>
                  
                  {errorMsg && (
                    <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errorMsg}
                    </div>
                  )}
                  
                  {!errorMsg && isSubmitting && (
                    <p className="text-sm text-amber-500 font-medium">Bid pending server confirmation...</p>
                  )}
                  {!errorMsg && !isSubmitting && ourLatestBidInStream?.amount === currentHighestBid && (
                    <p className="text-sm text-green-500 font-medium flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="h-4 w-4" /> You are the highest bidder!
                    </p>
                  )}
                  
                  <p className="text-[11px] text-muted-foreground mt-2">
                    By placing a bid, you are committing to buy this item if you win.
                  </p>
                </div>
              ) : (
                <div className="bg-muted py-6 px-4 text-center border border-border flex flex-col items-center">
                  <h3 className="font-bold text-lg uppercase tracking-wider mb-2">Bidding Closed</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This auction has ended. The final price was {formatPrice(auction.finalPrice || currentHighestBid)}.
                    {auction.winnerId && <><br/>Winner: {auction.winnerId === bidderId ? "You!" : auction.winnerId}</>}
                  </p>
                  {auction.winnerId === bidderId && (
                    <button 
                      onClick={() => window.location.href = '/orders'}
                      className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold uppercase tracking-wider text-xs rounded transition-colors"
                    >
                      View Invoice
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bid History */}
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Live Bid History
              </h3>
              
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {bids.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground italic py-4"
                    >
                      No bids placed yet. Be the first!
                    </motion.p>
                  ) : (
                    bids.map((bid, i) => (
                      <motion.div
                        key={`${bid.bidderId}-${bid.amount}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex items-center justify-between p-3 border",
                          i === 0 ? "bg-accent/10 border-accent/20" : "bg-card border-border/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            i === 0 ? "bg-accent" : "bg-muted-foreground"
                          )} />
                          <span className="text-sm font-medium">
                            {bid.bidderId === bidderId ? "You" : `Bidder ${bid.bidderId.substring(0, 5)}...`}
                          </span>
                        </div>
                        <span className="font-bold font-heading">
                          {formatPrice(bid.amount)}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
