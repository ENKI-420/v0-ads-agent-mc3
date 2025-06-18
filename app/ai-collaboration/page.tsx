"use client"

import { useState } from "react"
import { CollaborativeAISuite } from "@/components/ai-collaboration/collaborative-ai-suite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Shield, Building, Heart, Scale, Zap } from "lucide-react"

const MEETING_TYPES = {
  healthcare: {
    name: "Healthcare Consultation",
    icon: Heart,
    description: "HIPAA-compliant telemedicine with AI insights",
    features: [
      "Patient Privacy Protection",
      "Medical Terminology Recognition",
      "Treatment Recommendations",
      "Compliance Monitoring",
    ],
    participants: [
      { id: "doctor", name: "Dr. Sarah Johnson", role: "Primary Care Physician" },
      { id: "patient", name: "John Smith", role: "Patient" },
      { id: "nurse", name: "Mary Wilson", role: "Registered Nurse" },
    ],
  },
  legal: {
    name: "Legal Meeting",
    icon: Scale,
    description: "Secure legal discussions with contract analysis",
    features: [
      "Legal Terminology Recognition",
      "Contract Analysis",
      "Compliance Monitoring",
      "Confidentiality Protection",
    ],
    participants: [
      { id: "attorney1", name: "James Mitchell", role: "Senior Partner" },
      { id: "attorney2", name: "Lisa Chen", role: "Associate Attorney" },
      { id: "client", name: "Robert Davis", role: "Client" },
    ],
  },
  defense: {
    name: "Defense Briefing",
    icon: Shield,
    description: "ITAR-compliant secure communications",
    features: ["Classification Handling", "Security Clearance Verification", "ITAR Compliance", "Threat Analysis"],
    participants: [
      { id: "analyst1", name: "Colonel Anderson", role: "Intelligence Analyst" },
      { id: "analyst2", name: "Major Thompson", role: "Operations Officer" },
      { id: "briefer", name: "Captain Rodriguez", role: "Briefing Officer" },
    ],
  },
  enterprise: {
    name: "Enterprise Collaboration",
    icon: Building,
    description: "Business meetings with automated insights",
    features: ["Action Item Extraction", "Meeting Analytics", "Performance Tracking", "Team Collaboration"],
    participants: [
      { id: "ceo", name: "Michael Chang", role: "CEO" },
      { id: "cto", name: "Sarah Williams", role: "CTO" },
      { id: "manager", name: "David Brown", role: "Project Manager" },
    ],
  },
}

export default function AICollaborationPage() {
  const [selectedMeetingType, setSelectedMeetingType] = useState<keyof typeof MEETING_TYPES | null>(null)
  const [customParticipants, setCustomParticipants] = useState<Array<{ id: string; name: string; role: string }>>([])
  const [meetingStarted, setMeetingStarted] = useState(false)

  const handleStartMeeting = () => {
    if (selectedMeetingType) {
      setMeetingStarted(true)
    }
  }

  const handleMeetingEnd = (summary: any) => {
    console.log("Meeting ended with summary:", summary)
    setMeetingStarted(false)
  }

  if (meetingStarted && selectedMeetingType) {
    const meetingConfig = MEETING_TYPES[selectedMeetingType]
    const participants = customParticipants.length > 0 ? customParticipants : meetingConfig.participants

    return (
      <CollaborativeAISuite
        meetingType={selectedMeetingType}
        participants={participants}
        onMeetingEnd={handleMeetingEnd}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Collaborative Suite
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced generative AI collaboration platform with real-time transcription, intelligent analysis, and
            multi-modal capabilities for professional verticals
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-semibold mb-2">Live Transcription</h3>
              <p className="text-sm text-muted-foreground">85-99% accuracy with speaker diarization</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Brain className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">Sentiment, topics, action items, compliance</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Participant Tracking</h3>
              <p className="text-sm text-muted-foreground">Engagement, emotions, speaking patterns</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <h3 className="font-semibold mb-2">Multi-Modal Generation</h3>
              <p className="text-sm text-muted-foreground">Text, audio, video, presentations</p>
            </CardContent>
          </Card>
        </div>

        {/* Meeting Type Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Meeting Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(MEETING_TYPES).map(([key, config]) => {
                const Icon = config.icon
                const isSelected = selectedMeetingType === key

                return (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedMeetingType(key as keyof typeof MEETING_TYPES)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-lg">{config.name}</h3>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                          <div className="flex flex-wrap gap-1">
                            {config.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Default Participants:</h4>
                          <div className="space-y-1">
                            {config.participants.map((participant) => (
                              <div key={participant.id} className="text-xs text-muted-foreground">
                                {participant.name} - {participant.role}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Participants (Optional) */}
        {selectedMeetingType && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Customize Participants (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Leave empty to use default participants for {MEETING_TYPES[selectedMeetingType].name}
                </p>

                {/* Add custom participant form would go here */}
                <div className="text-sm text-muted-foreground">Custom participant configuration coming soon...</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Meeting */}
        {selectedMeetingType && (
          <div className="text-center">
            <Button onClick={handleStartMeeting} size="lg" className="px-8 py-4 text-lg">
              <Brain className="h-5 w-5 mr-2" />
              Start AI Collaborative Session
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will initialize all AI engines and start real-time processing
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
