"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  type Cart,
  type CartItem,
} from "@/APIs/cartAPIs";
import { createOrder } from "@/APIs/orderAPIs";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getItemCount(cart: Cart | null): number {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
}

function getProductId(item: CartItem): string {
  const p = item.productId;
  if (!p) return "";
  if (typeof p === "string") return p;
  return (p as { _id?: string; id?: string })._id ?? (p as { _id?: string; id?: string }).id ?? "";
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const setCartCount = useCartStore((s) => s.setCartCount);

  const loadCart = async () => {
    try {
      const data = await getCart();
      const c = data?.cart ?? null;
      setCart(c);
      setCartCount(getItemCount(c));
    } catch {
      setCart(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQty = async (productId: string, quantity: number) => {
    if (quantity < 1 || !productId) return;
    setUpdatingId(productId);
    try {
      const data = await updateCartItem(productId, quantity);
      setCart(data.cart ?? null);
      setCartCount(getItemCount(data.cart ?? null));
      toast.success("Cart updated");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e && (e as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(typeof msg === "string" ? msg : "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!productId) return;
    setUpdatingId(productId);
    try {
      const data = await removeFromCart(productId);
      setCart(data.cart ?? null);
      setCartCount(getItemCount(data.cart ?? null));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePlaceOrder = async () => {
    const address = deliveryAddress.trim();
    if (!address) {
      toast.error("Please enter delivery address");
      return;
    }
    if (!cart?._id || !cart.items?.length) {
      toast.error("Cart is empty");
      return;
    }
    setPlacing(true);
    try {
      await createOrder(cart._id, address);
      toast.success("Order placed successfully");
      setDeliveryAddress("");
      await loadCart();
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e && (e as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(typeof msg === "string" ? msg : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading cart…</p>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add items from the store to get started.</p>
          <Link
            href="/gym_buddy"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const items = cart.items as CartItem[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => {
              const product = item.productId;
              const productId = getProductId(item);
              const productObj = typeof product === "object" && product !== null ? product : null;
              const name = productObj && "name" in productObj ? (productObj as { name?: string }).name : "";
              const slug = productObj && "slug" in productObj ? (productObj as { slug?: string }).slug : "";
              const price = productObj && "price" in productObj ? Number((productObj as { price?: number }).price) : 0;
              const imageUrl = productObj && "imageUrl" in productObj ? (productObj as { imageUrl?: string[] }).imageUrl : undefined;
              const img = Array.isArray(imageUrl) && imageUrl[0] ? imageUrl[0] : "/placeholder-product.jpg";
              const isUpdating = updatingId === productId;
              return (
                <li key={productId} className="flex gap-4 p-4 sm:p-5">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={img}
                      alt={name || "Product"}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/gym_buddy/${slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {name}
                    </Link>
                    <p className="text-gray-600 mt-0.5">{formatPrice(price)} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(productId, Math.max(1, item.quantity - 1))}
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(productId, item.quantity + 1)}
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(productId)}
                        disabled={isUpdating}
                        className="ml-3 text-sm text-red-600 hover:underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
              <span>Total</span>
              <span>{formatPrice(cart.total_price ?? 0)}</span>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery address</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Street, city, state, PIN"
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="mt-4 w-full sm:w-auto sm:min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl"
            >
              {placing ? "Placing order…" : "Place order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
