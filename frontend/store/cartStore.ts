import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
    cartCount: number;
    setCartCount: (count: number) => void;
    incrementCartCount: (by?: number) => void;
    resetCartCount: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cartCount: 0,
            setCartCount: (count) => set({ cartCount: count }),
            incrementCartCount: (by = 1) => set((s) => ({ cartCount: s.cartCount + by })),
            resetCartCount: () => set({ cartCount: 0 }),
        }),
        { name: "cart-storage", partialize: (s) => ({ cartCount: s.cartCount }) }
    )
);
