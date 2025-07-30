"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, TrendingUp, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Aiden analyzes your data and conversations to provide intelligent recommendations and automate tasks.",
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description: "Teams work together in real-time, sharing documents, ideas, and feedback effortlessly.",
    },
    {
      icon: TrendingUp,
      title: "Boost Productivity",
      description: "Streamline workflows, reduce manual effort, and focus on high-impact strategic initiatives.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Scalable",
      description:
        "Built on a robust, secure, and scalable architecture to protect your data and grow with your business.",
    },
  ]

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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <section className="py-24 bg-gradient-to-b from-muted to-background">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">How AGENT-M3c Works</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Our platform integrates advanced AI with intuitive collaboration tools to empower your business.
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="flex flex-col items-center text-center p-6 h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <step.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
