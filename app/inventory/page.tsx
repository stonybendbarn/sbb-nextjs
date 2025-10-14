// app/inventory/page.tsx
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Package } from "lucide-react";
import { sql } from "@vercel/postgres";
import InventoryGrid from "@/components/InventoryGrid";

async function fetchProducts() {
  const { rows } = await sql/*sql*/`
    select id, name, category, size, price_cents, sale_price_cents, stock_status,
           images, description, shipping_cents
      from products
     order by
       case category
         when 'cutting-boards' then 1
         when 'cheese-boards'  then 2
         when 'coasters'       then 3
         when 'bar-ware'       then 4
         when 'furniture'      then 5
         else 6
       end,
       coalesce(sale_price_cents, price_cents) desc,
       name asc;
  `;
  return rows;
}

export default async function InventoryPage() {
  const products = await fetchProducts();

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold">Current Inventory</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Browse our available items ready to ship.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <InventoryGrid products={products as any} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
