"use client"

import { useState, useEffect, useRef } from "react"
import { Video, VideoOff, Mic, MicOff, Phone, Users, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VideoCallProps {
  sessionId: string
  role: string
}

export function VideoCall({ sessionId, role }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants, setParticipants] = useState([
    { id: "1", name: "You", role, isHost: true },
    { id: "2", name: "Dr. Smith", role: "clinician", isHost: false },
    { id: "3", name: "Patient", role: "patient", isHost: false },
  ])
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Initialize WebRTC connection
    initializeWebRTC()
  }, [])

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    // WebRTC video toggle implementation
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    // WebRTC audio toggle implementation
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    // Screen sharing implementation
  }

  const endCall = () => {
    // End call implementation
    window.history.back()
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Video Grid */}
        <div className="flex-1 bg-black rounded-t-lg relative overflow-hidden">
          {/* Main Video */}
          <div className="absolute inset-0">
            <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
            {!isVideoOn && (
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-12 h-12 mx-auto mb-2" />
                  <p>Camera Off</p>
                </div>
              </div>
            )}
          </div>

          {/* Participant Thumbnails */}
          <div className="absolute top-4 right-4 space-y-2">
            {participants.slice(1).map((participant) => (
              <div key={participant.id} className="w-32 h-24 bg-slate-700 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-1" />
                    <p>{participant.name}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                  {participant.role}
                </Badge>
              </div>
            ))}
          </div>

          {/* AI Transcription Overlay */}
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium">Live AI Transcription</span>
              </div>
              <p className="text-xs opacity-90">
                "Based on the symptoms described, I recommend we consider additional diagnostic tests..."
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-b-lg">
          <div className="flex items-center justify-center space-x-4">
            <Button variant={isAudioOn ? "outline" : "destructive"} size="icon" onClick={toggleAudio}>
              {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>

            <Button variant={isVideoOn ? "outline" : "destructive"} size="icon" onClick={toggleVideo}>
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>

            <Button variant={isScreenSharing ? "default" : "outline"} size="icon" onClick={toggleScreenShare}>
              <Share className="w-4 h-4" />
            </Button>

            <Button variant="destructive" size="icon" onClick={endCall}>
              <Phone className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span>Session ID: {sessionId}</span>
            <span>{participants.length} participants</span>
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              Encrypted
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
