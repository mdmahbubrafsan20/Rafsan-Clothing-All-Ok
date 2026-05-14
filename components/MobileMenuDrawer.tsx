"use client";

import { X, UserCircle } from "lucide-react";
import Link from "next/link";
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

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
}

export default function MobileMenuDrawer({ isOpen, onClose, user }: MobileMenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
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
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white font-black text-lg">
                  R
                </div>
                <span className="leading-none">
                  <span className="block text-base font-extrabold text-white tracking-tight">RafSan</span>
                  <span className="block text-[10px] text-zinc-400 tracking-[0.15em] uppercase">Clothing</span>
                </span>
              </Link>
              <button
                onClick={onClose}
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
                  onClick={onClose}
                  className="flex items-center gap-3 text-white"
                >
                  <UserCircle className="w-5 h-5 text-zinc-300" />
                  <span className="text-sm font-medium">My Account</span>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex-1 text-center py-2 rounded-xl bg-white text-black text-sm font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    onClick={onClose}
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
                      onClick={onClose}
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
                      onClick={onClose}
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
  );
}