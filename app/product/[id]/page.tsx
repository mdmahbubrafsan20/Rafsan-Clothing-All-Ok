"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use, ReactNode } from "react";
import ProductCard from "@/components/ProductCard";
import RecentlyViewed, { trackRecentlyViewed } from "@/components/RecentlyViewed";
import { X, ZoomIn, ShoppingBag, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { fetchProductById, getProductsByCategory, Product } from "@/lib/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"description" | "size" | "details">("description");
  const [descExpanded, setDescExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [sizeExpanded, setSizeExpanded] = useState(false);

  const { id } = use(params);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const productResult = await fetchProductById(id);
        if (!productResult) {
          setLoading(false);
          return;
        }
        setProduct(productResult);
        if (productResult.sizes?.length) setSelectedSize(productResult.sizes[0]);
        if (productResult.colors?.length) setSelectedColor(productResult.colors[0].name);

        // Track recently viewed
        trackRecentlyViewed({
          id: productResult.id,
          name: productResult.name,
          price: productResult.price,
          image: productResult.images?.[0] || productResult.image_url || "",
        });

        // Fetch related products in parallel
        if (productResult.category) {
          const relatedProducts = await getProductsByCategory(productResult.category);
          setRelatedProducts(relatedProducts.filter((p: Product) => p.id !== id).slice(0, 8));
        }
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
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="w-full aspect-square bg-gray-200" />
          <div className="px-4 py-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-7 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Product not found</p>
        <Link href="/products" className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold">
          View All Products
        </Link>
      </div>
    );
  }

  const imageUrls = product.images?.length ? product.images : product.image_url ? [product.image_url] : [];
  const mainImageUrl = imageUrls[selectedImageIndex] || "";

  const shortName = product.name.length > 40
    ? product.name.split("|")[0].trim()
    : product.name;

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrls[selectedImageIndex] || "",
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrls[selectedImageIndex] || "",
    });
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden">

        {/* Image slider */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={shortName}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}

          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discountPercent}%
            </div>
          )}

          <button
            onClick={() => setIsZoomModalOpen(true)}
            className="absolute bottom-3 right-3 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {imageUrls.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex(i => i > 0 ? i - 1 : imageUrls.length - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedImageIndex(i => i < imageUrls.length - 1 ? i + 1 : 0)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {imageUrls.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imageUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === selectedImageIndex ? "bg-white w-3" : "bg-white/60"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {imageUrls.length > 1 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${i === selectedImageIndex ? "border-black" : "border-gray-200"}`}
              >
                <Image src={url} alt={`view ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}

        {/* Product info */}
        <div className="px-4 pb-6">

          <div className="mt-2 mb-3">
            <h1 className="text-lg font-bold text-gray-900 leading-snug">{shortName}</h1>
            {product.sku && <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-black text-gray-900">৳{product.price}</span>
            {hasDiscount && (
              <>
                <span className="text-sm text-gray-400 line-through">৳{product.original_price}</span>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  ৳{product.original_price! - product.price} সাশ্রয়
                </span>
              </>
            )}
          </div>

          <div className="mb-4">
            {product.stock > 10 ? (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">⚠ Only {product.stock} left</span>
            ) : (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">Out of Stock</span>
            )}
          </div>

          {product.fabric && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span className="text-gray-500">Fabric:</span>
              <span className="font-semibold text-gray-800">{product.fabric}</span>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-bold text-gray-900 block mb-2">Select Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-bold text-gray-900 block mb-2">
                Color: <span className="font-normal text-gray-500">{selectedColor}</span>
              </span>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 rounded-full border-4 transition-all ${
                      selectedColor === color.name ? "border-black scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-5">
            <span className="text-sm font-bold text-gray-900 block mb-2">Quantity</span>
            <div className="inline-flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50"
              >−</button>
              <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-50"
              >+</button>
            </div>
          </div>

          {/* Buttons — Quantity এর নিচে, fixed না */}
          <div className="flex flex-col gap-2 mb-5">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-black text-black font-bold rounded-2xl text-sm hover:bg-gray-50 disabled:opacity-40"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white font-bold rounded-2xl text-sm hover:bg-gray-800 disabled:opacity-40"
            >
              <Zap className="w-4 h-4" />
              Buy Now
            </button>
          </div>

          {/* Description / Size / Details accordion */}
          <div className="border-t border-gray-100 pt-4 space-y-0">
            {/* Description */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-900"
              >
                Description
                <span className={`text-lg transition-transform ${descExpanded ? "rotate-180" : ""}`}>▼</span>
              </button>
              {descExpanded && (
                <div className="pb-4 space-y-2">
                  {(product.description || "No description available.")
                    .split("\n")
                    .filter(line => line.trim())
                    .map((line, i) => (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed">{line.trim()}</p>
                    ))}
                </div>
              )}
            </div>

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setSizeExpanded(!sizeExpanded)}
                  className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-900"
                >
                  Size Guide
                  <span className={`text-lg transition-transform ${sizeExpanded ? "rotate-180" : ""}`}>▼</span>
                </button>
                {sizeExpanded && (
                  <div className="pb-4">
                    {((): ReactNode => {
                      const raw = product.size_chart as any;
                      let parsed: { headers: string[]; rows: string[][] } | null = null;
                      if (raw && typeof raw === "object" && Array.isArray(raw.rows) && raw.rows.length > 0) {
                        parsed = raw;
                      } else if (raw && (typeof raw === "string" || raw.description)) {
                        const text = typeof raw === "string" ? raw : raw.description || "";
                        const lines = text.split("\n").map((l: string) => l.trim()).filter((l: string) => l.includes("||") && l.length > 3);
                        if (lines.length >= 2) {
                          const parsePipe = (line: string) => line.split("||").map((c: string) => c.trim()).filter((c: string) => c.length > 0);
                          parsed = { headers: parsePipe(lines[0]), rows: lines.slice(1).map(parsePipe) };
                        }
                      }
                      if (!parsed) return <p className="text-sm text-gray-400">Size chart not available.</p>;
                      return (
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-gray-900">
                                {parsed.headers.map((h, i) => (
                                  <th key={i} className={`px-2 py-2.5 font-semibold text-white text-center ${i === 0 ? "text-left" : ""}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {parsed.rows.map((row, ri) => (
                                <tr key={ri} className={`border-t border-gray-100 ${ri % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                  {row.map((cell, ci) => (
                                    <td key={ci} className={`px-2 py-2 text-center text-gray-700 ${ci === 0 ? "font-bold text-gray-900 text-left" : ""}`}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            {product.product_details && (
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setDetailsExpanded(!detailsExpanded)}
                  className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-900"
                >
                  Details
                  <span className={`text-lg transition-transform ${detailsExpanded ? "rotate-180" : ""}`}>▼</span>
                </button>
                {detailsExpanded && (
                  <div className="pb-4 space-y-2">
                    {(["overview", "fabric_care", "size_fit", "shipping_returns"] as const).map((key) =>
                      product.product_details?.[key] ? (
                        <div key={key} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                            {key.replace("_", " ")}
                          </p>
                          <p className="text-sm text-gray-700">{product.product_details[key]}</p>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── STICKY BOTTOM — Buy Now উপরে, Add to Cart নিচে ── */}
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{shortName}</span>
        </nav>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 cursor-zoom-in"
              onClick={() => setIsZoomModalOpen(true)}
            >
              {mainImageUrl && (
                <Image src={mainImageUrl} alt={shortName} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="50vw" priority />
              )}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 ${i === selectedImageIndex ? "border-black" : "border-transparent hover:border-gray-300"}`}
                  >
                    <Image src={url} alt={`view ${i + 1}`} fill className="object-cover" sizes="12vw" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{shortName}</h1>
            {product.sku && <p className="text-sm text-gray-400 mb-4">SKU: {product.sku}</p>}

            <div className="flex items-center gap-4 mb-5">
              <span className="text-3xl font-black">৳{product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">৳{product.original_price}</span>
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {product.fabric && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm mb-5">
                <span className="text-gray-500">Fabric:</span>
                <span className="font-bold">{product.fabric}</span>
              </div>
            )}

            {/* Sizes — only buttons, no chart here */}
            {product.sizes?.length ? (
              <div className="mb-5">
                <span className="font-semibold text-gray-900 block mb-2">Select Size</span>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-xl font-bold border-2 transition-all ${selectedSize === size ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Colors */}
            {product.colors?.length ? (
              <div className="mb-5">
                <span className="font-semibold text-gray-900 block mb-2">Color: <span className="font-normal text-gray-500">{selectedColor}</span></span>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 rounded-full border-4 ${selectedColor === c.name ? "border-black" : "border-gray-200"}`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quantity */}
            <div className="mb-6">
              <span className="font-semibold text-gray-900 block mb-2">Quantity</span>
              <div className="inline-flex items-center border-2 border-gray-200 rounded-xl">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 text-xl text-gray-600 hover:bg-gray-50">−</button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 text-xl text-gray-600 hover:bg-gray-50">+</button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-4 border-2 border-black font-bold rounded-xl hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" /> Buy Now
              </button>
            </div>

            {/* ── Description / Size / Details TABS (Desktop) ── */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex gap-6 mb-5 border-b border-gray-100">
                {(["description", "size", "details"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === tab ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "description" ? "Description" : tab === "size" ? "Size" : "Details"}
                  </button>
                ))}
              </div>

              {/* Description Tab */}
              {activeTab === "description" && (
                <div className="space-y-3">
                  {(product.description || "")
                    .split("\n")
                    .filter(line => line.trim())
                    .map((line, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed text-sm">{line.trim()}</p>
                    ))}
                </div>
              )}

              {/* Size Tab */}
              {activeTab === "size" && (() => {
                const raw = product.size_chart as any;
                let parsed: { headers: string[]; rows: string[][] } | null = null;
                if (raw && typeof raw === "object" && Array.isArray(raw.rows) && raw.rows.length > 0) {
                  parsed = raw;
                } else if (raw && (typeof raw === "string" || raw.description)) {
                  const text = typeof raw === "string" ? raw : raw.description || "";
                  const lines = text.split("\n").map((l: string) => l.trim()).filter((l: string) => l.includes("||") && l.length > 3);
                  if (lines.length >= 2) {
                    const parsePipe = (line: string) => line.split("||").map((c: string) => c.trim()).filter((c: string) => c.length > 0);
                    parsed = { headers: parsePipe(lines[0]), rows: lines.slice(1).map(parsePipe) };
                  }
                }
                if (!parsed) return <p className="text-sm text-gray-400">Size chart নেই।</p>;
                return (
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-900">
                          {parsed.headers.map((h, i) => (
                            <th key={i} className={`px-3 py-3 font-semibold text-white text-center ${i === 0 ? "text-left" : ""}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.rows.map((row, ri) => (
                          <tr key={ri} className={`border-t border-gray-100 ${ri % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                            {row.map((cell, ci) => (
                              <td key={ci} className={`px-3 py-2.5 text-center text-gray-700 ${ci === 0 ? "font-bold text-gray-900 text-left" : ""}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* Details Tab */}
              {activeTab === "details" && product.product_details && (
                <div className="space-y-3">
                  {(["overview", "fabric_care", "size_fit", "shipping_returns"] as const).map((key) =>
                    product.product_details?.[key] ? (
                      <div key={key} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace("_", " ")}
                        </p>
                        <p className="text-sm text-gray-700">{product.product_details[key]}</p>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products — Desktop only */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recently Viewed — Desktop only */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 pb-12">
        <RecentlyViewed />
      </div>

      {/* ── MOBILE: Related Products + Recently Viewed above footer ── */}
      <div className="md:hidden">
        {relatedProducts.length > 0 && (
          <div className="mt-6 px-4">
            <h2 className="text-base font-bold text-gray-900 mb-4">Related Products</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {relatedProducts.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-40">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
        <RecentlyViewed />
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium">
          <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs">✓</span>
          Added to cart!
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setIsZoomModalOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full" onClick={() => setIsZoomModalOpen(false)}>
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-2xl aspect-square" onClick={e => e.stopPropagation()}>
            {mainImageUrl && <Image src={mainImageUrl} alt={shortName} fill className="object-contain" sizes="100vw" />}
          </div>
        </div>
      )}
    </div>
  );
}
