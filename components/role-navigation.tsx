"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Video, FileText, Users, Settings, Brain, Shield, Activity, Calendar, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RoleNavigationProps {
  currentRole: string
}

const navigationItems = {
  clinician: [
    { icon: Home, label: "Dashboard", href: "/clinician/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/clinician/appointments" },
    { icon: FileText, label: "Patient Records", href: "/clinician/records" },
    { icon: Video, label: "Telehealth", href: "/clinician/telehealth" },
    { icon: Brain, label: "AI Diagnostics", href: "/clinician/diagnostics" },
    { icon: Activity, label: "Analytics", href: "/clinician/analytics" },
  ],
  attorney: [
    { icon: Home, label: "Dashboard", href: "/attorney/dashboard" },
    { icon: FileText, label: "Case Files", href: "/attorney/cases" },
    { icon: Video, label: "Client Meetings", href: "/attorney/meetings" },
    { icon: Brain, label: "Legal Research", href: "/attorney/research" },
    { icon: Shield, label: "Compliance", href: "/attorney/compliance" },
    { icon: Activity, label: "Billing", href: "/attorney/billing" },
  ],
  analyst: [
    { icon: Home, label: "Dashboard", href: "/analyst/dashboard" },
    { icon: Shield, label: "Threat Intel", href: "/analyst/threats" },
    { icon: Activity, label: "Risk Assessment", href: "/analyst/risk" },
    { icon: Video, label: "Briefings", href: "/analyst/briefings" },
    { icon: Brain, label: "AI Analysis", href: "/analyst/analysis" },
    { icon: FileText, label: "Reports", href: "/analyst/reports" },
  ],
  patient: [
    { icon: Home, label: "Dashboard", href: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
    { icon: FileText, label: "Health Records", href: "/patient/records" },
    { icon: Video, label: "Telehealth", href: "/patient/telehealth" },
    { icon: MessageSquare, label: "Messages", href: "/patient/messages" },
    { icon: Activity, label: "Health Tracking", href: "/patient/tracking" },
  ],
  enterprise: [
    { icon: Home, label: "Dashboard", href: "/enterprise/dashboard" },
    { icon: Activity, label: "Analytics", href: "/enterprise/analytics" },
    { icon: Users, label: "Team Management", href: "/enterprise/team" },
    { icon: Brain, label: "AI Automation", href: "/enterprise/automation" },
    { icon: Shield, label: "Security", href: "/enterprise/security" },
    { icon: FileText, label: "Documents", href: "/enterprise/documents" },
  ],
}

export function RoleNavigation({ currentRole }: RoleNavigationProps) {
  const pathname = usePathname()
  const items = navigationItems[currentRole as keyof typeof navigationItems] || []

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 text-left",
                isActive
                  ? "bg-gold-500/20 text-gold-400 hover:bg-gold-500/30"
                  : "text-slate-300 hover:text-white hover:bg-navy-800",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Button>
          </Link>
        )
      })}

      <div className="pt-4 mt-4 border-t border-navy-700">
        <Link href={`/${currentRole}/settings`}>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 text-slate-300 hover:text-white hover:bg-navy-800"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
    </nav>
  )
}
