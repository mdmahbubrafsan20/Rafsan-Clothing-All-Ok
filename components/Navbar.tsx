"use client";

import { Menu, Search, ShoppingBag, X, UserCircle } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "All Products", href: "/products", icon: "🛍️" },
  { label: "Men's", href: "/products?category=Men", icon: "👔" },
  { label: "Women's", href: "/products?category=Women", icon: "👗" },
  { label: "Kids", href: "/products?category=Kids", icon: "🧒" },
  { label: "Sports", href: "/products?category=Sports", icon: "⚽" },
];

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Return Policy", href: "/returns" },
  { label: "FAQs", href: "/faqs" },
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
      setSearchQuery("");
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
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[80] bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-[90] w-[78vw] max-w-xs bg-white md:hidden flex flex-col shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-zinc-900">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white font-black text-lg">
                    R
                  </div>
                  <span className="leading-none">
                    <span className="block text-base font-extrabold text-white tracking-tight">RafSan</span>
                    <span className="block text-[10px] text-zinc-400 tracking-[0.15em] uppercase">Clothing</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Login/Account bar */}
              <div className="px-4 py-3 bg-zinc-800">
                {user ? (
                  <Link
                    href="/account/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-white"
                  >
                    <UserCircle className="w-5 h-5 text-zinc-300" />
                    <span className="text-sm font-medium">My Account</span>
                  </Link>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 text-center py-2 rounded-xl bg-white text-black text-sm font-bold"
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 text-center py-2 rounded-xl bg-white/10 text-white text-sm font-bold border border-white/20"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Browse</p>
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-800 font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
                      >
                        <span className="text-xl w-7 text-center">{link.icon}</span>
                        <span className="text-sm">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="h-px bg-gray-100 my-4 mx-3" />

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Help</p>
                <ul className="space-y-1">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom contact */}
              <div className="px-4 py-4 border-t border-gray-100">
                <a
                  href="https://wa.me/8801610735064"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/10 text-[#128C7E]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <div>
                    <p className="text-xs font-bold">WhatsApp অর্ডার</p>
                    <p className="text-xs text-gray-500">+880 1610-735064</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
