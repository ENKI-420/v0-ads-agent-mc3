"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  FileText,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Shield,
  Eye,
  Zap,
} from "lucide-react"
import type { DocumentInsights } from "@/lib/document-processor"

interface AIInsightsPanelProps {
  documentId: string
  insights?: DocumentInsights
  isLoading?: boolean
}

export function AIInsightsPanel({ documentId, insights, isLoading }: AIInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse text-primary" />
            AI Analysis in Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={65} className="h-2" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No AI insights available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI-Powered Document Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Document Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document Summary
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{insights.summary}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                icon={<FileText className="h-4 w-4" />}
                label="Words"
                value={insights.wordCount.toLocaleString()}
              />
              <MetricCard icon={<Eye className="h-4 w-4" />} label="Pages" value={insights.pageCount.toString()} />
              <MetricCard
                icon={<TrendingUp className="h-4 w-4" />}
                label="Readability"
                value={`${insights.readabilityScore}/10`}
              />
              <MetricCard
                icon={<Zap className="h-4 w-4" />}
                label="Sentiment"
                value={insights.sentiment.label}
                color={getSentimentColor(insights.sentiment.label)}
              />
            </div>

            {/* Key Topics */}
            <div className="space-y-3">
              <h3 className="font-semibold">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {insights.keyTopics.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="entities" className="space-y-4">
            <h3 className="font-semibold">Extracted Entities</h3>
            <div className="space-y-3">
              {insights.entities.map((entity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <EntityIcon type={entity.type} />
                    <div>
                      <p className="font-medium">{entity.text}</p>
                      <p className="text-sm text-muted-foreground capitalize">{entity.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress value={entity.confidence * 100} className="w-16 h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{Math.round(entity.confidence * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <h3 className="font-semibold">Risk Assessment</h3>
            <div className="space-y-3">
              {insights.riskFactors.map((risk, index) => (
                <Alert key={index} className={getRiskAlertClass(risk.severity)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{risk.type}</p>
                        <p className="text-sm mt-1">{risk.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskBadgeVariant(risk.severity)}>{risk.severity}</Badge>
                        <span className="text-xs text-muted-foreground">{Math.round(risk.confidence * 100)}%</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Analysis
            </h3>
            <div className="space-y-3">
              {insights.complianceFlags.map((flag, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{flag.standard}</Badge>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm font-medium mb-1">{flag.issue}</p>
                  <p className="text-sm text-muted-foreground">{flag.recommendation}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MetricCard({
  icon,
  label,
  value,
  color = "text-foreground",
}: {
  icon: React.ReactNode
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className={`font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function EntityIcon({ type }: { type: string }) {
  const icons = {
    person: <Users className="h-4 w-4 text-blue-500" />,
    organization: <FileText className="h-4 w-4 text-green-500" />,
    location: <MapPin className="h-4 w-4 text-red-500" />,
    date: <Calendar className="h-4 w-4 text-purple-500" />,
    money: <DollarSign className="h-4 w-4 text-yellow-500" />,
  }
  return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />
}

function getSentimentColor(sentiment: string): string {
  const colors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }
  return colors[sentiment as keyof typeof colors] || "text-foreground"
}

function getRiskAlertClass(severity: string): string {
  const classes = {
    low: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
    medium: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
    high: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
  }
  return classes[severity as keyof typeof classes] || ""
}

function getRiskBadgeVariant(severity: string): "default" | "secondary" | "destructive" {
  const variants = {
    low: "secondary" as const,
    medium: "default" as const,
    high: "destructive" as const,
  }
  return variants[severity as keyof typeof variants] || "default"
}
