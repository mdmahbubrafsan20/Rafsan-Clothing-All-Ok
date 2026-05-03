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
  
  const hasDiscount = Boolean(
    product.original_price && product.original_price > product.price
  );
  const discountPercent = hasDiscount && product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
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
    <div className="group relative bg-white rounded-sm md:rounded-lg lg:rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-6 md:mb-0 max-md:border-0 max-md:shadow-none max-md:rounded-none">
      <Link href={`/product/${product.id}`} className="block">
        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <div className="absolute top-1.5 left-1.5 z-20 md:top-3 md:left-3 max-md:hidden">
            <span className="inline-flex items-center px-1.5 py-0.5 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold bg-red-600 text-white">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* ADD TO CART BUTTON - appears on hover */}
        <button
          onClick={handleAddToCart}
          className="absolute top-1.5 right-1.5 z-20 p-1 md:p-1.5 lg:p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white max-md:hidden"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
        </button>

        {/* IMAGE CONTAINER */}
          <div className="relative aspect-square bg-white overflow-hidden p-0 m-0">
          <Image
            src={imageToShow}
            alt={product.name}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            onError={() => setImageError(true)}
          />
          
        </div>

        {/* CONTENT - desktop */}
        <div className="p-2 md:p-3 lg:p-4 space-y-1 md:space-y-1.5 lg:space-y-2 max-md:hidden">
          {/* PRICE ROW */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <span className="text-sm md:text-lg lg:text-xl font-bold text-gray-900">
              ৳{product.price.toFixed(2)}
            </span>

            {hasDiscount && product.original_price && (
              <span className="text-[10px] md:text-xs lg:text-sm text-gray-500 line-through">
                ৳{product.original_price.toFixed(2)}
              </span>
            )}
            
            {hasDiscount && product.original_price && (
              <span className="ml-auto text-[10px] md:text-xs font-medium text-red-600">
                Save ৳{(product.original_price - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* PRODUCT NAME */}
          <h3 className="text-[11px] md:text-xs lg:text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* CATEGORY/TAG */}
          {product.description && (
            <p className="text-[10px] md:text-xs text-gray-500 line-clamp-1">
              {product.description}
            </p>
          )}
        </div>

        {/* CONTENT - mobile */}
        <div className="p-2 space-y-1 md:hidden">
          <h3 className="text-[14px] font-medium text-gray-800 line-clamp-1 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold leading-none text-gray-900">৳{product.price.toFixed(2)}</span>
            {hasDiscount && product.original_price && (
              <span className="text-[14px] text-gray-400 line-through">৳{product.original_price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}