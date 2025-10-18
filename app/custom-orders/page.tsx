// app/custom-orders/page.tsx
"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, CheckCircle2 } from "lucide-react";

export default function CustomOrdersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // shadcn controlled fields (not native inputs)
  const [productType, setProductType] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [engraving, setEngraving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = e.currentTarget;

    // grab everything the user typed
    const data = Object.fromEntries(new FormData(form).entries());
    // add controlled shadcn fields
    (data as any).productType = productType;
    (data as any).budget = budget;
    (data as any).timeline = timeline;
    (data as any).engraving = engraving ? "yes" : "no";

    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to send");

      setSubmitted(true);
      setMsg("Thanks! We’ll be in touch shortly.");
      form.reset();
      // reset controlled fields
      setProductType(""); setBudget(""); setTimeline(""); setEngraving(false);
      setTimeout(() => { setSubmitted(false); setMsg(null); }, 5000);
    } catch (err: any) {
      setMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Pencil className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Custom Orders
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Let's create something unique together. Share your vision and we'll bring it to life.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Custom Order Request Form</CardTitle>
                <CardDescription>We’ll reply within 1–2 business days.</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="h-16 w-16 text-secondary mx-auto mb-4" />
                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                      Thank you for your request!
                    </h3>
                    <p className="text-muted-foreground">
                      We’ve received your details and will be in touch soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" name="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" name="lastName" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" />
                      </div>
                    </div>

                    {/* Project */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg">Project Details</h3>

                      {/* Product Type (shadcn Select) */}
                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type *</Label>
                        <Select value={productType} onValueChange={setProductType} required>
                          <SelectTrigger id="productType">
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cutting-board">Cutting Board</SelectItem>
                            <SelectItem value="game-board">Game Board</SelectItem>
                            <SelectItem value="cheese-board">Cheese & Charcuterie Board</SelectItem>
                            <SelectItem value="coasters">Coasters</SelectItem>
                            <SelectItem value="outdoor">Outdoor Item</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="barware">Bar Ware</SelectItem>
                            <SelectItem value="montessori">Montessori Materials</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* hidden input so FormData sees it */}
                        <input type="hidden" name="productType" value={productType} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Desired Dimensions</Label>
                        <Input id="dimensions" name="dimensions" placeholder={`e.g., 18" x 24" x 2"`} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="woodPreference">Wood Preference</Label>
                        <Input id="woodPreference" name="woodPreference" placeholder="Walnut, Maple, Cherry, Mixed" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Project Description *</Label>
                        <Textarea id="description" name="description" rows={6} required />
                      </div>

                      {/* Budget */}
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={budget} onValueChange={setBudget}>
                          <SelectTrigger id="budget">
                            <SelectValue placeholder="Select your budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-100">Under $100</SelectItem>
                            <SelectItem value="100-250">$100 - $250</SelectItem>
                            <SelectItem value="250-500">$250 - $500</SelectItem>
                            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                            <SelectItem value="1000-plus">$1,000+</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="budget" value={budget} />
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Desired Timeline</Label>
                        <Select value={timeline} onValueChange={setTimeline}>
                          <SelectTrigger id="timeline">
                            <SelectValue placeholder="When do you need this?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">As soon as possible</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="2-3-months">2–3 months</SelectItem>
                            <SelectItem value="3-plus-months">3+ months</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="timeline" value={timeline} />
                      </div>

                      {/* Engraving (shadcn Checkbox) */}
                      <div className="flex items-start space-x-2 pt-2">
                        <Checkbox id="engraving" checked={engraving} onCheckedChange={(v) => setEngraving(!!v)} />
                        <div className="space-y-1">
                          <Label htmlFor="engraving" className="font-normal cursor-pointer">
                            I would like custom engraving or personalization
                          </Label>
                        </div>
                      </div>
                      <input type="hidden" name="engraving" value={engraving ? "yes" : "no"} />

                      <div className="space-y-2">
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea id="additionalNotes" name="additionalNotes" rows={4} />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? "Sending…" : "Submit Custom Order Request"}
                    </Button>
                    {msg && <p className="text-sm text-muted-foreground text-center mt-2">{msg}</p>}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* (optional FAQ section here …) */}

      <Footer />
    </div>
  );
}
