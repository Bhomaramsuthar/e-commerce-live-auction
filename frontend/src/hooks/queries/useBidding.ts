import { useMutation } from "@tanstack/react-query"
import { placeBid } from "@/api/auctions"
import type { PlaceBidRequest } from "@/api/auctions"

export { useAuctionStream } from "@/hooks/useAuctionStream"

interface PlaceBidParams {
  auctionId: string
  request: PlaceBidRequest
}

export function usePlaceBid() {
  return useMutation({
    mutationFn: ({ auctionId, request }: PlaceBidParams) =>
      placeBid(auctionId, request),
  })
}
