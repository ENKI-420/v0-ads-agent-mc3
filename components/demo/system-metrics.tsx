"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, HardDrive, Network, Brain, Users, MessageSquare, Clock } from "lucide-react"

interface SystemMetrics {
  timestamp: string
  system: {
    cpu: number
    memory: number
    network: number
    storage: number
  }
  ai: {
    activeAgents: number
    requestsPerMinute: number
    averageResponseTime: number
    accuracy: number
  }
  collaboration: {
    activeUsers: number
    activeRooms: number
    messagesPerMinute: number
    uptime: number
  }
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/demo/metrics")
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 2000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !metrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading system metrics...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* System Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <Progress value={metrics.system.cpu} className="h-2" />
              <p className="text-xs text-muted-foreground">{metrics.system.cpu}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <Progress value={metrics.system.memory} className="h-2" />
              <p className="text-xs text-muted-foreground">{metrics.system.memory}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Network</span>
              </div>
              <Progress value={metrics.system.network} className="h-2" />
              <p className="text-xs text-muted-foreground">{metrics.system.network}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <Progress value={metrics.system.storage} className="h-2" />
              <p className="text-xs text-muted-foreground">{metrics.system.storage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{metrics.ai.activeAgents}</div>
              <p className="text-sm text-muted-foreground">Active AI Agents</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{metrics.ai.requestsPerMinute}</div>
              <p className="text-sm text-muted-foreground">Requests/Min</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{metrics.ai.averageResponseTime}ms</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{metrics.ai.accuracy.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">AI Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Collaboration Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-xl font-bold">{metrics.collaboration.activeUsers}</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <MessageSquare className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-xl font-bold">{metrics.collaboration.activeRooms}</div>
                <p className="text-sm text-muted-foreground">Active Rooms</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-xl font-bold">{metrics.collaboration.messagesPerMinute}</div>
                <p className="text-sm text-muted-foreground">Messages/Min</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-xl font-bold">{metrics.collaboration.uptime}%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              All Systems Operational
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              AI Agents: Online
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              Real-time Sync: Active
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
              Security: Enabled
            </Badge>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ System performance is optimal. All AI agents are responding within SLA requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
