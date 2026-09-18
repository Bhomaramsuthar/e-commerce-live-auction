import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react"

import { useSearchProducts } from "@/hooks/queries/useSearch"
import { ProductCard } from "@/components/cards/ProductCard"
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton"
import { ErrorState, getErrorCode } from "@/components/ui/ErrorState"
import { useDebounce } from "@/hooks/useDebounce"
import watchImg from "@/assets/products/watch.jpg"
import { cn } from "@/utils/cn"

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: d * 0.05, ease: [0.25, 1, 0.5, 1] as const },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Local state for immediate input feedback
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "")
  const debouncedQuery = useDebounce(inputValue, 400)

  // Derived state from URL params
  const page = parseInt(searchParams.get("page") || "0", 10)
  const size = 16
  const sort = searchParams.get("sort") || "_score"
  const direction = searchParams.get("direction") || "desc"
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined

  // Sync URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== (searchParams.get("q") || "")) {
      const params = new URLSearchParams(searchParams)
      if (debouncedQuery) {
        params.set("q", debouncedQuery)
      } else {
        params.delete("q")
      }
      params.set("page", "0") // reset page on new search
      setSearchParams(params, { replace: true })
    }
  }, [debouncedQuery, searchParams, setSearchParams])

  // Fetch search results via TanStack Query hook
  const { data, isLoading, isError, error, refetch, isFetching } = useSearchProducts({
    query: debouncedQuery,
    page,
    size,
    sort,
    direction,
    minPrice,
    maxPrice,
  })

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle sorting
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const params = new URLSearchParams(searchParams)
    if (val === "price_asc") {
      params.set("sort", "price")
      params.set("direction", "asc")
    } else if (val === "price_desc") {
      params.set("sort", "price")
      params.set("direction", "desc")
    } else {
      params.set("sort", "_score")
      params.set("direction", "desc")
    }
    params.set("page", "0")
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen pt-8 pb-24 md:pt-12">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        
        {/* Search Header */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative group">
            <label htmlFor="search-input" className="sr-only">Search</label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            </div>
            <input
              id="search-input"
              type="search"
              className="block w-full bg-muted/30 border-0 border-b-2 border-border/60 py-4 pl-12 pr-10 text-lg md:text-2xl font-medium placeholder:text-muted-foreground/50 focus:border-foreground focus:ring-0 transition-colors bg-transparent"
              placeholder="Search items..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            {inputValue && (
              <button
                onClick={() => setInputValue("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 flex flex-col gap-8">
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                </h3>
                
                <div className="space-y-6">
                  {/* Price Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Price Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full bg-card border border-border px-3 py-2 text-sm focus:border-foreground focus:outline-none transition-colors"
                        value={searchParams.get("minPrice") || ""}
                        onChange={(e) => {
                          const params = new URLSearchParams(searchParams)
                          if (e.target.value) params.set("minPrice", e.target.value)
                          else params.delete("minPrice")
                          params.set("page", "0")
                          setSearchParams(params)
                        }}
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full bg-card border border-border px-3 py-2 text-sm focus:border-foreground focus:outline-none transition-colors"
                        value={searchParams.get("maxPrice") || ""}
                        onChange={(e) => {
                          const params = new URLSearchParams(searchParams)
                          if (e.target.value) params.set("maxPrice", e.target.value)
                          else params.delete("maxPrice")
                          params.set("page", "0")
                          setSearchParams(params)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Results Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <p className="text-sm text-muted-foreground">
                {data ? (
                  <>Showing <strong className="text-foreground">{data.totalElements}</strong> results {debouncedQuery && <>for "<strong className="text-foreground">{debouncedQuery}</strong>"</>}</>
                ) : (
                  "Searching..."
                )}
              </p>
              
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  Sort by
                </label>
                <select
                  id="sort"
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                  value={sort === "price" ? `price_${direction}` : "relevance"}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="price_asc">Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className={cn("transition-opacity duration-200", isFetching && data ? "opacity-50" : "opacity-100")}>
              {isLoading && !data ? (
                <ProductGridSkeleton count={8} />
              ) : isError ? (
                <ErrorState
                  title="Unable to load results"
                  message="We're having trouble connecting to our search service. Please check your connection or try again."
                  code={getErrorCode(error)}
                  onRetry={() => refetch()}
                />
              ) : data?.items.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-border/60">
                  <Search className="h-10 w-10 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium">No results found</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    We couldn't find any items matching "{debouncedQuery}". Try checking your spelling or using less specific terms.
                  </p>
                  <button
                    onClick={() => {
                      setInputValue("")
                      setSearchParams(new URLSearchParams())
                    }}
                    className="mt-6 text-[12px] font-medium uppercase tracking-[0.1em] underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4 md:gap-x-5"
                  >
                    {data?.items.map((product, i) => (
                      <motion.div key={product.id} custom={i} variants={reveal}>
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          designer={product.dynamicAttributes?.designer || "Unknown Designer"}
                          price={formatPrice(product.price)}
                          image={product.dynamicAttributes?.image || watchImg}
                          category={product.dynamicAttributes?.category}
                          isNew={product.dynamicAttributes?.isNew === "true"}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {data && data.totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-8 border-t border-border/40 pt-8">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.1em] disabled:opacity-30 disabled:cursor-not-allowed hover:text-muted-foreground transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground font-medium">
                        Page {page + 1} of {data.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= data.totalPages - 1}
                        className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.1em] disabled:opacity-30 disabled:cursor-not-allowed hover:text-muted-foreground transition-colors"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
