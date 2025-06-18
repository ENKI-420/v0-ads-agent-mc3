"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Palette, Video, MessageSquare, Share2, Settings } from "lucide-react"
import { SharedWhiteboard } from "./shared-whiteboard"
import { SharedDocumentEditor } from "./shared-document-editor"
import { VideoCallInterface } from "../video-call-interface"
import { RealTimeCollaborationManager, type UserPresence } from "@/lib/collaboration/real-time-sync"

interface CollaborationHubProps {
  sessionId: string
  userId: string
  userName: string
  userRole: string
}

export function CollaborationHub({ sessionId, userId, userName, userRole }: CollaborationHubProps) {
  const [activeTab, setActiveTab] = useState("whiteboard")
  const [users, setUsers] = useState<UserPresence[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "connecting",
  )
  const [documents, setDocuments] = useState([
    { id: "doc-1", title: "Meeting Notes", type: "document" },
    { id: "doc-2", title: "Project Plan", type: "document" },
    { id: "doc-3", title: "Brainstorm Board", type: "whiteboard" },
  ])

  const collaborationManager = useRef<RealTimeCollaborationManager | null>(null)

  useEffect(() => {
    // Initialize collaboration manager
    collaborationManager.current = new RealTimeCollaborationManager(sessionId, userId)

    collaborationManager.current.onConnectionStateChange = (state) => {
      setConnectionStatus(state)
    }

    collaborationManager.current.onPresenceUpdate = (updatedUsers) => {
      setUsers(updatedUsers)
    }

    // Connect to collaboration server
    collaborationManager.current.connect()

    return () => {
      collaborationManager.current?.disconnect()
    }
  }, [sessionId, userId])

  const createNewDocument = () => {
    const title = prompt("Document title:")
    if (title) {
      const newDoc = {
        id: `doc-${Date.now()}`,
        title,
        type: "document",
      }
      setDocuments((prev) => [...prev, newDoc])
    }
  }

  const createNewWhiteboard = () => {
    const title = prompt("Whiteboard title:")
    if (title) {
      const newBoard = {
        id: `board-${Date.now()}`,
        title,
        type: "whiteboard",
      }
      setDocuments((prev) => [...prev, newBoard])
    }
  }

  const shareSession = async () => {
    const shareUrl = `${window.location.origin}/collaboration/${sessionId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Collaboration Session",
          text: "Join our real-time collaboration session",
          url: shareUrl,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl)
        alert("Share link copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert("Share link copied to clipboard!")
    }
  }

  if (!collaborationManager.current) {
    return <div>Loading collaboration tools...</div>
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Collaboration Hub</h1>
            <Badge
              variant={connectionStatus === "connected" ? "default" : "destructive"}
              className="flex items-center space-x-1"
            >
              <div
                className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-400" : "bg-red-400"}`}
              />
              <span className="capitalize">{connectionStatus}</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Active Users */}
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{users.length + 1} active</span>
              <div className="flex -space-x-2">
                {/* Current user */}
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                {/* Other users */}
                {users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.userId}
                    className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: user.color }}
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {users.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white">
                    +{users.length - 3}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={shareSession}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={createNewDocument}>
                  <FileText className="w-4 h-4 mr-2" />
                  New Document
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={createNewWhiteboard}>
                  <Palette className="w-4 h-4 mr-2" />
                  New Whiteboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("video")}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Call
                </Button>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Documents & Boards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    className="w-full text-left p-2 rounded hover:bg-gray-700 transition-colors"
                    onClick={() => setActiveTab(doc.type === "document" ? "document" : "whiteboard")}
                  >
                    <div className="flex items-center space-x-2">
                      {doc.type === "document" ? (
                        <FileText className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Palette className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-sm text-gray-300 truncate">{doc.title}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="whiteboard" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Whiteboard</span>
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Document</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="whiteboard" className="h-[calc(100%-60px)] m-0">
              <SharedWhiteboard
                sessionId={sessionId}
                userId={userId}
                userName={userName}
                userRole={userRole}
                collaborationManager={collaborationManager.current}
              />
            </TabsContent>

            <TabsContent value="document" className="h-[calc(100%-60px)] m-0">
              <SharedDocumentEditor
                documentId="doc-1"
                sessionId={sessionId}
                userId={userId}
                userName={userName}
                userRole={userRole}
                collaborationManager={collaborationManager.current}
                initialContent="# Meeting Notes\n\nWelcome to our collaborative document. Start typing to see real-time collaboration in action!\n\n## Agenda\n1. Project updates\n2. Next steps\n3. Action items\n\n## Notes\n"
              />
            </TabsContent>

            <TabsContent value="video" className="h-[calc(100%-60px)] m-0">
              <VideoCallInterface
                sessionId={sessionId}
                userRole={userRole}
                onEndCall={() => setActiveTab("whiteboard")}
              />
            </TabsContent>

            <TabsContent value="chat" className="h-[calc(100%-60px)] m-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Team Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-400 mt-20">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Chat integration coming soon...</p>
                    <p className="text-sm mt-2">Use the AI chat in the video call for now</p>
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
