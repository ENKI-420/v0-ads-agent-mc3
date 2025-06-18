"use client"

import { useParams, useRouter } from "next/navigation"
import { VideoCallInterface } from "@/components/video-call-interface"

export default function VideoCallPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  // Get user role from URL params or session storage
  const userRole = new URLSearchParams(window.location.search).get("role") || "enterprise"

  const handleEndCall = () => {
    router.push("/dashboard")
  }

  return <VideoCallInterface sessionId={sessionId} userRole={userRole} onEndCall={handleEndCall} />
}
