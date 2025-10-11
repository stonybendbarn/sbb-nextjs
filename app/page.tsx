// app folder
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

import endGrain from "@/public/images/cutting-boards/eg-waffle.jpeg";
import gameBoards from "@/public/images/game-boards/gb-chess-wal-map.jpeg";
import cheeseBoards from "@/public/images/cheese-boards/cbeg-chaos.jpeg";
import furniture from "@/public/images/furniture/tab-mah-map-ebo.jpeg";
import barWare from "@/public/images/bar-ware/chaos-lazysusan.jpeg";
import outdoorItems from "@/public/images/outdoor-items/IMG_6584.jpeg";

type Card = { name: string; slug: string; image: StaticImageData };

const featured: Card[] = [
  { name: "End Grain Cutting Boards", slug: "cutting-boards", image: endGrain },
  { name: "Game Boards", slug: "game-boards", image: gameBoards },
  { name: "Cheese & Charcuterie Boards", slug: "cheese-boards", image: cheeseBoards },
  { name: "Furniture", slug: "furniture", image: furniture },
  { name: "Bar & Kitchen Ware", slug: "bar-ware", image: barWare },
  { name: "Outdoor Items", slug: "outdoor-items", image: outdoorItems },  
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
              Handcrafted excellence meets timeless design
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
              Discover artisan woodworking crafted with precision and passion at Stony Bend Barn.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/products">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="/custom-orders">Custom Orders</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Image 
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden">
            <img
              src="/rustic-woodworking-workshop-with-handcrafted-cutti.jpg"
              alt="Stony Bend Barn Workshop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>*/}
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              About Stony Bend Barn
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Where craftsmanship meets creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-card rounded-lg p-8 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a passion for woodworking, Stony Bend Barn has been creating beautiful, functional pieces
                for homes and businesses. Each item tells a story of dedication, skill, and love for the craft.
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 shadow-sm">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <Hammer className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Our Process</h3>
              <p className="text-muted-foreground leading-relaxed">
                We carefully select premium hardwoods and use traditional techniques combined with modern precision.
                Every piece is handcrafted with attention to detail, ensuring durability and beauty that lasts
                generations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 shadow-sm">
              <div className="w-12 h-12 bg-accent-foreground/10 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Our Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                From ready-made inventory to fully custom designs, we offer a range of services to meet your needs.
                Whether you're looking for a unique gift or a statement piece for your home, we bring your vision to
                life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (3 across) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our collection of handcrafted wood pieces
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((product, i) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group block">
                <figure className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    quality={95}
                    placeholder="blur"
                    priority={i === 0}
                    // Tuned for 3-column layout; intentionally generous for Hi-DPI
                    sizes="(min-width:1536px) 620px, (min-width:1280px) 560px, (min-width:1024px) 520px, (min-width:640px) 50vw, 95vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
                  <figcaption className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">
                    <h3 className="font-serif text-white text-2xl md:text-3xl font-extrabold text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                      {product.name}
                    </h3>
                  </figcaption>
                </figure>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Ready to create something special?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            Let's bring your custom woodworking vision to life with our expert craftsmanship.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/custom-orders">
              Start Your Custom Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
