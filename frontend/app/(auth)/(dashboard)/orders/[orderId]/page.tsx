"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getOrderById } from "@/APIs/orderAPIs";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type OrderDetail = {
  _id: string;
  userId: string;
  cartId: {
    _id: string;
    items: {
      productId: { _id: string; name: string; slug: string; price: number; imageUrl?: string[] };
      quantity: number;
    }[];
    total_price?: number;
  };
  totalPrice: number;
  deliveryAddress: string;
  createdAt?: string;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    getOrderById(orderId)
      .then((data) => setOrder(data?.order ?? null))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Order not found.</p>
        <button
          onClick={() => router.push("/orders")}
          className="text-blue-600 font-medium hover:underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const items = order.cartId?.items ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/orders"
          className="text-blue-600 font-medium hover:underline mb-4 inline-block"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-gray-500 mb-6">{formatDate(order.createdAt)}</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-1">Delivery address</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{order.deliveryAddress}</p>
          </div>
          <ul className="divide-y divide-gray-100">
            {items.map((item: { productId: { _id: string; name: string; slug: string; price: number; imageUrl?: string[] }; quantity: number }) => {
              const product = item.productId;
              const img = Array.isArray(product?.imageUrl) && product.imageUrl[0] ? product.imageUrl[0] : "/placeholder-product.jpg";
              return (
                <li key={product._id} className="flex gap-4 p-4 sm:p-5">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={img}
                      alt={product?.name ?? "Product"}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/gym_buddy/${product?.slug ?? ""}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {product?.name}
                    </Link>
                    <p className="text-gray-500 text-sm">
                      {formatPrice(product?.price ?? 0)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right font-semibold text-gray-900">
                    {formatPrice((product?.price ?? 0) * item.quantity)}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
