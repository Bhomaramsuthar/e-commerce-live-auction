import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrders, getOrderById, placeOrder } from "@/api/orders"
import type { CreateOrderRequest } from "@/api/orders"

/** Stable query keys for order queries. */
export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: number) => ["order", id] as const,
}

/** Fetches all orders from the Order Service. */
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: getOrders,
  })
}

/** Fetches a single order by numeric ID. */
export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  })
}

/**
 * Places a new order.
 * On success, invalidates the order list cache so the orders page
 * picks up the new order immediately.
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (order: CreateOrderRequest) => placeOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}
