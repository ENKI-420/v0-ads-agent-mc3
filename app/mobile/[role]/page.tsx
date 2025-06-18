"use client"

import { MobileInterfaceRouter } from "@/components/mobile/mobile-interface-router"
import { notFound } from "next/navigation"

interface MobileRolePageProps {
  params: {
    role: string
  }
}

const validRoles = ["clinician", "attorney", "analyst", "patient", "enterprise"]

export default function MobileRolePage({ params }: MobileRolePageProps) {
  if (!validRoles.includes(params.role)) {
    notFound()
  }

  return <MobileInterfaceRouter role={params.role as any} />
}
