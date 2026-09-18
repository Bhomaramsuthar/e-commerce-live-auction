import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Truck, BadgeCheck, Headphones, Gavel } from "lucide-react"

import { useProducts } from "@/hooks/queries/useProducts"
import { ProductCard } from "@/components/cards/ProductCard"
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton"
import { ErrorState, getErrorCode } from "@/components/ui/ErrorState"
import { EmptyState } from "@/components/ui/EmptyState"

import heroImage from "@/assets/hero.jpg"
import watchImg from "@/assets/products/watch.jpg"
import ringImg from "@/assets/products/ring.jpg"
import shoesImg from "@/assets/products/shoes.jpg"

/* ── Animation variants ── */
const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d * 0.1, ease: [0.25, 1, 0.5, 1] as const },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* Removed mock liveAuctions — will connect to a real backend endpoint */

/* Removed mock newArrivals */

const collections = [
  {
    title: "Fine Jewelry",
    subtitle: "Rings, necklaces & bracelets",
    image: ringImg,
    path: "/category/jewelry",
  },
  {
    title: "Timepieces",
    subtitle: "Automatic & mechanical watches",
    image: watchImg,
    path: "/category/watches",
  },
  {
    title: "Leather Goods",
    subtitle: "Bags, shoes & accessories",
    image: shoesImg,
    path: "/category/leather",
  },
]

const values = [
  {
    icon: BadgeCheck,
    title: "Authenticated",
    text: "Every item verified by independent experts before listing.",
  },
  {
    icon: Shield,
    title: "Buyer Protection",
    text: "Full coverage on every purchase. No exceptions.",
  },
  {
    icon: Truck,
    title: "White-Glove Delivery",
    text: "Insured shipping with signature confirmation worldwide.",
  },
  {
    icon: Headphones,
    title: "Concierge Support",
    text: "Dedicated specialists available for pre and post-sale.",
  },
]

export function HomePage() {
  const { data: products, isLoading, isError, error, refetch } = useProducts()

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — editorial split layout
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col lg:flex-row">
        {/* Text side */}
        <div className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-12 pt-32 md:px-8 md:pb-20 md:pt-40 lg:justify-center lg:px-16 lg:py-0 xl:px-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-lg"
          >
            <motion.p
              custom={0}
              variants={reveal}
              className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent"
            >
              Autumn Auction 2025
            </motion.p>

            <motion.h1
              custom={1}
              variants={reveal}
              className="mt-5 text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            >
              The Art of
              <br />
              Collecting
            </motion.h1>

            <motion.p
              custom={2}
              variants={reveal}
              className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-foreground"
            >
              Curated luxury from private estates and the world's most
              distinguished ateliers — bid in real time.
            </motion.p>

            <motion.div custom={3} variants={reveal} className="mt-8 flex items-center gap-4">
              <Link
                to="/auctions"
                className="group inline-flex items-center gap-2 bg-foreground px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-background transition-colors hover:bg-foreground/85"
              >
                View Auctions
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-2 border border-border px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground/40"
              >
                Shop New
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll hint - mobile only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-auto pt-10 lg:hidden"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Scroll to explore
            </span>
          </motion.div>
        </div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 lg:relative lg:flex-1"
        >
          <img
            src={heroImage}
            alt="Curated luxury collection"
            className="h-full w-full object-cover"
          />
          {/* Mobile overlay so text is readable */}
          <div className="absolute inset-0 bg-background/70 lg:hidden" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          LIVE AUCTIONS
         ═══════════════════════════════════════════════ */}
      <section className="border-t border-border/40 py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
            className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12"
          >
            <div>
              <motion.p
                custom={0}
                variants={reveal}
                className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent"
              >
                Bidding Now
              </motion.p>
              <motion.h2
                custom={1}
                variants={reveal}
                className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
              >
                Live Auctions
              </motion.h2>
            </div>
            <motion.div custom={2} variants={reveal}>
              <Link
                to="/auctions"
                className="group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Cards — Coming Soon */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/40"
          >
            <motion.div custom={0} variants={reveal}>
              <Gavel className="h-8 w-8 text-muted-foreground/30 mb-4 mx-auto" />
              <h3 className="text-lg font-medium">Auctions Coming Soon</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Live auction listings will appear here once available.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEW ARRIVALS
         ═══════════════════════════════════════════════ */}
      <section className="border-t border-border/40 py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
            className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12"
          >
            <div>
              <motion.p
                custom={0}
                variants={reveal}
                className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent"
              >
                Just Added
              </motion.p>
              <motion.h2
                custom={1}
                variants={reveal}
                className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
              >
                New Arrivals
              </motion.h2>
            </div>
            <motion.div custom={2} variants={reveal}>
              <Link
                to="/new-arrivals"
                className="group inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-5"
          >
            {isLoading && (
              <div className="col-span-2 md:col-span-4">
                <ProductGridSkeleton count={4} columns="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-5" />
              </div>
            )}

            {isError && (
              <div className="col-span-2 md:col-span-4">
                <ErrorState
                  title="Failed to load new arrivals"
                  message="We're having trouble connecting to the product service."
                  code={getErrorCode(error)}
                  onRetry={() => refetch()}
                />
              </div>
            )}

            {!isLoading && !isError && products?.length === 0 && (
              <div className="col-span-2 md:col-span-4">
                <EmptyState title="No products yet" message="Check back soon for new arrivals." />
              </div>
            )}

            {!isLoading && !isError && products?.slice(0, 4).map((product, i) => (
              <motion.div key={product.id} custom={i} variants={reveal}>
                <ProductCard 
                  id={product.id}
                  name={product.name}
                  designer={product.dynamicAttributes?.designer || "Unknown Designer"}
                  price={formatPrice(product.price)}
                  image={product.dynamicAttributes?.image || watchImg}
                  category={product.dynamicAttributes?.category}
                  isNew={product.dynamicAttributes?.isNew === "true" || true}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          EDITORIAL COLLECTIONS — asymmetric grid
         ═══════════════════════════════════════════════ */}
      <section className="border-t border-border/40 py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="mb-10 md:mb-12"
          >
            <motion.p
              custom={0}
              variants={reveal}
              className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent"
            >
              Collections
            </motion.p>
            <motion.h2
              custom={1}
              variants={reveal}
              className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
            >
              Shop by Category
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-4"
          >
            {/* Large feature card */}
            <motion.div custom={0} variants={reveal} className="md:col-span-7">
              <Link to={collections[0].path} className="group relative block aspect-[4/5] md:aspect-auto md:h-full overflow-hidden bg-card">
                <img
                  src={collections[0].image}
                  alt={collections[0].title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-1.5">
                    {collections[0].subtitle}
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">
                    {collections[0].title}
                  </h3>
                </div>
              </Link>
            </motion.div>

            {/* Stacked right column */}
            <div className="flex flex-col gap-4 md:col-span-5">
              {collections.slice(1).map((col, i) => (
                <motion.div key={col.title} custom={i + 1} variants={reveal} className="flex-1">
                  <Link to={col.path} className="group relative block h-full min-h-[220px] overflow-hidden bg-card">
                    <img
                      src={col.image}
                      alt={col.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />
                    <div className="absolute bottom-0 left-0 p-5 md:p-6">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-1">
                        {col.subtitle}
                      </p>
                      <h3 className="font-heading text-xl font-bold text-white">
                        {col.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BRAND VALUES
         ═══════════════════════════════════════════════ */}
      <section className="border-t border-border/40 py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border/40"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                variants={reveal}
                className="lg:px-8 first:lg:pl-0 last:lg:pr-0"
              >
                <v.icon className="h-5 w-5 text-muted-foreground mb-4" strokeWidth={1.5} />
                <h3 className="text-[13px] font-medium uppercase tracking-[0.08em] text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
