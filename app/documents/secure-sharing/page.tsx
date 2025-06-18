"use client"

import { SecureDocumentInterface } from "@/components/document-sharing/secure-document-interface"
import { useEffect, useState } from "react"

export default function SecureDocumentSharingPage() {
  const [userContext, setUserContext] = useState({
    userId: "user_123",
    userRole: "enterprise",
    vertical: "enterprise" as const,
  })

  // In a real app, get user context from auth
  useEffect(() => {
    const role = localStorage.getItem("userRole") || "enterprise"
    const vertical = localStorage.getItem("vertical") || "enterprise"
    setUserContext({
      userId: "user_123",
      userRole: role,
      vertical: vertical as any,
    })
  }, [])

  return (
    <div className="min-h-screen">
      <SecureDocumentInterface
        userId={userContext.userId}
        userRole={userContext.userRole}
        vertical={userContext.vertical}
      />
    </div>
  )
}
