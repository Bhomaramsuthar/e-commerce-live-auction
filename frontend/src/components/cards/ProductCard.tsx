import { Link } from "react-router-dom"
import { motion } from "framer-motion"

interface ProductCardProps {
  id: string
  name: string
  designer: string
  price: string
  image: string
  category?: string
  isNew?: boolean
}

export function ProductCard({
  id,
  name,
  designer,
  price,
  image,
  category,
  isNew,
}: ProductCardProps) {
  return (
    <Link to={`/product/${id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        <motion.img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Badges */}
        {(isNew || category) && (
          <div className="absolute top-0 left-0 flex gap-2 p-4">
            {isNew && (
              <span className="bg-foreground text-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest">
                New
              </span>
            )}
            {category && (
              <span className="border border-border/60 bg-background/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                {category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-4 pb-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {designer}
        </p>
        <h3 className="mt-1 text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
          {name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{price}</p>
      </div>
    </Link>
  )
}
