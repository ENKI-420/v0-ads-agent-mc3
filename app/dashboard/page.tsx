"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  Target,
  FileText,
  Settings,
  MessageSquare,
  Bell,
  Search,
  Filter,
} from "lucide-react"
import { useAidenStore } from "@/store/aidenStore"
import { AidenAssistant } from "@/components/aiden-assistant/AidenAssistant"

export default function DashboardPage() {
  const { setVisible } = useAidenStore()
  const [activeTab, setActiveTab] = useState("overview")

  const handleAskAiden = (context: string) => {
    setVisible(true)
    // You could also pre-populate a message or context here
  }

  const metrics = [
    {
      title: "Strategic Objectives",
      value: "12/15",
      change: "+8%",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Operational Efficiency",
      value: "94%",
      change: "+12%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Team Performance",
      value: "87%",
      change: "+5%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Security Score",
      value: "98%",
      change: "+2%",
      icon: Shield,
      color: "text-red-600",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: "Q4 Strategic Review Completed",
      description: "All department heads have submitted their quarterly assessments",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      title: "New Threat Assessment Available",
      description: "Updated cybersecurity threat landscape analysis",
      time: "4 hours ago",
      type: "warning",
    },
    {
      id: 3,
      title: "Team Meeting Scheduled",
      description: "Executive leadership sync for next week",
      time: "6 hours ago",
      type: "info",
    },
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: "Review Budget Proposals",
      deadline: "Today, 3:00 PM",
      priority: "high",
    },
    {
      id: 2,
      title: "Strategic Planning Session",
      deadline: "Tomorrow, 10:00 AM",
      priority: "high",
    },
    {
      id: 3,
      title: "Department Performance Review",
      deadline: "Dec 15, 2024",
      priority: "medium",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your strategic overview for today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metric.change}</span> from last month
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-6 px-2 text-xs"
                onClick={() => handleAskAiden(`Tell me more about ${metric.title.toLowerCase()}`)}
              >
                Ask Aiden
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activities */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant={activity.type === "success" ? "default" : "secondary"}>{activity.type}</Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleAskAiden("What are my recent activities and what should I focus on?")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Aiden for Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your priority items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.deadline}</p>
                    </div>
                    <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{task.priority}</Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleAskAiden("Help me prioritize my upcoming tasks")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Aiden to Prioritize
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Strategic Progress Overview</CardTitle>
              <CardDescription>Track your key initiatives and objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Digital Transformation Initiative</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Operational Excellence Program</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cybersecurity Enhancement</span>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent"
                onClick={() => handleAskAiden("Analyze my strategic progress and suggest improvements")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Get Aiden's Strategic Analysis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Detailed performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Analytics charts will be displayed here</p>
                  <Button
                    variant="outline"
                    onClick={() => handleAskAiden("Show me detailed analytics and insights for my performance metrics")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask Aiden for Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Documentation</CardTitle>
              <CardDescription>Access your reports and strategic documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Reports and documents will be displayed here</p>
                  <Button
                    variant="outline"
                    onClick={() => handleAskAiden("Help me generate a strategic report for this quarter")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask Aiden to Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>Customize your dashboard preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center space-y-2">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Settings panel will be displayed here</p>
                  <Button
                    variant="outline"
                    onClick={() => handleAskAiden("Help me optimize my dashboard settings and preferences")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask Aiden for Optimization
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Aiden Assistant */}
      <AidenAssistant />
    </div>
  )
}
