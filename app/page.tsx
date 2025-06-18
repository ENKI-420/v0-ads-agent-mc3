"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Shield, Target, Users, Brain, Video, FileText } from "lucide-react"
import { BusinessAssistant } from "@/components/3d-assistant/business-assistant"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import { DemoSection } from "@/components/sections/demo-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { CTASection } from "@/components/sections/cta-section"
import { Navbar } from "@/components/layout/navbar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import EnterpriseAvatar from "@/components/enterprise-avatar"

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
        {/* Enterprise Avatar Section */}
        <section className="min-h-screen flex items-center justify-center py-20">
          <EnterpriseAvatar />
        </section>

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
                  ADSTech Platform Capabilities
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Next-Gen AI Platform</h2>
                <p className="max-w-3xl mx-auto text-xl text-slate-300">
                  Defense-grade AI platform with domain specialization in oncology, defense, legal, and enterprise.
                  Real-time multi-modal interaction with military-standard security.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <ExecutiveFeatureCard
                  icon={<Shield className="w-8 h-8 text-gold-400" />}
                  title="Defense-Grade Security"
                  description="Military-standard encryption with HIPAA, SOC2, and GDPR compliance modes. Role-based access control and audit logging."
                />
                <ExecutiveFeatureCard
                  icon={<Target className="w-8 h-8 text-blue-400" />}
                  title="Domain Specialization"
                  description="Expert-tuned AI models for oncology, defense, legal, and enterprise verticals with superior accuracy and compliance."
                />
                <ExecutiveFeatureCard
                  icon={<Users className="w-8 h-8 text-green-400" />}
                  title="Role-Based AI Copilots"
                  description="Tailored AI assistants for clinicians, attorneys, analysts, patients, and enterprise users with specialized vocabularies."
                />
                <ExecutiveFeatureCard
                  icon={<Brain className="w-8 h-8 text-purple-400" />}
                  title="Vector Memory & RAG"
                  description="Encrypted vector database for long-term knowledge retention and retrieval-augmented generation with fast, low-latency search."
                />
                <ExecutiveFeatureCard
                  icon={<Video className="w-8 h-8 text-red-400" />}
                  title="Real-Time Multi-Modal"
                  description="WebRTC video conferencing with AI transcription, analysis, and real-time collaboration features."
                />
                <ExecutiveFeatureCard
                  icon={<FileText className="w-8 h-8 text-orange-400" />}
                  title="Secure Document Ingestion"
                  description="Permission-tagged document processing with Epic FHIR, Redox integration, and enterprise connectors."
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
