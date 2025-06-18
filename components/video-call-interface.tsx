"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Video, VideoOff, Mic, MicOff, Phone, Users, Share, MessageSquare, Brain, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebRTCConnectionManager, type ParticipantData, type TranscriptionEvent } from "@/lib/webrtc/connection-manager"

interface VideoCallInterfaceProps {
  sessionId: string
  userRole: string
  onEndCall?: () => void
}

interface AIInsight {
  id: string
  type: "summary" | "action_item" | "compliance" | "sentiment"
  content: string
  timestamp: Date
  confidence: number
  participants?: string[]
}

export function VideoCallInterface({ sessionId, userRole, onEndCall }: VideoCallInterfaceProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants, setParticipants] = useState<ParticipantData[]>([])
  const [transcriptions, setTranscriptions] = useState<TranscriptionEvent[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map())
  const webrtcManager = useRef<WebRTCConnectionManager | null>(null)
  const audioLevelInterval = useRef<NodeJS.Timeout>()

  // Initialize WebRTC connection
  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        webrtcManager.current = new WebRTCConnectionManager()

        // Set up event handlers
        webrtcManager.current.onParticipantJoined = (participant) => {
          setParticipants((prev) => [...prev, participant])
        }

        webrtcManager.current.onParticipantLeft = (participantId) => {
          setParticipants((prev) => prev.filter((p) => p.id !== participantId))
        }

        webrtcManager.current.onStreamReceived = (participantId, stream) => {
          const videoElement = remoteVideosRef.current.get(participantId)
          if (videoElement) {
            videoElement.srcObject = stream
          }
        }

        webrtcManager.current.onTranscription = (event) => {
          setTranscriptions((prev) => [...prev, event])

          // Generate AI insights from transcription
          if (event.isFinal && event.confidence > 0.8) {
            generateAIInsight(event)
          }
        }

        webrtcManager.current.onConnectionStateChange = (participantId, state) => {
          if (state === "connected") {
            setConnectionStatus("connected")
          } else if (state === "disconnected" || state === "failed") {
            setConnectionStatus("disconnected")
          }
        }

        // Initialize local media
        const localStream = await webrtcManager.current.initializeLocalMedia()
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream
        }

        setConnectionStatus("connected")

        // Start audio level monitoring
        audioLevelInterval.current = setInterval(() => {
          if (webrtcManager.current) {
            setAudioLevel(webrtcManager.current.getAudioLevel())
          }
        }, 100)
      } catch (error) {
        console.error("Failed to initialize WebRTC:", error)
        setConnectionStatus("disconnected")
      }
    }

    initializeWebRTC()

    return () => {
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current)
      }
      webrtcManager.current?.disconnect()
    }
  }, [sessionId])

  const generateAIInsight = useCallback(
    async (transcription: TranscriptionEvent) => {
      try {
        const response = await fetch("/api/ai/video-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            transcription: transcription.text,
            participantId: transcription.participantId,
            userRole,
          }),
        })

        if (response.ok) {
          const { insights } = await response.json()
          if (insights) {
            setAiInsights((prev) => [...prev, ...insights])
          }
        }
      } catch (error) {
        console.error("Failed to generate AI insights:", error)
      }
    },
    [sessionId, userRole],
  )

  const toggleVideo = useCallback(() => {
    const newState = !isVideoOn
    setIsVideoOn(newState)
    webrtcManager.current?.toggleVideo(newState)
  }, [isVideoOn])

  const toggleAudio = useCallback(() => {
    const newState = !isAudioOn
    setIsAudioOn(newState)
    webrtcManager.current?.toggleAudio(newState)
  }, [isAudioOn])

  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        await webrtcManager.current?.startScreenShare()
        setIsScreenSharing(true)
      } else {
        // Stop screen sharing logic would go here
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error("Screen sharing error:", error)
    }
  }, [isScreenSharing])

  const endCall = useCallback(() => {
    webrtcManager.current?.disconnect()
    onEndCall?.()
  }, [onEndCall])

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev)
    // Recording logic would be implemented here
  }, [])

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Video Conference</h1>
            <Badge variant={connectionStatus === "connected" ? "default" : "destructive"}>
              {connectionStatus === "connected" ? "Live" : "Disconnected"}
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Shield className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant={isRecording ? "destructive" : "outline"} size="sm" onClick={toggleRecording}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            <Badge variant="outline" className="text-xs">
              Session: {sessionId}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Local Video */}
            <Card className="relative overflow-hidden bg-black">
              <CardContent className="p-0 h-full">
                <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="w-12 h-12 mx-auto mb-2" />
                      <p>Camera Off</p>
                    </div>
                  </div>
                )}

                {/* Audio Level Indicator */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
                    <Mic className={`w-4 h-4 ${isAudioOn ? "text-green-400" : "text-red-400"}`} />
                    <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 transition-all duration-100"
                        style={{ width: `${audioLevel * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">You ({userRole})</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Remote Videos */}
            {participants.map((participant) => (
              <Card key={participant.id} className="relative overflow-hidden bg-black">
                <CardContent className="p-0 h-full">
                  <video
                    ref={(el) => {
                      if (el) remoteVideosRef.current.set(participant.id, el)
                    }}
                    autoPlay
                    className="w-full h-full object-cover"
                  />

                  {/* Participant Info */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">
                      {participant.name} ({participant.role})
                    </Badge>
                  </div>

                  {/* Audio/Video Status */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    {!participant.audioEnabled && (
                      <div className="bg-red-500 rounded-full p-1">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {!participant.videoEnabled && (
                      <div className="bg-red-500 rounded-full p-1">
                        <VideoOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 flex justify-center space-x-4">
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
        </div>

        {/* Side Panel */}
        <div className="w-96 bg-gray-800 border-l border-gray-700">
          <Tabs defaultValue="transcription" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="transcription">
                <MessageSquare className="w-4 h-4 mr-2" />
                Live
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Brain className="w-4 h-4 mr-2" />
                AI
              </TabsTrigger>
              <TabsTrigger value="participants">
                <Users className="w-4 h-4 mr-2" />
                People
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcription" className="flex-1 px-4 pb-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-sm">Live Transcription</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-300px)] px-4">
                    <div className="space-y-3">
                      {transcriptions.map((transcription, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-green-400">
                              {transcription.participantId === "local"
                                ? "You"
                                : `Participant ${transcription.participantId}`}
                            </span>
                            <span className="text-xs text-gray-400">
                              {transcription.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-300">{transcription.text}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs">
                              {Math.round(transcription.confidence * 100)}% confidence
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 px-4 pb-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-sm">AI Insights</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-300px)] px-4">
                    <div className="space-y-4">
                      {aiInsights.map((insight) => (
                        <div key={insight.id} className="p-3 rounded-lg bg-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant={
                                insight.type === "action_item"
                                  ? "default"
                                  : insight.type === "compliance"
                                    ? "destructive"
                                    : insight.type === "sentiment"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {insight.type.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-gray-400">{insight.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-gray-300">{insight.content}</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.round(insight.confidence * 100)}% confidence
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 px-4 pb-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-sm">Participants ({participants.length + 1})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Local user */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-700">
                      <div>
                        <p className="font-medium text-green-400">You</p>
                        <p className="text-xs text-gray-400 capitalize">{userRole}</p>
                      </div>
                      <div className="flex space-x-1">
                        {isAudioOn ? (
                          <Mic className="w-4 h-4 text-green-400" />
                        ) : (
                          <MicOff className="w-4 h-4 text-red-400" />
                        )}
                        {isVideoOn ? (
                          <Video className="w-4 h-4 text-green-400" />
                        ) : (
                          <VideoOff className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Remote participants */}
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-700"
                      >
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{participant.role}</p>
                        </div>
                        <div className="flex space-x-1">
                          {participant.audioEnabled ? (
                            <Mic className="w-4 h-4 text-green-400" />
                          ) : (
                            <MicOff className="w-4 h-4 text-red-400" />
                          )}
                          {participant.videoEnabled ? (
                            <Video className="w-4 h-4 text-green-400" />
                          ) : (
                            <VideoOff className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
