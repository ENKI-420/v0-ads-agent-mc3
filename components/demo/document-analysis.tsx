"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Brain, CheckCircle, AlertCircle, Clock } from "lucide-react"

export function DocumentAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const analysisResults = [
    {
      type: "Key Findings",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      content: "Document contains 3 critical compliance requirements and 2 risk factors",
    },
    {
      type: "Risk Assessment",
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      content: "Medium risk level detected - requires legal review before approval",
    },
    {
      type: "Processing Time",
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      content: "Analysis completed in 2.3 seconds with 97.8% confidence",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Drop your document here or click to browse</p>
            <Button variant="outline">Choose File</Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">sample_contract.pdf</span>
              </div>
              <Badge variant="secondary">Ready</Badge>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm">AI Analysis in Progress...</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{progress}% complete</p>
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? "Analyzing..." : "Start AI Analysis"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Analysis Results
            </CardTitle>
            {analysisComplete && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Complete
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!analysisComplete ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Upload and analyze a document to see AI-powered insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysisResults.map((result, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-start gap-3">
                    {result.icon}
                    <div>
                      <h4 className="font-medium text-sm mb-1">{result.type}</h4>
                      <p className="text-sm text-muted-foreground">{result.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <h4 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300">AI Recommendations</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Schedule legal review within 48 hours</li>
                  <li>• Update compliance section 3.2</li>
                  <li>• Add risk mitigation clause</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
