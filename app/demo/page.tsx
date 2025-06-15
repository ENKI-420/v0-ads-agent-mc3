"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIChat } from "@/components/demo/ai-chat"
import { RealTimeCollaboration } from "@/components/demo/real-time-collaboration"
import { DocumentAnalysis } from "@/components/demo/document-analysis"
import { VideoConference } from "@/components/demo/video-conference"
import { SystemMetrics } from "@/components/demo/system-metrics"
import { Brain, Users, FileText, Video, Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState("ai-chat")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for demo initialization
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing AI Demo Environment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold">Interactive AI Demo</h1>
          </div>
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            Live Demo
          </Badge>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Demo Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Demo Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeDemo === "ai-chat" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveDemo("ai-chat")}
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Chat Assistant
              </Button>
              <Button
                variant={activeDemo === "collaboration" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveDemo("collaboration")}
              >
                <Users className="h-4 w-4 mr-2" />
                Real-time Collaboration
              </Button>
              <Button
                variant={activeDemo === "document" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveDemo("document")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Document Analysis
              </Button>
              <Button
                variant={activeDemo === "video" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveDemo("video")}
              >
                <Video className="h-4 w-4 mr-2" />
                Video Conference
              </Button>
              <Button
                variant={activeDemo === "metrics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveDemo("metrics")}
              >
                <Activity className="h-4 w-4 mr-2" />
                System Metrics
              </Button>
            </CardContent>
          </Card>

          {/* Demo Content */}
          <div className="lg:col-span-3">
            {activeDemo === "ai-chat" && <AIChat />}
            {activeDemo === "collaboration" && <RealTimeCollaboration />}
            {activeDemo === "document" && <DocumentAnalysis />}
            {activeDemo === "video" && <VideoConference />}
            {activeDemo === "metrics" && <SystemMetrics />}
          </div>
        </div>
      </div>
    </div>
  )
}
