"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MessageSquare, FileText, Video, Activity, ArrowRight } from "lucide-react"
import Link from "next/link"

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("ai-chat")

  const demoFeatures = [
    {
      id: "ai-chat",
      title: "AI Chat Assistant",
      icon: Brain,
      description: "Experience multi-agent AI orchestration with real-time responses",
      preview: "Try asking: 'Analyze this medical report for key findings'",
    },
    {
      id: "collaboration",
      title: "Real-time Collaboration",
      icon: MessageSquare,
      description: "See live collaboration features with WebRTC integration",
      preview: "Join a simulated team meeting with AI copilots",
    },
    {
      id: "document",
      title: "Document Analysis",
      icon: FileText,
      description: "Upload and analyze documents with AI-powered insights",
      preview: "Upload a PDF and get instant AI analysis",
    },
    {
      id: "video",
      title: "Video Conference",
      icon: Video,
      description: "HIPAA-compliant video calls with AI transcription",
      preview: "Experience secure video with live AI assistance",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Interactive Demo
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Experience AI in Action</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just read about our capabilities—experience them firsthand. Our interactive demo showcases real AI
            features you can try right now.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {demoFeatures.map((feature) => (
                <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
                  <feature.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{feature.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {demoFeatures.map((feature) => (
              <TabsContent key={feature.id} value={feature.id}>
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{feature.title}</CardTitle>
                          <p className="text-muted-foreground mt-1">{feature.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        Live Demo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Try it yourself:</h3>
                        <p className="text-muted-foreground mb-6">{feature.preview}</p>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="h-4 w-4 text-green-500" />
                            Real-time processing
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Brain className="h-4 w-4 text-blue-500" />
                            AI-powered insights
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                            Interactive responses
                          </div>
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-6 border-2 border-dashed border-border">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <feature.icon className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-muted-foreground mb-4">Interactive {feature.title.toLowerCase()} demo</p>
                          <Link href="/demo">
                            <Button className="group">
                              Launch Demo
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="text-center mt-12">
          <Link href="/demo">
            <Button size="lg" className="px-8 py-4 text-lg group">
              Experience Full Demo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
