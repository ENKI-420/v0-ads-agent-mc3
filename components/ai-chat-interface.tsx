"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Send, Mic, MicOff, Volume2, VolumeX, Brain, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useStreamingChat } from "@/hooks/use-streaming-chat"
import { Textarea } from "@/components/ui/textarea"

interface AIChatInterfaceProps {
  role: string
  sessionId?: string
  complianceMode?: "HIPAA" | "SOC2" | "GDPR" | "DEFENSE"
  capabilities?: string[]
  onSpeakingChange?: (speaking: boolean) => void
  onListeningChange?: (listening: boolean) => void
  className?: string
}

export function AIChatInterface({
  role,
  sessionId,
  complianceMode = "SOC2",
  capabilities = [],
  onSpeakingChange,
  onListeningChange,
  className = "",
}: AIChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    isListening,
    isSpeaking,
    voiceEnabled,
    startListening,
    stopListening,
    toggleVoice,
  } = useStreamingChat({
    role,
    sessionId,
    complianceMode,
    capabilities,
    onMessageStart: () => {
      // Avatar will start listening animation
    },
    onMessageComplete: (message) => {
      // Avatar will show completion
    },
  })

  // Notify parent components of voice state changes
  useEffect(() => {
    onSpeakingChange?.(isSpeaking)
  }, [isSpeaking, onSpeakingChange])

  useEffect(() => {
    onListeningChange?.(isListening)
  }, [isListening, onListeningChange])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    await sendMessage(inputValue)
    setInputValue("")
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else if (voiceEnabled) {
      startListening()
    } else {
      toggleVoice()
    }
  }

  const getComplianceBadgeColor = (mode: string) => {
    switch (mode) {
      case "HIPAA":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "SOC2":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "GDPR":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "DEFENSE":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className={`h-[600px] flex flex-col bg-gray-900/50 border-gray-700 ${className}`}>
      <CardHeader className="pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2 text-white">
            <Brain className="w-5 h-5 text-gold-400" />
            <span>AI Assistant</span>
            {isSpeaking && <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />}
            {isListening && <Mic className="w-4 h-4 text-blue-400 animate-pulse" />}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`text-xs ${getComplianceBadgeColor(complianceMode)}`}>
              <Shield className="w-3 h-3 mr-1" />
              {complianceMode}
            </Badge>
            <Badge variant="outline" className="text-xs text-gold-400 border-gold-500/30 capitalize">
              {role}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">ADSTech AI Assistant Ready</h3>
                <p className="text-gray-400 text-sm">
                  Start a conversation or use voice input to interact with your AI copilot
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex space-x-2 max-w-[85%] ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={message.role === "user" ? "bg-blue-500 text-white" : "bg-gold-500 text-gray-900"}
                    >
                      {message.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-100 border border-gray-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="mt-2 text-xs opacity-70">
                      {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gold-500 text-gray-900">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                Error: {error.message}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex space-x-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask your ${role} AI assistant...`}
                className="flex-1 min-h-[40px] max-h-[120px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <div className="flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceToggle}
                  className={`
                    ${isListening ? "bg-blue-500 text-white border-blue-400" : ""}
                    ${!voiceEnabled ? "opacity-50" : ""}
                  `}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gold-500 hover:bg-gold-600 text-gray-900"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`flex items-center space-x-1 hover:text-gold-400 transition-colors ${
                    voiceEnabled ? "text-gold-400" : ""
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  <span>{voiceEnabled ? "Voice On" : "Voice Off"}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-gold-400 animate-pulse" : "bg-gray-600"}`} />
                  <span>AI Speaking</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isListening ? "bg-blue-400 animate-pulse" : "bg-gray-600"}`}
                  />
                  <span>Listening</span>
                </div>
              </div>
              <div className="text-gray-500">Press Shift+Enter for new line</div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
