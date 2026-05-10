"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatBdt } from "@/lib/format-price";

interface ViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recently_viewed");
      if (stored) setProducts(JSON.parse(stored));
    } catch {}
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="px-3 py-4 md:py-8">
      <h2 className="text-base md:text-xl font-bold text-gray-900 mb-4">
        সম্প্রতি দেখেছেন
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="snap-start shrink-0 w-32 md:w-40 group"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="160px"
              />
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
              {product.name}
            </p>
            <p className="text-xs md:text-sm font-bold text-gray-900 mt-0.5">
              ৳{formatBdt(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Call this from product detail page
export function trackRecentlyViewed(product: ViewedProduct) {
  try {
    const stored = localStorage.getItem("recently_viewed");
    const list: ViewedProduct[] = stored ? JSON.parse(stored) : [];
    const filtered = list.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 8);
    localStorage.setItem("recently_viewed", JSON.stringify(updated));
  } catch {}
}
