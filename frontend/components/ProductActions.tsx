"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/APIs/cartAPIs";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductActionsProps {
  productId: string;
  buyNow?: boolean; // if true, "Buy Now" = add to cart and redirect to cart
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"add" | "buy" | null>(null);
  const incrementCartCount = useCartStore((s) => s.incrementCartCount);

  const handleAddToCart = async () => {
    setLoading("add");
    try {
      await addToCart(productId, 1);
      incrementCartCount(1);
      toast.success("Added to cart");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "response" in e && typeof (e as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
        ? (e as { response: { data: { message: string } } }).response.data.message
        : "Failed to add to cart";
      toast.error(msg);
    } finally {
      setLoading(null);
    }
  };

  const handleBuyNow = async () => {
    setLoading("buy");
    try {
      await addToCart(productId, 1);
      incrementCartCount(1);
      toast.success("Added to cart");
      router.push("/cart");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "response" in e && typeof (e as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
        ? (e as { response: { data: { message: string } } }).response.data.message
        : "Failed to add to cart";
      toast.error(msg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-6">
      <button
        onClick={handleAddToCart}
        disabled={!!loading}
        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        {loading === "add" ? "Adding…" : "Add to Cart"}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={!!loading}
        className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 3h12m-4.5 0h3m-3 0h-3m10.5-11.25h-16.5a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h16.5a1.5 1.5 0 001.5-1.5v-12a1.5 1.5 0 00-1.5-1.5z"
          />
        </svg>
        {loading === "buy" ? "Adding…" : "Buy Now"}
      </button>
    </div>
  );
}
