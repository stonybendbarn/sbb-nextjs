import { Product } from "@/types/product"

interface StructuredDataProps {
  products: Product[]
  category: string
  categoryName: string
}

export function StructuredData({ products, category, categoryName }: StructuredDataProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stony Bend Barn",
    "description": "Handcrafted woodworking and custom furniture",
    "url": "https://stonybendbarn.com",
    "logo": "https://stonybendbarn.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "stonybendbarn@gmail.com",
      "contactType": "customer service"
    },
    "sameAs": [
      // Add your social media URLs here when available
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://stonybendbarn.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://stonybendbarn.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `https://stonybendbarn.com/products/${category}`
      }
    ]
  }

  const productSchemas = products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.seo_description || product.description,
    "category": categoryName,
    "brand": {
      "@type": "Brand",
      "name": "Stony Bend Barn"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Stony Bend Barn"
    },
    "offers": {
      "@type": "Offer",
      "price": (product.price_cents / 100).toString(),
      "priceCurrency": "USD",
      "availability": product.stock_status === "In Stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Stony Bend Barn"
      }
    },
    "material": "Hardwood",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Size",
        "value": product.size
      },
      {
        "@type": "PropertyValue",
        "name": "Category",
        "value": categoryName
      }
    ]
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
