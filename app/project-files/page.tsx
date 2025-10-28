"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Images as ImagesIcon, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import Image from "next/image"
import { useState, useCallback, KeyboardEvent } from "react"

interface ProjectFile {
  title: string
  description: string
  filename: string
  sizeBytes?: number
  tags?: string[]
  images?: string[]
}

const projectFiles: ProjectFile[] = [
  {
    title: "Segmented Vase Plans",
    description: "Complete plans for creating a beautiful segmented wooden vase with detailed measurements, wood selection guide, and step-by-step assembly instructions.",
    filename: "segmented-vase.pdf",
    sizeBytes: 1536000, // 1.5 MB (1500 KB)
    tags: ["intermediate", "segmented turning"],
    images: [
      "/images/project-files/seg-vase.jpeg",
      "/images/project-files/segments.jpeg",
      "/images/project-files/lathe-vase.jpeg",
      "/images/project-files/lathe-vase-half.jpeg"
    ]
  }
]

function ProjectImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const hasMultiple = safeImages.length > 1;
  const [idx, setIdx] = useState(0);

  // wrap around
  const next = useCallback(() => {
    setIdx((i) => (i + 1) % (safeImages.length || 1));
  }, [safeImages.length]);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + (safeImages.length || 1)) % (safeImages.length || 1));
  }, [safeImages.length]);

  // keyboard navigation when the image is focused
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  };

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden bg-muted rounded-md"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {safeImages.length ? (
        <Image
          key={safeImages[idx]}               // force re-render when image changes
          src={safeImages[idx]}
          alt={alt}
          fill
          className="object-contain select-none"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={false}
        />
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
            className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center
                       h-11 w-11 rounded-full bg-black/45 text-white
                       hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/70
                       shadow-sm backdrop-blur-[2px]"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center
                       h-11 w-11 rounded-full bg-black/45 text-white
                       hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white/70
                       shadow-sm backdrop-blur-[2px]"
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
  );
}

export default function ProjectFilesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Page Header */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Project Files
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty mb-4">
              Free downloadable plans for select projects. Personal use only.
            </p>
            <p className="text-sm text-muted-foreground/80">
              These plans are provided for educational and personal use. Please respect our work and don't redistribute commercially.
            </p>
          </div>
        </div>
      </section>

      {/* Project Files Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {projectFiles.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">No files yet—check back soon.</h2>
              <p className="text-muted-foreground">
                We're working on adding more downloadable plans. Contact us if you have specific requests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {projectFiles.map((file, index) => (
                <Card key={index} className="flex flex-col overflow-hidden">
                  {/* Image Carousel */}
                  <div className="relative">
                    <ProjectImageCarousel images={file.images || []} alt={file.title} />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="font-serif text-xl font-bold text-foreground">
                      {file.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {file.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>File size: {file.sizeBytes ? formatFileSize(file.sizeBytes) : 'PDF'}</span>
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex gap-1">
                            {file.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-2 py-1 bg-accent rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button asChild className="w-full">
                        <a
                          href={`/files/${file.filename}`}
                          download={file.filename}
                          className="flex items-center gap-2"
                          aria-label={`Download ${file.title}`}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">Need custom plans?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            We can create detailed plans for your specific woodworking project needs.
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href="/custom-orders">Request Custom Plans</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
