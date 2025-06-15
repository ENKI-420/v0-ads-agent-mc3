"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRight, Shield, Target, Users, TrendingUp, Award } from "lucide-react"
import { BusinessAssistant } from "@/components/3d-assistant/business-assistant"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import { HeroSection } from "@/components/sections/hero-section"
import { DemoSection } from "@/components/sections/demo-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { CTASection } from "@/components/sections/cta-section"
import { Navbar } from "@/components/layout/navbar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ExecutiveLandingPage() {
  const [showContent, setShowContent] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <section
            className={cn(
              "w-full py-24 transition-opacity duration-1000",
              showContent ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="container px-6 mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block rounded-lg bg-gold-500/20 px-3 py-1 text-sm text-gold-400 font-medium mb-4">
                  Platform Capabilities
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Executive Command Center</h2>
                <p className="max-w-3xl mx-auto text-xl text-slate-300">
                  Comprehensive tools and insights designed specifically for defense industry leaders who demand
                  excellence in strategic execution.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <ExecutiveFeatureCard
                  icon={<Shield className="w-8 h-8 text-gold-400" />}
                  title="Defense-Grade Security"
                  description="Military-standard encryption and compliance frameworks ensuring your strategic data remains protected at the highest levels."
                />
                <ExecutiveFeatureCard
                  icon={<Target className="w-8 h-8 text-blue-400" />}
                  title="Strategic Intelligence"
                  description="AI-powered market analysis and competitive intelligence tailored for defense contractors and government relations."
                />
                <ExecutiveFeatureCard
                  icon={<Users className="w-8 h-8 text-green-400" />}
                  title="Leadership Development"
                  description="Executive coaching modules and team optimization tools designed for high-stakes defense industry leadership."
                />
                <ExecutiveFeatureCard
                  icon={<TrendingUp className="w-8 h-8 text-purple-400" />}
                  title="Performance Analytics"
                  description="Real-time KPI tracking and predictive modeling for contract performance and organizational efficiency."
                />
                <ExecutiveFeatureCard
                  icon={<Award className="w-8 h-8 text-gold-400" />}
                  title="Compliance Management"
                  description="Automated compliance tracking for DFARS, ITAR, and other critical defense industry regulations."
                />
                <ExecutiveFeatureCard
                  icon={<ArrowRight className="w-8 h-8 text-red-400" />}
                  title="Strategic Execution"
                  description="Project management and strategic initiative tracking with defense industry best practices integration."
                />
              </div>
            </div>
          </section>
        </Suspense>

        {/* Demo Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <DemoSection />
        </Suspense>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Call to Action Section */}
        <CTASection />
      </main>

      {/* 3D Business Assistant */}
      <BusinessAssistant
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onToggle={() => setAssistantOpen(!assistantOpen)}
      />
    </div>
  )
}

interface ExecutiveFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function ExecutiveFeatureCard({ icon, title, description }: ExecutiveFeatureCardProps) {
  return (
    <div className="group p-8 rounded-xl executive-card hover:shadow-executive transition-all duration-300 transform hover:-translate-y-2">
      <div className="p-4 rounded-full bg-navy-900/20 dark:bg-gold-500/20 mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-navy-900 dark:text-white mb-4">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
    </div>
  )
}
