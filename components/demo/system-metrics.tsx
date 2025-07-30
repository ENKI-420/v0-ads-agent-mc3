"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Cpu, MemoryStickIcon as Memory, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Metrics {
  cpuUsage: number
  memoryUsage: number
  networkLatency: number
  activeUsers: number
  timestamp: string
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/demo/metrics")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Metrics = await response.json()
      setMetrics(data)
    } catch (err) {
      console.error("Failed to fetch metrics:", err)
      setError("Failed to load metrics. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Real-time System Metrics</CardTitle>
        <CardDescription>Monitor the performance and health of your AGENT-M3c instance.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {error && <div className="col-span-2 text-center text-destructive">{error}</div>}
        {loading && !metrics ? (
          <div className="col-span-2 text-center text-muted-foreground">Loading metrics...</div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Cpu className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>CPU Usage</span>
                  <span>{metrics?.cpuUsage.toFixed(1) || 0}%</span>
                </div>
                <Progress value={metrics?.cpuUsage || 0} className="mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Memory className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Memory Usage</span>
                  <span>{metrics?.memoryUsage.toFixed(1) || 0}%</span>
                </div>
                <Progress value={metrics?.memoryUsage || 0} className="mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Network Latency</span>
                  <span>{metrics?.networkLatency.toFixed(0) || 0}ms</span>
                </div>
                <Progress value={metrics ? Math.min(100, metrics.networkLatency / 2) : 0} className="mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Active Users</span>
                  <span>{metrics?.activeUsers || 0}</span>
                </div>
                <Progress value={metrics ? Math.min(100, metrics.activeUsers / 5) : 0} className="mt-1" />
              </div>
            </div>
          </>
        )}
        <div className="col-span-2 text-center text-sm text-muted-foreground">
          Last updated: {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleTimeString() : "N/A"}
        </div>
        <div className="col-span-2 flex justify-center">
          <Button onClick={fetchMetrics} disabled={loading} variant="outline">
            <RefreshCw className={loading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
            {loading ? "Refreshing..." : "Refresh Metrics"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
