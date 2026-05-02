"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  const handleIncreaseQuantity = (id: string) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (id: string) => {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = cartTotal;
  const shipping = cart.length > 0 ? 99 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="pt-6 pb-20 px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
          <div className="max-w-2xl mx-auto py-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="pt-6 pb-20 px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items - Desktop Table */}
          <div className="lg:col-span-2">
            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden lg:block bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 dark:border-zinc-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="col-span-6">PRODUCT</div>
                <div className="col-span-2 text-center">PRICE</div>
                <div className="col-span-2 text-center">QUANTITY</div>
                <div className="col-span-2 text-center">TOTAL</div>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      ৳{item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-lg">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="font-bold text-gray-900 dark:text-white">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards (hidden on desktop) */}
            <div className="lg:hidden space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                        ৳{item.price.toFixed(2)}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-lg">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearCart}
                className="px-6 py-3 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {shipping > 0 ? `৳${shipping.toFixed(2)}` : "Free"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-zinc-800 pt-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">৳{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </button>
                <Link
                  href="/"
                  className="block w-full py-3 border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg text-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">We accept</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">VISA</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">MC</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">AMEX</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">bKash</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}