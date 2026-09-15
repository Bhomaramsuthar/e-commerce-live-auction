import { create } from "zustand"

interface UIState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isCartOpen: boolean
  toggleMobileMenu: () => void
  toggleSearch: () => void
  toggleCart: () => void
  closeAll: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCartOpen: false,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  toggleCart: () =>
    set((state) => ({ isCartOpen: !state.isCartOpen })),

  closeAll: () =>
    set({ isMobileMenuOpen: false, isSearchOpen: false, isCartOpen: false }),
}))
