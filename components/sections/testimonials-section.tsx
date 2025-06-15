"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      company: "MedTech Solutions",
      content:
        "AGENT-M3c has revolutionized our medical documentation process. The AI-powered analysis saves us hours daily.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "James Rodriguez",
      role: "Legal Director",
      company: "Corporate Law Firm",
      content: "The real-time collaboration features are game-changing for our legal team's document review process.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Colonel Mike Thompson",
      role: "Defense Contractor",
      company: "Strategic Defense Corp",
      content:
        "Enterprise-grade security with cutting-edge AI capabilities. Exactly what we needed for classified projects.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Customer Success
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Trusted by Industry Leaders</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how organizations across healthcare, legal, and defense sectors are transforming their workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-semibold text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
