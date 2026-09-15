import { useState, useEffect } from "react"

/**
 * Tracks the vertical scroll position of the window.
 * Returns the current `scrollY` value.
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return scrollY
}
