"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Profile from "./profile";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Sidebar() {
  const { user } = useAuthStore();
  const cartCount = useCartStore((s) => s.cartCount);
  const [isOpen, setIsOpen] = useState(false);

  const navlinks = [
    { name: "Home", href: "/" },
    { name: "Cart", href: "/cart" },
    { name: "Orders", href: "/orders" },
    { name: "Workouts", href: "/workouts" },
    { name: "Profile", href: "/profile" },
    ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  return (
    <>
      {/* Menu Button (Mobile Only) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-gray-800"
      >
        <Menu size={28} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-lg z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <img src="/logo.png" alt="FitFlex Logo" className="h-10 w-28" />
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <SearchBar />

        {/* Links */}
        <div className="flex flex-col p-4 space-y-4">
          {navlinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-800 text-lg hover:text-blue-600 transition flex items-center justify-between"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
              {link.href === "/cart" && cartCount > 0 && (
                <span className="text-sm bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Profile at Bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t">
          <Profile />
        </div>
      </div>
    </>
  );
}