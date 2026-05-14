"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { deliveryFee } from "@/lib/shipping";
import CheckoutCustomerForm from "@/components/CheckoutCustomerForm";
import CheckoutOrderSummary from "@/components/CheckoutOrderSummary";

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart } = useCart();
  const [deliveryOption, setDeliveryOption] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "sslcommerz">("cod");
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

  useEffect(() => {
    const p = searchParams.get("payment");
    if (p === "fail" || p === "cancel") {
      alert("Payment was not completed. You can try again or choose cash on delivery.");
    }
    if (p === "amount" || p === "invalid") {
      alert("Payment could not be verified. If you were charged, contact support with your order number.");
    }
  }, [searchParams]);

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
      const deliveryCost = deliveryFee(deliveryOption);
      const totalAmount = subtotal + deliveryCost;

      // 1. Insert order (guest checkout - user_id can be null)
      const orderData: Record<string, unknown> = {
        total_amount: totalAmount,
        status: "pending",
        shipping_address: `${formData.address}, ${formData.city}`,
        phone: formData.phone,
        customer_name: formData.name,
        order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        payment_method:
          paymentMethod === "sslcommerz" ? "sslcommerz_pending" : "cash_on_delivery",
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
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // 4. Insert order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      if (paymentMethod === "sslcommerz") {
        const initRes = await fetch("/api/payment/sslcommerz/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });
        const initJson = (await initRes.json()) as { gatewayPageUrl?: string; error?: string };
        if (!initRes.ok || !initJson.gatewayPageUrl) {
          throw new Error(
            initJson.error ||
              "Online payment is not available. Configure SSLCommerz and SUPABASE_SERVICE_ROLE_KEY, or use cash on delivery."
          );
        }
        clearCart();
        window.location.href = initJson.gatewayPageUrl;
        return;
      }

      clearCart();

      fetch("/api/order-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.order_number,
          totalAmount,
          customerName: formData.name,
          customerPhone: formData.phone,
          paymentMethod: "Cash on delivery",
        }),
      }).catch(() => {});

      alert("Order placed successfully!");

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
  const deliveryCost = deliveryFee(deliveryOption);
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
            <CheckoutCustomerForm
              formData={formData}
              onInputChange={handleInputChange}
              deliveryOption={deliveryOption}
              onDeliveryChange={setDeliveryOption}
              paymentMethod={paymentMethod}
              onPaymentChange={setPaymentMethod}
            />
            <CheckoutOrderSummary
              cart={cart}
              subtotal={subtotal}
              deliveryCost={deliveryCost}
              total={total}
              placingOrder={placingOrder}
              paymentMethod={paymentMethod}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-gray-600">
          Loading checkout…
        </div>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}