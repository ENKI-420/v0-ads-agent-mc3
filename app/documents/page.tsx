"use client"

import { DocumentProcessingHub } from "@/components/document-processing/document-processing-hub"
import { useEffect, useState } from "react"

export default function DocumentsPage() {
  const [userRole, setUserRole] = useState("enterprise")
  const [compliance, setCompliance] = useState(["SOC2", "GDPR"])

  // In a real app, get user role and compliance from auth context
  useEffect(() => {
    // Simulate getting user context
    const role = localStorage.getItem("userRole") || "enterprise"
    const comp = JSON.parse(localStorage.getItem("compliance") || '["SOC2", "GDPR"]')
    setUserRole(role)
    setCompliance(comp)
  }, [])

  return (
    <div className="container mx-auto py-8">
      <DocumentProcessingHub role={userRole} compliance={compliance} userId="user_123" />
    </div>
  )
}
