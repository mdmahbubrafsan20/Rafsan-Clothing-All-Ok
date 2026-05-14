import type { MetadataRoute } from "next";
import { getAllCategories, fetchActiveProductsForHome } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/faqs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // Dynamic category pages
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getAllCategories();
    categoryPages = categories.map((cat) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(cat.name.toLowerCase())}`,
      lastModified: new Date(cat.updated_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Fallback static category slugs if DB fetch fails
    const fallbackCategories = ["men", "women", "kids", "sports"];
    categoryPages = fallbackCategories.map((slug) => ({
      url: `${SITE_URL}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  }

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchActiveProductsForHome(500);
    productPages = products.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: new Date(product.updated_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If DB fetch fails, product pages will be empty — static pages still served
  }

  return [...staticPages, ...categoryPages, ...productPages];
}