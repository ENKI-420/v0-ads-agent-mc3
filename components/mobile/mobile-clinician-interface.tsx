"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Heart,
  Activity,
  Stethoscope,
  AlertTriangle,
  Menu,
  Phone,
  MessageSquare,
  Calendar,
  Pill,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface PatientCard {
  id: string
  name: string
  age: number
  room: string
  condition: string
  priority: "low" | "medium" | "high" | "critical"
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenSat: number
  }
  alerts: number
  lastUpdate: string
}

const mockPatients: PatientCard[] = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 45,
    room: "302A",
    condition: "Post-op monitoring",
    priority: "medium",
    vitals: { heartRate: 78, bloodPressure: "140/90", temperature: 98.6, oxygenSat: 98 },
    alerts: 2,
    lastUpdate: "5 min ago",
  },
  {
    id: "P002",
    name: "Michael Chen",
    age: 62,
    room: "305B",
    condition: "Cardiac monitoring",
    priority: "high",
    vitals: { heartRate: 95, bloodPressure: "110/70", temperature: 99.1, oxygenSat: 94 },
    alerts: 3,
    lastUpdate: "2 min ago",
  },
  {
    id: "P003",
    name: "Emma Davis",
    age: 28,
    room: "301C",
    condition: "Recovery",
    priority: "low",
    vitals: { heartRate: 68, bloodPressure: "118/75", temperature: 98.2, oxygenSat: 99 },
    alerts: 0,
    lastUpdate: "10 min ago",
  },
]

export function MobileClinicianInterface() {
  const [selectedPatient, setSelectedPatient] = useState<PatientCard | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [patients, setPatients] = useState(mockPatients)
  const isMobile = useMobile()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
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
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Stethoscope className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-semibold">Clinical Mobile</h1>
              <p className="text-xs text-blue-100">{patients.length} patients</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-blue-700"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Rounds
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Team Chat
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Emergency Call
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Pill className="w-4 h-4 mr-2" />
                      Medication Orders
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="p-4 space-y-3">
        {patients.map((patient) => (
          <Card
            key={patient.id}
            className="cursor-pointer transition-all duration-200 active:scale-95"
            onClick={() => setSelectedPatient(patient)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(patient.priority)}`} />
                  <div>
                    <h3 className="font-semibold text-base">{patient.name}</h3>
                    <p className="text-sm text-gray-600">
                      Room {patient.room} • Age {patient.age}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-3">
                <Badge variant={getPriorityBadge(patient.priority) as any} className="text-xs">
                  {patient.priority.toUpperCase()}
                </Badge>
                {patient.alerts > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {patient.alerts} alerts
                  </Badge>
                )}
              </div>

              {/* Vital Signs - Mobile Optimized */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>{patient.vitals.heartRate} BPM</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span>{patient.vitals.bloodPressure}</span>
                </div>
                <div className="text-gray-600">{patient.vitals.temperature}°F</div>
                <div className="text-gray-600">O2: {patient.vitals.oxygenSat}%</div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-gray-500">{patient.condition}</span>
                <span className="text-xs text-gray-500">{patient.lastUpdate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <Sheet open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <SheetContent side="bottom" className="h-[80vh]">
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                  <p className="text-gray-600">
                    Room {selectedPatient.room} • Age {selectedPatient.age}
                  </p>
                </div>
                <Badge variant={getPriorityBadge(selectedPatient.priority) as any}>
                  {selectedPatient.priority.toUpperCase()}
                </Badge>
              </div>

              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {/* Vital Signs */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Current Vitals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                          <div className="text-lg font-semibold">{selectedPatient.vitals.heartRate}</div>
                          <div className="text-xs text-gray-600">Heart Rate</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Activity className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                          <div className="text-lg font-semibold">{selectedPatient.vitals.bloodPressure}</div>
                          <div className="text-xs text-gray-600">Blood Pressure</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-semibold">{selectedPatient.vitals.temperature}°F</div>
                          <div className="text-xs text-gray-600">Temperature</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-semibold">{selectedPatient.vitals.oxygenSat}%</div>
                          <div className="text-xs text-gray-600">O2 Saturation</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts */}
                  {selectedPatient.alerts > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                          Active Alerts ({selectedPatient.alerts})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-sm">Blood pressure elevated - requires monitoring</p>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm">Medication due in 30 minutes</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <Pill className="w-4 h-4 mr-2" />
                        Administer Medication
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Specialist
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full w-14 h-14 shadow-lg">
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
