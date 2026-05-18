import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById, getProductsByCategory } from "@/lib/products";
import ProductPageClient from "./ProductPageClient";
import { ProductSchema, BreadcrumbSchema } from "@/app/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Rafsan Clothing",
      description: "This product is not available. Browse our full collection of Export Quality T-Shirts at Rafsan Clothing Bangladesh.",
    };
  }

  const productUrl = `${SITE_URL}/product/${product.id}`;
  const imageUrl =
    product.images?.[0] || product.image_url || `${SITE_URL}/og-image.png`;

  const categoryLabel = product.category
    ? `${product.category} · `
    : "";

  // Smart title: product name + key buying signals
  const title = `${product.name} | ${categoryLabel}Export Quality T-Shirt BD | Rafsan Clothing`;

  // Smart description with price + keywords
  const priceText = product.price
    ? `মাত্র ৳${product.price}`
    : "সেরা দামে";
  const description =
    product.description?.slice(0, 120) ||
    `${product.name} কিনুন ${priceText} — Rafsan Clothing Bangladesh (therafsan.com)। Export Quality, কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+, Cash on Delivery, ৭ দিনের Return গ্যারান্টি।`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} bangladesh`,
      `${product.name} bd`,
      "oversized tshirt bangladesh",
      "drop shoulder tshirt bd",
      "buy tshirt online bangladesh",
      "export quality tshirt bd",
      "rafsan clothing",
      "therafsan",
      "bd brand",
      "bangladeshi brand",
      "কম দামে গেঞ্জি",
      "টি শার্ট দাম বাংলাদেশ",
      "free delivery clothing bd",
      "cash on delivery tshirt bd",
      ...(product.category ? [product.category, `${product.category} bangladesh`] : []),
    ],
    openGraph: {
      title: `${product.name} — ${priceText} | Rafsan Clothing Bangladesh`,
      description,
      type: "website",
      url: productUrl,
      siteName: "Rafsan Clothing",
      locale: "bn_BD",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${product.name} — Rafsan Clothing Bangladesh | therafsan.com`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Rafsan Clothing BD`,
      description: `${priceText} — Export Quality, ফ্রি ডেলিভারি ৳৯৯৯+।`,
      images: [imageUrl],
    },
    alternates: { canonical: productUrl },
    other: {
      "product:price:amount": product.price?.toString() || "",
      "product:price:currency": "BDT",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:brand": "Rafsan Clothing",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  // Fetch related products — same as original
  let relatedProducts: Awaited<ReturnType<typeof getProductsByCategory>> = [];
  if (product.category) {
    relatedProducts = await getProductsByCategory(product.category);
  }

  const filteredRelated = relatedProducts
    .filter((p) => p.id !== id)
    .slice(0, 8);

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          ...(product.category
            ? [
                {
                  name: product.category,
                  url: `${SITE_URL}/category/${encodeURIComponent(
                    product.category.toLowerCase()
                  )}`,
                },
              ]
            : []),
          { name: product.name, url: `${SITE_URL}/product/${product.id}` },
        ]}
      />
      <ProductPageClient product={product} relatedProducts={filteredRelated} />
    </>
  );
}
