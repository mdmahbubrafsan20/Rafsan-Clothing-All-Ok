import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import MarketingBanner from "@/components/MarketingBanner";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rafsan Clothing - Premium Fashion",
  description: "Modern ecommerce store for premium clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <CartProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-screen-2xl mx-auto px-0 md:px-6 lg:px-8">
            {children}
          </main>
          <MarketingBanner />
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
