"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/ui/animated-background"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="container px-4 md:px-6 relative z-10">
        <div
          className={`flex flex-col items-center text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Status Badge */}
          <Badge variant="secondary" className="mb-6 bg-green-500/10 text-green-500 border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Production Ready • Live Demo Available
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            AI-Enhanced
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Collaboration Platform
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            Experience the future of real-time collaboration with multi-agent AI orchestration, enterprise-grade
            security, and seamless integration across healthcare, legal, and defense sectors.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Real-time AI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Multi-Agent Orchestration</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="px-8 py-4 text-lg group">
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Try Interactive Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              View Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">&lt; 200ms</div>
              <div className="text-sm text-muted-foreground">AI Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">SOC 2</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
