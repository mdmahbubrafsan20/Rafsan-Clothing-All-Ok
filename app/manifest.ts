import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rafsan Clothing — Premium Fashion Bangladesh",
    short_name: "Rafsan",
    description:
      "বাংলাদেশের সেরা প্রিমিয়াম ফ্যাশন ব্র্যান্ড। Export Quality পোশাক, ফ্রি ডেলিভারি ৳৯৯৯+।",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0D0D0D",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["shopping", "fashion", "lifestyle"],
    icons: [
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
      },
    ],
  };
}