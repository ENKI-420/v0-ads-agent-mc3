"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Download,
  Share,
  Volume2,
} from "lucide-react"
import { AdvancedTranscriptionEngine, type TranscriptionResult } from "@/lib/ai/transcription-engine"
import { AIAnalysisEngine, type ActionItem, type ComplianceFlag } from "@/lib/ai/analysis-engine"
import { MultiModalGenerativeEngine } from "@/lib/ai/multimodal-generator"
import { ParticipantTracker, type ParticipantMetrics } from "@/lib/ai/participant-tracker"

interface CollaborativeAISuiteProps {
  meetingType: "healthcare" | "legal" | "defense" | "enterprise"
  participants: Array<{
    id: string
    name: string
    role: string
  }>
  onMeetingEnd?: (summary: any) => void
}

export function CollaborativeAISuite({ meetingType, participants, onMeetingEnd }: CollaborativeAISuiteProps) {
  // Core AI engines
  const [transcriptionEngine] = useState(
    () =>
      new AdvancedTranscriptionEngine({
        language: "en",
        model: "whisper-large",
        accuracy: "premium",
        realTimeProcessing: true,
        speakerDiarization: true,
        noiseReduction: true,
      }),
  )

  const [analysisEngine] = useState(
    () =>
      new AIAnalysisEngine({
        enableSentimentAnalysis: true,
        enableTopicExtraction: true,
        enableActionItemDetection: true,
        enableComplianceMonitoring: true,
        enableEmotionDetection: true,
        complianceStandards: getComplianceStandards(meetingType),
        confidenceThreshold: 0.7,
      }),
  )

  const [generativeEngine] = useState(() => new MultiModalGenerativeEngine())
  const [participantTracker] = useState(() => new ParticipantTracker())

  // State management
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [currentTranscription, setCurrentTranscription] = useState<TranscriptionResult[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [complianceFlags, setComplianceFlags] = useState<ComplianceFlag[]>([])
  const [participantMetrics, setParticipantMetrics] = useState<ParticipantMetrics[]>([])
  const [currentSentiment, setCurrentSentiment] = useState<any>(null)
  const [generationProgress, setGenerationProgress] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState("transcription")

  // Refs
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Initialize AI engines
  useEffect(() => {
    const initializeEngines = async () => {
      try {
        await transcriptionEngine.initialize()

        // Set up event handlers
        transcriptionEngine.onTranscriptionResult = handleTranscriptionResult
        analysisEngine.onActionItemDetected = handleActionItemDetected
        analysisEngine.onComplianceFlag = handleComplianceFlag
        analysisEngine.onSentimentUpdate = handleSentimentUpdate
        analysisEngine.onParticipantAnalytics = handleParticipantUpdate
        generativeEngine.onGenerationProgress = handleGenerationProgress

        // Initialize participants
        participants.forEach((participant) => {
          participantTracker.addParticipant(participant.id, participant.name, participant.role)
        })

        console.log("AI Collaborative Suite initialized")
      } catch (error) {
        console.error("Failed to initialize AI engines:", error)
      }
    }

    initializeEngines()

    return () => {
      transcriptionEngine.stop()
      participantTracker.reset()
    }
  }, [])

  // Event handlers
  const handleTranscriptionResult = useCallback((result: TranscriptionResult) => {
    setCurrentTranscription((prev) => [...prev.slice(-50), result]) // Keep last 50 results

    // Trigger AI analysis
    analysisEngine.analyzeTranscription(result.text, result.speakerId || "unknown", result.timestamp)

    // Update participant tracking
    if (result.speakerId) {
      // This would normally include audio data for analysis
      participantTracker.updateSpeakingActivity(
        result.speakerId,
        result.text,
        new Float32Array(1024), // Placeholder audio data
        result.timestamp,
        result.duration,
      )
    }
  }, [])

  const handleActionItemDetected = useCallback((actionItem: ActionItem) => {
    setActionItems((prev) => [...prev, actionItem])
  }, [])

  const handleComplianceFlag = useCallback((flag: ComplianceFlag) => {
    setComplianceFlags((prev) => [...prev, flag])
  }, [])

  const handleSentimentUpdate = useCallback((sentiment: any) => {
    setCurrentSentiment(sentiment)
  }, [])

  const handleParticipantUpdate = useCallback((participant: ParticipantMetrics) => {
    setParticipantMetrics((prev) => {
      const updated = prev.filter((p) => p.id !== participant.id)
      return [...updated, participant]
    })
  }, [])

  const handleGenerationProgress = useCallback((requestId: string, progress: number) => {
    setGenerationProgress((prev) => ({ ...prev, [requestId]: progress }))
  }, [])

  // Media controls
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        },
        video: isVideoEnabled
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            }
          : false,
      })

      mediaStreamRef.current = stream

      if (videoRef.current && isVideoEnabled) {
        videoRef.current.srcObject = stream
      }

      await transcriptionEngine.startRealTimeTranscription(stream)
      setIsRecording(true)
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }

    transcriptionEngine.stop()
    setIsRecording(false)
  }

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => !prev)
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
      }
    }
  }

  // Generation functions
  const generateMeetingSummary = async () => {
    const transcriptions = currentTranscription.map((t) => t.text)
    const participantNames = participants.map((p) => p.name)

    try {
      const requestId = await generativeEngine.generateMeetingSummary(transcriptions, participantNames, meetingType)
      console.log("Meeting summary generation started:", requestId)
    } catch (error) {
      console.error("Failed to generate meeting summary:", error)
    }
  }

  const generateActionItemReport = async () => {
    try {
      const requestId = await generativeEngine.generateActionItemReport(actionItems)
      console.log("Action item report generation started:", requestId)
    } catch (error) {
      console.error("Failed to generate action item report:", error)
    }
  }

  // Helper functions
  function getComplianceStandards(type: string): ("HIPAA" | "SOC2" | "GDPR" | "ITAR")[] {
    const standards = {
      healthcare: ["HIPAA"] as const,
      legal: ["SOC2", "GDPR"] as const,
      defense: ["ITAR"] as const,
      enterprise: ["SOC2"] as const,
    }
    return standards[type as keyof typeof standards] || []
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "violation":
        return "destructive"
      case "warning":
        return "default"
      case "info":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              AI Collaborative Suite - {meetingType.charAt(0).toUpperCase() + meetingType.slice(1)}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button onClick={toggleVideo} variant={isVideoEnabled ? "default" : "outline"} size="icon">
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button onClick={generateMeetingSummary} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Summary
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Video Preview */}
      {isVideoEnabled && (
        <Card>
          <CardContent className="p-4">
            <video ref={videoRef} autoPlay muted className="w-full max-w-md mx-auto rounded-lg" />
          </CardContent>
        </Card>
      )}

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="transcription">Live Transcription</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="generation">AI Generation</TabsTrigger>
        </TabsList>

        {/* Live Transcription Tab */}
        <TabsContent value="transcription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Live Transcription
                {isRecording && (
                  <Badge variant="destructive" className="ml-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                    Recording
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full border rounded-lg p-4">
                {currentTranscription.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    {isRecording ? "Listening for speech..." : "Start recording to see transcription"}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentTranscription.map((result, index) => (
                      <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0">
                          <Badge variant="outline">{result.speakerId || "Unknown"}</Badge>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{result.text}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(result.timestamp).toLocaleTimeString()}
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(result.confidence * 100)}% confidence
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentSentiment ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Sentiment</span>
                      <Badge
                        variant={
                          currentSentiment.overall === "positive"
                            ? "default"
                            : currentSentiment.overall === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {currentSentiment.overall}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sentiment Score</span>
                        <span>{(currentSentiment.score * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(currentSentiment.score + 1) * 50} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confidence</span>
                        <span>{(currentSentiment.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={currentSentiment.confidence * 100} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">No sentiment data available</div>
                )}
              </CardContent>
            </Card>

            {/* Topic Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Topic Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-4">
                  Topic analysis will appear here during the meeting
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participant Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participantMetrics.map((participant) => (
                  <div key={participant.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{participant.name}</h4>
                        <p className="text-sm text-muted-foreground">{participant.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getEngagementColor(participant.attentionLevel)}`} />
                        <Badge variant="outline">{participant.attentionLevel} engagement</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Speaking Time</p>
                        <p className="font-medium">{Math.round(participant.totalSpeakingTime)}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Word Count</p>
                        <p className="font-medium">{participant.wordCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participation</p>
                        <p className="font-medium">{participant.participationRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement Score</p>
                        <p className="font-medium">{participant.engagementScore}/100</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Level</span>
                        <span>{participant.engagementScore}%</span>
                      </div>
                      <Progress value={participant.engagementScore} className="h-2" />
                    </div>
                  </div>
                ))}

                {participantMetrics.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Participant analytics will appear during the meeting
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Action Items ({actionItems.length})
                </CardTitle>
                <Button onClick={generateActionItemReport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {actionItems.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No action items detected yet</div>
                ) : (
                  <div className="space-y-3">
                    {actionItems.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium">{item.text}</p>
                          <Badge
                            variant={
                              item.priority === "urgent"
                                ? "destructive"
                                : item.priority === "high"
                                  ? "default"
                                  : item.priority === "medium"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {item.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {item.assignee && <span>Assigned to: {item.assignee}</span>}
                          {item.dueDate && <span>Due: {item.dueDate.toLocaleDateString()}</span>}
                          <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          Extracted from {item.extractedFrom.speakerId} at{" "}
                          {new Date(item.extractedFrom.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Compliance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Active Standards:</span>
                  {getComplianceStandards(meetingType).map((standard) => (
                    <Badge key={standard} variant="outline">
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-80">
                {complianceFlags.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    No compliance issues detected
                  </div>
                ) : (
                  <div className="space-y-3">
                    {complianceFlags.map((flag) => (
                      <Alert
                        key={flag.id}
                        variant={
                          flag.severity === "critical" || flag.severity === "violation" ? "destructive" : "default"
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {flag.type} - {flag.severity}
                              </span>
                              <Badge variant={getSeverityColor(flag.severity)}>
                                {Math.round(flag.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <p>{flag.description}</p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Recommendation:</strong> {flag.recommendation}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Detected at {new Date(flag.timestamp).toLocaleTimeString()}
                              {flag.speakerId && ` from ${flag.speakerId}`}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Generation Tab */}
        <TabsContent value="generation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generateMeetingSummary} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Meeting Summary
                </Button>
                <Button onClick={generateActionItemReport} className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Generate Action Item Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Generate Audio Summary
                </Button>
                <Button className="w-full" variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Create Presentation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(generationProgress).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No active generations</div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(generationProgress).map(([requestId, progress]) => (
                      <div key={requestId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Generation {requestId.slice(-8)}</span>
                          <span>{Math.round(progress * 100)}%</span>
                        </div>
                        <Progress value={progress * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
