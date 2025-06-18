"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, AlertTriangle, CheckCircle, Video, Stethoscope, Pill, Activity, Shield } from "lucide-react"
import { CopilotChat } from "@/components/copilot-chat"
import { VideoCallInterface } from "@/components/video-call-interface"

interface PatientData {
  id: string
  name: string
  age: number
  condition: string
  riskLevel: "low" | "medium" | "high"
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenSat: number
  }
  medications: string[]
  alerts: string[]
}

const mockPatients: PatientData[] = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 45,
    condition: "Hypertension, Type 2 Diabetes",
    riskLevel: "medium",
    vitals: {
      heartRate: 78,
      bloodPressure: "140/90",
      temperature: 98.6,
      oxygenSat: 98,
    },
    medications: ["Metformin 500mg", "Lisinopril 10mg", "Atorvastatin 20mg"],
    alerts: ["Blood pressure elevated", "HbA1c due for recheck"],
  },
  {
    id: "P002",
    name: "Michael Chen",
    age: 62,
    condition: "Post-MI, Heart Failure",
    riskLevel: "high",
    vitals: {
      heartRate: 95,
      bloodPressure: "110/70",
      temperature: 99.1,
      oxygenSat: 94,
    },
    medications: ["Carvedilol 25mg", "Furosemide 40mg", "Aspirin 81mg"],
    alerts: ["O2 saturation low", "Weight gain 3lbs in 2 days", "Medication adherence concern"],
  },
]

export default function ClinicianDemo() {
  const [selectedPatient, setSelectedPatient] = useState<PatientData>(mockPatients[0])
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showTelehealth, setShowTelehealth] = useState(false)

  const generateAIInsights = async (patient: PatientData) => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const insights = [
      `Patient ${patient.name} shows ${patient.riskLevel} cardiovascular risk based on current vitals and medication profile.`,
      `Recommend monitoring blood pressure more frequently given recent elevation trends.`,
      `Consider adjusting Lisinopril dosage based on current BP readings and patient response.`,
      `Drug interaction check: No significant interactions detected with current medication regimen.`,
      `Clinical guideline compliance: 85% adherent to AHA/ACC hypertension management guidelines.`,
    ]

    setAiInsights(insights)
    setIsAnalyzing(false)
  }

  useEffect(() => {
    generateAIInsights(selectedPatient)
  }, [selectedPatient])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Clinical AI Copilot Demo</h1>
              <p className="text-slate-600">AI-powered clinical decision support with HIPAA compliance</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Activity className="w-3 h-3 mr-1" />
              Real-time Analysis
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Queue</CardTitle>
                <CardDescription>Select a patient for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPatient.id === patient.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{patient.name}</span>
                      <Badge
                        variant={
                          patient.riskLevel === "high"
                            ? "destructive"
                            : patient.riskLevel === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {patient.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">{patient.condition}</p>
                    <div className="flex items-center mt-2 text-xs text-slate-500">
                      <Heart className="w-3 h-3 mr-1" />
                      {patient.vitals.heartRate} BPM
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="telehealth">Telehealth</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Patient Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedPatient.name}</CardTitle>
                        <CardDescription>
                          Age {selectedPatient.age} • {selectedPatient.condition}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          selectedPatient.riskLevel === "high"
                            ? "destructive"
                            : selectedPatient.riskLevel === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {selectedPatient.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">{selectedPatient.vitals.heartRate}</div>
                        <div className="text-xs text-slate-600">Heart Rate</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">{selectedPatient.vitals.bloodPressure}</div>
                        <div className="text-xs text-slate-600">Blood Pressure</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold">{selectedPatient.vitals.temperature}°F</div>
                        <div className="text-xs text-slate-600">Temperature</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-semibold">{selectedPatient.vitals.oxygenSat}%</div>
                        <div className="text-xs text-slate-600">O2 Saturation</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-blue-500" />
                        AI Clinical Insights
                      </CardTitle>
                      <Button size="sm" onClick={() => generateAIInsights(selectedPatient)} disabled={isAnalyzing}>
                        {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isAnalyzing ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span className="text-sm">Analyzing patient data...</span>
                        </div>
                        <Progress value={75} className="w-full" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {aiInsights.map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Clinical Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPatient.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">{alert}</span>
                          <Button size="sm" variant="outline" className="ml-auto">
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vitals">
                <Card>
                  <CardHeader>
                    <CardTitle>Vital Signs Monitoring</CardTitle>
                    <CardDescription>Real-time patient vital signs with AI trend analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Simulated vital signs chart would go here */}
                      <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600">Interactive vital signs chart</p>
                          <p className="text-sm text-slate-500">Real-time monitoring with AI trend detection</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pill className="w-5 h-5 mr-2" />
                      Medication Management
                    </CardTitle>
                    <CardDescription>AI-powered drug interaction checking and dosage optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPatient.medications.map((medication, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{medication}</span>
                            <div className="text-sm text-slate-600">Daily • With food</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Safe
                            </Badge>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full" variant="outline">
                        <Pill className="w-4 h-4 mr-2" />
                        Add Medication
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="telehealth">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="w-5 h-5 mr-2" />
                      Telehealth Session
                    </CardTitle>
                    <CardDescription>Secure video consultation with AI transcription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!showTelehealth ? (
                      <div className="text-center py-8">
                        <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Start Telehealth Session</h3>
                        <p className="text-slate-600 mb-4">
                          Connect with {selectedPatient.name} for a secure video consultation
                        </p>
                        <Button onClick={() => setShowTelehealth(true)}>
                          <Video className="w-4 h-4 mr-2" />
                          Start Video Call
                        </Button>
                      </div>
                    ) : (
                      <VideoCallInterface
                        sessionId="demo-clinical-session"
                        onEndCall={() => setShowTelehealth(false)}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Copilot */}
          <div className="lg:col-span-1">
            <CopilotChat role="clinician" />
          </div>
        </div>
      </div>
    </div>
  )
}
