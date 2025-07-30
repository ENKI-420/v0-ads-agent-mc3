"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Collaboration?</h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
          Join thousands of organizations already using AGENT-M3c to enhance their productivity with AI-powered
          collaboration tools.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg group">
              <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Try Interactive Demo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
          >
            Schedule Consultation
          </Button>
        </div>

        <div className="mt-12 text-sm opacity-75">
          <p>No credit card required • 14-day free trial • Enterprise support available</p>
        </div>
      </div>
    </section>
  )
}
