"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, MessageSquare, FileText, Video, Activity } from "lucide-react"

interface CollaborationEvent {
  id: string
  type: "user_joined" | "document_shared" | "ai_suggestion" | "message_sent"
  user: string
  content?: string
  timestamp: Date
}

export function RealTimeCollaboration() {
  const [events, setEvents] = useState<CollaborationEvent[]>([
    {
      id: "1",
      type: "user_joined",
      user: "Dr. Sarah Chen",
      content: "Medical Review Room",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      type: "document_shared",
      user: "Legal Team",
      content: "Contract_v2.pdf",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      type: "ai_suggestion",
      user: "SynthAgent",
      content: "Consider adding compliance clause for HIPAA requirements",
      timestamp: new Date(Date.now() - 180000),
    },
  ])

  const [activeUsers] = useState([
    { name: "Dr. Sarah Chen", role: "Medical Director", status: "active" },
    { name: "Legal Team", role: "Compliance Officer", status: "active" },
    { name: "Project Manager", role: "Operations", status: "away" },
    { name: "AI Assistant", role: "SynthAgent", status: "active" },
  ])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/demo/collaboration")
        if (response.ok) {
          const data = await response.json()
          setEvents((prev) => [...prev, data.event].slice(-10)) // Keep last 10 events
        }
      } catch (error) {
        console.error("Failed to fetch collaboration events:", error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "user_joined":
        return <Users className="h-4 w-4 text-green-500" />
      case "document_shared":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "ai_suggestion":
        return <Activity className="h-4 w-4 text-purple-500" />
      case "message_sent":
        return <MessageSquare className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getEventDescription = (event: CollaborationEvent) => {
    switch (event.type) {
      case "user_joined":
        return `${event.user} joined ${event.content}`
      case "document_shared":
        return `${event.user} shared ${event.content}`
      case "ai_suggestion":
        return `${event.user}: ${event.content}`
      case "message_sent":
        return `${event.user}: ${event.content}`
      default:
        return `${event.user} performed an action`
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Active Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                  className={user.status === "active" ? "bg-green-500" : ""}
                >
                  {user.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-primary" />
              <span className="font-medium">Live Video Conference</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">HIPAA-compliant video call with AI transcription</p>
            <Button size="sm" className="w-full">
              Join Video Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Activity Feed
            </CardTitle>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{getEventDescription(event)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              💡 AI Insight: High collaboration activity detected. Consider scheduling a follow-up meeting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
