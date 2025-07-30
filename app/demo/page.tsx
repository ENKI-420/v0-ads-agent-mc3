"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIChat } from "@/components/demo/ai-chat"
import { RealTimeCollaboration } from "@/components/demo/real-time-collaboration"
import { SystemMetrics } from "@/components/demo/system-metrics"
import { DocumentAnalysis } from "@/components/demo/document-analysis"
import { VideoConference } from "@/components/demo/video-conference"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("ai-chat")

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 md:px-6 bg-gradient-to-b from-background to-muted">
      <div className="max-w-6xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Experience AGENT-M3c in Action
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the powerful features of our AI-powered collaboration platform through interactive demos.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-2 sm:grid-cols-5 h-auto">
              <TabsTrigger value="ai-chat" className="py-2">
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="py-2">
                Collaboration
              </TabsTrigger>
              <TabsTrigger value="metrics" className="py-2">
                Metrics
              </TabsTrigger>
              <TabsTrigger value="document-analysis" className="py-2">
                Document Analysis
              </TabsTrigger>
              <TabsTrigger value="video-conference" className="py-2">
                Video Conference
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ai-chat">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>AI-Powered Chat Assistant</CardTitle>
                <CardDescription>Interact with Aiden, your intelligent business assistant.</CardDescription>
              </CardHeader>
              <CardContent>
                <AIChat />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaboration">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Real-time Collaboration</CardTitle>
                <CardDescription>See how teams collaborate seamlessly with AGENT-M3c.</CardDescription>
              </CardHeader>
              <CardContent>
                <RealTimeCollaboration />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>System Metrics & Insights</CardTitle>
                <CardDescription>Monitor performance and gain insights from your data.</CardDescription>
              </CardHeader>
              <CardContent>
                <SystemMetrics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="document-analysis">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Intelligent Document Analysis</CardTitle>
                <CardDescription>Upload and analyze documents with AI assistance.</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentAnalysis />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video-conference">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>AI-Enhanced Video Conferencing</CardTitle>
                <CardDescription>Experience smarter meetings with AI summaries and insights.</CardDescription>
              </CardHeader>
              <CardContent>
                <VideoConference />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-6">Ready to integrate AGENT-M3c into your workflow?</p>
          <Link href="/dashboard">
            <Button size="lg" className="px-8 py-4 text-lg group">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
