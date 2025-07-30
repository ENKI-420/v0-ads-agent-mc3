"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Users, BarChart, FileText, Video } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function DemoSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Interact with Aiden, your intelligent business co-pilot for instant insights.",
      link: "/demo?tab=ai-chat",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Seamlessly work together on documents and projects with live updates.",
      link: "/demo?tab=collaboration",
    },
    {
      icon: BarChart,
      title: "System Metrics & Insights",
      description: "Monitor performance and gain actionable insights from your operational data.",
      link: "/demo?tab=metrics",
    },
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Intelligently analyze documents for summaries, key entities, and sentiment.",
      link: "/demo?tab=document-analysis",
    },
    {
      icon: Video,
      title: "Video Conferencing",
      description: "Smarter meetings with AI-powered transcription and automated summaries.",
      link: "/demo?tab=video-conference",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Explore Our Interactive Demo</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Dive into the core functionalities of AGENT-M3c and see how AI transforms everyday business tasks.
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-6 bg-muted rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-center mb-4">{feature.description}</p>
              <Link href={feature.link}>
                <Button variant="link" className="group">
                  Try Demo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <Link href="/demo">
          <Button size="lg" className="px-8 py-4 text-lg group">
            View All Demos
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
