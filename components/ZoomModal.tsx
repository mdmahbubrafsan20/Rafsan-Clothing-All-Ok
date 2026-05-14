"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export default function ZoomModal({ isOpen, onClose, imageUrl, alt }: ZoomModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
      <div
        className="relative w-full max-w-2xl aspect-square"
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
        )}
      </div>
    </div>
  );
}