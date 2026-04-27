"use client"

import { Search } from "lucide-react";
import Profile from "./profile";
import Link from 'next/link';
import SearchBar from "./SearchBar";
import { usePathname } from 'next/navigation';
import { useAuthStore } from "@/store/authStore";
import CartLink from "./CartLink";

export default function Navbar() {
    const { user } = useAuthStore();
    const pathname = usePathname();
    
    const navlinks = [
        { name: "Home", href: "/" },
        { name: "Supplements", href: "/gym_buddy" },
        { name: "Cart", href: "/cart" },
        { name: "Orders", href: "/orders" },
        { name: "Workouts", href: "/workouts" },
        ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin" }] : []),
    ];
    
    return (
        <nav className="hidden sm:block sticky top-4 w-[95%] max-w-7xl mx-auto z-50">
            <div className="relative backdrop-blur-sm bg-gray-200 border border-white/20 shadow-lg rounded-2xl p-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img 
                            src="/logo.png" 
                            alt="FitFlex Logo" 
                            className="h-15 w-auto hover:scale-105 transition-transform duration-300" 
                        />
                    </div>

                    <SearchBar />

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-1">
                        {navlinks.map((link) => {
                            const isActive = pathname === link.href;
                            
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-5 py-2.5 font-medium rounded-xl transition-all duration-300 group ${
                                        isActive 
                                            ? 'text-blue-600' 
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    
                                    {/* Bottom line effect - expands from center */}
                                    <span 
                                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300 ${
                                            isActive 
                                                ? 'w-1/2' 
                                                : 'w-0 group-hover:w-1/2'
                                        }`} 
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Cart & Profile */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                        <CartLink />
                        <Profile />
                    </div>
                </div>

                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-blue-400/30 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-blue-400/30 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-blue-400/30 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-blue-400/30 rounded-br-2xl" />
            </div>
        </nav>
    );
}