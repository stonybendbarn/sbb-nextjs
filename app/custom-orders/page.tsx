"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function CustomOrdersPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real application, this would send the form data to a server
    setSubmitted(true)
    // Reset after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Pencil className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Custom Orders
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Let's create something unique together. Share your vision and we'll bring it to life with expert
              craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Our Custom Order Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Submit Your Request</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Fill out the form below with details about your project
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Consultation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We'll discuss your vision, materials, and provide a quote
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Creation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We handcraft your piece with care and attention to detail
                </p>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Custom Order Request Form</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible about your custom order. We'll get back to you within 1-2
                  business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="h-16 w-16 text-secondary mx-auto mb-4" />
                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                      Thank you for your request!
                    </h3>
                    <p className="text-muted-foreground">
                      We've received your custom order request and will be in touch soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
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

                    {/* Project Details */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg">Project Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type *</Label>
                        <Select name="productType" required>
                          <SelectTrigger id="productType">
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cutting-board">Cutting Board</SelectItem>
                            <SelectItem value="game-board">Game Board</SelectItem>
                            <SelectItem value="cheese-board">Cheese Board</SelectItem>
                            <SelectItem value="coasters">Coasters</SelectItem>
                            <SelectItem value="outdoor">Outdoor Item</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="barware">Bar Ware</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Desired Dimensions</Label>
                        <Input id="dimensions" name="dimensions" placeholder='e.g., 18" x 24" x 2"' />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="woodPreference">Wood Preference</Label>
                        <Input
                          id="woodPreference"
                          name="woodPreference"
                          placeholder="e.g., Walnut, Maple, Cherry, Mixed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Project Description *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          rows={6}
                          placeholder="Please describe your vision in detail. Include any specific design elements, patterns, or features you'd like."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select name="budget">
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline">Desired Timeline</Label>
                        <Select name="timeline">
                          <SelectTrigger id="timeline">
                            <SelectValue placeholder="When do you need this?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">As soon as possible</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="2-3-months">2-3 months</SelectItem>
                            <SelectItem value="3-plus-months">3+ months</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-start space-x-2 pt-2">
                        <Checkbox id="engraving" name="engraving" />
                        <div className="space-y-1">
                          <Label htmlFor="engraving" className="font-normal cursor-pointer">
                            I would like custom engraving or personalization
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea
                          id="additionalNotes"
                          name="additionalNotes"
                          rows={4}
                          placeholder="Any other details, inspiration photos you've seen, or questions you have"
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Submit Custom Order Request
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">How long does a custom order take?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Timeline varies depending on the complexity of the project and our current workload. Most custom
                  orders take 4-8 weeks from approval to completion. We'll provide a specific timeline during your
                  consultation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What's the deposit requirement?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We require a 50% deposit to begin work on custom orders. The remaining balance is due upon completion
                  before shipping or pickup.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I see progress photos?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We're happy to share progress photos throughout the creation process so you can see your piece coming
                  to life.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Do you ship custom orders?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, we carefully package and ship custom orders nationwide. Shipping costs are calculated based on
                  size and destination. Local pickup is also available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
