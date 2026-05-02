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
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Premium fashion placeholder images from Unsplash
  const placeholderImages = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop", // Premium t-shirt
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1470&auto=format&fit=crop", // Fashion hoodie
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1470&auto=format&fit=crop", // Luxury sweater
    "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=1470&auto=format&fit=crop", // Casual wear
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1470&auto=format&fit=crop", // Street fashion
    "https://images.unsplash.com/photo-1558769132-cb1a40ed0ada?q=80&w=1470&auto=format&fit=crop", // Designer jacket
  ];
  
  // Select placeholder based on product ID hash for variety
  const getPlaceholderIndex = (id: string) => {
    // Create a simple hash from the string ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % placeholderImages.length;
  };
  
  const placeholderImage = placeholderImages[getPlaceholderIndex(product.id)];
  
  const imageToShow =
    !imageError && product.image_url && product.image_url !== ""
      ? product.image_url
      : placeholderImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id, // Now a string/UUID, no need for toString()
      name: product.name,
      price: product.price,
      image: imageToShow,
    });
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.id}`} className="block">
        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* ADD TO CART BUTTON - appears on hover */}
        <button
          onClick={handleAddToCart}
          className="absolute top-3 right-3 z-20 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>

        {/* IMAGE CONTAINER */}
        <div className="relative aspect-square bg-gray-100 dark:bg-zinc-800 overflow-hidden">
          <Image
            src={imageToShow}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            onError={() => setImageError(true)}
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          {/* PRICE ROW */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-gray-900 dark:text-zinc-50">
              ৳{product.price.toFixed(2)}
            </span>

            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-gray-500 dark:text-zinc-500 line-through">
                ৳{product.originalPrice.toFixed(2)}
              </span>
            )}
            
            {hasDiscount && product.originalPrice && (
              <span className="ml-auto text-xs font-medium text-red-600 dark:text-red-400">
                Save ৳{(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* PRODUCT NAME */}
          <h3 className="text-sm font-medium text-gray-800 dark:text-zinc-300 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* CATEGORY/TAG */}
          {product.description && (
            <p className="text-xs text-gray-500 dark:text-zinc-500 line-clamp-1">
              {product.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}