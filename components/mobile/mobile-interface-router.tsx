"use client"

import { useEffect, useState } from "react"
import { MobileClinicianInterface } from "./mobile-clinician-interface"
import { MobileAttorneyInterface } from "./mobile-attorney-interface"
import { MobileAnalystInterface } from "./mobile-analyst-interface"
import { MobilePatientInterface } from "./mobile-patient-interface"
import { MobileEnterpriseInterface } from "./mobile-enterprise-interface"
import { useMobile } from "@/hooks/use-mobile"

interface MobileInterfaceRouterProps {
  role: "clinician" | "attorney" | "analyst" | "patient" | "enterprise"
}

export function MobileInterfaceRouter({ role }: MobileInterfaceRouterProps) {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Mobile Interface</h2>
          <p className="text-gray-600">Please view this page on a mobile device to see the mobile interface.</p>
        </div>
      </div>
    )
  }

  switch (role) {
    case "clinician":
      return <MobileClinicianInterface />
    case "attorney":
      return <MobileAttorneyInterface />
    case "analyst":
      return <MobileAnalystInterface />
    case "patient":
      return <MobilePatientInterface />
    case "enterprise":
      return <MobileEnterpriseInterface />
    default:
      return <MobileEnterpriseInterface />
  }
}
