"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/shared/footer"
import { useAidenStore } from "@/store/aidenStore"
import { Shield, Brain, Zap, Lock, Mic, FileText, Monitor, Network, CheckCircle } from "lucide-react"
import { HeroSection } from "@/components/sections/hero-section"
import { DemoSection } from "@/components/sections/demo-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { CTASection } from "@/components/sections/cta-section"
import { Navbar } from "@/components/layout/navbar"
import { ExecutiveAnimatedBackground } from "@/components/animated-background"
import { AidenAssistant } from "@/components/aiden-assistant/AidenAssistant"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  const { setVisible, processInteraction } = useAidenStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartTour = async () => {
    setIsLoading(true)
    setVisible(true)

    // Trigger onboarding tour
    await processInteraction("system_trigger", {
      systemTrigger: {
        type: "onboarding_tour",
        context: "landing_page_cta",
      },
    })

    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ExecutiveAnimatedBackground />
      <Navbar />
      <main className="relative z-10 flex flex-col min-h-[100dvh]">
        <HeroSection />

        <DemoSection />

        <HowItWorksSection />

        {/* Core Capabilities */}
        <section className="section-padding bg-muted/30">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Aiden Engine Core Capabilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the future of AI-driven defense intelligence with our comprehensive suite of advanced
                capabilities
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                {
                  icon: Brain,
                  title: "Multi-Modal AI Processing",
                  description:
                    "Advanced natural language understanding, document analysis, and visual intelligence processing",
                  features: ["Text & Voice Input", "Document Intelligence", "Visual Analysis"],
                },
                {
                  icon: Zap,
                  title: "Real-Time Analytics",
                  description: "Instant insights and predictive analytics for strategic decision-making",
                  features: ["Live Dashboards", "Predictive Models", "Alert Systems"],
                },
                {
                  icon: Mic,
                  title: "Voice-Powered Interactions",
                  description: "Natural voice commands and conversational AI for hands-free operation",
                  features: ["Voice Commands", "Speech-to-Text", "Audio Analysis"],
                },
                {
                  icon: FileText,
                  title: "Document Intelligence",
                  description: "Automated document processing, classification, and insight extraction",
                  features: ["OCR Processing", "Content Analysis", "Auto Classification"],
                },
                {
                  icon: Monitor,
                  title: "Screen Capture & Analysis",
                  description: "Intelligent screen context understanding and workflow optimization",
                  features: ["Context Awareness", "Workflow Analysis", "UI Intelligence"],
                },
                {
                  icon: Network,
                  title: "Multi-Agent Workflows",
                  description: "Coordinated AI agents working together for complex task execution",
                  features: ["Agent Orchestration", "Task Delegation", "Workflow Automation"],
                },
              ].map((capability, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="card-executive h-full">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <capability.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl mb-2">{capability.title}</CardTitle>
                      <CardDescription className="text-base">{capability.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {capability.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="section-padding bg-muted/30">
          <div className="container">
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-4">
                  <Lock className="h-4 w-4 mr-2" />
                  Enterprise Security
                </Badge>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                  CMMC & HIPAA Compliant by Design
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Built from the ground up with defense industry security requirements in mind. Our platform meets the
                  highest standards for data protection and regulatory compliance.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "End-to-End Encryption",
                    "Zero Trust Architecture",
                    "Audit Trail Logging",
                    "Role-Based Access Control",
                    "Data Residency Control",
                    "Continuous Monitoring",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-executive">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-6 w-6 text-primary mr-3" />
                      Security Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-semibold">CMMC Level 2</div>
                        <div className="text-sm text-muted-foreground">Cybersecurity Maturity Model</div>
                      </div>
                      <Badge variant="secondary">Certified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-semibold">HIPAA Compliant</div>
                        <div className="text-sm text-muted-foreground">Health Information Protection</div>
                      </div>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-semibold">SOC 2 Type II</div>
                        <div className="text-sm text-muted-foreground">Security & Availability</div>
                      </div>
                      <Badge variant="secondary">Audited</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <TestimonialsSection />

        <PricingSection />

        <CTASection />
      </main>
      <Footer />
      <AidenAssistant />
    </div>
  )
}
