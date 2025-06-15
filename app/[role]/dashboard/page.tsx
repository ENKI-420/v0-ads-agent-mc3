"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Users, FileText, Video, Brain, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopilotChat } from "@/components/copilot-chat"
import { ComplianceStatus } from "@/components/compliance-status"
import { RoleNavigation } from "@/components/role-navigation"

const roleConfigs = {
  clinician: {
    title: "Clinical AI Copilot",
    description: "AI-powered clinical decision support with HIPAA compliance",
    color: "bg-blue-500",
    features: ["EHR Integration", "Clinical Guidelines", "Drug Interactions", "Diagnostic Support"],
  },
  attorney: {
    title: "Legal AI Assistant",
    description: "AI-powered legal research and document analysis",
    color: "bg-purple-500",
    features: ["Case Law Research", "Document Review", "Contract Analysis", "Compliance Tracking"],
  },
  analyst: {
    title: "Defense Intelligence Copilot",
    description: "AI-powered intelligence analysis with security clearance",
    color: "bg-red-500",
    features: ["Threat Assessment", "Geospatial Analysis", "Pattern Recognition", "Risk Modeling"],
  },
  patient: {
    title: "Patient Portal",
    description: "Secure patient communication and health insights",
    color: "bg-green-500",
    features: ["Health Tracking", "Appointment Scheduling", "Secure Messaging", "Care Plans"],
  },
  enterprise: {
    title: "Enterprise AI Hub",
    description: "AI-powered business intelligence and automation",
    color: "bg-orange-500",
    features: ["Process Automation", "Data Analytics", "Workflow Optimization", "Compliance Management"],
  },
}

export default function RoleDashboard() {
  const params = useParams()
  const role = params.role as string
  const config = roleConfigs[role as keyof typeof roleConfigs]
  const [activeSession, setActiveSession] = useState<string | null>(null)

  if (!config) {
    return <div>Invalid role</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-navy-900 border-r border-navy-700">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-navy-900" />
              </div>
              <span className="text-xl font-bold text-white">ADSTech</span>
            </div>
            <RoleNavigation currentRole={role} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-navy-800 border-b border-navy-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{config.title}</h1>
                <p className="text-slate-300">{config.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <ComplianceStatus />
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Features & Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Start your AI-powered workflow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="h-20 flex-col space-y-2">
                        <Video className="w-6 h-6" />
                        <span>Start Session</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <FileText className="w-6 h-6" />
                        <span>Upload Document</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <Users className="w-6 h-6" />
                        <span>Collaborate</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <Brain className="w-6 h-6" />
                        <span>AI Analysis</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Role-Specific Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Capabilities</CardTitle>
                    <CardDescription>Specialized features for your role</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {config.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-navy-900/20">
                          <div className={`w-3 h-3 rounded-full ${config.color}`} />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">AI Analysis Completed</p>
                          <p className="text-xs text-slate-500">Document processed with 98% confidence</p>
                        </div>
                        <span className="text-xs text-slate-400">2 min ago</span>
                      </div>
                      <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Collaboration Session Started</p>
                          <p className="text-xs text-slate-500">3 participants joined</p>
                        </div>
                        <span className="text-xs text-slate-400">15 min ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - AI Copilot */}
              <div className="space-y-6">
                <CopilotChat role={role} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
