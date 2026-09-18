import { useQuery, useMutation } from "@tanstack/react-query"
import { getAuctions, getLiveAuctions, getAuction, createAuction, startAuction, endAuction } from "@/api/auctions"
import type { CreateAuctionRequest } from "@/api/auctions"

export const auctionKeys = {
  all: ["auctions"] as const,
  live: ["auctions", "live"] as const,
  detail: (id: string) => ["auction", id] as const,
}

export function useAuctions() {
  return useQuery({
    queryKey: auctionKeys.all,
    queryFn: getAuctions,
  })
}

export function useLiveAuctions() {
  return useQuery({
    queryKey: auctionKeys.live,
    queryFn: getLiveAuctions,
  })
}

export function useAuction(auctionId: string) {
  return useQuery({
    queryKey: auctionKeys.detail(auctionId),
    queryFn: () => getAuction(auctionId),
    enabled: !!auctionId,
  })
}

export function useCreateAuction() {
  return useMutation({
    mutationFn: (request: CreateAuctionRequest) => createAuction(request),
  })
}

export function useStartAuction() {
  return useMutation({
    mutationFn: (auctionId: string) => startAuction(auctionId),
  })
}

export function useEndAuction() {
  return useMutation({
    mutationFn: (auctionId: string) => endAuction(auctionId),
  })
}
