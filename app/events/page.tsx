// app/events/page.tsx

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import type { Metadata } from "next"

type Event = {
  id: number
  title: string
  date: string
  time: string
  location: string
  address: string
  description: string
  type: string
  image: string
  spots?: string
  price?: string
}

export const metadata: Metadata = {
  title: "Events & Workshops | Stony Bend Barn",
  description:
    "Join us at craft fairs, markets, and hands-on workshops. Learn woodworking skills or find Stony Bend Barn in your community.",
  keywords: "woodworking events, craft fairs, workshops, woodworking classes, Stony Bend Barn events",
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Christmas Event",
    date: "TBD",
    time: "TBD",
    location: "TBD",
    address: "TBD",
    description:
      "Join us as we will be one of many vendors as Brindledog Scents puts on their annual Christmas event.",
    type: "Market",
    image: "outdoor craft fair with wooden products",
  },
]

const pastEvents: Array<{
  id: number
  title: string
  date: string
  description: string
  image: string
}> = [
  {
    id: 1,
    title: "Hasentree Fall Market",
    date: "September 27, 2025",
    description: "Beautiful weather helped make this event a continued success!",
    image: "holiday market with wooden gifts",
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Events & Workshops
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Join us at craft fairs, markets, and hands-on workshops. Learn woodworking skills or find us in your
              community.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground text-sm px-4 text-center">{event.image}</span>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{event.type}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">{event.title}</CardTitle>
                  <CardDescription className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">{event.location}</div>
                        <div className="text-sm">{event.address}</div>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  {(event.spots || event.price) && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      {event.spots && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{event.spots}</span>
                        </div>
                      )}
                      {event.price && <div className="text-lg font-semibold text-primary">{event.price}</div>}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {event.type === "Workshop" ? (
                    <Button className="w-full" asChild>
                      <a href="mailto:info@stonybendbarn.com?subject=Workshop Registration">Register Now</a>
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full bg-transparent">
                      Add to Calendar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup 
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
              Subscribe to our newsletter to receive updates about upcoming events, new products, and workshop
              announcements.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
              <Button type="submit" variant="secondary" size="lg" className="sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
	  */}

      {/* Past Events */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pastEvents.map((event) => (
              <div key={event.id} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted mb-4">
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground text-sm px-4 text-center">{event.image}</span>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Interested in Hosting an Event?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            We're available for private workshops, demonstrations, and vendor opportunities. Contact us to discuss your
            event needs.
          </p>
          <Button asChild size="lg">
            <a href="mailto:info@stonybendbarn.com?subject=Event Inquiry">Get in Touch</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
