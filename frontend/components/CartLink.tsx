"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { getCart } from "@/APIs/cartAPIs";

function getItemCount(cart: { items?: { quantity: number }[] } | null): number {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
}

export default function CartLink({ className = "" }: { className?: string }) {
  const { isAuthenticated } = useAuthStore();
  const { cartCount, setCartCount } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    getCart()
      .then((data) => {
        const cart = data?.cart ?? null;
        setCartCount(getItemCount(cart));
      })
      .catch(() => setCartCount(0));
  }, [isAuthenticated, setCartCount]);

  if (!isAuthenticated) return null;

  return (
    <Link
      href="/cart"
      className={`relative flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition ${className}`}
      aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
    >
      <ShoppingCart className="w-6 h-6" />
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-blue-600 text-white text-xs font-semibold rounded-full">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
