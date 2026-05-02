"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import { X, ZoomIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { fetchProductById, Product } from "@/lib/products";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract params using React.use()
  const { id } = use(params);
  
  // Fetch product by ID
  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
        // For now, we'll keep related products empty (could fetch from API)
        setRelatedProducts([]);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">Product not found</div>;
  }

  const openZoomModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomModalOpen(true);
  };

  const closeZoomModal = () => {
    setIsZoomModalOpen(false);
  };

  const handleAddToCart = () => {
    const imageUrl = product.images?.[selectedImageIndex]?.image_url || product.image_url || '';
    const productToAdd = {
      id: product.id, // already a string UUID
      name: product.name,
      price: product.price,
      image: imageUrl,
    };
    
    addToCart(productToAdd);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    const imageUrl = product.images?.[selectedImageIndex]?.image_url || product.image_url || '';
    const productToAdd = {
      id: product.id, // already a string UUID
      name: product.name,
      price: product.price,
      image: imageUrl,
    };
    
    addToCart(productToAdd);
    
    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Map images to URLs for display
  const imageUrls = product.images?.map(img => img.image_url) || [];
  const mainImageUrl = imageUrls[selectedImageIndex] || product.image_url || '';

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="py-6 px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/" className="hover:text-black dark:hover:text-white">Clothing</Link>
          <span className="mx-2">/</span>
          <span className="text-black dark:text-white">Product</span>
        </nav>

        {/* Product Details - 2 column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT COLUMN - Images */}
          <div>
            {/* Main Image with zoom functionality */}
            <div
              className="relative aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-lg mb-4 group cursor-zoom-in"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => openZoomModal(selectedImageIndex)}
            >
              <Image
                src={mainImageUrl}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-300 ${
                  isHovering ? 'scale-110' : 'scale-100'
                }`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Zoom indicator */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {imageUrls.map((imgUrl, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer bg-white dark:bg-zinc-900 ${
                    selectedImageIndex === index
                      ? 'border-black dark:border-white'
                      : 'border-transparent hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info */}
          <div className="space-y-6">
            {/* Title and SKU */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  SKU: <span className="font-mono">{product.sku}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ৳{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  ৳{product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-bold">
                  Save ৳{(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Fabric Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Fabric:
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {product.fabric}
              </span>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    className="px-5 py-3 border-2 border-gray-300 dark:border-zinc-700 rounded-lg hover:border-black dark:hover:border-white font-medium text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {size}
                  </button>
                )) ?? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No sizes available
                  </p>
                )}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Color
              </h3>
              <div className="flex flex-wrap gap-4">
                {product.colors?.map((color) => (
                  <button
                    key={color.name}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-zinc-700"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {color.name}
                    </span>
                  </button>
                )) ?? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No colors available
                  </p>
                )}
              </div>
            </div>

            {/* Quantity and Stock */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 text-lg font-medium">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  >
                    +
                  </button>
                </div>

                <div className="text-sm">
                  {product.stock !== undefined && product.stock > 0 ? (
                    product.stock > 10 ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Low Stock - Only {product.stock} left
                      </span>
                    )
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            DESCRIPTION
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
            <ul className="mt-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>100% organic cotton for maximum comfort</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Pre-shrunk fabric maintains shape after washing</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Reinforced stitching for durability</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Classic fit suitable for all body types</span>
              </li>
            </ul>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              You May Also Like
            </h2>
            <Link
              href="/"
              className="text-black dark:text-white font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[100]">
          <div className="bg-black text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Added to cart successfully!</span>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeZoomModal}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-[101] text-white p-2 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeZoomModal();
            }}
            aria-label="Close zoom"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image container */}
          <div
            className="relative w-full max-w-4xl h-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageUrls[selectedImageIndex] || ''}
              alt={`Zoomed view of ${product.name}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Thumbnail strip for mobile/desktop */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {imageUrls.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  selectedImageIndex === index
                    ? 'bg-white'
                    : 'bg-white/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation arrows for larger screens */}
          <div className="hidden md:flex absolute inset-y-0 left-4 right-4 items-center justify-between pointer-events-none">
            <button
              className="pointer-events-auto p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev > 0 ? prev - 1 : imageUrls.length - 1
                );
              }}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="pointer-events-auto p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev < imageUrls.length - 1 ? prev + 1 : 0
                );
              }}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}