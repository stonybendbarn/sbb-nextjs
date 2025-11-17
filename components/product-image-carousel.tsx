"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Images as ImagesIcon } from "lucide-react"
import { useState, useCallback, KeyboardEvent, useEffect } from "react"

interface ProductImageCarouselProps {
  images: string[]
  alt: string
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : []
  const hasMultiple = safeImages.length > 1
  const [idx, setIdx] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset loaded state when image changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [idx, safeImages[idx]])

  // wrap around
  const next = useCallback(() => {
    setIdx((i) => (i + 1) % (safeImages.length || 1))
  }, [safeImages.length])

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + (safeImages.length || 1)) % (safeImages.length || 1))
  }, [safeImages.length])

  // keyboard navigation when the image is focused
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return
    if (e.key === "ArrowRight") { e.preventDefault(); next() }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev() }
  }

  // Ensure image path starts with / for absolute paths
  const getImageSrc = (imagePath: string) => {
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-muted rounded-md"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {safeImages.length ? (
        imageError ? (
          // Fallback to regular img tag ONLY if Next.js Image fails
          <img
            src={getImageSrc(safeImages[idx])}
            alt={alt}
            className="w-full h-full object-contain select-none"
            style={{ position: 'absolute', inset: 0 }}
            onError={() => {
              console.error('Image failed to load even with fallback:', getImageSrc(safeImages[idx]))
            }}
            onLoad={() => {
              setImageLoaded(true)
              setImageError(false)
            }}
          />
        ) : (
          <Image
            key={getImageSrc(safeImages[idx])}
            src={getImageSrc(safeImages[idx])}
            alt={alt}
            fill
            className="object-contain select-none"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            priority={false}
            unoptimized={safeImages[idx]?.includes('metal_inset')}
            onError={(e) => {
              console.error('Next.js Image failed, falling back to regular img:', getImageSrc(safeImages[idx]), e)
              setImageError(true)
            }}
            onLoad={() => {
              setImageLoaded(true)
              setImageError(false)
            }}
          />
        )
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <span className="px-3 text-sm">Image coming soon</span>
        </div>
      )}

      {hasMultiple && (
        <>
          {/* counter badge */}
          <div className="pointer-events-none absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/45 text-white px-1.5 py-0.5 text-[10px]">
            <ImagesIcon className="h-3.5 w-3.5" /> {idx + 1}/{safeImages.length}
          </div>

          {/* prev/next buttons */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-11 w-11 rounded-full bg-black/45 text-white hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/70 shadow-sm backdrop-blur-[2px]"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-11 w-11 rounded-full bg-black/45 text-white hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/70 shadow-sm backdrop-blur-[2px]"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

