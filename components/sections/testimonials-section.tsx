"use client"

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "CEO, InnovateCorp",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      feedback:
        "AGENT-M3c has revolutionized our team's productivity. The AI assistant is incredibly intuitive, and the real-time collaboration features have streamlined our workflows beyond expectation. A truly indispensable tool!",
    },
    {
      name: "David Lee",
      title: "Head of Product, TechSolutions",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      feedback:
        "The insights from AGENT-M3c's system metrics are invaluable. We've optimized our resource allocation and identified bottlenecks we never knew existed. This platform is a game-changer for data-driven decisions.",
    },
    {
      name: "Maria Garcia",
      title: "Marketing Director, GlobalBrands",
      avatar: "/placeholder-user.jpg",
      rating: 4,
      feedback:
        "Our marketing campaigns have seen a significant boost thanks to AGENT-M3c's document analysis. It helps us quickly distill key information from market research, saving countless hours. Highly recommended!",
    },
    {
      name: "Alex Johnson",
      title: "Operations Manager, FutureWorks",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      feedback:
        "The AI-enhanced video conferencing is a revelation. Automated summaries mean we never miss an action item, and the transcription feature is incredibly accurate. Meetings are now more efficient and productive.",
    },
  ]

  return (
    <section className="py-24 bg-muted">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Hear from business leaders who have transformed their operations with AGENT-M3c.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="flex flex-col items-center p-0">
                <Avatar className="w-20 h-20 mb-4 border-4 border-primary">
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg font-semibold mb-2">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground mb-4">{testimonial.title}</p>
                <CardDescription className="text-base italic">"{testimonial.feedback}"</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
