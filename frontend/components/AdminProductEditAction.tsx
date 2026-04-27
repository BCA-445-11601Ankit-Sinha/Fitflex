"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

interface AdminProductEditActionProps {
  productId: string;
  slug: string;
}

export default function AdminProductEditAction({ productId, slug }: AdminProductEditActionProps) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated || user?.role !== "admin") {
    return null;
  }

  const href = `/admin/create-product?edit=true&id=${encodeURIComponent(productId)}&slug=${encodeURIComponent(slug)}`;

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
    >
      Edit Product
    </Link>
  );
}
