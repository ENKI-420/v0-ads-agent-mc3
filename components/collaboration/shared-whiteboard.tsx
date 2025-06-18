"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Pencil, Square, Circle, Type, ArrowRight, StickyNote, Eraser, Undo, Redo, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import type { RealTimeCollaborationManager, WhiteboardElement, UserPresence } from "@/lib/collaboration/real-time-sync"

interface SharedWhiteboardProps {
  sessionId: string
  userId: string
  userName: string
  userRole: string
  collaborationManager: RealTimeCollaborationManager
}

type DrawingTool = "pen" | "rectangle" | "circle" | "text" | "arrow" | "sticky" | "eraser"

const COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

const USER_COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export function SharedWhiteboard({
  sessionId,
  userId,
  userName,
  userRole,
  collaborationManager,
}: SharedWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<DrawingTool>("pen")
  const [currentColor, setCurrentColor] = useState("#22c55e")
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [elements, setElements] = useState<WhiteboardElement[]>([])
  const [users, setUsers] = useState<UserPresence[]>([])
  const [currentPath, setCurrentPath] = useState<number[]>([])
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [history, setHistory] = useState<WhiteboardElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize collaboration
  useEffect(() => {
    collaborationManager.onWhiteboardUpdate = (updatedElements) => {
      setElements(updatedElements)
      redrawCanvas(updatedElements)
    }

    collaborationManager.onPresenceUpdate = (updatedUsers) => {
      setUsers(updatedUsers)
    }

    collaborationManager.onCursorUpdate = (cursorUserId, cursor) => {
      if (cursorUserId !== userId) {
        drawRemoteCursor(cursor, cursorUserId)
      }
    }

    return () => {
      collaborationManager.onWhiteboardUpdate = undefined
      collaborationManager.onPresenceUpdate = undefined
      collaborationManager.onCursorUpdate = undefined
    }
  }, [collaborationManager, userId])

  const redrawCanvas = useCallback((elementsToRender: WhiteboardElement[]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all elements
    elementsToRender.forEach((element) => {
      ctx.strokeStyle = element.color
      ctx.lineWidth = element.strokeWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      switch (element.type) {
        case "path":
          if (element.points && element.points.length > 2) {
            ctx.beginPath()
            ctx.moveTo(element.points[0], element.points[1])
            for (let i = 2; i < element.points.length; i += 2) {
              ctx.lineTo(element.points[i], element.points[i + 1])
            }
            ctx.stroke()
          }
          break

        case "rectangle":
          ctx.strokeRect(element.x, element.y, element.width || 0, element.height || 0)
          break

        case "circle":
          const radius = Math.sqrt(Math.pow(element.width || 0, 2) + Math.pow(element.height || 0, 2)) / 2
          ctx.beginPath()
          ctx.arc(element.x + (element.width || 0) / 2, element.y + (element.height || 0) / 2, radius, 0, 2 * Math.PI)
          ctx.stroke()
          break

        case "arrow":
          drawArrow(ctx, element.x, element.y, element.x + (element.width || 0), element.y + (element.height || 0))
          break

        case "text":
          ctx.fillStyle = element.color
          ctx.font = `${element.strokeWidth * 6}px Arial`
          ctx.fillText(element.text || "", element.x, element.y)
          break

        case "sticky":
          // Draw sticky note background
          ctx.fillStyle = element.color + "40" // Semi-transparent
          ctx.fillRect(element.x, element.y, element.width || 100, element.height || 100)
          ctx.strokeRect(element.x, element.y, element.width || 100, element.height || 100)

          // Draw text
          ctx.fillStyle = element.color
          ctx.font = "14px Arial"
          const lines = (element.text || "").split("\n")
          lines.forEach((line, index) => {
            ctx.fillText(line, element.x + 10, element.y + 25 + index * 20)
          })
          break
      }
    })
  }, [])

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 15
    const angle = Math.atan2(toY - fromY, toX - fromX)

    // Draw line
    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke()

    // Draw arrowhead
    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
    ctx.stroke()
  }

  const drawRemoteCursor = (cursor: { x: number; y: number }, cursorUserId: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const user = users.find((u) => u.userId === cursorUserId)
    if (!user) return

    // Draw cursor
    ctx.fillStyle = user.color
    ctx.beginPath()
    ctx.arc(cursor.x, cursor.y, 5, 0, 2 * Math.PI)
    ctx.fill()

    // Draw user name
    ctx.fillStyle = user.color
    ctx.font = "12px Arial"
    ctx.fillText(user.name, cursor.x + 10, cursor.y - 10)
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)
    setIsDrawing(true)
    setStartPoint(coords)

    if (currentTool === "pen") {
      setCurrentPath([coords.x, coords.y])
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)

    // Update cursor position for other users
    collaborationManager.updateCursor(coords.x, coords.y)

    if (!isDrawing || !startPoint) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    if (currentTool === "pen") {
      setCurrentPath((prev) => [...prev, coords.x, coords.y])

      // Draw current stroke locally
      ctx.strokeStyle = currentColor
      ctx.lineWidth = strokeWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      ctx.moveTo(currentPath[currentPath.length - 4] || coords.x, currentPath[currentPath.length - 3] || coords.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
    } else {
      // For shapes, redraw canvas and show preview
      redrawCanvas(elements)

      ctx.strokeStyle = currentColor
      ctx.lineWidth = strokeWidth
      ctx.setLineDash([5, 5]) // Dashed preview

      switch (currentTool) {
        case "rectangle":
          ctx.strokeRect(startPoint.x, startPoint.y, coords.x - startPoint.x, coords.y - startPoint.y)
          break
        case "circle":
          const radius = Math.sqrt(Math.pow(coords.x - startPoint.x, 2) + Math.pow(coords.y - startPoint.y, 2)) / 2
          ctx.beginPath()
          ctx.arc(
            startPoint.x + (coords.x - startPoint.x) / 2,
            startPoint.y + (coords.y - startPoint.y) / 2,
            radius,
            0,
            2 * Math.PI,
          )
          ctx.stroke()
          break
        case "arrow":
          drawArrow(ctx, startPoint.x, startPoint.y, coords.x, coords.y)
          break
      }

      ctx.setLineDash([]) // Reset dash
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return

    const coords = getCanvasCoordinates(e)
    setIsDrawing(false)

    let newElement: Omit<WhiteboardElement, "id" | "userId" | "timestamp">

    switch (currentTool) {
      case "pen":
        if (currentPath.length > 2) {
          newElement = {
            type: "path",
            x: startPoint.x,
            y: startPoint.y,
            points: currentPath,
            color: currentColor,
            strokeWidth,
          }
        } else {
          return
        }
        break

      case "rectangle":
        newElement = {
          type: "rectangle",
          x: Math.min(startPoint.x, coords.x),
          y: Math.min(startPoint.y, coords.y),
          width: Math.abs(coords.x - startPoint.x),
          height: Math.abs(coords.y - startPoint.y),
          color: currentColor,
          strokeWidth,
        }
        break

      case "circle":
        newElement = {
          type: "circle",
          x: Math.min(startPoint.x, coords.x),
          y: Math.min(startPoint.y, coords.y),
          width: Math.abs(coords.x - startPoint.x),
          height: Math.abs(coords.y - startPoint.y),
          color: currentColor,
          strokeWidth,
        }
        break

      case "arrow":
        newElement = {
          type: "arrow",
          x: startPoint.x,
          y: startPoint.y,
          width: coords.x - startPoint.x,
          height: coords.y - startPoint.y,
          color: currentColor,
          strokeWidth,
        }
        break

      case "text":
        const text = prompt("Enter text:")
        if (text) {
          newElement = {
            type: "text",
            x: startPoint.x,
            y: startPoint.y,
            text,
            color: currentColor,
            strokeWidth,
          }
        } else {
          return
        }
        break

      case "sticky":
        const stickyText = prompt("Enter sticky note text:")
        if (stickyText) {
          newElement = {
            type: "sticky",
            x: startPoint.x,
            y: startPoint.y,
            width: 120,
            height: 120,
            text: stickyText,
            color: currentColor,
            strokeWidth: 1,
          }
        } else {
          return
        }
        break

      default:
        return
    }

    // Add to collaboration manager
    collaborationManager.addWhiteboardElement(newElement)

    // Save to history
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), [...elements, newElement as WhiteboardElement]])
    setHistoryIndex((prev) => prev + 1)

    setCurrentPath([])
    setStartPoint(null)
  }

  const clearCanvas = () => {
    elements.forEach((element) => {
      collaborationManager.deleteWhiteboardElement(element.id)
    })
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      const previousState = history[historyIndex - 1]
      setElements(previousState)
      redrawCanvas(previousState)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      const nextState = history[historyIndex + 1]
      setElements(nextState)
      redrawCanvas(nextState)
    }
  }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `whiteboard-${sessionId}-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Drawing Tools */}
            <div className="flex items-center space-x-2">
              {[
                { tool: "pen" as DrawingTool, icon: Pencil, label: "Pen" },
                { tool: "rectangle" as DrawingTool, icon: Square, label: "Rectangle" },
                { tool: "circle" as DrawingTool, icon: Circle, label: "Circle" },
                { tool: "arrow" as DrawingTool, icon: ArrowRight, label: "Arrow" },
                { tool: "text" as DrawingTool, icon: Type, label: "Text" },
                { tool: "sticky" as DrawingTool, icon: StickyNote, label: "Sticky Note" },
                { tool: "eraser" as DrawingTool, icon: Eraser, label: "Eraser" },
              ].map(({ tool, icon: Icon, label }) => (
                <Button
                  key={tool}
                  variant={currentTool === tool ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentTool(tool)}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 ${
                    currentColor === color ? "border-white" : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>

            {/* Stroke Width */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Size:</span>
              <Slider
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                max={20}
                min={1}
                step={1}
                className="w-20"
              />
              <span className="text-sm text-gray-300 w-6">{strokeWidth}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={exportCanvas}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas and Sidebar */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                className="w-full h-full cursor-crosshair bg-white"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDrawing(false)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Active Users */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Active Users ({users.length + 1})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Current user */}
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: USER_COLORS[0] }} />
                <div>
                  <p className="text-sm font-medium text-green-400">You</p>
                  <p className="text-xs text-gray-400 capitalize">{userRole}</p>
                </div>
              </div>

              {/* Other users */}
              {users.map((user, index) => (
                <div key={user.userId} className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                  {user.isActive && (
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
