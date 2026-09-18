import { apiClient } from "./client"

/**
 * Matches OrderLineItems.java in order-service.
 */
export interface OrderLineItem {
  id?: number
  productId: string
  productName: string
  price: number
  quantity: number
}

/**
 * Matches Order.java in order-service.
 */
export interface Order {
  id: number
  orderNumber: string
  orderLineItemsList: OrderLineItem[]
}

/**
 * Request body for placing a new order.
 * The backend auto-generates `orderNumber` (UUID) and validates each
 * product exists via a Feign call to the Product Service.
 */
export interface CreateOrderRequest {
  orderLineItemsList: Omit<OrderLineItem, "id">[]
}

/**
 * Places a new order.
 * Endpoint: POST /api/order → OrderController.placeOrder()
 * @returns Success message string from the backend.
 */
export async function placeOrder(order: CreateOrderRequest): Promise<string> {
  const { data } = await apiClient.post<string>("/api/order", order)
  return data
}

/**
 * Gets all orders.
 * Endpoint: GET /api/order → OrderController.getAllOrders()
 */
export async function getOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>("/api/order")
  return data
}

/**
 * Gets a single order by its numeric ID.
 * Endpoint: GET /api/order/{id} → OrderController.getOrderById()
 */
export async function getOrderById(id: number): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/api/order/${id}`)
  return data
}
