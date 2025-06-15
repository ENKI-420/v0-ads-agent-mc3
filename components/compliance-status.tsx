"use client"

import { Shield, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const complianceStatuses = {
  HIPAA: { status: "active", lastAudit: "2024-01-15" },
  SOC2: { status: "active", lastAudit: "2024-01-10" },
  GDPR: { status: "active", lastAudit: "2024-01-20" },
  ITAR: { status: "pending", lastAudit: "2024-01-05" },
}

export function ComplianceStatus() {
  const activeCompliance = Object.entries(complianceStatuses).filter(([_, data]) => data.status === "active")
  const pendingCompliance = Object.entries(complianceStatuses).filter(([_, data]) => data.status === "pending")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="space-x-2">
          <Shield className="w-4 h-4" />
          <span>Compliance</span>
          <Badge variant="secondary" className="ml-1">
            {activeCompliance.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Compliance Status</span>
            </CardTitle>
            <CardDescription>Current compliance and audit status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active Compliance */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">Active Compliance</h4>
              <div className="space-y-2">
                {activeCompliance.map(([name, data]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    <span className="text-xs text-slate-500">Audited {data.lastAudit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Compliance */}
            {pendingCompliance.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-orange-700 dark:text-orange-400">Pending Review</h4>
                <div className="space-y-2">
                  {pendingCompliance.map(([name, data]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                      <span className="text-xs text-slate-500">Review needed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Features */}
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Security Features</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Badge variant="outline" className="justify-center">
                  End-to-End Encryption
                </Badge>
                <Badge variant="outline" className="justify-center">
                  Zero Trust Architecture
                </Badge>
                <Badge variant="outline" className="justify-center">
                  Audit Logging
                </Badge>
                <Badge variant="outline" className="justify-center">
                  Role-Based Access
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
