"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-green-500/10 text-green-500 border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Ready for Production
          </Badge>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Transform Your Workflow
            <span className="block text-primary">Today</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of organizations already using AGENT-M3c to revolutionize their collaboration and
            decision-making processes with AI-powered insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-4 text-lg group">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">SOC 2 & HIPAA compliant</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Sub-200ms AI responses</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Integration</h3>
              <p className="text-sm text-muted-foreground">Setup in under 5 minutes</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Trusted by 500+ organizations • 99.9% uptime SLA • 24/7 support
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
