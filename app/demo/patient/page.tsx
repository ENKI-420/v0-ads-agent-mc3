"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Calendar,
  MessageSquare,
  Activity,
  Pill,
  FileText,
  Video,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface HealthMetric {
  name: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  lastUpdated: string
}

interface Appointment {
  id: string
  date: string
  time: string
  provider: string
  type: string
  status: "upcoming" | "completed" | "cancelled"
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  remaining: number
  nextRefill: string
}

const mockHealthMetrics: HealthMetric[] = [
  {
    name: "Blood Pressure",
    value: "128/82",
    unit: "mmHg",
    status: "warning",
    trend: "up",
    lastUpdated: "2 hours ago",
  },
  {
    name: "Heart Rate",
    value: "72",
    unit: "BPM",
    status: "normal",
    trend: "stable",
    lastUpdated: "2 hours ago",
  },
  {
    name: "Blood Glucose",
    value: "145",
    unit: "mg/dL",
    status: "warning",
    trend: "up",
    lastUpdated: "4 hours ago",
  },
  {
    name: "Weight",
    value: "165",
    unit: "lbs",
    status: "normal",
    trend: "down",
    lastUpdated: "1 day ago",
  },
]

const mockAppointments: Appointment[] = [
  {
    id: "A001",
    date: "2025-06-20",
    time: "10:00 AM",
    provider: "Dr. Sarah Johnson",
    type: "Follow-up Visit",
    status: "upcoming",
  },
  {
    id: "A002",
    date: "2025-06-25",
    time: "2:30 PM",
    provider: "Dr. Michael Chen",
    type: "Cardiology Consultation",
    status: "upcoming",
  },
]

const mockMedications: Medication[] = [
  {
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    remaining: 15,
    nextRefill: "2025-06-25",
  },
  {
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    remaining: 8,
    nextRefill: "2025-06-22",
  },
]

export default function PatientDemo() {
  const [healthScore, setHealthScore] = useState(78)
  const [showTelehealth, setShowTelehealth] = useState(false)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Patient Portal Demo</h1>
              <p className="text-slate-600">Secure patient communication and health insights</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Protected
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Activity className="w-3 h-3 mr-1" />
              Health Score: {healthScore}%
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <MessageSquare className="w-3 h-3 mr-1" />
              Secure Messaging
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common patient tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Provider
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Pill className="w-4 h-4 mr-2" />
                  Refill Prescription
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View Test Results
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Telehealth Consultation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Health Metrics */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Metrics</CardTitle>
                <CardDescription>Current health status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockHealthMetrics.map((metric) => (
                  <div key={metric.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">
                        {metric.value} {metric.unit}
                      </span>
                      <span className="text-sm text-slate-600">{metric.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          metric.status === "normal"
                            ? "default"
                            : metric.status === "warning"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {metric.status === "normal" ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : metric.status === "warning" ? (
                          <AlertCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 mr-1" />
                        )}
                        {metric.status.toUpperCase()}
                      </Badge>
                      <Progress
                        value={metric.status === "normal" ? 100 : metric.status === "warning" ? 50 : 0}
                        className="w-48"
                      />
                      <span className="text-sm text-slate-600">{metric.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
