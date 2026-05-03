"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const placeholder =
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop";

  const imageToShow =
    !imageError && product.image_url ? product.image_url : placeholder;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageToShow,
    });
  };

  return (
    <div className="group relative bg-white overflow-hidden max-md:border-0 max-md:shadow-none">
      
      <Link href={/product/${product.id}} className="block">

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="absolute top-1 right-1 z-20 p-1 bg-white rounded-full shadow max-md:bg-white/90"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        {/* IMAGE (FULL BOX, NO GAP) */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={imageToShow}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />

          {/* PRICE OVERLAY (LIKE YOUR SCREENSHOT) */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur px-2 py-1">
            <span className="text-black font-bold text-sm">
              ৳{product.price.toFixed(2)}
            </span>
          </div>
        </div>

      </Link>
    </div>
  );
}