import { apiClient } from "./client"

/**
 * Bid record matching the Bid.java record in bidding-service.
 */
export interface Bid {
  productId: string
  bidderId: string
  amount: number
}

/**
 * Places a new bid on a product via the simple bidding path.
 * Endpoint: POST /api/bidding/{productId} → BiddingController.placeBid()
 *
 * The bid is broadcast via a Reactor Sink to all SSE listeners.
 * NOTE: This path has no persistence — bids are in-memory only and
 * are lost when the bidding-service restarts.
 */
export async function placeBid(
  productId: string,
  amount: number,
  bidderId: string,
): Promise<void> {
  const bid: Bid = { productId, bidderId, amount }
  await apiClient.post(`/api/bidding/${productId}`, bid)
}
