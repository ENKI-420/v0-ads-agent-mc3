"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Mic,
  MicOff,
  Upload,
  Send,
  Loader2,
  Shield,
  Zap,
  FileText,
  ImageIcon,
  Video,
  Volume2,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
  sources?: any[]
  recommendations?: string[]
  processingTime?: number
  modelUsed?: string
}

interface AdvancedCopilotProps {
  role: string
  complianceMode: string[]
  sessionId?: string
  userId: string
}

export function AdvancedCopilot({ role, complianceMode, sessionId, userId }: AdvancedCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedTask, setSelectedTask] = useState("general")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [streamingResponse, setStreamingResponse] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const taskOptions = {
    clinician: [
      { value: "diagnosis_support", label: "Diagnosis Support" },
      { value: "treatment_planning", label: "Treatment Planning" },
      { value: "drug_interaction", label: "Drug Interactions" },
      { value: "clinical_documentation", label: "Clinical Documentation" },
    ],
    attorney: [
      { value: "case_research", label: "Case Research" },
      { value: "contract_analysis", label: "Contract Analysis" },
      { value: "compliance_review", label: "Compliance Review" },
      { value: "legal_writing", label: "Legal Writing" },
    ],
    analyst: [
      { value: "threat_assessment", label: "Threat Assessment" },
      { value: "geospatial_analysis", label: "Geospatial Analysis" },
      { value: "pattern_recognition", label: "Pattern Recognition" },
      { value: "intelligence_briefing", label: "Intelligence Briefing" },
    ],
    patient: [
      { value: "health_education", label: "Health Education" },
      { value: "appointment_prep", label: "Appointment Prep" },
      { value: "medication_guidance", label: "Medication Guidance" },
      { value: "wellness_support", label: "Wellness Support" },
    ],
    enterprise: [
      { value: "business_analysis", label: "Business Analysis" },
      { value: "process_optimization", label: "Process Optimization" },
      { value: "financial_analysis", label: "Financial Analysis" },
      { value: "strategic_planning", label: "Strategic Planning" },
    ],
  }

  const currentTasks = taskOptions[role as keyof typeof taskOptions] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingResponse])

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedFile) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: uploadedFile ? `[File: ${uploadedFile.name}] ${input}` : input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setStreamingResponse("")

    try {
      let response: any

      if (uploadedFile) {
        // Handle multi-modal input
        const formData = new FormData()
        formData.append("file", uploadedFile)
        formData.append("role", role)
        formData.append("complianceMode", JSON.stringify(complianceMode))
        if (input.trim()) {
          formData.append("text", input)
        }

        response = await fetch("/api/ai/multi-modal", {
          method: "POST",
          body: formData,
        })
      } else {
        // Handle text-only input
        response = await fetch("/api/ai/advanced-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            task: selectedTask,
            query: input,
            complianceMode,
            sessionId,
            userId,
            streaming: false,
          }),
        })
      }

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || data.extractedText,
          timestamp: new Date(),
          confidence: data.confidence,
          sources: data.sources,
          recommendations: data.recommendations || data.insights,
          processingTime: data.processingTime,
          modelUsed: data.modelUsed,
        }

        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setUploadedFile(null)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" })
        setUploadedFile(audioFile)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (file.type.startsWith("audio/")) return <Volume2 className="w-4 h-4" />
    if (file.type.startsWith("video/")) return <Video className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-gold-500" />
            AI Copilot
          </CardTitle>
          <div className="flex items-center gap-2">
            {complianceMode.map((mode) => (
              <Badge key={mode} variant="outline" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                {mode}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mb-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-gold-500 text-navy-900" : "bg-navy-900 text-white"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {message.role === "assistant" && (
                        <div className="mt-2 space-y-2">
                          {message.confidence && (
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              <Zap className="w-3 h-3" />
                              Confidence: {(message.confidence * 100).toFixed(0)}%
                            </div>
                          )}

                          {message.recommendations && message.recommendations.length > 0 && (
                            <div className="text-xs">
                              <p className="font-medium mb-1">Recommendations:</p>
                              <ul className="list-disc list-inside space-y-1 opacity-75">
                                {message.recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {message.sources && message.sources.length > 0 && (
                            <div className="text-xs">
                              <p className="font-medium mb-1">Sources:</p>
                              <div className="space-y-1">
                                {message.sources.map((source, idx) => (
                                  <div key={idx} className="opacity-75">
                                    <span className="font-medium">{source.title}</span>
                                    <span className="ml-2">({(source.relevance * 100).toFixed(0)}% relevant)</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {streamingResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-navy-900 text-white">
                      <p className="text-sm">{streamingResponse}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-xs opacity-75">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              {uploadedFile && (
                <div className="mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-2">
                  {getFileIcon(uploadedFile)}
                  <span className="text-sm flex-1">{uploadedFile.name}</span>
                  <Button size="sm" variant="ghost" onClick={() => setUploadedFile(null)}>
                    ×
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask your AI ${role} assistant...`}
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? "bg-red-500 text-white" : ""}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={isLoading || (!input.trim() && !uploadedFile)}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Select AI Task</h3>
              <div className="grid grid-cols-1 gap-2">
                {currentTasks.map((task) => (
                  <Button
                    key={task.value}
                    variant={selectedTask === task.value ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedTask(task.value)}
                  >
                    {task.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Copilot Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Role</span>
                  <Badge>{role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compliance Mode</span>
                  <div className="flex gap-1">
                    {complianceMode.map((mode) => (
                      <Badge key={mode} variant="outline" className="text-xs">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session ID</span>
                  <span className="text-xs text-slate-500">{sessionId || "None"}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
        />
      </CardContent>
    </Card>
  )
}
