"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Heart, Scale, Building, FileText, BarChart3, Zap, Lock, Globe, Smartphone } from "lucide-react"
import { CollaborativeAISuite } from "@/components/ai-collaboration/collaborative-ai-suite"
import { SecureDocumentInterface } from "@/components/document-sharing/secure-document-interface"
import { MarketResearchDashboard } from "@/components/marketing/market-research-dashboard"

interface UnifiedPlatformProps {
  initialVertical?: "healthcare" | "legal" | "defense" | "enterprise"
}

export function UnifiedPlatform({ initialVertical = "enterprise" }: UnifiedPlatformProps) {
  const [selectedVertical, setSelectedVertical] = useState(initialVertical)
  const [activeFeature, setActiveFeature] = useState<"collaboration" | "documents" | "analytics" | "ai">(
    "collaboration",
  )
  const [currentUser] = useState({
    id: "user-123",
    name: "John Doe",
    role: "analyst",
    avatar: "/placeholder-user.jpg",
  })

  const verticals = [
    {
      id: "healthcare",
      name: "Healthcare",
      icon: Heart,
      color: "blue",
      description: "HIPAA-compliant telemedicine with AI clinical insights",
      features: [
        "Real-time patient consultations",
        "AI-powered clinical decision support",
        "Automated medical documentation",
        "EHR system integration",
        "HIPAA compliance monitoring",
      ],
      compliance: ["HIPAA", "HITECH", "FDA"],
      accuracy: "99.7%",
      savings: "35%",
    },
    {
      id: "legal",
      name: "Legal",
      icon: Scale,
      color: "purple",
      description: "Secure legal collaboration with contract analysis",
      features: [
        "Secure client communications",
        "AI-powered contract review",
        "Legal research automation",
        "Privilege protection",
        "Case management integration",
      ],
      compliance: ["SOC2", "GDPR", "Attorney-Client Privilege"],
      accuracy: "95.2%",
      savings: "50%",
    },
    {
      id: "defense",
      name: "Defense",
      icon: Shield,
      color: "red",
      description: "ITAR-compliant secure communications for defense operations",
      features: [
        "Multi-level security classification",
        "Real-time threat intelligence",
        "Secure mission planning",
        "Cross-domain collaboration",
        "ITAR compliance automation",
      ],
      compliance: ["ITAR", "NIST", "FedRAMP", "CMMC"],
      accuracy: "98.5%",
      savings: "45%",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: Building,
      color: "green",
      description: "AI-powered business collaboration with advanced analytics",
      features: [
        "Intelligent meeting insights",
        "Automated action tracking",
        "Team engagement analytics",
        "Workflow automation",
        "Business intelligence integration",
      ],
      compliance: ["SOC2", "GDPR", "CCPA"],
      accuracy: "92.8%",
      savings: "30%",
    },
  ]

  const platformFeatures = [
    {
      id: "collaboration",
      name: "AI Collaboration",
      icon: Brain,
      description: "Real-time AI-enhanced collaboration with transcription and insights",
    },
    {
      id: "documents",
      name: "Secure Documents",
      icon: FileText,
      description: "Enterprise-grade document sharing with granular permissions",
    },
    {
      id: "analytics",
      name: "Market Analytics",
      icon: BarChart3,
      description: "Comprehensive market research and competitive intelligence",
    },
    {
      id: "ai",
      name: "AI Insights",
      icon: Zap,
      description: "Advanced AI capabilities for each professional vertical",
    },
  ]

  const getVerticalColor = (color: string) => {
    const colors = {
      blue: "border-blue-500 bg-blue-50 text-blue-700",
      purple: "border-purple-500 bg-purple-50 text-purple-700",
      red: "border-red-500 bg-red-50 text-red-700",
      green: "border-green-500 bg-green-50 text-green-700",
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  const selectedVerticalData = verticals.find((v) => v.id === selectedVertical)

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "collaboration":
        return (
          <CollaborativeAISuite
            meetingType={selectedVertical}
            participants={[
              { id: "user1", name: "Dr. Sarah Johnson", role: "physician" },
              { id: "user2", name: "John Smith", role: "patient" },
              { id: "user3", name: "Mary Wilson", role: "nurse" },
            ]}
          />
        )
      case "documents":
        return (
          <SecureDocumentInterface userId={currentUser.id} userRole={currentUser.role} vertical={selectedVertical} />
        )
      case "analytics":
        return <MarketResearchDashboard />
      case "ai":
        return (
          <div className="p-8 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold mb-4">Advanced AI Capabilities</h3>
            <p className="text-gray-600 mb-6">
              Explore cutting-edge AI features tailored for {selectedVerticalData?.name.toLowerCase()} professionals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedVerticalData?.features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                    <h4 className="font-semibold mb-2">{feature}</h4>
                    <p className="text-sm text-gray-600">
                      AI-powered {feature.toLowerCase()} designed specifically for{" "}
                      {selectedVerticalData.name.toLowerCase()} workflows
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agent M3C</h1>
                <p className="text-sm text-gray-600">AI-Powered Collaborative Intelligence Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>Multi-Vertical Platform</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Enterprise Security</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Smartphone className="w-3 h-3" />
                <span>Cross-Platform</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Vertical Selection */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h2 className="text-lg font-semibold mb-4">Select Your Professional Vertical</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {verticals.map((vertical) => {
              const Icon = vertical.icon
              const isSelected = selectedVertical === vertical.id

              return (
                <Card
                  key={vertical.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? `border-2 ${getVerticalColor(vertical.color)}` : "border hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedVertical(vertical.id as any)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className={`w-8 h-8 ${isSelected ? `text-${vertical.color}-600` : "text-gray-600"}`} />
                      <div>
                        <h3 className="font-semibold">{vertical.name}</h3>
                        <p className="text-xs text-gray-500">{vertical.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">AI Accuracy</span>
                        <span className="font-semibold text-green-600">{vertical.accuracy}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Cost Savings</span>
                        <span className="font-semibold text-blue-600">{vertical.savings}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {vertical.compliance.slice(0, 2).map((comp) => (
                        <Badge key={comp} variant="secondary" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {vertical.compliance.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{vertical.compliance.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-6 overflow-x-auto">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon
              const isActive = activeFeature === feature.id

              return (
                <Button
                  key={feature.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setActiveFeature(feature.id as any)}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  <span>{feature.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">{renderActiveFeature()}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6" />
                <span className="text-xl font-bold">Agent M3C</span>
              </div>
              <p className="text-gray-400 text-sm">
                The world's most advanced AI-powered collaborative intelligence platform for professional verticals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Professional Verticals</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Healthcare & Telemedicine</li>
                <li>Legal & Law Firms</li>
                <li>Defense & Intelligence</li>
                <li>Enterprise & Business</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI-Powered Collaboration</li>
                <li>Secure Document Sharing</li>
                <li>Real-time Transcription</li>
                <li>Compliance Monitoring</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Security & Compliance</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>HIPAA Compliant</li>
                <li>ITAR Certified</li>
                <li>SOC2 Type II</li>
                <li>GDPR Ready</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Agent M3C. All rights reserved. Built with cutting-edge AI for professional excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
