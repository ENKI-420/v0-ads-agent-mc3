"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, Users, DollarSign, Target, Lightbulb, Shield, Heart, Scale, Building, ArrowUp } from "lucide-react"
import { marketResearch, type MarketSegment } from "@/lib/analytics/market-research"
import { valueProposition } from "@/lib/marketing/value-proposition"
import { adoptionStrategy } from "@/lib/marketing/adoption-strategy"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function MarketResearchDashboard() {
  const [selectedSector, setSelectedSector] = useState<string>("healthcare")
  const [marketSegments, setMarketSegments] = useState<MarketSegment[]>([])
  const [userAnalytics, setUserAnalytics] = useState<any>(null)

  useEffect(() => {
    setMarketSegments(marketResearch.getAllMarketSegments())
    setUserAnalytics(marketResearch.getUserAnalytics())
  }, [])

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case "healthcare":
        return <Heart className="w-5 h-5 text-blue-500" />
      case "legal":
        return <Scale className="w-5 h-5 text-purple-500" />
      case "defense":
        return <Shield className="w-5 h-5 text-red-500" />
      case "enterprise":
        return <Building className="w-5 h-5 text-green-500" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(0)}`
  }

  const marketSizeData = marketSegments.map((segment) => ({
    name: segment.sector,
    size: segment.marketSize,
    growth: segment.growthRate,
  }))

  const opportunityData = marketResearch.identifyGrowthOpportunities()

  const competitiveAnalysis = marketResearch.generateCompetitiveAnalysis()

  const selectedSegment = marketSegments.find((s) => s.sector === selectedSector)
  const selectedValueProp = valueProposition.getValueProposition(selectedSector)
  const selectedStrategy = adoptionStrategy.getAdoptionStrategy(selectedSector)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Market Research & Strategy Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive market analysis, competitive intelligence, and go-to-market strategies for AI-powered
            collaboration across professional verticals
          </p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Market Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${marketSegments.reduce((sum, s) => sum + s.marketSize, 0).toFixed(1)}B
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">
                  {(marketSegments.reduce((sum, s) => sum + s.growthRate, 0) / marketSegments.length).toFixed(1)}% avg
                  growth
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{userAnalytics?.activeUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">{(userAnalytics?.retentionRate * 100).toFixed(1)}% retention</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Opportunity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      marketSegments.reduce((sum, s) => {
                        const opp = marketResearch.calculateMarketOpportunity(s.sector)
                        return sum + opp.revenueProjection
                      }, 0),
                    )}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Target className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-600">5% target market share</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityData.length}</p>
                </div>
                <Lightbulb className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">
                  {opportunityData.filter((o) => o.impact === "high").length} high impact
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Analysis Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Size by Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marketSizeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}B`, "Market Size"]} />
                  <Bar dataKey="size" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Rate by Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marketSizeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Growth Rate"]} />
                  <Line type="monotone" dataKey="growth" stroke="#00C49F" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sector Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Sector Deep Dive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {marketSegments.map((segment) => (
                <Button
                  key={segment.sector}
                  variant={selectedSector === segment.sector ? "default" : "outline"}
                  onClick={() => setSelectedSector(segment.sector)}
                  className="flex items-center space-x-2 h-auto p-4"
                >
                  {getSectorIcon(segment.sector)}
                  <div className="text-left">
                    <div className="font-medium capitalize">{segment.sector}</div>
                    <div className="text-xs text-gray-500">${segment.marketSize}B market</div>
                  </div>
                </Button>
              ))}
            </div>

            {selectedSegment && (
              <Tabs defaultValue="market" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="market">Market Analysis</TabsTrigger>
                  <TabsTrigger value="value">Value Proposition</TabsTrigger>
                  <TabsTrigger value="strategy">Go-to-Market</TabsTrigger>
                  <TabsTrigger value="competitive">Competitive</TabsTrigger>
                </TabsList>

                <TabsContent value="market" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Market Size</span>
                          <span className="text-lg font-bold">${selectedSegment.marketSize}B</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Growth Rate</span>
                          <span className="text-lg font-bold text-green-600">{selectedSegment.growthRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Budget Range</span>
                          <span className="text-sm">
                            {formatCurrency(selectedSegment.budgetRange.min)} -{" "}
                            {formatCurrency(selectedSegment.budgetRange.max)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Pain Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedSegment.painPoints.slice(0, 5).map((pain, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              <span className="text-sm">{pain}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Market Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedSegment.opportunities.slice(0, 5).map((opportunity, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm">{opportunity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Decision Makers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedSegment.decisionMakers.map((maker, index) => (
                            <Badge key={index} variant="outline" className="mr-2 mb-2">
                              {maker}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="value" className="space-y-6">
                  {selectedValueProp && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Value Proposition</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <h3 className="text-xl font-bold mb-2">{selectedValueProp.headline}</h3>
                          <p className="text-gray-600 mb-4">{selectedValueProp.subheadline}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Key Benefits</h4>
                              <ul className="space-y-1">
                                {selectedValueProp.keyBenefits.map((benefit, index) => (
                                  <li key={index} className="text-sm flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Unique Selling Points</h4>
                              <ul className="space-y-1">
                                {selectedValueProp.uniqueSellingPoints.map((usp, index) => (
                                  <li key={index} className="text-sm flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                    <span>{usp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{selectedValueProp.roi.timeToValue}</div>
                            <div className="text-sm text-gray-600">Time to Value</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{selectedValueProp.roi.costSavings}</div>
                            <div className="text-sm text-gray-600">Cost Savings</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedValueProp.roi.productivityGains}
                            </div>
                            <div className="text-sm text-gray-600">Productivity Gains</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{selectedValueProp.roi.riskReduction}</div>
                            <div className="text-sm text-gray-600">Risk Reduction</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="strategy" className="space-y-6">
                  {selectedStrategy && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Go-to-Market Strategy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">Target Audience</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Primary:</span>
                                  <div className="text-sm text-gray-600">
                                    {selectedStrategy.targetAudience.primary.join(", ")}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Secondary:</span>
                                  <div className="text-sm text-gray-600">
                                    {selectedStrategy.targetAudience.secondary.join(", ")}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Marketing Channels</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Digital:</span>
                                  <div className="text-sm text-gray-600">
                                    {selectedStrategy.channels.digital.slice(0, 3).join(", ")}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Events:</span>
                                  <div className="text-sm text-gray-600">
                                    {selectedStrategy.channels.events.slice(0, 2).join(", ")}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Budget Allocation</h4>
                              <div className="space-y-2">
                                {Object.entries(selectedStrategy.budget.allocation).map(([key, value]) => (
                                  <div key={key} className="flex justify-between items-center">
                                    <span className="text-sm capitalize">{key.replace("-", " ")}</span>
                                    <span className="text-sm font-medium">{value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Implementation Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedStrategy.timeline.map((phase, index) => (
                              <div key={index} className="border-l-4 border-blue-500 pl-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{phase.phase}</h4>
                                  <Badge variant="outline">{phase.duration}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Objectives:</span>
                                    <ul className="mt-1 space-y-1">
                                      {phase.objectives.map((obj, objIndex) => (
                                        <li key={objIndex} className="text-gray-600">
                                          • {obj}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <span className="font-medium">Key Metrics:</span>
                                    <ul className="mt-1 space-y-1">
                                      {phase.metrics.map((metric, metricIndex) => (
                                        <li key={metricIndex} className="text-gray-600">
                                          • {metric}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="competitive" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Competitive Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {competitiveAnalysis.strengths.map((strength, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Areas for Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {competitiveAnalysis.weaknesses.map((weakness, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              <span className="text-sm">{weakness}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Market Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {competitiveAnalysis.opportunities.map((opportunity, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span className="text-sm">{opportunity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Competitive Threats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {competitiveAnalysis.threats.map((threat, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <span className="text-sm">{threat}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Differentiators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {competitiveAnalysis.differentiators.map((diff, index) => (
                          <div key={index} className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Target className="w-5 h-5 text-blue-500" />
                              <span className="font-medium text-blue-900">{diff}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Growth Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunityData
                .sort((a, b) => b.priority - a.priority)
                .map((opportunity, index) => (
                  <Card key={index} className="border-l-4 border-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                          {opportunity.sector}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Badge variant={opportunity.impact === "high" ? "default" : "secondary"} className="text-xs">
                            {opportunity.impact} impact
                          </Badge>
                          <Badge variant={opportunity.effort === "low" ? "default" : "secondary"} className="text-xs">
                            {opportunity.effort} effort
                          </Badge>
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{opportunity.opportunity}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Priority Score</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={opportunity.priority * 10} className="w-16 h-2" />
                          <span className="text-sm font-medium">{opportunity.priority}/10</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* User Analytics */}
        {userAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle>Current User Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{userAnalytics.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                  <div className="text-xs text-green-600 mt-1">
                    {((userAnalytics.activeUsers / userAnalytics.totalUsers) * 100).toFixed(1)}% active
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {(userAnalytics.retentionRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {userAnalytics.engagementMetrics.averageSessionDuration.toFixed(1)} min avg session
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {(userAnalytics.conversionFunnels.trialToSubscription * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Trial Conversion</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {(userAnalytics.churnAnalysis.churnRate * 100).toFixed(1)}% monthly churn
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {userAnalytics.engagementMetrics.userSatisfaction.toFixed(1)}/5
                  </div>
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                  <div className="text-xs text-green-600 mt-1">
                    {Object.values(userAnalytics.engagementMetrics.featuresUsed).reduce((a, b) => a + b, 0) /
                      Object.keys(userAnalytics.engagementMetrics.featuresUsed).length}
                    % avg feature usage
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-4">Feature Usage Analytics</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={Object.entries(userAnalytics.engagementMetrics.featuresUsed).map(([feature, usage]) => ({
                      feature: feature.replace("-", " "),
                      usage,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Usage Rate"]} />
                    <Bar dataKey="usage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
