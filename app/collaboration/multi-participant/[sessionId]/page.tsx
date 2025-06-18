"use client"

import { useParams, useSearchParams } from "next/navigation"
import { MultiParticipantInterface } from "@/components/collaboration/multi-participant-interface"

export default function MultiParticipantCollaborationPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const sessionId = params.sessionId as string
  const vertical = (searchParams.get("vertical") as "healthcare" | "legal" | "defense" | "enterprise") || "enterprise"

  // In a real app, this would come from authentication
  const currentUser = {
    id: "user-123",
    name: "John Doe",
    role: "analyst",
    avatar: "/placeholder-user.jpg",
  }

  return <MultiParticipantInterface sessionId={sessionId} currentUser={currentUser} vertical={vertical} />
}
