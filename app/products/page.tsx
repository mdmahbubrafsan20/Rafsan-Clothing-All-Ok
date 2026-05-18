import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchProducts, getAllCategories } from "@/lib/products";
import ProductsClient from "@/components/ProductsClient";

export const metadata: Metadata = {
  title:
    "সব পোশাক দেখুন | Oversized, Drop Shoulder, Polo, Graphic T-Shirt BD | Rafsan Clothing",
  description:
    "Rafsan Clothing-এর সম্পূর্ণ কালেকশন দেখুন — Oversized T-Shirt, Drop Shoulder T-Shirt BD, Polo Shirt, Graphic T-Shirt, Couple T-Shirt, কাস্টমাইজ টি-শার্ট, Streetwear Bangladesh। কম দামে গেঞ্জি, Export Quality, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery।",
  keywords: [
    "oversized tshirt bangladesh",
    "drop shoulder tshirt bd",
    "buy tshirt online bangladesh",
    "polo shirt bd",
    "graphic tshirt bangladesh",
    "কাপল টি শার্ট বাংলাদেশ",
    "couple matching tshirt bd",
    "কাস্টমাইজ টি-শার্ট",
    "streetwear bangladesh",
    "unisex tshirt bd",
    "export quality tshirt bd",
    "online shopping bd tshirt",
    "টি শার্ট দাম বাংলাদেশ",
    "কম দামে গেঞ্জি",
    "কম দামে টি শার্ট",
    "পুরুষের টি শার্ট",
    "মেয়েদের পোশাক অনলাইন",
    "বাচ্চাদের টি শার্ট",
    "black tshirt bangladesh",
    "white tshirt bangladesh",
    "printed tshirt bd",
    "plain tshirt bangladesh",
    "cotton tshirt bd",
    "half sleeve tshirt bangladesh",
    "full sleeve tshirt bd",
    "hoodie bangladesh",
    "sports jersey bangladesh",
    "gym wear bangladesh",
    "wholesale tshirt bangladesh",
    "bulk order tshirt bd",
    "free delivery clothing bd",
    "cash on delivery tshirt bd",
    "ফ্রি ডেলিভারি পোশাক",
    "অনলাইনে কাপড় কেনা",
    "rafsan clothing",
    "therafsan",
    "bd brand",
    "bangladeshi brand",
    "eid collection 2025 bangladesh",
    "পোশাক কেনাকাটা অনলাইন",
  ],
  openGraph: {
    title:
      "সব পোশাক | Oversized, Drop Shoulder, Polo, Couple T-Shirt Bangladesh | Rafsan Clothing",
    description:
      "Oversized, Drop Shoulder, Polo, Graphic, Couple T-Shirt — কম দামে গেঞ্জি, Export Quality, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "All Products — Rafsan Clothing Bangladesh",
      },
    ],
    type: "website",
    url: "https://therafsan.com/products",
    siteName: "Rafsan Clothing",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "সব পোশাক | T-Shirt Bangladesh — Rafsan Clothing",
    description:
      "Oversized, Drop Shoulder, Polo, Graphic T-Shirt — কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+।",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://therafsan.com/products" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categoryParam = params.category || "";
  const searchParam = params.search || "";

  const [products, categoriesData] = await Promise.all([
    fetchProducts({ activeOnly: true }),
    getAllCategories(),
  ]);

  // ProductsClient expects string[] not object[]
  const categoryNames = categoriesData.map((c) => c.name);

  return (
    <Suspense fallback={null}>
      <ProductsClient
        initialProducts={products}
        categories={categoryNames}
        initialCategory={categoryParam}
        initialSearch={searchParam}
      />
    </Suspense>
  );
}
