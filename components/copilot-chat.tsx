"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Brain, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    sources?: string[]
    compliance?: string[]
  }
}

interface CopilotChatProps {
  role: string
  sessionId?: string
}

const rolePrompts = {
  clinician:
    "I'm your clinical AI copilot, trained on medical guidelines and protocols. I can help with diagnosis, treatment planning, and clinical decision support while maintaining HIPAA compliance.",
  attorney:
    "I'm your legal AI assistant, specialized in case law research, document analysis, and legal compliance. I can help with contract review, legal research, and regulatory guidance.",
  analyst:
    "I'm your defense intelligence copilot, trained on threat assessment and geospatial analysis. I can help with pattern recognition, risk modeling, and strategic intelligence.",
  patient:
    "I'm your personal health AI assistant. I can help you understand your health information, track symptoms, and communicate with your care team.",
  enterprise:
    "I'm your enterprise AI assistant, specialized in business intelligence and process optimization. I can help with data analysis, workflow automation, and compliance management.",
}

export function CopilotChat({ role, sessionId }: CopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        rolePrompts[role as keyof typeof rolePrompts] || "Hello! I'm your AI copilot. How can I assist you today?",
      timestamp: new Date(),
      metadata: {
        confidence: 100,
        compliance: ["SOC2", "GDPR"],
      },
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on your ${role} context, I understand you're asking about "${input}". Let me provide you with relevant, compliant information tailored to your role and current session.`,
        timestamp: new Date(),
        metadata: {
          confidence: Math.floor(Math.random() * 20) + 80,
          sources: ["Clinical Guidelines", "Best Practices", "Regulatory Framework"],
          compliance: role === "clinician" ? ["HIPAA", "SOC2"] : ["SOC2", "GDPR"],
        },
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // Voice recognition implementation would go here
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span>AI Copilot</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {role}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex space-x-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.role === "user" ? "bg-blue-500" : "bg-purple-500"}>
                      {message.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.metadata && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.metadata.confidence && (
                          <Badge variant="secondary" className="text-xs">
                            {message.metadata.confidence}% confidence
                          </Badge>
                        )}
                        {message.metadata.compliance?.map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-500">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask your ${role} AI copilot...`}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVoice}
              className={isListening ? "bg-red-500 text-white" : ""}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
