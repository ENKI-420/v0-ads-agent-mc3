"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Play, Shield, Brain, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0)
  const roles = [
    { name: "Clinician", path: "/clinician/dashboard", color: "text-blue-400" },
    { name: "Attorney", path: "/attorney/dashboard", color: "text-purple-400" },
    { name: "Analyst", path: "/analyst/dashboard", color: "text-red-400" },
    { name: "Patient", path: "/patient/dashboard", color: "text-green-400" },
    { name: "Enterprise", path: "/enterprise/dashboard", color: "text-orange-400" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center space-x-2 bg-gold-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
          <Shield className="w-4 h-4 text-gold-400" />
          <span className="text-gold-400 font-medium text-sm">ADSTech Next-Gen AI Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Zero-to-Deploy
          <br />
          <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">AI Blueprint</span>
        </h1>

        {/* Dynamic Role Subtitle */}
        <div className="text-2xl md:text-3xl text-slate-300 mb-8 h-12 flex items-center justify-center">
          <span>AI Copilot for </span>
          <span className={`ml-2 font-bold transition-all duration-500 ${roles[currentRole].color}`}>
            {roles[currentRole].name}s
          </span>
        </div>

        {/* Description */}
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Defense-grade AI platform with domain specialization in oncology, defense, legal, and enterprise. Real-time
          multi-modal interaction with military-standard security and compliance.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge variant="outline" className="bg-navy-800/50 border-gold-500/30 text-gold-400 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            Vector Memory & RAG
          </Badge>
          <Badge variant="outline" className="bg-navy-800/50 border-blue-500/30 text-blue-400 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            HIPAA/SOC2/GDPR Compliant
          </Badge>
          <Badge variant="outline" className="bg-navy-800/50 border-green-500/30 text-green-400 px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Role-Based AI Copilots
          </Badge>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <div className="flex flex-wrap gap-2 justify-center">
            {roles.map((role, index) => (
              <Link key={role.name} href={role.path}>
                <Button
                  variant={index === currentRole ? "default" : "outline"}
                  className={`transition-all duration-300 ${
                    index === currentRole
                      ? "bg-gold-500 hover:bg-gold-600 text-navy-900"
                      : "border-slate-600 hover:border-gold-500 hover:text-gold-400"
                  }`}
                >
                  Enter as {role.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Demo Button */}
        <div className="flex justify-center">
          <Link href="/demo">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gold-500/50 text-gold-400 hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Interactive Demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-navy-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-gold-400 mb-2">99.9%</div>
            <div className="text-sm text-slate-400">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">&lt;100ms</div>
            <div className="text-sm text-slate-400">AI Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">5</div>
            <div className="text-sm text-slate-400">Domain Specializations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">SOC2</div>
            <div className="text-sm text-slate-400">Security Certified</div>
          </div>
        </div>
      </div>
    </section>
  )
}
