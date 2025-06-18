"use client"

import { useParams } from "next/navigation"
import { CollaborationHub } from "@/components/collaboration/collaboration-hub"

export default function CollaborationPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  // In a real app, these would come from authentication
  const userId = "user-123"
  const userName = "John Doe"
  const userRole = "analyst"

  return <CollaborationHub sessionId={sessionId} userId={userId} userName={userName} userRole={userRole} />
}
