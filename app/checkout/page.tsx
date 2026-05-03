"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [deliveryOption, setDeliveryOption] = useState<string>("inside");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return false;
    }
    if (!formData.phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }
    if (!formData.address.trim()) {
      alert("Please enter your address");
      return false;
    }
    if (!formData.city.trim()) {
      alert("Please enter your city");
      return false;
    }
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to your cart before placing an order.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setPlacingOrder(true);
    try {
      // Calculate total amount
      const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const deliveryCost = deliveryOption === "inside" ? 60 : 120;
      const totalAmount = subtotal + deliveryCost;

      // 1. Insert order (guest checkout - user_id can be null)
      const orderData: any = {
        total_amount: totalAmount,
        status: "pending",
        shipping_address: `${formData.address}, ${formData.city}`,
        phone: formData.phone,
        customer_name: formData.name,
        order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };

      // Add user_id if logged in
      if (user) {
        orderData.user_id = user.id;
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // 2. Prepare order items - use item.id directly (should be UUID from Supabase)
      const orderItems = cart.map((item) => {
        // Validate that item.id looks like a UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
        
        if (!isUuid) {
          console.warn(`Cart item ID "${item.id}" doesn't look like a standard UUID. This may cause insertion errors.`);
        }
        
        return {
          order_id: order.id,
          product_id: item.id, // Use item.id directly (should be UUID)
          quantity: item.quantity,
          price: item.price,
        };
      });

      console.log("ORDER ITEMS:", orderItems);
      console.log("First order item:", orderItems[0]);

      // 4. Insert order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // 5. Clear local cart
      clearCart();

      // 6. Show success message and redirect
      alert("Order placed successfully!");
      
      // Redirect based on authentication
      if (user) {
        router.push("/account/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Order placement failed:", error);
      alert(`Order placement failed: ${error.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Calculate subtotal from cart items
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryCost = deliveryOption === "inside" ? 60 : 120;
  const total = subtotal + deliveryCost;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="pt-6 pb-20 px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to your cart before proceeding to checkout.</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Customer Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                    required
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Option</h2>
                
                <div className="space-y-3">
                  <div 
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${deliveryOption === "inside" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                    onClick={() => setDeliveryOption("inside")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${deliveryOption === "inside" ? "border-blue-500" : "border-gray-400"}`}>
                        {deliveryOption === "inside" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Inside Dhaka</p>
                        <p className="text-sm text-gray-500">Standard delivery</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">৳60</span>
                  </div>

                  <div 
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${deliveryOption === "outside" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                    onClick={() => setDeliveryOption("outside")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${deliveryOption === "outside" ? "border-blue-500" : "border-gray-400"}`}>
                        {deliveryOption === "outside" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Outside Dhaka</p>
                        <p className="text-sm text-gray-500">Extended delivery</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">৳120</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="mb-6 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b border-gray-100 last:border-0">
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
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">৳{item.price * item.quantity}</p>
                      <p className="text-sm text-gray-500">৳{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
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
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full mt-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {placingOrder ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}