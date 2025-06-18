"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Target,
  AlertTriangle,
  TrendingUp,
  Map,
  Radar,
  Activity,
  Globe,
  Lock,
  Eye,
  Zap,
  Database,
} from "lucide-react"
import { CopilotChat } from "@/components/copilot-chat"

interface ThreatData {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  category: string
  region: string
  confidence: number
  lastUpdated: string
  status: "active" | "monitoring" | "resolved"
}

interface IntelligenceReport {
  id: string
  title: string
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  summary: string
  keyFindings: string[]
  riskLevel: number
}

const mockThreats: ThreatData[] = [
  {
    id: "T001",
    title: "Advanced Persistent Threat - APT29",
    severity: "critical",
    category: "Cyber Warfare",
    region: "Eastern Europe",
    confidence: 95,
    lastUpdated: "2 hours ago",
    status: "active",
  },
  {
    id: "T002",
    title: "Supply Chain Vulnerability",
    severity: "high",
    category: "Economic Security",
    region: "Southeast Asia",
    confidence: 78,
    lastUpdated: "6 hours ago",
    status: "monitoring",
  },
  {
    id: "T003",
    title: "Disinformation Campaign",
    severity: "medium",
    category: "Information Warfare",
    region: "Global",
    confidence: 82,
    lastUpdated: "1 day ago",
    status: "monitoring",
  },
]

const mockReport: IntelligenceReport = {
  id: "RPT001",
  title: "Quarterly Threat Assessment - Q2 2025",
  classification: "CONFIDENTIAL",
  summary:
    "Comprehensive analysis of emerging threats in the cyber domain with focus on critical infrastructure vulnerabilities.",
  keyFindings: [
    "30% increase in state-sponsored cyber attacks targeting critical infrastructure",
    "New malware families detected with advanced evasion capabilities",
    "Supply chain attacks becoming more sophisticated and targeted",
    "Increased coordination between threat actors across different regions",
  ],
  riskLevel: 75,
}

export default function AnalystDemo() {
  const [selectedThreat, setSelectedThreat] = useState<ThreatData>(mockThreats[0])
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [riskScore, setRiskScore] = useState(75)

  const performThreatAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI threat analysis
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Defense Intelligence Copilot Demo</h1>
              <p className="text-slate-600">AI-powered intelligence analysis with security clearance</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Lock className="w-3 h-3 mr-1" />
              CONFIDENTIAL
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Radar className="w-3 h-3 mr-1" />
              AI Threat Detection
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              Risk Level: {riskScore}%
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Threat List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Threats</CardTitle>
                <CardDescription>Current threat landscape</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedThreat.id === threat.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedThreat(threat)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          threat.severity === "critical"
                            ? "destructive"
                            : threat.severity === "high"
                              ? "destructive"
                              : threat.severity === "medium"
                                ? "default"
                                : "secondary"
                        }
                        className="text-xs"
                      >
                        {threat.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {threat.confidence}%
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{threat.title}</h3>
                    <p className="text-xs text-slate-600 mb-2">{threat.region}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{threat.category}</span>
                      <span>{threat.lastUpdated}</span>
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
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="geospatial">Geospatial</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Threat Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedThreat.title}</CardTitle>
                        <CardDescription>
                          {selectedThreat.category} • {selectedThreat.region}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          selectedThreat.severity === "critical"
                            ? "destructive"
                            : selectedThreat.severity === "high"
                              ? "destructive"
                              : selectedThreat.severity === "medium"
                                ? "default"
                                : "secondary"
                        }
                      >
                        {selectedThreat.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Target className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">{selectedThreat.confidence}%</div>
                        <div className="text-xs text-slate-600">Confidence</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">High</div>
                        <div className="text-xs text-slate-600">Impact Level</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Globe className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">Multi</div>
                        <div className="text-xs text-slate-600">Vectors</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Activity className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">Active</div>
                        <div className="text-xs text-slate-600">Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Threat Intelligence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-500" />
                      Intelligence Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="font-medium text-red-800">Critical Infrastructure Target</span>
                        </div>
                        <p className="text-sm text-red-700">
                          Advanced persistent threat group targeting energy sector with sophisticated malware campaign.
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Zap className="w-4 h-4 text-orange-500 mr-2" />
                          <span className="font-medium text-orange-800">Attack Vectors</span>
                        </div>
                        <p className="text-sm text-orange-700">
                          Spear phishing, supply chain compromise, and zero-day exploits identified in attack pattern.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Database className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="font-medium text-blue-800">Attribution</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          High confidence attribution to state-sponsored group based on TTPs and infrastructure
                          analysis.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Risk Score</span>
                        <span className="text-2xl font-bold text-red-600">{riskScore}/100</span>
                      </div>
                      <Progress value={riskScore} className="w-full" />

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-red-600">High</div>
                          <div className="text-xs text-slate-600">Likelihood</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-red-600">Critical</div>
                          <div className="text-xs text-slate-600">Impact</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-orange-600">72h</div>
                          <div className="text-xs text-slate-600">Time to Act</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Radar className="w-5 h-5 mr-2" />
                      AI Threat Analysis
                    </CardTitle>
                    <CardDescription>Advanced pattern recognition and predictive modeling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button onClick={performThreatAnalysis} disabled={isAnalyzing} className="w-full">
                        {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
                      </Button>

                      {isAnalyzing && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            <span className="text-sm">Processing intelligence data...</span>
                          </div>
                          <Progress value={analysisProgress} className="w-full" />
                        </div>
                      )}

                      {analysisProgress === 100 && (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-medium text-green-800 mb-2">Pattern Analysis Complete</h3>
                            <p className="text-sm text-green-700">
                              Identified 15 similar attack patterns with 89% correlation to known APT29 campaigns.
                            </p>
                          </div>

                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">Predictive Modeling</h3>
                            <p className="text-sm text-blue-700">
                              Model predicts 73% probability of escalation within next 48 hours based on historical
                              data.
                            </p>
                          </div>

                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h3 className="font-medium text-purple-800 mb-2">Recommended Actions</h3>
                            <ul className="text-sm text-purple-700 space-y-1">
                              <li>• Increase monitoring of critical infrastructure networks</li>
                              <li>• Deploy additional threat hunting resources</li>
                              <li>• Coordinate with international partners</li>
                              <li>• Prepare incident response protocols</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="geospatial">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Map className="w-5 h-5 mr-2" />
                      Geospatial Intelligence
                    </CardTitle>
                    <CardDescription>Geographic threat mapping and analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Map className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600">Interactive threat map</p>
                        <p className="text-sm text-slate-500">Real-time geospatial intelligence visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Intelligence Reports
                    </CardTitle>
                    <CardDescription>Classified intelligence assessments and briefings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{mockReport.title}</h3>
                          <Badge variant="destructive">{mockReport.classification}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{mockReport.summary}</p>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Key Findings:</h4>
                          {mockReport.keyFindings.map((finding, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-slate-700">{finding}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600">Risk Level:</span>
                            <Progress value={mockReport.riskLevel} className="w-20" />
                            <span className="text-sm font-medium">{mockReport.riskLevel}%</span>
                          </div>
                          <Button size="sm" variant="outline">
                            View Full Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Copilot */}
          <div className="lg:col-span-1">
            <CopilotChat role="analyst" />
          </div>
        </div>
      </div>
    </div>
  )
}
