/**
 * Reusable JSON-LD Structured Data Components for Rafsan Clothing (therafsan.com)
 *
 * Usage:
 *   import { OrganizationSchema, ProductSchema, BreadcrumbSchema, WebSiteSchema, FAQPageSchema } from "@/app/schema";
 *
 *   // In any server component:
 *   <OrganizationSchema />
 *   <ProductSchema product={product} />
 *   <BreadcrumbSchema items={[{ name: "Home", url: "https://therafsan.com" }, ...]} />
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

// ─── Types ───────────────────────────────────────────────────────────────────

type BreadcrumbItem = { name: string; url: string };

type ProductForSchema = {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  images?: string[];
  stock: number;
  category?: string;
  sku?: string;
};

type FAQItem = { question: string; answer: string };

// ─── Organization / ClothingStore Schema ─────────────────────────────────────

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Rafsan Clothing",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.png`,
    description:
      "বাংলাদেশের প্রিমিয়াম ফ্যাশন ব্র্যান্ড Rafsan Clothing — Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+, ১০০% অরিজিনাল গ্যারান্টি।",
    telephone: "+8801610735064",
    email: "rafsanclothing@gmail.com",
    priceRange: "৳৳",
    currenciesAccepted: "BDT",
    paymentAccepted: ["Cash", "Credit Card", "bKash", "Nagad", "Rocket"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Narayanganj",
      addressRegion: "Dhaka Division",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "23.6238",
      longitude: "90.4994",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+8801610735064",
        contactType: "customer service",
        availableLanguage: ["English", "Bengali"],
        areaServed: "BD",
      },
      {
        "@type": "ContactPoint",
        telephone: "+8801610735064",
        contactType: "sales",
        availableLanguage: ["English", "Bengali"],
        url: "https://wa.me/8801610735064",
      },
    ],
    sameAs: [
      "https://www.facebook.com/rafsanstorefb",
      "https://www.instagram.com/rafsanstoreig",
      "https://youtube.com/@rafsanclothing",
      "https://tiktok.com/@rafsanclothing",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── WebSite + SearchAction Schema ───────────────────────────────────────────

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rafsan Clothing",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Product Schema ──────────────────────────────────────────────────────────

export function ProductSchema({ product }: { product: ProductForSchema }) {
  const productUrl = `${SITE_URL}/product/${product.id}`;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [`${SITE_URL}/og-image.png`];

  const inStock = product.stock > 0;
  const priceValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split("T")[0];

  // Free shipping if price >= 999
  const shippingCost = product.price >= 999 ? "0" : "60";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description?.slice(0, 5000) ||
      `Buy ${product.name} at the best price in Bangladesh. Export quality, fast delivery.`,
    image: images,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Rafsan Clothing",
    },
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "BDT",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
      priceValidUntil,
      seller: {
        "@type": "Organization",
        name: "Rafsan Clothing",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: shippingCost,
          currency: "BDT",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
          },
        },
      },
    },
  };

  // Add original_price as highPrice if available
  if (product.original_price && product.original_price > product.price) {
    (schema.offers as Record<string, unknown>).highPrice =
      product.original_price.toString();
  }

  // Add category if available
  if (product.category) {
    schema.category = product.category;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── BreadcrumbList Schema ───────────────────────────────────────────────────

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQPage Schema ──────────────────────────────────────────────────────────

export function FAQPageSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── AggregateOffer Schema (for products listing / category pages) ───────────

export function AggregateOfferSchema({
  products,
  categoryName,
}: {
  products: ProductForSchema[];
  categoryName?: string;
}) {
  if (products.length === 0) return null;

  const prices = products.map((p) => p.price);
  const lowPrice = Math.min(...prices).toString();
  const highPrice = Math.max(...prices).toString();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryName
      ? `${categoryName} — Rafsan Clothing Bangladesh`
      : "All Products — Rafsan Clothing Bangladesh",
    url: categoryName
      ? `${SITE_URL}/category/${encodeURIComponent(categoryName.toLowerCase())}`
      : `${SITE_URL}/products`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${SITE_URL}/product/${product.id}`,
        image: product.images?.[0] || product.image_url || "",
        offers: {
          "@type": "Offer",
          price: product.price.toString(),
          priceCurrency: "BDT",
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}