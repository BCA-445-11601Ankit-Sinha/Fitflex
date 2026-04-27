import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cartStore";

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: "admin" | "user";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  hasHydrated: boolean;

  setAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logIn: (user: User, accessToken: string) => void;
  logOut: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      hasHydrated: false,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setUser: (user) => set({ user }),

      setAccessToken: (token) => set({ accessToken: token }),

      logIn: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      logOut: () => {
        useCartStore.getState().resetCartCount();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage", // localStorage key

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);