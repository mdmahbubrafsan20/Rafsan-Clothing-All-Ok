import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rafsan Clothing — Oversized & Drop Shoulder T-Shirt Bangladesh",
    short_name: "Rafsan Clothing",
    description:
      "বাংলাদেশের সেরা BD Brand — Oversized T-Shirt, Drop Shoulder, Polo Shirt, Graphic T-Shirt, কাস্টমাইজ টি-শার্ট। কম দামে গেঞ্জি, ফ্রি ডেলিভারি ৳৯৯৯+।",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0D0D0D",
    orientation: "portrait-primary",
    lang: "bn",
    dir: "ltr",
    categories: ["shopping", "fashion", "lifestyle"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        // @ts-ignore — form_factor is valid in Web App Manifest spec
        form_factor: "wide",
        label: "Rafsan Clothing Homepage",
      },
    ],
    shortcuts: [
      {
        name: "Men's Collection",
        url: "/category/men",
        description: "Shop Men's T-Shirts Bangladesh",
      },
      {
        name: "Women's Collection",
        url: "/category/women",
        description: "Shop Women's Clothing Bangladesh",
      },
      {
        name: "All Products",
        url: "/products",
        description: "Browse All T-Shirts & Clothing",
      },
    ],
    prefer_related_applications: false,
  };
}
