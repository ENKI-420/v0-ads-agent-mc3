"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Edit, CheckCircle } from "lucide-react"

interface Activity {
  id: number
  message: string
  timestamp: string
}

export function RealTimeCollaboration() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [commentInput, setCommentInput] = useState("")
  const [documentEditInput, setDocumentEditInput] = useState("")
  const [taskAssignInput, setTaskAssignInput] = useState("")

  const addActivity = (message: string) => {
    setActivities((prev) => [...prev, { id: prev.length + 1, message, timestamp: new Date().toLocaleTimeString() }])
  }

  const simulateCollaboration = async (action: string, data: any) => {
    try {
      const response = await fetch("/api/demo/collaboration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, data }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      addActivity(result.message)
    } catch (error) {
      console.error("Error simulating collaboration:", error)
      addActivity(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleAddComment = () => {
    if (commentInput.trim() === "") return
    simulateCollaboration("comment_add", { userId: "User A", comment: commentInput })
    setCommentInput("")
  }

  const handleDocumentEdit = () => {
    if (documentEditInput.trim() === "") return
    simulateCollaboration("document_edit", {
      userId: "User B",
      documentId: "ProjectPlan.docx",
      lineNumber: Math.floor(Math.random() * 100) + 1,
      change: documentEditInput,
    })
    setDocumentEditInput("")
  }

  const handleTaskAssign = () => {
    if (taskAssignInput.trim() === "") return
    simulateCollaboration("task_assign", {
      userId: "User C",
      taskId: "Task-" + Math.floor(Math.random() * 1000),
      assigneeId: taskAssignInput,
    })
    setTaskAssignInput("")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Real-time Collaboration Feed</CardTitle>
        <CardDescription>Simulate various collaboration activities and see them update instantly.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" /> Add Comment
            </h3>
            <Input
              placeholder="Type a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} className="w-full">
              Add Comment
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Edit className="h-5 w-5 text-muted-foreground" /> Simulate Document Edit
            </h3>
            <Input
              placeholder="Enter document change..."
              value={documentEditInput}
              onChange={(e) => setDocumentEditInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleDocumentEdit()}
            />
            <Button onClick={handleDocumentEdit} className="w-full">
              Simulate Edit
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-muted-foreground" /> Assign Task
            </h3>
            <Input
              placeholder="Assignee Name (e.g., 'Alice')"
              value={taskAssignInput}
              onChange={(e) => setTaskAssignInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleTaskAssign()}
            />
            <Button onClick={handleTaskAssign} className="w-full">
              Assign Task
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-4">Activity Feed</h3>
          <ScrollArea className="h-[300px] border rounded-md p-4 bg-muted/20">
            <div className="space-y-3">
              {activities.length === 0 && (
                <p className="text-muted-foreground text-center">No activity yet. Try simulating some actions!</p>
              )}
              {activities.map((activity) => (
                <div key={activity.id} className="text-sm">
                  <span className="font-medium text-muted-foreground mr-2">[{activity.timestamp}]</span>
                  {activity.message}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
