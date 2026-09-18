import { useState, useEffect } from "react"
import type { Bid } from "@/api/auctions"

type ConnectionStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR"

export function useAuctionStream(auctionId: string) {
  const [bids, setBids] = useState<Bid[]>([])
  const [status, setStatus] = useState<ConnectionStatus>("CONNECTING")

  useEffect(() => {
    if (!auctionId) return

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
    const eventSource = new EventSource(`${baseUrl}/api/auctions/${auctionId}/bids/stream`)

    eventSource.onopen = () => {
      setStatus("CONNECTED")
    }

    eventSource.onmessage = (event) => {
      try {
        const newBid: Bid = JSON.parse(event.data)
        setBids((prev) => [newBid, ...prev])
      } catch (error) {
        console.error("Failed to parse bid event:", error)
      }
    }

    eventSource.onerror = () => {
      setStatus(eventSource.readyState === EventSource.CONNECTING ? "CONNECTING" : "ERROR")
    }

    return () => {
      eventSource.close()
      setStatus("DISCONNECTED")
    }
  }, [auctionId])

  return { bids, status }
}
