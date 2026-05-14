"use client";

import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  imageUrls: string[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  onZoomOpen: () => void;
  hasDiscount: boolean;
  discountPercent: number;
  shortName: string;
}

export default function ProductImageGallery({
  imageUrls,
  selectedImageIndex,
  onSelectImage,
  onZoomOpen,
  hasDiscount,
  discountPercent,
  shortName,
}: ProductImageGalleryProps) {
  const mainImageUrl = imageUrls[selectedImageIndex] || "";

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="md:hidden">
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={shortName}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}

          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discountPercent}%
            </div>
          )}

          <button
            onClick={onZoomOpen}
            className="absolute bottom-3 right-3 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {imageUrls.length > 1 && (
            <>
              <button
                onClick={() =>
                  onSelectImage(
                    selectedImageIndex > 0
                      ? selectedImageIndex - 1
                      : imageUrls.length - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  onSelectImage(
                    selectedImageIndex < imageUrls.length - 1
                      ? selectedImageIndex + 1
                      : 0
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {imageUrls.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imageUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onSelectImage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === selectedImageIndex
                      ? "bg-white w-3"
                      : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile thumbnails */}
        {imageUrls.length > 1 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => onSelectImage(i)}
                className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                  i === selectedImageIndex
                    ? "border-black"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={url}
                  alt={`view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">
        <div
          className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 cursor-zoom-in"
          onClick={onZoomOpen}
        >
          {mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={shortName}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="50vw"
              priority
            />
          )}
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{discountPercent}%
            </div>
          )}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full">
            <ZoomIn className="w-5 h-5" />
          </div>
        </div>

        {imageUrls.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => onSelectImage(i)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                  i === selectedImageIndex
                    ? "border-black"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={url}
                  alt={`view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="12vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}