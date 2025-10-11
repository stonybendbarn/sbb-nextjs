// components/footer.tsx
import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-semibold mb-4">Stony Bend Barn</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Handcrafted woodworking with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Inventory
                </Link>
              </li>
              {/* 
              <li>
                <Link
                  href="/gallery"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Gallery
                </Link>
              </li>
              */}
              <li>
                <Link
                  href="/custom-orders"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products/cutting-boards" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Cutting Boards
                </Link>
              </li>
              <li>
                <Link href="/products/game-boards" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Game Boards
                </Link>
              </li>
              <li>
                <Link href="/products/furniture" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/products/outdoor-items" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Outdoor Items
                </Link>
              </li>              
			  <li>
                <Link href="/products/bar-ware" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Bar Ware
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <a href="mailto:stonybendbarn@gmail.com" className="hover:underline">
                  stonybendbarn@gmail.com
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/stonybendbarn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/stonybendbarn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div> {/* <-- close the grid */}

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Stony Bend Barn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
