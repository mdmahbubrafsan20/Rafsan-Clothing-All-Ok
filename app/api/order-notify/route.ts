import { NextResponse } from "next/server";
import { sendOrderNotifications } from "@/lib/order-notify";

/** Called after COD (or other client-confirmed) orders — keep idempotent and non-blocking. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderNumber?: string;
      totalAmount?: number;
      customerName?: string;
      customerPhone?: string;
      paymentMethod?: string;
    };

    if (!body.orderNumber || typeof body.totalAmount !== "number") {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    await sendOrderNotifications({
      orderNumber: body.orderNumber,
      totalAmount: body.totalAmount,
      customerName: body.customerName || "",
      customerPhone: body.customerPhone || "",
      paymentMethod: body.paymentMethod || "Cash on delivery",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
