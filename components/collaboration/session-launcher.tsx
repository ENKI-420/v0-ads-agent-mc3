"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Users, Video, FileText, Presentation, Shield, Settings, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface SessionSettings {
  title: string
  type: "meeting" | "document" | "whiteboard" | "presentation"
  vertical: "healthcare" | "legal" | "defense" | "enterprise"
  maxParticipants: number
  allowAnonymous: boolean
  requireApproval: boolean
  recordingEnabled: boolean
  transcriptionEnabled: boolean
  aiInsightsEnabled: boolean
  complianceMode: string
  encryption: "standard" | "enhanced" | "military"
}

export function SessionLauncher() {
  const router = useRouter()
  const [settings, setSettings] = useState<SessionSettings>({
    title: "",
    type: "meeting",
    vertical: "enterprise",
    maxParticipants: 10,
    allowAnonymous: false,
    requireApproval: true,
    recordingEnabled: true,
    transcriptionEnabled: true,
    aiInsightsEnabled: true,
    complianceMode: "standard",
    encryption: "enhanced",
  })
  const [isCreating, setIsCreating] = useState(false)

  const createSession = async () => {
    if (!settings.title.trim()) {
      alert("Please enter a session title")
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/collaboration/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings }),
      })

      const data = await response.json()
      if (data.success) {
        router.push(data.joinUrl)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Failed to create session:", error)
      alert("Failed to create session. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const getVerticalIcon = (vertical: string) => {
    switch (vertical) {
      case "healthcare":
        return "🏥"
      case "legal":
        return "⚖️"
      case "defense":
        return "🛡️"
      default:
        return "🏢"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Video className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      case "presentation":
        return <Presentation className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Launch Multi-Participant Collaboration</h1>
        <p className="text-gray-600">Create a secure, AI-enhanced collaboration session</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Basic Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Enter session title..."
              />
            </div>

            <div>
              <Label htmlFor="type">Session Type</Label>
              <Select value={settings.type} onValueChange={(value: any) => setSettings({ ...settings, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>Video Meeting</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="document">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Document Collaboration</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="whiteboard">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Whiteboard Session</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="presentation">
                    <div className="flex items-center space-x-2">
                      <Presentation className="w-4 h-4" />
                      <span>Presentation</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vertical">Professional Vertical</Label>
              <Select
                value={settings.vertical}
                onValueChange={(value: any) => setSettings({ ...settings, vertical: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">
                    <div className="flex items-center space-x-2">
                      <span>🏥</span>
                      <span>Healthcare</span>
                      <Badge variant="outline" className="ml-2">
                        HIPAA
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="legal">
                    <div className="flex items-center space-x-2">
                      <span>⚖️</span>
                      <span>Legal</span>
                      <Badge variant="outline" className="ml-2">
                        SOC2
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="defense">
                    <div className="flex items-center space-x-2">
                      <span>🛡️</span>
                      <span>Defense</span>
                      <Badge variant="outline" className="ml-2">
                        ITAR
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="enterprise">
                    <div className="flex items-center space-x-2">
                      <span>🏢</span>
                      <span>Enterprise</span>
                      <Badge variant="outline" className="ml-2">
                        Standard
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Select
                value={settings.maxParticipants.toString()}
                onValueChange={(value) => setSettings({ ...settings, maxParticipants: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 participants</SelectItem>
                  <SelectItem value="10">10 participants</SelectItem>
                  <SelectItem value="25">25 participants</SelectItem>
                  <SelectItem value="50">50 participants</SelectItem>
                  <SelectItem value="100">100 participants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security & Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowAnonymous">Allow Anonymous Users</Label>
              <Switch
                id="allowAnonymous"
                checked={settings.allowAnonymous}
                onCheckedChange={(checked) => setSettings({ ...settings, allowAnonymous: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requireApproval">Require Approval to Join</Label>
              <Switch
                id="requireApproval"
                checked={settings.requireApproval}
                onCheckedChange={(checked) => setSettings({ ...settings, requireApproval: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="recordingEnabled">Enable Recording</Label>
              <Switch
                id="recordingEnabled"
                checked={settings.recordingEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, recordingEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="transcriptionEnabled">Live Transcription</Label>
              <Switch
                id="transcriptionEnabled"
                checked={settings.transcriptionEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, transcriptionEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="aiInsightsEnabled">AI Insights</Label>
              <Switch
                id="aiInsightsEnabled"
                checked={settings.aiInsightsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, aiInsightsEnabled: checked })}
              />
            </div>

            <div>
              <Label htmlFor="encryption">Encryption Level</Label>
              <Select
                value={settings.encryption}
                onValueChange={(value: any) => setSettings({ ...settings, encryption: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (AES-128)</SelectItem>
                  <SelectItem value="enhanced">Enhanced (AES-256)</SelectItem>
                  <SelectItem value="military">Military Grade (AES-256 + HSM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="complianceMode">Compliance Mode</Label>
              <Select
                value={settings.complianceMode}
                onValueChange={(value) => setSettings({ ...settings, complianceMode: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="hipaa">HIPAA Compliant</SelectItem>
                  <SelectItem value="sox">SOX Compliant</SelectItem>
                  <SelectItem value="gdpr">GDPR Compliant</SelectItem>
                  <SelectItem value="itar">ITAR Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Session Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(settings.type)}
                <span className="font-medium">{settings.title || "Untitled Session"}</span>
              </div>
              <Badge variant="outline">
                {getVerticalIcon(settings.vertical)} {settings.vertical}
              </Badge>
              <Badge variant="outline">Max {settings.maxParticipants} participants</Badge>
              {settings.recordingEnabled && <Badge variant="outline">🔴 Recording</Badge>}
              {settings.transcriptionEnabled && <Badge variant="outline">📝 Transcription</Badge>}
              {settings.aiInsightsEnabled && <Badge variant="outline">🧠 AI Insights</Badge>}
            </div>
            <Button onClick={createSession} disabled={isCreating} className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>{isCreating ? "Creating..." : "Launch Session"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
