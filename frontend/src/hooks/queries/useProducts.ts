import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products"
import type { CreateProductRequest, UpdateProductRequest } from "@/api/products"

/** Stable query keys for product queries — use for cache invalidation. */
export const productKeys = {
  all: ["products"] as const,
  detail: (id: string) => ["product", id] as const,
}

/**
 * Fetches all products from the Product Service.
 * Data comes from MongoDB via the API Gateway.
 */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
  })
}

/**
 * Fetches a single product by ID.
 * Backed by Redis cache on the backend.
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  })
}

/** Creates a new product and invalidates the product list cache. */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (product: CreateProductRequest) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

/** Fully updates an existing product and invalidates caches. */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: UpdateProductRequest }) =>
      updateProduct(id, product),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
    },
  })
}

/** Deletes a product and invalidates the product list cache. */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
