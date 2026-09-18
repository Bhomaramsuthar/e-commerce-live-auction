import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { searchProducts } from "@/api/search"
import type { SearchParams } from "@/api/search"

/** Stable query keys for search queries. */
export const searchKeys = {
  all: ["search"] as const,
  products: (params: SearchParams) => ["search", "products", params] as const,
}

/**
 * Full-text product search via Elasticsearch.
 * Uses `keepPreviousData` to prevent layout flash while paginating.
 */
export function useSearchProducts(params: SearchParams) {
  return useQuery({
    queryKey: searchKeys.products(params),
    queryFn: () => searchProducts(params),
    placeholderData: keepPreviousData,
  })
}
