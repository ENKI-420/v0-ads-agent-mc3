"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Mic, Video, MessageSquare, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

export function VideoConference() {
  const [isMeetingActive, setIsMeetingActive] = useState(false)
  const [recordingProgress, setRecordingProgress] = useState(0)
  const [summary, setSummary] = useState("")
  const [loadingSummary, setLoadingSummary] = useState(false)

  const handleStartMeeting = () => {
    setIsMeetingActive(true)
    setRecordingProgress(0)
    setSummary("")
    const interval = setInterval(() => {
      setRecordingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500) // Simulate recording progress
  }

  const handleEndMeeting = async () => {
    setIsMeetingActive(false)
    setLoadingSummary(true)
    setSummary("Generating AI summary...")

    try {
      // Simulate AI summary generation
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setSummary(`
        **Meeting Summary:**
        - Discussed Q3 marketing strategies.
        - Reviewed product roadmap for 2025.
        - Action item: Follow up on client feedback by end of week.

        **Key Decisions:**
        - Approved budget for digital ad campaigns.
        - Prioritized feature X for next sprint.

        **Participants:** John Doe, Jane Smith, Bob Johnson.
      `)
    } catch (error) {
      console.error("Error generating summary:", error)
      setSummary("Failed to generate summary. Please try again.")
    } finally {
      setLoadingSummary(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI-Enhanced Video Conferencing</CardTitle>
        <CardDescription>
          Experience smarter meetings with real-time transcription, AI summaries, and actionable insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="aspect-video w-full rounded-md bg-black flex items-center justify-center text-white text-lg">
          {isMeetingActive ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-group-of-people-working-in-an-office-4000-large.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="relative z-10 text-center">
                <p className="text-2xl font-bold">Meeting in Progress</p>
                <p className="text-sm text-muted-foreground">Simulating live video feed</p>
              </div>
            </div>
          ) : (
            "Meeting Room"
          )}
        </div>
        <div className="flex justify-center gap-4">
          {!isMeetingActive ? (
            <Button onClick={handleStartMeeting} size="lg">
              <Play className="mr-2 h-5 w-5" /> Start Meeting
            </Button>
          ) : (
            <>
              <Button onClick={handleEndMeeting} size="lg" variant="destructive">
                <Pause className="mr-2 h-5 w-5" /> End Meeting
              </Button>
              <Button variant="outline" size="lg">
                <Mic className="mr-2 h-5 w-5" /> Mute
              </Button>
              <Button variant="outline" size="lg">
                <Video className="mr-2 h-5 w-5" /> Stop Video
              </Button>
            </>
          )}
        </div>

        {isMeetingActive && (
          <div className="grid gap-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Recording Progress</span>
              <span>{recordingProgress}%</span>
            </div>
            <Progress value={recordingProgress} className="h-2" />
          </div>
        )}

        {summary && (
          <Card className="bg-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> AI Meeting Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <p className="text-sm text-muted-foreground animate-pulse">{summary}</p>
              ) : (
                <ScrollArea className="h-[200px] whitespace-pre-wrap">
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, "<br/>") }} />
                </ScrollArea>
              )}
              {!loadingSummary && (
                <Button variant="outline" className="mt-4 w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" /> Download Summary
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
