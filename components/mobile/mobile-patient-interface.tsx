"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Heart,
  Calendar,
  Pill,
  MessageSquare,
  Activity,
  FileText,
  Video,
  Menu,
  AlertCircle,
  CheckCircle,
  Plus,
  Bell,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface HealthMetric {
  name: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
  lastReading: string
}

interface Appointment {
  id: string
  date: string
  time: string
  provider: string
  type: string
  status: "upcoming" | "completed"
}

interface Medication {
  name: string
  dosage: string
  nextDose: string
  remaining: number
  status: "on-time" | "overdue" | "upcoming"
}

const mockHealthMetrics: HealthMetric[] = [
  {
    name: "Blood Pressure",
    value: "128/82",
    unit: "mmHg",
    status: "warning",
    lastReading: "2 hours ago",
  },
  {
    name: "Heart Rate",
    value: "72",
    unit: "BPM",
    status: "normal",
    lastReading: "2 hours ago",
  },
  {
    name: "Blood Glucose",
    value: "145",
    unit: "mg/dL",
    status: "warning",
    lastReading: "4 hours ago",
  },
  {
    name: "Weight",
    value: "165",
    unit: "lbs",
    status: "normal",
    lastReading: "1 day ago",
  },
]

const mockAppointments: Appointment[] = [
  {
    id: "A001",
    date: "Today",
    time: "2:30 PM",
    provider: "Dr. Sarah Johnson",
    type: "Follow-up",
    status: "upcoming",
  },
  {
    id: "A002",
    date: "Jun 25",
    time: "10:00 AM",
    provider: "Dr. Michael Chen",
    type: "Cardiology",
    status: "upcoming",
  },
]

const mockMedications: Medication[] = [
  {
    name: "Metformin",
    dosage: "500mg",
    nextDose: "6:00 PM",
    remaining: 15,
    status: "upcoming",
  },
  {
    name: "Lisinopril",
    dosage: "10mg",
    nextDose: "8:00 AM",
    remaining: 8,
    status: "overdue",
  },
]

export function MobilePatientInterface() {
  const [healthScore] = useState(78)
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null)
  const isMobile = useMobile()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "critical":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  if (!isMobile) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-600">Mobile interface - please view on a mobile device</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-semibold">My Health</h1>
              <p className="text-xs text-green-100">Health Score: {healthScore}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-green-700">
              <Bell className="w-4 h-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:bg-green-700">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
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
                      <Video className="w-4 h-4 mr-2" />
                      Telehealth Visit
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Health Score */}
      <div className="p-4 bg-white border-b">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-green-600 mb-1">{healthScore}%</div>
          <p className="text-sm text-gray-600">Overall Health Score</p>
        </div>
        <Progress value={healthScore} className="w-full h-3" />
        <p className="text-xs text-center text-gray-500 mt-2">Good - Keep up the healthy habits!</p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 space-y-4">
          {/* Today's Medications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center">
                  <Pill className="w-4 h-4 mr-2" />
                  Today's Medications
                </span>
                <Badge variant="destructive" className="text-xs">
                  1 overdue
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockMedications.map((med, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    med.status === "overdue"
                      ? "border-red-200 bg-red-50"
                      : med.status === "upcoming"
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{med.name}</h3>
                    <Badge
                      variant={
                        med.status === "overdue" ? "destructive" : med.status === "upcoming" ? "default" : "outline"
                      }
                      className="text-xs"
                    >
                      {med.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      {med.dosage} • Next: {med.nextDose}
                    </span>
                    <span>{med.remaining} pills left</span>
                  </div>
                  {med.status === "overdue" && (
                    <Button size="sm" className="w-full mt-2">
                      Mark as Taken
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Health Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockHealthMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer active:bg-gray-50"
                  onClick={() => setSelectedMetric(metric)}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <h3 className="font-medium text-sm">{metric.name}</h3>
                      <p className="text-xs text-gray-500">{metric.lastReading}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getStatusColor(metric.status)}`}>
                      {metric.value} {metric.unit}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Reading
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{appointment.type}</h3>
                    <Badge variant="outline" className="text-xs">
                      {appointment.date}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{appointment.provider}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{appointment.time}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Video className="w-3 h-3 mr-1" />
                        Join
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">Dr. Sarah Johnson</h3>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your test results are ready for review. Please schedule a follow-up...
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">Pharmacy</h3>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-sm text-gray-600">Your prescription is ready for pickup at CVS Pharmacy...</p>
              </div>
              <Button variant="outline" className="w-full">
                View All Messages
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Health Metric Detail Modal */}
      {selectedMetric && (
        <Sheet open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
          <SheetContent side="bottom" className="h-[60vh]">
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{selectedMetric.name}</h2>
                {getStatusIcon(selectedMetric.status)}
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-3xl font-bold ${getStatusColor(selectedMetric.status)} mb-1`}>
                    {selectedMetric.value}
                  </div>
                  <div className="text-sm text-gray-600">{selectedMetric.unit}</div>
                  <div className="text-xs text-gray-500 mt-1">Last reading: {selectedMetric.lastReading}</div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Reading
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Provider
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Heart className="w-4 h-4 mb-1" />
            <span className="text-xs">Health</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Calendar className="w-4 h-4 mb-1" />
            <span className="text-xs">Appointments</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Pill className="w-4 h-4 mb-1" />
            <span className="text-xs">Medications</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <MessageSquare className="w-4 h-4 mb-1" />
            <span className="text-xs">Messages</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
