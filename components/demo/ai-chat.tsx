"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

interface Message {
  id: number
  sender: "user" | "ai"
  text: string
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", text: "Hello! How can I assist you today?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const newUserMessage: Message = { id: messages.length + 1, sender: "user", text: input }
    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const newAiMessage: Message = { id: messages.length + 2, sender: "ai", text: data.response }
      setMessages((prev) => [...prev, newAiMessage])
    } catch (error) {
      console.error("Error sending message to AI:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4 flex flex-col h-[400px]">
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-3 rounded-lg bg-muted text-muted-foreground animate-pulse">Typing...</div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            disabled={loading}
          />
          <Button onClick={handleSendMessage} disabled={loading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
