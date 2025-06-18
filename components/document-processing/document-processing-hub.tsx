"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SecureUpload } from "./secure-upload"
import { DocumentSearch } from "./document-search"
import { AIInsightsPanel } from "./ai-insights-panel"
import { Upload, Search, Brain, FileText, Shield } from "lucide-react"

interface DocumentProcessingHubProps {
  role: string
  compliance: string[]
  userId: string
}

export function DocumentProcessingHub({ role, compliance, userId }: DocumentProcessingHubProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [documentInsights, setDocumentInsights] = useState<any>(null)

  const handleUploadComplete = (documentId: string) => {
    // Switch to insights tab and load document
    setSelectedDocument(documentId)
    setActiveTab("insights")
    // In a real app, fetch insights from API
    setTimeout(() => {
      setDocumentInsights({
        summary: "AI-generated summary of the uploaded document with key findings and recommendations.",
        keyTopics: ["Contract Terms", "Risk Assessment", "Compliance Requirements"],
        entities: [
          { text: "John Smith", type: "person", confidence: 0.95 },
          { text: "Acme Corporation", type: "organization", confidence: 0.88 },
        ],
        sentiment: { score: 0.2, label: "neutral" },
        riskFactors: [
          {
            type: "Legal Risk",
            description: "Contract contains non-standard liability clauses",
            severity: "medium",
            confidence: 0.82,
          },
        ],
        complianceFlags: compliance.map((standard) => ({
          standard,
          issue: `Document reviewed for ${standard} compliance`,
          recommendation: `All ${standard} requirements appear to be met`,
        })),
        readabilityScore: 7.5,
        wordCount: 2847,
        pageCount: 12,
      })
    }, 3000)
  }

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId)
    setActiveTab("insights")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Document Processing Hub
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {role}
              </Badge>
              {compliance.map((comp) => (
                <Badge key={comp} variant="secondary">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Securely upload, process, and analyze documents with AI-powered insights. All processing is compliant with{" "}
            {compliance.join(", ")} standards and role-based access controls.
          </p>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <SecureUpload role={role} compliance={compliance} onUploadComplete={handleUploadComplete} />
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <DocumentSearch role={role} compliance={compliance} onDocumentSelect={handleDocumentSelect} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsightsPanel
            documentId={selectedDocument || ""}
            insights={documentInsights}
            isLoading={selectedDocument && !documentInsights}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
