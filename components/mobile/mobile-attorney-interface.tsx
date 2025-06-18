"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Scale,
  FileText,
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  Menu,
  MessageSquare,
  ChevronRight,
  Gavel,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface CaseCard {
  id: string
  title: string
  client: string
  type: string
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  status: "active" | "pending" | "review" | "closed"
  documents: number
  lastActivity: string
  nextDeadline: string
}

const mockCases: CaseCard[] = [
  {
    id: "C001",
    title: "Smith v. TechCorp Employment Dispute",
    client: "Jennifer Smith",
    type: "Employment Law",
    priority: "high",
    dueDate: "2025-07-15",
    status: "active",
    documents: 23,
    lastActivity: "2 hours ago",
    nextDeadline: "Discovery due in 3 days",
  },
  {
    id: "C002",
    title: "MedDevice Patent Infringement",
    client: "MedDevice Inc.",
    type: "IP Law",
    priority: "urgent",
    dueDate: "2025-06-30",
    status: "review",
    documents: 45,
    lastActivity: "30 min ago",
    nextDeadline: "Motion due tomorrow",
  },
  {
    id: "C003",
    title: "Johnson Contract Negotiation",
    client: "Johnson & Associates",
    type: "Contract Law",
    priority: "medium",
    dueDate: "2025-08-01",
    status: "pending",
    documents: 12,
    lastActivity: "1 day ago",
    nextDeadline: "Client meeting Friday",
  },
]

export function MobileAttorneyInterface() {
  const [selectedCase, setSelectedCase] = useState<CaseCard | null>(null)
  const [cases] = useState(mockCases)
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
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "review":
        return "destructive"
      case "closed":
        return "outline"
      default:
        return "outline"
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
      <div className="bg-purple-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-semibold">Legal Mobile</h1>
              <p className="text-xs text-purple-100">{cases.length} active cases</p>
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="ghost" className="text-white hover:bg-purple-700">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Legal Research
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Draft Document
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Court Calendar
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Client Messages
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases, clients, documents..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Case List */}
      <div className="p-4 space-y-3">
        {cases.map((caseItem) => (
          <Card
            key={caseItem.id}
            className="cursor-pointer transition-all duration-200 active:scale-95"
            onClick={() => setSelectedCase(caseItem)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(caseItem.priority)}`} />
                    <Badge variant={getStatusBadge(caseItem.status) as any} className="text-xs">
                      {caseItem.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm leading-tight mb-1">{caseItem.title}</h3>
                  <p className="text-xs text-gray-600">{caseItem.client}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{caseItem.type}</span>
                <span>{caseItem.documents} docs</span>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-2">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-700 font-medium">{caseItem.nextDeadline}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Due: {caseItem.dueDate}</span>
                <span>{caseItem.lastActivity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <Sheet open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <SheetContent side="bottom" className="h-[80vh]">
            <div className="py-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold leading-tight mb-1">{selectedCase.title}</h2>
                  <p className="text-gray-600 text-sm">{selectedCase.client}</p>
                  <p className="text-gray-500 text-xs">{selectedCase.type}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={getStatusBadge(selectedCase.status) as any}>{selectedCase.status}</Badge>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedCase.priority)}`} />
                </div>
              </div>

              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {/* Deadline Alert */}
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-800">{selectedCase.nextDeadline}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Case Overview */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Case Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <p className="font-medium">{selectedCase.dueDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Documents:</span>
                          <p className="font-medium">{selectedCase.documents}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Priority:</span>
                          <p className="font-medium capitalize">{selectedCase.priority}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Activity:</span>
                          <p className="font-medium">{selectedCase.lastActivity}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Documents */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Recent Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Motion to Dismiss.pdf</span>
                        </div>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Discovery Request.docx</span>
                        </div>
                        <span className="text-xs text-gray-500">1d ago</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Client
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Meeting
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Search className="w-4 h-4 mr-2" />
                        Research Similar Cases
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Draft Document
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
            <Gavel className="w-4 h-4 mb-1" />
            <span className="text-xs">Cases</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Search className="w-4 h-4 mb-1" />
            <span className="text-xs">Research</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Calendar className="w-4 h-4 mb-1" />
            <span className="text-xs">Calendar</span>
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
