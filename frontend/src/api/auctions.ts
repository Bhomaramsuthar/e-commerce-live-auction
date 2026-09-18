import { apiClient } from "./client"

export type AuctionStatus = "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED"

export interface AuctionReadModel {
  auctionId: string
  productId: string
  sellerId: string
  startingPrice: number
  currentHighestBid: number
  highestBidderId: string | null
  minimumBidIncrement: number
  startTime: string
  endTime: string
  status: AuctionStatus
  winnerId: string | null
  finalPrice: number | null
}

export interface CreateAuctionRequest {
  productId: string
  sellerId: string
  startingPrice: number
  minimumBidIncrement: number
  startTime: string
  endTime: string
}

export interface PlaceBidRequest {
  bidderId: string
  amount: number
}

export interface Bid {
  auctionId: string
  bidderId: string
  amount: number
}

export async function getAuctions(): Promise<AuctionReadModel[]> {
  const { data } = await apiClient.get<AuctionReadModel[]>("/api/auctions")
  return data
}

export async function getLiveAuctions(): Promise<AuctionReadModel[]> {
  const { data } = await apiClient.get<AuctionReadModel[]>("/api/auctions/live")
  return data
}

export async function getAuction(auctionId: string): Promise<AuctionReadModel> {
  const { data } = await apiClient.get<AuctionReadModel>(`/api/auctions/${auctionId}`)
  return data
}

export async function createAuction(request: CreateAuctionRequest): Promise<string> {
  const { data } = await apiClient.post<string>("/api/auctions", request)
  return data
}

export async function startAuction(auctionId: string): Promise<string> {
  const { data } = await apiClient.post<string>(`/api/auctions/${auctionId}/start`)
  return data
}

export async function endAuction(auctionId: string): Promise<string> {
  const { data } = await apiClient.post<string>(`/api/auctions/${auctionId}/end`)
  return data
}

export async function placeBid(auctionId: string, request: PlaceBidRequest): Promise<string> {
  const { data } = await apiClient.post<string>(`/api/auctions/${auctionId}/bids`, request)
  return data
}
