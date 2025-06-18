"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Briefcase,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  Menu,
  Bell,
  ChevronRight,
  Activity,
  DollarSign,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface KPI {
  name: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  status: "good" | "warning" | "critical"
}

interface Task {
  id: string
  title: string
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  assignee: string
  status: "pending" | "in-progress" | "review" | "completed"
  project: string
}

const mockKPIs: KPI[] = [
  {
    name: "Revenue",
    value: "$2.4M",
    change: "+12.5%",
    trend: "up",
    status: "good",
  },
  {
    name: "Active Users",
    value: "45.2K",
    change: "+8.3%",
    trend: "up",
    status: "good",
  },
  {
    name: "Conversion Rate",
    value: "3.2%",
    change: "-0.5%",
    trend: "down",
    status: "warning",
  },
  {
    name: "Customer Satisfaction",
    value: "4.7/5",
    change: "+0.2",
    trend: "up",
    status: "good",
  },
]

const mockTasks: Task[] = [
  {
    id: "T001",
    title: "Q2 Financial Review",
    priority: "urgent",
    dueDate: "Today",
    assignee: "Finance Team",
    status: "in-progress",
    project: "Financial Planning",
  },
  {
    id: "T002",
    title: "Product Launch Strategy",
    priority: "high",
    dueDate: "Jun 25",
    assignee: "Marketing Team",
    status: "review",
    project: "Product Launch",
  },
  {
    id: "T003",
    title: "Security Audit Report",
    priority: "medium",
    dueDate: "Jun 30",
    assignee: "IT Security",
    status: "pending",
    project: "Compliance",
  },
]

export function MobileEnterpriseInterface() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [performanceScore] = useState(87)
  const isMobile = useMobile()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "review":
        return "destructive"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗️"
      case "down":
        return "↘️"
      case "stable":
        return "→"
      default:
        return "→"
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
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-semibold">Enterprise Hub</h1>
              <p className="text-xs text-blue-100">Performance: {performanceScore}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
              <Bell className="w-4 h-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Team Management
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Performance Score */}
      <div className="p-4 bg-white border-b">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-blue-600 mb-1">{performanceScore}%</div>
          <p className="text-sm text-gray-600">Overall Performance</p>
        </div>
        <Progress value={performanceScore} className="w-full h-3" />
        <p className="text-xs text-center text-gray-500 mt-2">Excellent - Above target performance</p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 space-y-4">
          {/* Key Performance Indicators */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {mockKPIs.map((kpi, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{kpi.name}</span>
                      <span className="text-xs">{getTrendIcon(kpi.trend)}</span>
                    </div>
                    <div className="text-lg font-bold">{kpi.value}</div>
                    <div
                      className={`text-xs ${
                        kpi.trend === "up" ? "text-green-600" : kpi.trend === "down" ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {kpi.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Priority Tasks
                </span>
                <Badge variant="destructive" className="text-xs">
                  2 urgent
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border rounded-lg cursor-pointer active:bg-gray-50"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <Badge variant={getStatusBadge(task.status) as any} className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
                      <p className="text-xs text-gray-600">{task.project}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{task.assignee}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  JS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">John Smith</p>
                  <p className="text-xs text-gray-600">Completed Q2 Financial Review</p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  MD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maria Davis</p>
                  <p className="text-xs text-gray-600">Updated product launch timeline</p>
                </div>
                <span className="text-xs text-gray-500">4h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  RJ
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Robert Johnson</p>
                  <p className="text-xs text-gray-600">Submitted security audit findings</p>
                </div>
                <span className="text-xs text-gray-500">6h ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">$2.4M</div>
                  <div className="text-xs text-gray-600">Monthly Revenue</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">156</div>
                  <div className="text-xs text-gray-600">Team Members</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Target className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">23</div>
                  <div className="text-xs text-gray-600">Active Projects</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">94%</div>
                  <div className="text-xs text-gray-600">Goal Achievement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <SheetContent side="bottom" className="h-[70vh]">
            <div className="py-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold leading-tight mb-2">{selectedTask.title}</h2>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={getStatusBadge(selectedTask.status) as any}>{selectedTask.status}</Badge>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTask.priority)}`} />
                    <span className="text-sm text-gray-600 capitalize">{selectedTask.priority} priority</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedTask.project}</p>
                </div>
              </div>

              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Task Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Assignee:</span>
                          <p className="font-medium">{selectedTask.assignee}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <p className="font-medium">{selectedTask.dueDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Priority:</span>
                          <p className="font-medium capitalize">{selectedTask.priority}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium capitalize">{selectedTask.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Team
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Review
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        View Documents
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Assign Resources
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
            <BarChart3 className="w-4 h-4 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Target className="w-4 h-4 mb-1" />
            <span className="text-xs">Tasks</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Users className="w-4 h-4 mb-1" />
            <span className="text-xs">Team</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <MessageSquare className="w-4 h-4 mb-1" />
            <span className="text-xs">Messages</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
