"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Scale,
  FileText,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gavel,
  Shield,
  BookOpen,
  Calendar,
} from "lucide-react"
import { CopilotChat } from "@/components/copilot-chat"
import { DocumentAnalysis } from "@/components/demo/document-analysis"

interface CaseData {
  id: string
  title: string
  client: string
  type: string
  status: "active" | "pending" | "closed"
  priority: "low" | "medium" | "high"
  dueDate: string
  documents: number
  lastActivity: string
}

interface LegalResearch {
  query: string
  results: {
    case: string
    citation: string
    relevance: number
    summary: string
    jurisdiction: string
  }[]
}

const mockCases: CaseData[] = [
  {
    id: "C001",
    title: "Smith v. TechCorp Employment Dispute",
    client: "Jennifer Smith",
    type: "Employment Law",
    status: "active",
    priority: "high",
    dueDate: "2025-07-15",
    documents: 23,
    lastActivity: "2 hours ago",
  },
  {
    id: "C002",
    title: "MedDevice Inc. Patent Infringement",
    client: "MedDevice Inc.",
    type: "Intellectual Property",
    status: "pending",
    priority: "medium",
    dueDate: "2025-08-01",
    documents: 45,
    lastActivity: "1 day ago",
  },
]

const mockResearch: LegalResearch = {
  query: "employment discrimination wrongful termination",
  results: [
    {
      case: "McDonnell Douglas Corp. v. Green",
      citation: "411 U.S. 792 (1973)",
      relevance: 95,
      summary: "Established the burden-shifting framework for employment discrimination claims under Title VII.",
      jurisdiction: "Federal",
    },
    {
      case: "Texas Dept. of Community Affairs v. Burdine",
      citation: "450 U.S. 248 (1981)",
      relevance: 88,
      summary:
        "Clarified employer's burden of production in discrimination cases and employee's ultimate burden of proof.",
      jurisdiction: "Federal",
    },
    {
      case: "Reeves v. Sanderson Plumbing Products",
      citation: "530 U.S. 133 (2000)",
      relevance: 82,
      summary: "Addressed sufficiency of circumstantial evidence in age discrimination cases.",
      jurisdiction: "Federal",
    },
  ],
}

export default function AttorneyDemo() {
  const [selectedCase, setSelectedCase] = useState<CaseData>(mockCases[0])
  const [researchResults, setResearchResults] = useState<LegalResearch>(mockResearch)
  const [isResearching, setIsResearching] = useState(false)
  const [complianceScore, setComplianceScore] = useState(92)

  const performLegalResearch = async (query: string) => {
    setIsResearching(true)

    // Simulate AI legal research
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setResearchResults({
      query,
      results: mockResearch.results,
    })
    setIsResearching(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Legal AI Assistant Demo</h1>
              <p className="text-slate-600">AI-powered legal research and document analysis</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Shield className="w-3 h-3 mr-1" />
              Attorney-Client Privilege Protected
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Search className="w-3 h-3 mr-1" />
              AI Legal Research
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              {complianceScore}% Compliance Score
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Case List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Cases</CardTitle>
                <CardDescription>Select a case for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCase.id === caseItem.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          caseItem.priority === "high"
                            ? "destructive"
                            : caseItem.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {caseItem.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {caseItem.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{caseItem.title}</h3>
                    <p className="text-xs text-slate-600 mb-2">{caseItem.client}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{caseItem.documents} docs</span>
                      <span>{caseItem.lastActivity}</span>
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
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Case Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedCase.title}</CardTitle>
                        <CardDescription>
                          Client: {selectedCase.client} • {selectedCase.type}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          selectedCase.status === "active"
                            ? "default"
                            : selectedCase.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {selectedCase.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">{selectedCase.dueDate}</div>
                        <div className="text-xs text-slate-600">Due Date</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">{selectedCase.documents}</div>
                        <div className="text-xs text-slate-600">Documents</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Clock className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">24.5</div>
                        <div className="text-xs text-slate-600">Hours Logged</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Gavel className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold">3</div>
                        <div className="text-xs text-slate-600">Motions Filed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Case Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-purple-500" />
                      AI Case Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-medium text-green-800">Strong Case Merits</span>
                        </div>
                        <p className="text-sm text-green-700">
                          AI analysis indicates 78% likelihood of favorable outcome based on similar cases and evidence
                          strength.
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="font-medium text-yellow-800">Discovery Gaps</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Missing key documentation: employee handbook, performance reviews from 2023-2024.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="font-medium text-blue-800">Relevant Precedents</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Found 12 similar cases in jurisdiction with 67% plaintiff success rate.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="research" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      AI Legal Research
                    </CardTitle>
                    <CardDescription>Intelligent case law and statute research</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter legal research query..."
                          className="flex-1 px-3 py-2 border rounded-md"
                          defaultValue={researchResults.query}
                        />
                        <Button
                          onClick={() => performLegalResearch("employment discrimination wrongful termination")}
                          disabled={isResearching}
                        >
                          {isResearching ? "Researching..." : "Research"}
                        </Button>
                      </div>

                      {isResearching ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                            <span className="text-sm">Searching legal databases...</span>
                          </div>
                          <Progress value={65} className="w-full" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {researchResults.results.map((result, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{result.case}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{result.jurisdiction}</Badge>
                                  <Badge variant="secondary">{result.relevance}% relevant</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{result.citation}</p>
                              <p className="text-sm">{result.summary}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <DocumentAnalysis />
              </TabsContent>

              <TabsContent value="compliance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Compliance Monitoring
                    </CardTitle>
                    <CardDescription>Automated compliance checking and risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{complianceScore}%</div>
                        <p className="text-slate-600">Overall Compliance Score</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">Attorney-Client Privilege</span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Compliant
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">Document Retention</span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Compliant
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="text-sm">Conflict of Interest Check</span>
                          </div>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                            Review Required
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">Billing Compliance</span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Compliant
                          </Badge>
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
            <CopilotChat role="attorney" />
          </div>
        </div>
      </div>
    </div>
  )
}
