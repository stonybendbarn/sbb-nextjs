import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { CartProvider } from "@/components/cart-context";

export const metadata: Metadata = {
  title: "Stony Bend Barn - Handcrafted Woodworking & Custom Furniture",
  description: "Premium handcrafted wood products including cutting boards, game boards, furniture, and custom woodworking. Each piece is artisan-crafted from select hardwoods at Stony Bend Barn.",
  keywords: "handcrafted woodworking, custom furniture, cutting boards, game boards, artisan wood products, premium hardwood, Stony Bend Barn",
  authors: [{ name: "Stony Bend Barn" }],
  creator: "Stony Bend Barn",
  publisher: "Stony Bend Barn",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stonybendbarn.com",
    siteName: "Stony Bend Barn",
    title: "Stony Bend Barn - Handcrafted Woodworking & Custom Furniture",
    description: "Premium handcrafted wood products including cutting boards, game boards, furniture, and custom woodworking. Each piece is artisan-crafted from select hardwoods at Stony Bend Barn.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stony Bend Barn - Handcrafted Woodworking & Custom Furniture",
    description: "Premium handcrafted wood products including cutting boards, game boards, furniture, and custom woodworking. Each piece is artisan-crafted from select hardwoods at Stony Bend Barn.",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CartProvider>
          {children}
        </CartProvider>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}