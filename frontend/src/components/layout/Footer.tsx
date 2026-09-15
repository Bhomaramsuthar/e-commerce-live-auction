import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

const columns = [
  {
    title: "Shop",
    links: [
      { name: "New Arrivals", path: "/new-arrivals" },
      { name: "Auctions", path: "/auctions" },
      { name: "Designers", path: "/designers" },
    ],
  },
  {
    title: "Info",
    links: [
      { name: "About", path: "/about" },
      { name: "FAQ", path: "/faq" },
      { name: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms", path: "/terms" },
      { name: "Privacy", path: "/privacy" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-8 py-14 md:grid-cols-12 md:gap-6 md:py-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5 lg:col-span-4">
            <Link to="/">
              <span className="font-heading text-base font-bold tracking-[-0.04em]">
                BIDCRAFT
              </span>
            </Link>
            <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-muted-foreground">
              Curated luxury and exclusive live auctions.
            </p>

            {/* Newsletter inline */}
            <div className="mt-6 flex max-w-[300px]">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 border border-border bg-transparent px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
              <button className="border border-l-0 border-border bg-foreground px-3 py-2 text-[12px] text-background transition-colors hover:bg-foreground/90 flex items-center gap-1">
                Subscribe
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-border/30 py-5 text-[11px] text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Bidcraft</span>
          <span className="hidden sm:inline">All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}
