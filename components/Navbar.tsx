"use client";

import { Menu, Search, ShoppingBag, UserCircle } from "lucide-react";
import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import MobileMenuDrawer from "./MobileMenuDrawer";

const navLinks = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "All Products", href: "/products", icon: "🛍️" },
  { label: "Men's", href: "/products?category=Men", icon: "👔" },
  { label: "Women's", href: "/products?category=Women", icon: "👗" },
  { label: "Kids", href: "/products?category=Kids", icon: "🧒" },
  { label: "Sports", href: "/products?category=Sports", icon: "⚽" },
];

interface NavbarProps {
  /** User object from server-side auth — no client-side fetch needed. */
  user: any | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const { cartCount } = useCart();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 h-16">

        {/* ── MOBILE NAV ── */}
        <div className="relative flex items-center justify-between px-3 py-2 md:hidden h-16">
          {/* LEFT - Menu + Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <Link href="/" className="flex items-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black shrink-0 overflow-hidden">
                <Image src="/logo.png" alt="R" width={32} height={32} className="h-8 w-8 object-cover" />
              </div>
              <span className="leading-none">
                <span className="block text-[13px] font-extrabold text-black tracking-tight">RafSan</span>
                <span className="block text-[9px] text-gray-400 tracking-[0.15em] uppercase">Clothing</span>
              </span>
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <Link href="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile search bar */}
          {showMobileSearch && (
            <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow-md z-50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery("");
                      setShowMobileSearch(false);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm bg-gray-50"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery("");
                      setShowMobileSearch(false);
                    }
                  }}
                  className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium"
                >
                  খুঁজুন
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── DESKTOP NAV ── */}
        <div className="hidden md:flex container mx-auto px-6 h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black shrink-0">
              <Image src="/logo.png" alt="R" width={32} height={32} className="h-8 w-8 object-cover rounded-lg" />
            </div>
            <span className="leading-none">
              <span className="block text-base font-extrabold text-black tracking-tight">RafSan</span>
              <span className="block text-[9px] text-gray-400 tracking-[0.15em] uppercase">Clothing</span>
            </span>
          </Link>
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-gray-700 hover:text-black font-medium transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </form>
            <Link href={user ? "/account/dashboard" : "/login"} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <UserCircle className="w-5 h-5 text-gray-700" />
            </Link>
            <Link href="/cart" className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER (slide from left) ── */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
      />
    </>
  );
}
