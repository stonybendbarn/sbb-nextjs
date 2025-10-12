// components/ProductTile.tsx
"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useState, useCallback } from "react";

type Props = {
  title: string;
  images: { src: string; alt?: string }[];
};

export default function ProductTile({ title, images }: Props) {
  const [i, setI] = useState(0);
  const hasMore = images.length > 1;

  const next = useCallback(() => setI((p) => (p + 1) % images.length), [images.length]);
  const prev = useCallback(
    () => setI((p) => (p - 1 + images.length) % images.length),
    [images.length]
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-neutral-100">
      <Image
        src={images[i].src}
        alt={images[i].alt ?? title}
        width={1200}
        height={900}
        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        priority={false}
      />

      {/* Subtle gradient at right edge so the arrow reads on light/dark photos */}
      {hasMore && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      )}

      {/* Right/left arrows (only show if >1 photo) */}
      {hasMore && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 shadow-md transition-opacity duration-200 focus:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next photo"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white shadow-md transition-transform duration-150 hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* “x photos” badge (only on multi-image products) */}
      {hasMore && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs text-white backdrop-blur">
          <Images className="h-3.5 w-3.5" />
          {images.length} photos
        </div>
      )}

      {/* Optional title bar */}
      <div className="absolute left-0 top-0 m-2 rounded-md bg-black/45 px-2 py-1 text-xs text-white">
        {title}
      </div>
    </div>
  );
}
