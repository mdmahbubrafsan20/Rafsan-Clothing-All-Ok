/**
 * SSLCommerz hosted payment session (v4).
 * @see https://developer.sslcommerz.com/doc/v4/
 */

const SANDBOX = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const LIVE = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

export type InitiatePaymentInput = {
  tranId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
  productName: string;
  /** Passed through gateway and returned on success (e.g. Supabase order UUID). */
  valueA?: string;
  valueB?: string;
};

export type InitiatePaymentResult =
  | { ok: true; gatewayPageUrl: string; sessionkey?: string }
  | { ok: false; message: string };

export function isSslcommerzConfigured(): boolean {
  return Boolean(
    process.env.SSLCOMMERZ_STORE_ID?.trim() &&
      process.env.SSLCOMMERZ_STORE_PASSWORD?.trim()
  );
}

export async function initiateSslcommerzSession(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResult> {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePass = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePass) {
    return { ok: false, message: "SSLCommerz is not configured." };
  }

  const baseUrl =
    process.env.SSLCOMMERZ_SANDBOX === "0" || process.env.SSLCOMMERZ_SANDBOX === "false"
      ? LIVE
      : SANDBOX;

  const body = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePass,
    total_amount: input.amount.toFixed(2),
    currency: input.currency,
    tran_id: input.tranId,
    success_url: input.successUrl,
    fail_url: input.failUrl,
    cancel_url: input.cancelUrl,
    ipn_url: input.ipnUrl,
    cus_name: input.customerName.slice(0, 50),
    cus_email: input.customerEmail || "customer@example.com",
    cus_add1: input.customerAddress.slice(0, 150),
    cus_city: input.customerCity.slice(0, 50),
    cus_country: "Bangladesh",
    cus_phone: input.customerPhone.replace(/\D/g, "").slice(0, 20) || "01700000000",
    shipping_method: "NO",
    product_name: input.productName.slice(0, 240),
    product_category: "clothing",
    product_profile: "general",
  });
  if (input.valueA) body.set("value_a", input.valueA.slice(0, 500));
  if (input.valueB) body.set("value_b", input.valueB.slice(0, 500));

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { ok: false, message: "Invalid response from payment gateway." };
  }

  if (data.status !== "SUCCESS") {
    const failed =
      typeof data.failedreason === "string"
        ? data.failedreason
        : typeof data.message === "string"
          ? data.message
          : "Gateway rejected the session.";
    return { ok: false, message: failed };
  }

  const gatewayPageUrl = data.GatewayPageURL;
  if (typeof gatewayPageUrl !== "string" || !gatewayPageUrl.startsWith("http")) {
    return { ok: false, message: "Missing GatewayPageURL in gateway response." };
  }

  const sessionkey = typeof data.sessionkey === "string" ? data.sessionkey : undefined;
  return { ok: true, gatewayPageUrl, sessionkey };
}

const VALIDATOR_SANDBOX =
  "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
const VALIDATOR_LIVE = "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

export type ValidationResult =
  | { ok: true; amount: number; currency: string; tranId: string; cardType?: string }
  | { ok: false; message: string };

/** Validate transaction after redirect or IPN using val_id. */
export async function validateSslcommerzTransaction(valId: string): Promise<ValidationResult> {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePass = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePass || !valId) {
    return { ok: false, message: "Missing validation parameters." };
  }

  const validator =
    process.env.SSLCOMMERZ_SANDBOX === "0" || process.env.SSLCOMMERZ_SANDBOX === "false"
      ? VALIDATOR_LIVE
      : VALIDATOR_SANDBOX;

  const qs = new URLSearchParams({
    val_id: valId,
    store_id: storeId,
    store_passwd: storePass,
    v: "1",
    format: "json",
  });

  const res = await fetch(`${validator}?${qs.toString()}`);
  const data = (await res.json()) as Record<string, unknown>;

  if (data.status !== "VALID" && data.status !== "VALIDATED") {
    return {
      ok: false,
      message: typeof data.error === "string" ? data.error : "Validation failed.",
    };
  }

  const amount = Number(data.amount ?? data.store_amount);
  if (!Number.isFinite(amount)) {
    return { ok: false, message: "Invalid amount in validation response." };
  }

  return {
    ok: true,
    amount,
    currency: String(data.currency_type || "BDT"),
    tranId: String(data.tran_id || ""),
    cardType: typeof data.card_type === "string" ? data.card_type : undefined,
  };
}
