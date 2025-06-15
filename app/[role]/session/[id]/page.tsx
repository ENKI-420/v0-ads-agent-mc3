"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { VideoCall } from "@/components/video-call"
import { CopilotChat } from "@/components/copilot-chat"
import { DocViewer } from "@/components/doc-viewer"
import { SessionControls } from "@/components/session-controls"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SessionPage() {
  const params = useParams()
  const { role, id } = params
  const [sessionData, setSessionData] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    // Initialize session data
    setSessionData({
      id,
      role,
      title: `${role} Session ${id}`,
      startTime: new Date(),
      status: "active",
    })
  }, [id, role])

  return (
    <div className="min-h-screen bg-background">
      {/* Session Header */}
      <header className="bg-navy-800 border-b border-navy-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">{sessionData?.title}</h1>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Live Session
            </Badge>
          </div>
          <SessionControls isRecording={isRecording} onToggleRecording={() => setIsRecording(!isRecording)} />
        </div>
      </header>

      {/* Session Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Video Call */}
            <div className="lg:col-span-2">
              <VideoCall sessionId={id as string} role={role as string} />
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              <Tabs defaultValue="chat" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="docs">Docs</TabsTrigger>
                  <TabsTrigger value="insights">AI</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="h-[calc(100%-40px)]">
                  <CopilotChat role={role as string} sessionId={id as string} />
                </TabsContent>

                <TabsContent value="docs" className="h-[calc(100%-40px)]">
                  <DocViewer sessionId={id as string} />
                </TabsContent>

                <TabsContent value="insights" className="h-[calc(100%-40px)]">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-sm">AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Key Discussion Points</p>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                          <li>• Treatment options discussed</li>
                          <li>• Risk factors identified</li>
                          <li>• Follow-up scheduled</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Action Items</p>
                        <ul className="text-xs text-green-700 dark:text-green-300 mt-2 space-y-1">
                          <li>• Schedule lab work</li>
                          <li>• Review medication list</li>
                          <li>• Patient education materials</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
