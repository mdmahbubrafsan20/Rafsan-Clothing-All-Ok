import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { validateSslcommerzTransaction } from "@/lib/sslcommerz";
import { sendOrderNotifications } from "@/lib/order-notify";

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  let valId: string | null = null;
  let orderId: string | null = null;

  if (ct.includes("application/json")) {
    const j = (await req.json()) as Record<string, string>;
    valId = j.val_id || null;
    orderId = j.value_a || null;
  } else {
    const f = await req.formData();
    valId = f.get("val_id")?.toString() || null;
    orderId = f.get("value_a")?.toString() || null;
  }

  if (!valId || !orderId) {
    return new NextResponse("INVALID", { status: 400 });
  }

  const validated = await validateSslcommerzTransaction(valId);
  if (!validated.ok) {
    return new NextResponse("FAILED", { status: 400 });
  }

  const admin = createSupabaseAdmin();
  if (!admin) {
    return new NextResponse("FAILED", { status: 500 });
  }

  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).single();
  if (!order) {
    return new NextResponse("FAILED", { status: 404 });
  }

  if (order.status === "processing") {
    return new NextResponse("SUCCESS", { status: 200 });
  }

  const expected = Number(order.total_amount);
  if (Math.abs(expected - validated.amount) > 1.5) {
    return new NextResponse("FAILED", { status: 400 });
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
    paymentMethod: "SSLCommerz (IPN)",
  });

  return new NextResponse("SUCCESS", { status: 200 });
}
