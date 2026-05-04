import { NextResponse } from "next/server";

function origin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export async function POST() {
  return NextResponse.redirect(`${origin()}/checkout?payment=fail`, 303);
}

export async function GET() {
  return NextResponse.redirect(`${origin()}/checkout?payment=fail`, 303);
}
