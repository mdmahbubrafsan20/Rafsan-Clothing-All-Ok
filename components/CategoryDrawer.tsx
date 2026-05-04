"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getAllCategories, type Category } from "@/lib/products";

type Props = {
  open: boolean;
  onClose: () => void;
};

const PRESET = [
  { label: "All products", href: "/products" },
  { label: "Men", href: "/category/men" },
  { label: "Women", href: "/category/women" },
  { label: "Kids", href: "/category/kids" },
  { label: "Sports", href: "/category/sports" },
];

export default function CategoryDrawer({ open, onClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const data = await getAllCategories();
      if (!cancelled) setCategories(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close categories"
            className="fixed inset-0 z-[60] bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-drawer-title"
            className="fixed bottom-0 left-0 right-0 z-[70] md:hidden rounded-t-2xl bg-white shadow-2xl border-t border-gray-200 max-h-[min(85vh,560px)] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
              <h2 id="category-drawer-title" className="text-lg font-semibold text-gray-900">
                Categories
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-2 py-3 pb-8">
              <ul className="space-y-1">
                {PRESET.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-xl text-gray-900 font-medium hover:bg-gray-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {categories.length > 0 && (
                  <>
                    <li className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      More
                    </li>
                    {categories.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/category/${encodeURIComponent(c.name)}`}
                          onClick={onClose}
                          className="block px-4 py-3 rounded-xl text-gray-800 hover:bg-gray-100"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
