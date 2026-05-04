/**
 * Optional post-order notifications (SMS / WhatsApp via provider webhooks).
 * Configure one or more of:
 * - ORDER_NOTIFY_WEBHOOK_URL: POST JSON { channel, to, body, meta }
 * - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ORDER_NOTIFY_SMS_TO (admin copy)
 * - WHATSAPP_CLOUD_TOKEN, WHATSAPP_CLOUD_PHONE_NUMBER_ID, ORDER_NOTIFY_WHATSAPP_TO
 */

type NotifyPayload = {
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
};

function buildMessage(p: NotifyPayload): string {
  return `Order ${p.orderNumber} confirmed. Total ৳${p.totalAmount.toFixed(0)}. ${p.customerName}. Pay: ${p.paymentMethod}.`;
}

export async function sendOrderNotifications(p: NotifyPayload): Promise<void> {
  const body = buildMessage(p);
  const webhook = process.env.ORDER_NOTIFY_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "order_confirmation",
          to: p.customerPhone,
          body,
          meta: p,
        }),
      });
    } catch {
      // non-fatal
    }
  }

  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  const smsTo = process.env.ORDER_NOTIFY_SMS_TO?.trim() || p.customerPhone.replace(/\D/g, "");

  if (sid && token && from && smsTo) {
    try {
      const auth = Buffer.from(`${sid}:${token}`).toString("base64");
      const params = new URLSearchParams({
        From: from,
        To: smsTo.startsWith("+") ? smsTo : `+${smsTo}`,
        Body: body,
      });
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
    } catch {
      // non-fatal
    }
  }

  const waToken = process.env.WHATSAPP_CLOUD_TOKEN?.trim();
  const waPhoneId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID?.trim();
  const waTo = process.env.ORDER_NOTIFY_WHATSAPP_TO?.trim() || p.customerPhone.replace(/\D/g, "");

  if (waToken && waPhoneId && waTo) {
    try {
      await fetch(
        `https://graph.facebook.com/v21.0/${waPhoneId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${waToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: waTo.replace(/\D/g, ""),
            type: "text",
            text: { preview_url: false, body },
          }),
        }
      );
    } catch {
      // non-fatal
    }
  }
}
