import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import MarketingBanner from "@/components/MarketingBanner";
import SiteFooter from "@/components/SiteFooter";
import AnnouncementBar from "@/components/AnnouncementBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";
import { getServerUser } from "@/lib/auth-server";
import { WebSiteSchema } from "@/app/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com",
  ),
  title: {
    default:
      "Rafsan Clothing | Premium Export Quality Fashion Bangladesh | রাফসান ক্লোথিং",
    template: "%s | Rafsan Clothing",
  },
  description:
    "বাংলাদেশের সেরা প্রিমিয়াম ফ্যাশন ব্র্যান্ড Rafsan Clothing। Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+। ১০০% অরিজিনাল গ্যারান্টি। WhatsApp: 01610-735064",
  keywords: [
    "bd clothing",
    "bangladeshi fashion",
    "bd brand",
    "bd tshirt",
    "drop shoulder tshirt bd",
    "oversized tshirt bangladesh",
    "men clothing bd",
    "women clothing bangladesh",
    "kids clothing bd",
    "premium tshirt bangladesh",
    "custom apparel bangladesh",
    "online clothing store bd",
    "dhaka fashion",
    "narayanganj clothing",
    "rafsan clothing bangladesh",
    "rafsan store bd",
    "export quality clothes bangladesh",
    "premium t shirt bd",
    "online clothing store dhaka",
    "fashion bangladesh",
    "custom apparel printing bangladesh",
    "wholesale t shirt bangladesh",
    "bulk order clothing bd",
    "narayanganj fashion store",
    "dhaka clothing brand",
    "bangladesh online shopping",
    "টি শার্ট বাংলাদেশ",
    "পোশাক অনলাইন",
    "ফ্যাশন ব্র্যান্ড বাংলাদেশ",
  ],
  authors: [{ name: "Rafsan Clothing" }],
  creator: "Rafsan Clothing",
  publisher: "Rafsan Clothing",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "bn_BD",
    siteName: "Rafsan Clothing",
    title:
      "Rafsan Clothing | Premium Export Quality Fashion Bangladesh",
    description:
      "বাংলাদেশের সেরা প্রিমিয়াম ফ্যাশন ব্র্যান্ড। Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rafsan Clothing - Premium Fashion Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafsan Clothing | Premium Fashion Bangladesh",
    description:
      "Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+। WhatsApp: 01610-735064",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  alternates: { canonical: "/" },
  other: {
    "geo.region": "BD-C",
    "geo.placename": "Narayanganj",
    "geo.position": "23.6238;90.4994",
    ICBM: "23.6238, 90.4994",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user server-side — cached per request, no client-side auth call needed
  const user = await getServerUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preload" as="image" href="/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#0D0D0D" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <WebSiteSchema />
        <CartProvider>
          <AnnouncementBar />
          <Navbar user={user} />
          <main className="flex-1 w-full max-w-screen-2xl mx-auto px-0 md:px-6 lg:px-8">
            {children}
          </main>
          <MarketingBanner />
          <SiteFooter />
          <WhatsAppButton />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
