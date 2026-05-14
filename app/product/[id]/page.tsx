import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById, getProductsByCategory } from "@/lib/products";
import ProductPageClient from "./ProductPageClient";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Rafsan Clothing",
      description: "The requested product could not be found.",
    };
  }

  const shortName =
    product.name.length > 40
      ? product.name.split("|")[0].trim()
      : product.name;

  const imageUrl = product.images?.[0] || product.image_url || "";

  return {
    title: `${shortName} | Rafsan Clothing`,
    description:
      product.description?.slice(0, 160) ||
      `Buy ${shortName} at the best price in Bangladesh. Fast delivery, quality guaranteed.`,
    openGraph: {
      title: `${shortName} | Rafsan Clothing`,
      description:
        product.description?.slice(0, 160) ||
        `Buy ${shortName} at the best price in Bangladesh.`,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${shortName} | Rafsan Clothing`,
      description:
        product.description?.slice(0, 160) ||
        `Buy ${shortName} at the best price in Bangladesh.`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  // Fetch related products in parallel
  let relatedProducts: Awaited<ReturnType<typeof getProductsByCategory>> = [];
  if (product.category) {
    relatedProducts = await getProductsByCategory(product.category);
  }

  const filteredRelated = relatedProducts
    .filter((p) => p.id !== id)
    .slice(0, 8);

  return <ProductPageClient product={product} relatedProducts={filteredRelated} />;
}
