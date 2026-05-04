import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { validateSslcommerzTransaction } from "@/lib/sslcommerz";
import { sendOrderNotifications } from "@/lib/order-notify";

async function readForm(req: Request): Promise<URLSearchParams> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = (await req.json()) as Record<string, string>;
    return new URLSearchParams(j);
  }
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const f = await req.formData();
    const p = new URLSearchParams();
    f.forEach((v, k) => p.set(k, String(v)));
    return p;
  }
  const text = await req.text();
  try {
    return new URLSearchParams(text);
  } catch {
    return new URLSearchParams();
  }
}

export async function POST(req: Request) {
  const params = await readForm(req);
  const valId = params.get("val_id") || params.get("valId");
  const orderId = params.get("value_a");

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  if (!valId) {
    return NextResponse.redirect(`${origin}/checkout?payment=invalid`, 303);
  }

  const validated = await validateSslcommerzTransaction(valId);
  if (!validated.ok) {
    return NextResponse.redirect(`${origin}/checkout?payment=failed`, 303);
  }

  const admin = createSupabaseAdmin();
  if (!admin || !orderId) {
    return NextResponse.redirect(`${origin}/checkout?payment=config`, 303);
  }

  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).single();
  if (!order) {
    return NextResponse.redirect(`${origin}/checkout?payment=order`, 303);
  }

  if (order.status === "processing") {
    return NextResponse.redirect(`${origin}/?payment=success`, 303);
  }

  const expected = Number(order.total_amount);
  if (Math.abs(expected - validated.amount) > 1.5) {
    return NextResponse.redirect(`${origin}/checkout?payment=amount`, 303);
  }

  await admin
    .from("orders")
    .update({
      status: "processing",
      payment_method: "sslcommerz",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  await sendOrderNotifications({
    orderNumber: String(order.order_number || orderId),
    totalAmount: validated.amount,
    customerName: String(order.customer_name || ""),
    customerPhone: String(order.phone || ""),
    paymentMethod: "SSLCommerz",
  });

  return NextResponse.redirect(`${origin}/?payment=success`, 303);
}
