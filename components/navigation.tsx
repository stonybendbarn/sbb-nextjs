"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import CartLink from "@/components/cart-link";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/products/montessori", label: "Montessori" },
    { href: "/inventory", label: "Inventory" },
    //{ href: "/gallery", label: "Gallery" },
    { href: "/project-files", label: "Project Files" },
    { href: "/custom-orders", label: "Custom Orders" },
    { href: "/products/barn-finds", label: "Barn Finds!" },
    { href: "/events", label: "Events" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 md:h-36">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Stony Bend Barn - Carolina Fine Woodworking"
              width={200}
              height={200}
              className="h-24 md:h-32 w-auto mix-blend-multiply"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
			<CartLink />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
			  <CartLink	/>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
