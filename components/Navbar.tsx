"use client";

import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Men's", href: "/category/men" },
  { label: "Women's", href: "/category/women" },
  { label: "Kids", href: "/category/kids" },
  { label: "Sports", href: "/category/sports" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { cartCount } = useCart();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear input after search
    }
  };

  const handleMobileSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear input after search
    }
  };

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 h-16">
      {/* Mobile Navbar (visible on small screens) */}
      <div className="relative flex items-center justify-between px-4 py-3 md:hidden">
        {/* LEFT - Menu button */}
        <div className="flex-1 flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* CENTER - Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="font-bold text-lg text-center">
            Rafsan Clothing
          </Link>
        </div>

        {/* RIGHT - Icons */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {/* Cart icon */}
          <Link
            href="/cart"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Search icon - moved to where user icon was */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Search"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        {/* Mobile search input */}
        {showMobileSearch && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow-md z-50">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (searchQuery.trim()) {
                      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery("");
                      setShowMobileSearch(false);
                    }
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-black"
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
                className="px-4 py-2 bg-black text-white rounded-r-full hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navbar (hidden on mobile) */}
      <div className="hidden md:flex container mx-auto px-6 h-full items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight cursor-pointer">
            Rafsan Clothing
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-700 hover:text-black font-medium transition-colors"
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right: Search bar + Icons */}
        <div className="flex items-center gap-6">
          {/* Search bar - hidden on mobile, shown on lg and up */}
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </form>

          {/* Search icon for md to lg screens (tablet) - shows icon only */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Search"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>

          {/* Profile icon */}
          <Link
            href={user ? "/account/dashboard" : "/login"}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-gray-700" />
          </Link>

          {/* Cart icon */}
          <Link
            href="/cart"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu dropdown (only for mobile) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-2 text-gray-700 hover:text-black font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}