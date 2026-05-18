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
      "Rafsan Clothing | Oversized & Drop Shoulder T-Shirt Bangladesh | রাফসান ক্লোথিং",
    template: "%s | Rafsan Clothing — therafsan.com",
  },
  description:
    "Rafsan Clothing — বাংলাদেশের সেরা BD Brand। Oversized tshirt, Drop shoulder tshirt, Polo shirt, Graphic tshirt, Couple tshirt, কাস্টমাইজ টি-শার্ট। Export quality, কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery। WhatsApp: 01610-735064",
  keywords: [
    // 🔥 Core product keywords
    "oversized tshirt bangladesh",
    "drop shoulder tshirt bd",
    "buy tshirt online bangladesh",
    "polo shirt bd",
    "graphic tshirt bangladesh",
    "export quality tshirt bd",
    "online shopping bd tshirt",
    "wholesale tshirt bangladesh",
    "bulk order tshirt bd",
    "streetwear bangladesh",
    "unisex tshirt bd",
    "black tshirt bangladesh",
    "white tshirt bangladesh",
    "printed tshirt bd",
    "plain tshirt bangladesh",
    "cotton tshirt bd",
    "half sleeve tshirt bangladesh",
    "full sleeve tshirt bd",
    "couple matching tshirt bd",
    "hoodie bangladesh",
    "sports jersey bangladesh",
    "gym wear bangladesh",
    // 🛒 Conversion keywords
    "free delivery clothing bd",
    "cash on delivery tshirt bd",
    "online clothing store bangladesh",
    "best clothing brand bd",
    "original tshirt bd",
    "premium quality tshirt bd",
    // 🏷️ Brand keywords
    "rafsan clothing",
    "therafsan",
    "the rafsan",
    "rafsan clothing bangladesh",
    "rafsan store bd",
    "bd brand",
    "bangladeshi brand",
    "narayanganj clothing brand",
    "dhaka tshirt brand",
    // 🔤 Bengali keywords
    "কাপল টি শার্ট বাংলাদেশ",
    "টি শার্ট দাম বাংলাদেশ",
    "পুরুষের টি শার্ট",
    "মেয়েদের পোশাক অনলাইন",
    "কম দামে গেঞ্জি",
    "কাস্টমাইজ টি-শার্ট",
    "কম দামে টি শার্ট",
    "বাচ্চাদের টি শার্ট",
    "মেয়েদের টি শার্ট",
    "ছেলেদের গেঞ্জি দাম",
    "কালো গেঞ্জি",
    "সাদা গেঞ্জি",
    "ফ্রি ডেলিভারি পোশাক",
    "অনলাইনে কাপড় কেনা",
    "পোলো শার্ট দাম",
    "টি শার্ট বাংলাদেশ",
    "পোশাক অনলাইন",
    // 🗓️ Seasonal
    "eid collection 2025 bangladesh",
    "eid tshirt bangladesh",
  ],
  authors: [{ name: "Rafsan Clothing", url: "https://therafsan.com" }],
  creator: "Rafsan Clothing",
  publisher: "Rafsan Clothing",
  category: "fashion",
  classification: "Clothing & Apparel",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    siteName: "Rafsan Clothing",
    url: "https://therafsan.com",
    title:
      "Rafsan Clothing | Oversized, Drop Shoulder, Polo T-Shirt Bangladesh",
    description:
      "বাংলাদেশের সেরা BD Brand — Oversized, Drop Shoulder, Couple, Graphic tshirt। কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rafsan Clothing — Bangladesh's Best T-Shirt Brand | therafsan.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rafsanclothing",
    creator: "@rafsanclothing",
    title: "Rafsan Clothing | Best T-Shirt Brand Bangladesh",
    description:
      "Oversized, Drop Shoulder, Polo, Graphic tshirt bd — কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+। WhatsApp: 01610-735064",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  alternates: {
    canonical: "https://therafsan.com",
    languages: {
      "en-US": "https://therafsan.com",
      "bn-BD": "https://therafsan.com",
    },
  },
  other: {
    "geo.region": "BD-C",
    "geo.placename": "Narayanganj, Dhaka, Bangladesh",
    "geo.position": "23.6238;90.4994",
    ICBM: "23.6238, 90.4994",
    "business:contact_data:country_name": "Bangladesh",
    "business:contact_data:locality": "Narayanganj",
    "og:price:currency": "BDT",
    "product:availability": "in stock",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerUser();

  return (
    <html
      lang="bn"
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
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="preload" as="image" href="/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Rafsan Clothing" />
        <meta name="application-name" content="Rafsan Clothing" />
        <meta name="theme-color" content="#0D0D0D" />
        <meta name="msapplication-TileColor" content="#0D0D0D" />
        {/* Language targeting */}
        <meta httpEquiv="content-language" content="bn, en" />
        {/* Rich snippet hints */}
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="3 days" />
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
