"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Settings,
  Users,
  MessageSquare,
  Share,
  RepeatIcon as Record,
} from "lucide-react"

export function VideoConference() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)

  const participants = [
    { name: "Dr. Sarah Chen", role: "Host", status: "speaking" },
    { name: "Legal Team", role: "Participant", status: "muted" },
    { name: "Project Manager", role: "Participant", status: "active" },
    { name: "AI Assistant", role: "AI Agent", status: "listening" },
  ]

  const transcription = [
    { speaker: "Dr. Sarah Chen", text: "Let's review the patient care protocol updates.", time: "14:32" },
    {
      speaker: "AI Assistant",
      text: "I've identified 3 key compliance requirements in the new protocol.",
      time: "14:33",
    },
    { speaker: "Legal Team", text: "The HIPAA implications look good from our review.", time: "14:34" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Video Area */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                HIPAA-Compliant Video Conference
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Live
                </Badge>
                {isRecording && (
                  <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                    <Record className="w-3 h-3 mr-1" />
                    Recording
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Video Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {participants.slice(0, 4).map((participant, index) => (
                <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/placeholder.svg?height=64&width=64`} />
                      <AvatarFallback>
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium bg-black/50 text-white px-2 py-1 rounded">
                        {participant.name}
                      </span>
                      <div className="flex gap-1">
                        {participant.status === "speaking" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                        {participant.status === "muted" && <MicOff className="h-3 w-3 text-red-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="icon"
                onClick={() => setIsAudioOn(!isAudioOn)}
              >
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>

              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>

              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
              >
                <Record className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="destructive" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-4 w-4" />
              Participants ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">{participant.role}</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    participant.status === "speaking"
                      ? "bg-green-500/10 text-green-500"
                      : participant.status === "muted"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-blue-500/10 text-blue-500"
                  }
                >
                  {participant.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Transcription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-4 w-4" />
              Live AI Transcription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {transcription.map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{item.speaker}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 AI detected discussion about compliance requirements. Relevant documents have been prepared for
                review.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
