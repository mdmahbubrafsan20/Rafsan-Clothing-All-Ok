import type { MetadataRoute } from "next";
import { getAllCategories, fetchActiveProductsForHome } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages — ordered by SEO importance
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    // Static category shortcuts (fast-loading, high-intent)
    {
      url: `${SITE_URL}/category/men`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/women`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/kids`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/category/sports`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faqs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/returns`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic category pages from DB
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getAllCategories();
    // Exclude already-added static categories to avoid duplicates
    const staticSlugs = ["men", "women", "kids", "sports"];
    categoryPages = categories
      .filter(
        (cat) => !staticSlugs.includes(cat.name.toLowerCase())
      )
      .map((cat) => ({
        url: `${SITE_URL}/category/${encodeURIComponent(cat.name.toLowerCase())}`,
        lastModified: new Date(cat.updated_at || Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    // Static category pages already added above as fallback
  }

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchActiveProductsForHome(500);
    productPages = products.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: new Date(product.updated_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {
    // Product pages empty if DB fails — static pages still served
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
