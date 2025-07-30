"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Lightbulb } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DocumentAnalysis() {
  const [documentContent, setDocumentContent] = useState("")
  const [analysisResult, setAnalysisResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAnalyzeDocument = async () => {
    if (documentContent.trim() === "") {
      setAnalysisResult("Please enter some text to analyze.")
      return
    }

    setLoading(true)
    setAnalysisResult("Analyzing document...")

    try {
      // Simulate API call to an AI document analysis service
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay

      const mockAnalysis = `
        **Summary:** This document discusses the importance of AI in modern business operations, highlighting its potential to streamline workflows and enhance decision-making.

        **Key Entities:** AI, business operations, workflows, decision-making.

        **Sentiment:** Positive, emphasizing growth and efficiency.

        **Actionable Insights:**
        1. Consider implementing AI-driven automation in customer support.
        2. Explore data analytics tools to leverage insights from operational data.
        3. Invest in employee training for AI adoption.
      `
      setAnalysisResult(mockAnalysis)
    } catch (error) {
      console.error("Error during document analysis:", error)
      setAnalysisResult("Failed to analyze document. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Intelligent Document Analysis</CardTitle>
        <CardDescription>
          Upload or paste text to get AI-powered summaries, key insights, and sentiment analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <label htmlFor="document-upload" className="sr-only">
            Upload Document
          </label>
          <Button variant="outline" className="w-full bg-transparent">
            <Upload className="mr-2 h-4 w-4" /> Upload Document (Coming Soon)
          </Button>
          <div className="relative">
            <Textarea
              id="document-content"
              placeholder="Or paste your document content here..."
              rows={8}
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              className="pr-10"
              disabled={loading}
            />
            <FileText className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <Button onClick={handleAnalyzeDocument} disabled={loading}>
          <Lightbulb className="mr-2 h-4 w-4" />
          {loading ? "Analyzing..." : "Analyze Document"}
        </Button>
        {analysisResult && (
          <Card className="bg-muted/20">
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] whitespace-pre-wrap">
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, "<br/>") }} />
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
