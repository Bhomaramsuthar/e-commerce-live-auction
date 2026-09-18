import { cn } from "@/utils/cn"

/** Base animated skeleton bone. */
function Bone({ className }: { className?: string }) {
  return <div className={cn("bg-muted/40 animate-pulse", className)} />
}

/** Matches the ProductCard layout: 3:4 image + 3 text lines. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Bone className="aspect-[3/4]" />
      <Bone className="h-3 w-1/3" />
      <Bone className="h-4 w-2/3" />
      <Bone className="h-3 w-1/4" />
    </div>
  )
}

/** Grid of ProductCardSkeletons — used in HomePage and SearchPage. */
export function ProductGridSkeleton({ count = 4, columns }: { count?: number; columns?: string }) {
  return (
    <div className={columns || "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4 md:gap-x-5"}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Skeleton for product/auction detail pages. */
export function DetailPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      <div className="lg:col-span-7">
        <Bone className="aspect-[4/5]" />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-4">
        <Bone className="h-3 w-1/4" />
        <Bone className="h-8 w-3/4" />
        <div className="flex flex-col gap-3 mt-4">
          <Bone className="h-48 w-full" />
          <Bone className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton for order history rows. */
export function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border border-border/50 p-4">
      <Bone className="h-12 w-12 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Bone className="h-4 w-1/3" />
        <Bone className="h-3 w-1/2" />
      </div>
      <Bone className="h-5 w-20 shrink-0" />
    </div>
  )
}

/** Generic inline skeleton line — use for small loading indicators. */
export function InlineSkeleton({ className }: { className?: string }) {
  return <Bone className={cn("h-4 w-24", className)} />
}
