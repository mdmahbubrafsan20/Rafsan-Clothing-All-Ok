"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/context/CartContext";

interface CheckoutOrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  placingOrder: boolean;
  paymentMethod: "cod" | "sslcommerz";
  onPlaceOrder: () => void;
}

export default function CheckoutOrderSummary({
  cart,
  subtotal,
  deliveryCost,
  total,
  placingOrder,
  paymentMethod,
  onPlaceOrder,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="mb-6 max-h-96 overflow-y-auto pr-2">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center py-4 border-b border-gray-100 last:border-0"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                ৳{item.price * item.quantity}
              </p>
              <p className="text-sm text-gray-500">৳{item.price} each</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-gray-900">৳{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="font-medium text-gray-900">৳{deliveryCost}</span>
        </div>

        <div className="h-px bg-gray-200 my-4"></div>

        <div className="flex justify-between text-lg font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">৳{total}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={placingOrder}
        className="w-full mt-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {placingOrder ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Order...
          </>
        ) : paymentMethod === "sslcommerz" ? (
          "Pay with SSLCommerz"
        ) : (
          "Place order"
        )}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        By placing your order, you agree to our{" "}
        <Link href="/terms" className="underline text-gray-700 hover:text-black">
          Terms & Conditions
        </Link>
        .
      </p>
    </div>
  );
}