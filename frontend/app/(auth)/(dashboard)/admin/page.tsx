"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dumbbell, Package } from "lucide-react";
import { getAdminOrders, updateOrderStatus, type OrderStatus } from "@/APIs/orderAPIs";
import { toast } from "sonner";

type AdminOrder = {
  _id: string;
  userId: { _id: string; fullName?: string; email?: string } | string;
  cartId: unknown;
  totalPrice: number;
  deliveryAddress: string;
  status?: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
};

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
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_OPTIONS: OrderStatus[] = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data?.orders ?? []);
    } catch {
      setOrders([]);
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const actions = [
    {
      name: "Create Workout",
      href: "/admin/create-workout",
      description: "Add a new workout or exercise to the library.",
      icon: Dumbbell,
    },
    {
      name: "Create Product",
      href: "/admin/create-product",
      description: "Add a new supplement or product to the store.",
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin</h1>
        <p className="text-gray-600 mb-8">Manage workouts, products, and orders.</p>

        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {item.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </Link>
            );
          })}
        </div>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order records</h2>
          {ordersLoading ? (
            <p className="text-gray-500 py-8">Loading orders…</p>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              No orders yet.
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const user = typeof order.userId === "object" && order.userId !== null
                        ? order.userId
                        : { fullName: "—", email: "" };
                      const customerName = (user as { fullName?: string }).fullName ?? "—";
                      const customerEmail = (user as { email?: string }).email ?? "";
                      const status = order.status ?? "placed";
                      const isUpdating = updatingId === order._id;
                      return (
                        <tr key={order._id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-700">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <span className="block">{customerName}</span>
                            {customerEmail && (
                              <span className="block text-gray-500 text-xs">{customerEmail}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {formatPrice(order.totalPrice)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                            {order.deliveryAddress}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value as OrderStatus)
                              }
                              disabled={isUpdating}
                              className="block w-full min-w-[120px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
