import { Link } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import { Gavel } from "lucide-react"

interface AuctionCardProps {
  id: string
  name: string
  designer: string
  currentBid: string
  image: string
  endsAt: Date
  totalBids: number
}

function useCountdown(target: Date) {
  const calc = useCallback(() => {
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
  }, [target])

  const [time, setTime] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [calc])

  return time
}

export function AuctionCard({
  id,
  name,
  designer,
  currentBid,
  image,
  endsAt,
  totalBids,
}: AuctionCardProps) {
  const countdown = useCountdown(endsAt)

  return (
    <Link to={`/auction/${id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Live badge */}
        <div className="absolute top-0 left-0 p-4">
          <span className="flex items-center gap-1.5 bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-foreground" />
            </span>
            Live
          </span>
        </div>

        {/* Countdown - bottom of image */}
        <div className="absolute bottom-0 inset-x-0 bg-background/90 backdrop-blur-sm px-4 py-3 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 font-heading text-sm tabular-nums tracking-wide">
              <div className="text-center">
                <span className="text-foreground font-medium">{countdown.hours}</span>
                <span className="ml-0.5 text-[9px] text-muted-foreground uppercase">h</span>
              </div>
              <span className="text-border">:</span>
              <div className="text-center">
                <span className="text-foreground font-medium">{countdown.minutes}</span>
                <span className="ml-0.5 text-[9px] text-muted-foreground uppercase">m</span>
              </div>
              <span className="text-border">:</span>
              <div className="text-center">
                <span className="text-foreground font-medium">{countdown.seconds}</span>
                <span className="ml-0.5 text-[9px] text-muted-foreground uppercase">s</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              <Gavel className="h-3 w-3" />
              {totalBids} bids
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {designer}
        </p>
        <h3 className="mt-1 text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
          {name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Current bid
          </span>
          <span className="text-sm font-medium text-foreground">
            {currentBid}
          </span>
        </div>
      </div>
    </Link>
  )
}
