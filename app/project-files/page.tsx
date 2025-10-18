import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { formatFileSize } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Project Files – Stony Bend Barn",
  description: "Free downloadable plans for select woodworking projects. Personal use only.",
}

interface ProjectFile {
  title: string
  description: string
  filename: string
  sizeBytes?: number
  tags?: string[]
}

const projectFiles: ProjectFile[] = [
  {
    title: "Cutting Board Template",
    description: "Complete plans for a 12\" x 18\" end grain cutting board with detailed measurements and assembly instructions.",
    filename: "cutting-board-template.pdf",
    sizeBytes: 2048576, // 2 MB
    tags: ["cutting-boards", "beginner", "templates"]
  },
  {
    title: "Coaster Set Plans",
    description: "Step-by-step guide to create a set of 4 wooden coasters with matching holder box.",
    filename: "coaster-set-plans.pdf",
    sizeBytes: 1536000, // 1.5 MB
    tags: ["coasters", "beginner", "gift-ideas"]
  },
  {
    title: "Chess Board Blueprint",
    description: "Detailed blueprints for a traditional 18\" x 18\" chess board with inlay techniques.",
    filename: "chess-board-blueprint.pdf",
    sizeBytes: 3072000, // 3 MB
    tags: ["game-boards", "intermediate", "inlay"]
  }
]

export default function ProjectFilesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Page Header */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
                Project Files
              </h1>
              <div className="h-px flex-1 bg-border" />
            </div>
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
                <Card key={index} className="flex flex-col">
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
