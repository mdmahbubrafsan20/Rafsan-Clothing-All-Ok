/**
 * JSON-LD Structured Data — Rafsan Clothing (therafsan.com)
 * Full SEO schema: Organization, WebSite, Product, Breadcrumb, FAQ, ItemList
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://therafsan.com";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Organization / ClothingStore Schema ──────────────────────────────────────

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["ClothingStore", "OnlineStore"],
    "@id": `${SITE_URL}/#organization`,
    name: "Rafsan Clothing",
    alternateName: ["therafsan", "The Rafsan", "রাফসান ক্লোথিং", "Rafsan Store"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-image.png`,
    description:
      "Rafsan Clothing (therafsan.com) — বাংলাদেশের সেরা BD Brand। Oversized T-Shirt, Drop Shoulder T-Shirt, Polo Shirt, Graphic T-Shirt, Couple T-Shirt, কাস্টমাইজ টি-শার্ট। Export Quality, কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+।",
    telephone: "+8801610735064",
    email: "rafsanclothing@gmail.com",
    priceRange: "৳৳",
    currenciesAccepted: "BDT",
    paymentAccepted: ["Cash", "bKash", "Nagad", "Rocket", "Credit Card"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Rafsan Clothing Products",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Oversized T-Shirt Bangladesh" },
        { "@type": "OfferCatalog", name: "Drop Shoulder T-Shirt BD" },
        { "@type": "OfferCatalog", name: "Polo Shirt BD" },
        { "@type": "OfferCatalog", name: "Graphic T-Shirt Bangladesh" },
        { "@type": "OfferCatalog", name: "Couple T-Shirt Bangladesh" },
        { "@type": "OfferCatalog", name: "Customize T-Shirt BD" },
        { "@type": "OfferCatalog", name: "Streetwear Bangladesh" },
        { "@type": "OfferCatalog", name: "Gym Wear Bangladesh" },
        { "@type": "OfferCatalog", name: "Wholesale T-Shirt Bangladesh" },
      ],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Narayanganj",
      addressRegion: "Dhaka Division",
      addressCountry: "BD",
      postalCode: "1400",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "23.6238",
      longitude: "90.4994",
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "14:00",
        closes: "20:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+8801610735064",
        contactType: "customer service",
        availableLanguage: ["Bengali", "English"],
        areaServed: "BD",
        contactOption: "TollFree",
      },
      {
        "@type": "ContactPoint",
        telephone: "+8801610735064",
        contactType: "sales",
        availableLanguage: ["Bengali", "English"],
        url: "https://wa.me/8801610735064",
      },
    ],
    sameAs: [
      "https://www.facebook.com/rafsanstorefb",
      "https://www.instagram.com/rafsanstoreig",
      "https://youtube.com/@rafsanclothing",
      "https://tiktok.com/@rafsanclothing",
    ],
    knowsAbout: [
      "Oversized T-Shirt Bangladesh",
      "Drop Shoulder T-Shirt BD",
      "Export Quality Clothing Bangladesh",
      "Bangladeshi Fashion Brand",
      "Streetwear Bangladesh",
      "Wholesale T-Shirt Bangladesh",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── WebSite + SearchAction Schema ────────────────────────────────────────────

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Rafsan Clothing",
    alternateName: "therafsan.com",
    url: SITE_URL,
    description:
      "বাংলাদেশের সেরা Oversized T-Shirt, Drop Shoulder, Polo Shirt, Graphic T-Shirt Brand — Rafsan Clothing",
    inLanguage: ["bn-BD", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Product Schema ────────────────────────────────────────────────────────────

export function ProductSchema({ product }: { product: ProductForSchema }) {
  const productUrl = `${SITE_URL}/product/${product.id}`;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [`${SITE_URL}/og-image.png`];

  const inStock = product.stock > 0;
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const shippingCost = product.price >= 999 ? "0" : "60";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description?.slice(0, 5000) ||
      `Buy ${product.name} at the best price in Bangladesh from Rafsan Clothing (therafsan.com). Export quality, fast delivery across Bangladesh. Cash on Delivery available.`,
    image: images,
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Rafsan Clothing",
      url: SITE_URL,
    },
    manufacturer: {
      "@type": "Organization",
      name: "Rafsan Clothing",
      url: SITE_URL,
    },
    countryOfOrigin: {
      "@type": "Country",
      name: "Bangladesh",
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
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Rafsan Clothing",
        url: SITE_URL,
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
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BD",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  if (product.original_price && product.original_price > product.price) {
    (schema.offers as Record<string, unknown>).highPrice =
      product.original_price.toString();
  }

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

// ─── BreadcrumbList Schema ─────────────────────────────────────────────────────

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

// ─── FAQPage Schema ────────────────────────────────────────────────────────────

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

// ─── AggregateOffer / ItemList Schema (category & products pages) ──────────────

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
      ? `${categoryName} — Rafsan Clothing Bangladesh | therafsan.com`
      : "All T-Shirts & Clothing — Rafsan Clothing Bangladesh",
    description: categoryName
      ? `Buy ${categoryName} at Rafsan Clothing Bangladesh. Export quality, কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+।`
      : "Shop Oversized T-Shirt, Drop Shoulder, Polo Shirt, Graphic T-Shirt, Couple T-Shirt Bangladesh. কম দামে গেঞ্জি, ফ্রি ডেলিভারি।",
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
        brand: { "@type": "Brand", name: "Rafsan Clothing" },
        offers: {
          "@type": "Offer",
          price: product.price.toString(),
          priceCurrency: "BDT",
          lowPrice,
          highPrice,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Rafsan Clothing" },
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

// ─── Local Business Schema (for local SEO) ────────────────────────────────────

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Rafsan Clothing",
    image: `${SITE_URL}/og-image.png`,
    url: SITE_URL,
    telephone: "+8801610735064",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Narayanganj",
      addressRegion: "Dhaka Division",
      postalCode: "1400",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.6238,
      longitude: 90.4994,
    },
    priceRange: "৳৳",
    servesCuisine: undefined,
    currenciesAccepted: "BDT",
    paymentAccepted: "Cash, bKash, Nagad, Rocket",
    openingHours: ["Su-Th 10:00-20:00", "Fr 14:00-20:00"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
