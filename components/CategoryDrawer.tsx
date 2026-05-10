"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { getAllCategories, type Category } from "@/lib/products";
import {
  CORE_SHOP_CATEGORIES,
  productsCategoryHref,
} from "@/lib/category-nav";

type Props = {
  open: boolean;
  onClose: () => void;
};

const PRESET = [
  {
    label: "Men's Collection",
    sub: "T-Shirt, Polo, Hoodie & more",
    href: productsCategoryHref("Men"),
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
      </svg>
    ),
  },
  {
    label: "Women's Collection",
    sub: "Top, Kurti, T-Shirt & more",
    href: productsCategoryHref("Women"),
    bg: "bg-pink-100",
    iconColor: "text-pink-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm-1 12.1V22h2v-7.9c2.72.46 5 2.6 5 5.9H6c0-3.3 2.28-5.44 5-5.9z"/>
      </svg>
    ),
  },
  {
    label: "Kids Collection",
    sub: "Boys & Girls Clothing",
    href: productsCategoryHref("Kids"),
    bg: "bg-amber-100",
    iconColor: "text-amber-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 10c-4 0-8 1.79-8 4v1h16v-1c0-2.21-4-4-8-4z"/>
      </svg>
    ),
  },
  {
    label: "Sports Collection",
    sub: "Jersey, Activewear & more",
    href: productsCategoryHref("Sports"),
    bg: "bg-green-100",
    iconColor: "text-green-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4.07 11h2.02C6.23 8.6 7.37 6.53 9 5.07 6.6 5.64 4.68 8.07 4.07 11zm2.02 2H4.07c.61 2.93 2.53 5.36 4.93 5.93C7.37 17.47 6.23 15.4 6.09 13zm1.98 0c.18 2.17 1.08 4.1 2.43 5.53C11.61 18.26 11.82 18.2 12 18.2c.18 0 .39.06.5.33C13.92 17.1 14.82 15.17 15 13H8.07zM15 11c-.18-2.17-1.08-4.1-2.43-5.53-.11.27-.32.33-.5.33-.18 0-.39-.06-.5-.33C10.22 6.9 9.32 8.83 9.07 11H15zm1.93 0h2.02c-.61-2.93-2.53-5.36-4.93-5.93C15.63 6.53 16.77 8.6 16.93 11zm0 2c-.16 2.4-1.3 4.47-2.91 5.93 2.4-.57 4.32-3 4.93-5.93h-2.02z"/>
      </svg>
    ),
  },
];

function normalizeStrict(name: string): string {
  return name.trim().toLowerCase().replace(/[''`]s$/, "").replace(/s$/, "");
}

export default function CategoryDrawer({ open, onClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const data = await getAllCategories();
      if (!cancelled) setCategories(data);
    })();
    return () => { cancelled = true; };
  }, [open]);

  const extraCategories = categories.filter(
    (c) =>
      !CORE_SHOP_CATEGORIES.some(
        (core) => normalizeStrict(core) === normalizeStrict(c.name)
      ) && c.name.toLowerCase() !== "all products"
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close categories"
            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-drawer-title"
            className="fixed bottom-0 left-0 right-0 z-[70] md:hidden rounded-t-3xl bg-white shadow-2xl max-h-[85vh] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4">
              <h2 id="category-drawer-title" className="text-xl font-bold text-gray-900">
                Shop by Category
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto px-4 pb-10 space-y-2">
              {PRESET.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                </Link>
              ))}

              {/* Extra Supabase categories */}
              {extraCategories.map((c) => (
                <Link
                  key={c.id}
                  href={productsCategoryHref(c.name)}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-purple-100 text-purple-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                </Link>
              ))}

              {/* View All */}
              <Link
                href="/products"
                onClick={onClose}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-zinc-900 active:bg-zinc-800 transition-colors mt-1"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">View All Products</p>
                  <p className="text-xs text-zinc-400 mt-0.5">সব পণ্য দেখুন</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
