"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Shield,
  AlertTriangle,
  Target,
  Radar,
  Map,
  Activity,
  Menu,
  Search,
  ChevronRight,
  TrendingUp,
  Globe,
  Lock,
  Zap,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface ThreatCard {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  category: string
  region: string
  confidence: number
  status: "active" | "monitoring" | "resolved"
  lastUpdate: string
  description: string
  impact: string
}

const mockThreats: ThreatCard[] = [
  {
    id: "T001",
    title: "APT29 Infrastructure Activity",
    severity: "critical",
    category: "Cyber Warfare",
    region: "Eastern Europe",
    confidence: 95,
    status: "active",
    lastUpdate: "15 min ago",
    description: "Advanced persistent threat targeting critical infrastructure",
    impact: "High - Critical systems at risk",
  },
  {
    id: "T002",
    title: "Supply Chain Vulnerability",
    severity: "high",
    category: "Economic Security",
    region: "Southeast Asia",
    confidence: 78,
    status: "monitoring",
    lastUpdate: "2 hours ago",
    description: "Potential compromise in semiconductor supply chain",
    impact: "Medium - Economic disruption possible",
  },
  {
    id: "T003",
    title: "Disinformation Campaign",
    severity: "medium",
    category: "Information Warfare",
    region: "Global",
    confidence: 82,
    status: "monitoring",
    lastUpdate: "6 hours ago",
    description: "Coordinated social media manipulation detected",
    impact: "Low - Public opinion influence",
  },
]

export function MobileAnalystInterface() {
  const [selectedThreat, setSelectedThreat] = useState<ThreatCard | null>(null)
  const [threats] = useState(mockThreats)
  const [riskLevel] = useState(75)
  const isMobile = useMobile()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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
      <div className="bg-red-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-semibold">Intel Mobile</h1>
              <p className="text-xs text-red-100">Risk Level: {riskLevel}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-red-100 border-red-300">
              <Lock className="w-3 h-3 mr-1" />
              CONFIDENTIAL
            </Badge>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:bg-red-700">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Radar className="w-4 h-4 mr-2" />
                      Threat Scan
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Map className="w-4 h-4 mr-2" />
                      Geospatial View
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Search className="w-4 h-4 mr-2" />
                      Intelligence Search
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Risk Assessment
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Risk Dashboard */}
      <div className="p-4 bg-white border-b">
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-red-600 mb-1">{riskLevel}%</div>
          <p className="text-sm text-gray-600">Current Threat Level</p>
        </div>
        <Progress value={riskLevel} className="w-full h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Critical</span>
        </div>
      </div>

      {/* Active Threats Counter */}
      <div className="p-4 bg-white border-b">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-600">2</div>
            <div className="text-xs text-gray-600">Critical</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">3</div>
            <div className="text-xs text-gray-600">High</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">5</div>
            <div className="text-xs text-gray-600">Medium</div>
          </div>
        </div>
      </div>

      {/* Threat List */}
      <div className="p-4 space-y-3">
        {threats.map((threat) => (
          <Card
            key={threat.id}
            className="cursor-pointer transition-all duration-200 active:scale-95"
            onClick={() => setSelectedThreat(threat)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.severity)}`} />
                    <Badge variant={getSeverityBadge(threat.severity) as any} className="text-xs">
                      {threat.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {threat.confidence}%
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm leading-tight mb-1">{threat.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{threat.description}</p>
                  <p className="text-xs text-gray-500">
                    {threat.region} • {threat.category}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600">{threat.status}</span>
                </div>
                <span className="text-gray-500">{threat.lastUpdate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Threat Detail Modal */}
      {selectedThreat && (
        <Sheet open={!!selectedThreat} onOpenChange={() => setSelectedThreat(null)}>
          <SheetContent side="bottom" className="h-[80vh]">
            <div className="py-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold leading-tight mb-2">{selectedThreat.title}</h2>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={getSeverityBadge(selectedThreat.severity) as any}>
                      {selectedThreat.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{selectedThreat.confidence}% confidence</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{selectedThreat.description}</p>
                </div>
              </div>

              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {/* Threat Overview */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Threat Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{selectedThreat.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Region:</span>
                          <p className="font-medium">{selectedThreat.region}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium capitalize">{selectedThreat.status}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Update:</span>
                          <p className="font-medium">{selectedThreat.lastUpdate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Impact Assessment */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Target className="w-4 h-4 mr-2 text-red-500" />
                        Impact Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedThreat.impact}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Risk Level</span>
                          <span>{selectedThreat.confidence}%</span>
                        </div>
                        <Progress value={selectedThreat.confidence} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-orange-500" />
                        Recommended Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">Immediate: Increase monitoring of critical systems</p>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">Short-term: Deploy additional security measures</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">Long-term: Review and update security protocols</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Escalate Threat
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Search className="w-4 h-4 mr-2" />
                        Research Similar Threats
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Globe className="w-4 h-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Shield className="w-4 h-4 mb-1" />
            <span className="text-xs">Threats</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Map className="w-4 h-4 mb-1" />
            <span className="text-xs">Map</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <TrendingUp className="w-4 h-4 mb-1" />
            <span className="text-xs">Analytics</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Search className="w-4 h-4 mb-1" />
            <span className="text-xs">Intel</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
