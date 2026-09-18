import { apiClient } from "./client"

/**
 * ProductDocument matching the Elasticsearch ProductDocument.java model.
 */
export interface ProductDocument {
  id: string
  name: string
  description: string
  price: number
  dynamicAttributes?: Record<string, string>
}

/**
 * Paginated search response matching ProductSearchResponse.java record.
 */
export interface ProductSearchResponse {
  items: ProductDocument[]
  totalElements: number
  page: number
  size: number
  totalPages: number
}

/**
 * Query parameters accepted by the search endpoint.
 */
export interface SearchParams {
  query?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  sort?: string
  direction?: string
}

/**
 * Full-text search with filters via Elasticsearch.
 * Endpoint: GET /api/search/products → SearchController.searchProducts()
 */
export async function searchProducts(
  params: SearchParams,
): Promise<ProductSearchResponse> {
  const { data } = await apiClient.get<ProductSearchResponse>(
    "/api/search/products",
    { params },
  )
  return data
}
