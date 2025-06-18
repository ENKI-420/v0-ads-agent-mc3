"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Share2,
  Settings,
  Send,
  Crown,
  Shield,
} from "lucide-react"
import {
  MultiParticipantManager,
  type Participant,
  type ChatMessage,
  type SharedContent,
  type AIInsight,
} from "@/lib/collaboration/multi-participant-manager"

interface MultiParticipantInterfaceProps {
  sessionId: string
  currentUser: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  vertical: "healthcare" | "legal" | "defense" | "enterprise"
}

export function MultiParticipantInterface({ sessionId, currentUser, vertical }: MultiParticipantInterfaceProps) {
  const [manager, setManager] = useState<MultiParticipantManager | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [sharedContent, setSharedContent] = useState<SharedContent[]>([])
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [mediaState, setMediaState] = useState({
    audio: false,
    video: false,
    screen: false,
  })
  const [chatInput, setChatInput] = useState("")
  const [activeTab, setActiveTab] = useState("participants")
  const [showChat, setShowChat] = useState(false)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map())

  // Initialize collaboration manager
  useEffect(() => {
    const initManager = async () => {
      const participant: Participant = {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
        status: "online",
        permissions: {
          canEdit: true,
          canComment: true,
          canShare: true,
          canInvite: true,
          canModerate: currentUser.role === "moderator",
          canRecord: true,
          canViewSensitive: true,
        },
        joinedAt: new Date(),
        lastActive: new Date(),
        deviceInfo: {
          type: "desktop",
          browser: navigator.userAgent,
          os: navigator.platform,
        },
        mediaState: {
          audio: false,
          video: false,
          screen: false,
        },
      }

      const collaborationManager = new MultiParticipantManager(sessionId, participant)

      // Set up event handlers
      collaborationManager.on("connection:established", () => {
        setConnectionStatus("connected")
      })

      collaborationManager.on("connection:lost", () => {
        setConnectionStatus("disconnected")
      })

      collaborationManager.on("participant:joined", (participant: Participant) => {
        setParticipants((prev) => [...prev.filter((p) => p.id !== participant.id), participant])
      })

      collaborationManager.on("participant:left", ({ participantId }: { participantId: string }) => {
        setParticipants((prev) => prev.filter((p) => p.id !== participantId))
        setRemoteStreams((prev) => {
          const newStreams = new Map(prev)
          newStreams.delete(participantId)
          return newStreams
        })
      })

      collaborationManager.on("chat:message_received", (message: ChatMessage) => {
        setChatMessages((prev) => [...prev, message])
      })

      collaborationManager.on("content:shared", (content: SharedContent) => {
        setSharedContent((prev) => [...prev, content])
      })

      collaborationManager.on("ai:insight_received", (insight: AIInsight) => {
        setAIInsights((prev) => [...prev, insight])
      })

      collaborationManager.on("media:video_enabled", (stream: MediaStream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      })

      collaborationManager.on(
        "media:remote_stream",
        ({ participantId, stream }: { participantId: string; stream: MediaStream }) => {
          setRemoteStreams((prev) => new Map(prev.set(participantId, stream)))
        },
      )

      await collaborationManager.connect()
      setManager(collaborationManager)
    }

    initManager()

    return () => {
      manager?.endSession()
    }
  }, [sessionId, currentUser])

  // Update remote video elements when streams change
  useEffect(() => {
    remoteStreams.forEach((stream, participantId) => {
      const videoElement = remoteVideosRef.current.get(participantId)
      if (videoElement) {
        videoElement.srcObject = stream
      }
    })
  }, [remoteStreams])

  const toggleAudio = useCallback(async () => {
    if (!manager) return

    try {
      if (mediaState.audio) {
        // Disable audio
        setMediaState((prev) => ({ ...prev, audio: false }))
      } else {
        await manager.enableAudio()
        setMediaState((prev) => ({ ...prev, audio: true }))
      }
    } catch (error) {
      console.error("Failed to toggle audio:", error)
    }
  }, [manager, mediaState.audio])

  const toggleVideo = useCallback(async () => {
    if (!manager) return

    try {
      if (mediaState.video) {
        // Disable video
        setMediaState((prev) => ({ ...prev, video: false }))
      } else {
        await manager.enableVideo()
        setMediaState((prev) => ({ ...prev, video: true }))
      }
    } catch (error) {
      console.error("Failed to toggle video:", error)
    }
  }, [manager, mediaState.video])

  const toggleScreenShare = useCallback(async () => {
    if (!manager) return

    try {
      if (mediaState.screen) {
        await manager.stopScreenShare()
        setMediaState((prev) => ({ ...prev, screen: false }))
      } else {
        await manager.shareScreen()
        setMediaState((prev) => ({ ...prev, screen: true }))
      }
    } catch (error) {
      console.error("Failed to toggle screen share:", error)
    }
  }, [manager, mediaState.screen])

  const sendChatMessage = useCallback(async () => {
    if (!manager || !chatInput.trim()) return

    try {
      await manager.sendChatMessage(chatInput)
      setChatInput("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }, [manager, chatInput])

  const inviteParticipant = useCallback(async () => {
    if (!manager) return

    const email = prompt("Enter participant email:")
    if (email) {
      try {
        await manager.inviteParticipant(email, "participant", {
          canEdit: true,
          canComment: true,
          canShare: false,
          canInvite: false,
          canModerate: false,
          canRecord: false,
          canViewSensitive: false,
        })
      } catch (error) {
        console.error("Failed to invite participant:", error)
      }
    }
  }, [manager])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400"
      case "away":
        return "bg-yellow-400"
      case "busy":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const getVerticalColor = () => {
    switch (vertical) {
      case "healthcare":
        return "border-blue-500"
      case "legal":
        return "border-purple-500"
      case "defense":
        return "border-red-500"
      default:
        return "border-green-500"
    }
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className={`bg-gray-800 border-b-2 ${getVerticalColor()} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Multi-Participant Collaboration</h1>
            <Badge
              variant={connectionStatus === "connected" ? "default" : "destructive"}
              className="flex items-center space-x-1"
            >
              <div
                className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-400" : "bg-red-400"}`}
              />
              <span className="capitalize">{connectionStatus}</span>
            </Badge>
            <Badge variant="outline" className="capitalize">
              {vertical}
            </Badge>
          </div>

          {/* Media Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={mediaState.audio ? "default" : "outline"}
              size="sm"
              onClick={toggleAudio}
              className={mediaState.audio ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {mediaState.audio ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button
              variant={mediaState.video ? "default" : "outline"}
              size="sm"
              onClick={toggleVideo}
              className={mediaState.video ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {mediaState.video ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              variant={mediaState.screen ? "default" : "outline"}
              size="sm"
              onClick={toggleScreenShare}
              className={mediaState.screen ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {mediaState.screen ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowChat(!showChat)}>
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={inviteParticipant}>
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
            {/* Local Video */}
            <Card className="relative overflow-hidden">
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                You {mediaState.audio && <Mic className="w-3 h-3 inline ml-1" />}
              </div>
            </Card>

            {/* Remote Videos */}
            {participants.map((participant) => (
              <Card key={participant.id} className="relative overflow-hidden">
                <video
                  ref={(el) => {
                    if (el) {
                      remoteVideosRef.current.set(participant.id, el)
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`} />
                  <span>{participant.name}</span>
                  {participant.mediaState.audio && <Mic className="w-3 h-3" />}
                  {participant.permissions.canModerate && <Crown className="w-3 h-3 text-yellow-400" />}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="participants">
                <Users className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="content">
                <Share2 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Shield className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="flex-1 m-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-sm">Participants ({participants.length + 1})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {/* Current User */}
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-400">You</p>
                          <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {mediaState.audio && <Mic className="w-3 h-3 text-green-400" />}
                          {mediaState.video && <Video className="w-3 h-3 text-blue-400" />}
                          {mediaState.screen && <Monitor className="w-3 h-3 text-purple-400" />}
                        </div>
                      </div>

                      {/* Other Participants */}
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">{participant.name}</p>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`} />
                              {participant.permissions.canModerate && <Crown className="w-3 h-3 text-yellow-400" />}
                            </div>
                            <p className="text-xs text-gray-400 capitalize">{participant.role}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {participant.mediaState.audio && <Mic className="w-3 h-3 text-green-400" />}
                            {participant.mediaState.video && <Video className="w-3 h-3 text-blue-400" />}
                            {participant.mediaState.screen && <Monitor className="w-3 h-3 text-purple-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 m-4">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-sm">Chat ({chatMessages.length})</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="p-2 rounded-lg bg-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {participants.find((p) => p.id === message.senderId)?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-gray-300">{message.content}</p>
                          {message.reactions.length > 0 && (
                            <div className="flex space-x-1 mt-2">
                              {message.reactions.map((reaction, index) => (
                                <span key={index} className="text-xs bg-gray-600 px-1 rounded">
                                  {reaction.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={sendChatMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="flex-1 m-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-sm">Shared Content ({sharedContent.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {sharedContent.map((content) => (
                        <div key={content.id} className="p-2 rounded-lg bg-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{content.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Shared by {participants.find((p) => p.id === content.ownerId)?.name || "Unknown"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 m-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-sm">AI Insights ({aiInsights.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {aiInsights.map((insight) => (
                        <div key={insight.id} className="p-2 rounded-lg bg-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {insight.type.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-gray-400">{insight.confidence}% confidence</span>
                          </div>
                          <p className="text-sm text-gray-300">{insight.content}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
