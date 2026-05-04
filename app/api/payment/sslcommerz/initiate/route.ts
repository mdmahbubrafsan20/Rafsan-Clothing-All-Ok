import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { initiateSslcommerzSession, isSslcommerzConfigured } from "@/lib/sslcommerz";

function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    if (!isSslcommerzConfigured()) {
      return NextResponse.json(
        { error: "SSLCommerz is not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD." },
        { status: 503 }
      );
    }

    const admin = createSupabaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is required for online payment." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as { orderId?: string };
    const orderId = body.orderId?.trim();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id, order_number, total_amount, customer_name, phone, shipping_address, status, payment_method")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const total = Number(order.total_amount);
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
    }

    const origin = siteOrigin();
    const session = await initiateSslcommerzSession({
      tranId: String(order.order_number || orderId).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 30),
      amount: total,
      currency: "BDT",
      customerName: String(order.customer_name || "Customer"),
      customerEmail: "customer@example.com",
      customerPhone: String(order.phone || ""),
      customerAddress: String(order.shipping_address || "Dhaka"),
      customerCity: "Dhaka",
      successUrl: `${origin}/api/payment/sslcommerz/success`,
      failUrl: `${origin}/api/payment/sslcommerz/fail`,
      cancelUrl: `${origin}/api/payment/sslcommerz/cancel`,
      ipnUrl: `${origin}/api/payment/sslcommerz/ipn`,
      productName: `Order ${order.order_number}`,
      valueA: order.id,
      valueB: String(order.order_number || ""),
    });

    if (!session.ok) {
      return NextResponse.json({ error: session.message }, { status: 502 });
    }

    return NextResponse.json({ gatewayPageUrl: session.gatewayPageUrl });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
