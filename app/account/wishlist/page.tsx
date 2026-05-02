"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Heart, Trash2, ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";

type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image_url?: string;
    category?: string;
  };
};

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Fetch wishlist data
  useEffect(() => {
    async function fetchWishlistData() {
      try {
        setLoading(true);
        
        // Get current user - DashboardLayout already ensures user exists
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        // User should exist because DashboardLayout already authenticated
        if (!authUser) {
          console.error("WishlistPage: Unexpected - no user found but DashboardLayout should have redirected");
          setLoading(false);
          return;
        }
        setUser(authUser);
        
        // Fetch wishlist items with product details
        const { data: wishlistData, error: wishlistError } = await supabase
          .from("wishlist")
          .select(`
            *,
            product:products (
              id,
              name,
              price,
              originalPrice,
              image_url,
              category
            )
          `)
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false });

        if (wishlistError) {
          throw wishlistError;
        }

        if (wishlistData) {
          setWishlistItems(wishlistData);
        }
        
      } catch (err: any) {
        console.error("Error loading wishlist:", err);
        setError(err.message || "Failed to load wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchWishlistData();
  }, []);

  // Remove item from wishlist
  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", itemId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Move item to cart
  const handleMoveToCart = async (productId: string) => {
    try {
      // Add to cart logic would go here
      // For now, just show a message
      alert("Item added to cart! This feature will be implemented soon.");
    } catch (err) {
      console.error("Error moving to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Format currency (BDT)
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString("en-BD")}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">Your saved favorite items</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">Your saved favorite items</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">
                Start adding items you love to your wishlist. They'll appear here.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs text-gray-500">
                          Added {formatDate(item.created_at)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {item.product ? (
                      <>
                        <div className="mb-4">
                          <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                            {item.product.image_url ? (
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-400">
                                <Heart className="h-12 w-12" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(item.product.price)}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatCurrency(item.product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {item.product.category && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {item.product.category}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            href={`/product/${item.product.id}`}
                            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                          <button
                            onClick={() => handleMoveToCart(item.product_id)}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Product details not available</p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}