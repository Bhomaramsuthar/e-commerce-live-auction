import { apiClient } from "./client"

/**
 * Product interface matching the MongoDB Product entity.
 * `price` arrives as a JSON number (serialized BigDecimal).
 */
export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  dynamicAttributes?: Record<string, string>
}

/** Body for POST /api/product */
export interface CreateProductRequest {
  sku: string
  name: string
  description: string
  price: number
  dynamicAttributes?: Record<string, string>
}

/** Body for PUT /api/product/{id} */
export interface UpdateProductRequest {
  sku: string
  name: string
  description: string
  price: number
  dynamicAttributes?: Record<string, string>
}

/**
 * Fetches all products from the Product Service via the API Gateway.
 * Endpoint: GET /api/product → ProductController.getAllProducts()
 */
export async function getProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>("/api/product")
  return data
}

/**
 * Fetches a single product by ID (Redis-cached on backend).
 * Endpoint: GET /api/product/{id} → ProductController.getProductById()
 */
export async function getProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/api/product/${id}`)
  return data
}

/**
 * Creates a new product.
 * Endpoint: POST /api/product → ProductController.createProduct()
 * Publishes a PRODUCT_CREATED event to Kafka.
 */
export async function createProduct(product: CreateProductRequest): Promise<Product> {
  const { data } = await apiClient.post<Product>("/api/product", product)
  return data
}

/**
 * Fully replaces an existing product.
 * Endpoint: PUT /api/product/{id} → ProductController.updateProduct()
 */
export async function updateProduct(id: string, product: UpdateProductRequest): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/api/product/${id}`, product)
  return data
}

/**
 * Partially updates an existing product (only non-null fields are applied).
 * Endpoint: PATCH /api/product/{id} → ProductController.patchProduct()
 */
export async function patchProduct(id: string, product: Partial<UpdateProductRequest>): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/api/product/${id}`, product)
  return data
}

/**
 * Deletes a product by ID.
 * Endpoint: DELETE /api/product/{id} → ProductController.deleteProduct()
 * Publishes a PRODUCT_DELETED event to Kafka.
 */
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/api/product/${id}`)
}
