"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const publicRoutes = ["/login", "/signup", "/forgot-password"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, accessToken, hasHydrated, logOut } =
    useAuthStore();

  const isPublicRoute = useMemo(() => {
    return publicRoutes.includes(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated && !accessToken) {
      logOut();
      return;
    }

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace("/");
    }
  }, [
    hasHydrated,
    isAuthenticated,
    accessToken,
    isPublicRoute,
    router,
    logOut,
  ]);

  if (!hasHydrated) return null;
  if (!isAuthenticated && !isPublicRoute) return null;

  return <>{children}</>;
}