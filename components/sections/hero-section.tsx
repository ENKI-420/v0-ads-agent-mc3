"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BusinessAssistant } from "@/components/3d-assistant/business-assistant"

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BusinessAssistant />
      </div>
      <div className="container px-4 md:px-6 relative z-10 text-center text-white">
        <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 drop-shadow-lg"
            variants={itemVariants}
          >
            Unleash Your Business Potential with AI
          </motion.h1>
          <motion.p className="text-lg md:text-xl lg:text-2xl mb-10 opacity-90 drop-shadow-md" variants={itemVariants}>
            AGENT-M3c is your AI-powered co-pilot for strategic decision-making, real-time collaboration, and
            unparalleled productivity.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-8 py-4 text-lg group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Explore Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
