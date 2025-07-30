"use client"

import React, { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Mic, Paperclip, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAidenStore } from "@/store/aidenStore"
import type { AidenMessage } from "@/lib/types/aiden"

interface RichContentRendererProps {
  message: AidenMessage
  onFollowUpClick: (prompt: string) => void
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ message, onFollowUpClick }) => {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">{message.content}</p>
      {message.followUpPrompts && message.followUpPrompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.followUpPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 bg-transparent"
              onClick={() => onFollowUpClick(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export const AidenAssistant: React.FC = () => {
  const {
    isVisible,
    isLoading,
    currentSession,
    error,
    userProfile,
    setVisible,
    sendMessage,
    clearError,
    initializeAidenSession,
  } = useAidenStore()

  const [inputValue, setInputValue] = React.useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  // Focus input when assistant becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isVisible])

  // Initialize Aiden session when component mounts
  useEffect(() => {
    if (isVisible && (!currentSession || currentSession.messages.length === 0)) {
      initializeAidenSession()
    }
  }, [isVisible, currentSession, initializeAidenSession])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const message = inputValue.trim()
    setInputValue("")
    await sendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFollowUpClick = async (prompt: string) => {
    await sendMessage(prompt)
  }

  const handleClose = () => {
    setVisible(false)
    clearError()
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        role="dialog"
        aria-labelledby="aiden-title"
        aria-describedby="aiden-description"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Aiden" />
                <AvatarFallback className="bg-white/20 text-white text-xs">AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 id="aiden-title" className="font-semibold text-sm">
                  Aiden Assistant
                </h3>
                <p id="aiden-description" className="text-xs opacity-90">
                  Your AI Executive Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setVisible(false)}
                aria-label="Minimize assistant"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={handleClose}
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border-b border-red-200">
                <p className="text-sm text-red-600">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-6 px-2 text-xs text-red-600 hover:bg-red-100"
                  onClick={clearError}
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {currentSession?.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.isUser
                          ? "bg-blue-600 text-white"
                          : message.type === "error"
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : message.type === "welcome"
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 border border-blue-200"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.isUser ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <RichContentRenderer message={message} onFollowUpClick={handleFollowUpClick} />
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">Aiden is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50/50">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Aiden anything..."
                    disabled={isLoading}
                    className="pr-20 bg-white"
                    aria-label="Message input"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                      aria-label="Voice input"
                    >
                      <Mic className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="h-9 px-3"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
