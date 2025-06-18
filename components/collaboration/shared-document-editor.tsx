"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, Save, Users, MessageSquare, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RealTimeCollaborationManager, UserPresence, DocumentEdit } from "@/lib/collaboration/real-time-sync"

interface SharedDocumentEditorProps {
  documentId: string
  sessionId: string
  userId: string
  userName: string
  userRole: string
  collaborationManager: RealTimeCollaborationManager
  initialContent?: string
}

interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  position: number
  timestamp: Date
  resolved: boolean
}

export function SharedDocumentEditor({
  documentId,
  sessionId,
  userId,
  userName,
  userRole,
  collaborationManager,
  initialContent = "",
}: SharedDocumentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [users, setUsers] = useState<UserPresence[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 })
  const [showComments, setShowComments] = useState(false)
  const [isCommentMode, setIsCommentMode] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [lastSaved, setLastSaved] = useState<Date>(new Date())

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize collaboration
  useEffect(() => {
    collaborationManager.onDocumentUpdate = (docId, updatedContent, edits) => {
      if (docId === documentId) {
        setContent(updatedContent)
        setLastSaved(new Date())
      }
    }

    collaborationManager.onPresenceUpdate = (updatedUsers) => {
      setUsers(updatedUsers)
    }

    return () => {
      collaborationManager.onDocumentUpdate = undefined
      collaborationManager.onPresenceUpdate = undefined
    }
  }, [collaborationManager, documentId])

  // Auto-save functionality
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument()
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [content])

  const saveDocument = useCallback(async () => {
    try {
      const response = await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          content,
          sessionId,
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error("Failed to save document:", error)
    }
  }, [documentId, content, sessionId])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    const oldContent = content

    // Calculate the difference
    const edit: Omit<DocumentEdit, "id" | "userId" | "timestamp"> = {
      documentId,
      type: newContent.length > oldContent.length ? "insert" : "delete",
      position: e.target.selectionStart,
      content: newContent.length > oldContent.length ? newContent.slice(oldContent.length) : undefined,
      length: newContent.length < oldContent.length ? oldContent.length - newContent.length : undefined,
    }

    setContent(newContent)
    collaborationManager.editDocument(documentId, edit)
  }

  const handleSelectionChange = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    setSelectedText({ start, end })
    collaborationManager.updateSelection(documentId, start, end)
  }

  const insertFormatting = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    const newText = before + selectedText + after
    const newContent = content.substring(0, start) + newText + content.substring(end)

    setContent(newContent)

    // Send edit to collaboration manager
    collaborationManager.editDocument(documentId, {
      documentId,
      type: "insert",
      position: start,
      content: newText,
      length: end - start,
    })

    // Update cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const addComment = () => {
    if (!newComment.trim() || selectedText.start === selectedText.end) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId,
      userName,
      content: newComment,
      position: selectedText.start,
      timestamp: new Date(),
      resolved: false,
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
    setIsCommentMode(false)

    // In a real implementation, this would be sent through the collaboration manager
  }

  const renderUserCursors = () => {
    return users
      .filter((user) => user.selection && user.selection.documentId === documentId)
      .map((user) => (
        <div
          key={user.userId}
          className="absolute pointer-events-none"
          style={{
            left: `${(user.selection!.start / content.length) * 100}%`,
            top: "0",
            height: "100%",
            width: "2px",
            backgroundColor: user.color,
            zIndex: 10,
          }}
        >
          <div
            className="absolute -top-6 left-0 px-2 py-1 text-xs rounded"
            style={{ backgroundColor: user.color, color: "white" }}
          >
            {user.name}
          </div>
        </div>
      ))
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Formatting Tools */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => insertFormatting("**", "**")} title="Bold">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertFormatting("*", "*")} title="Italic">
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertFormatting("<u>", "</u>")} title="Underline">
                <Underline className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertFormatting("- ", "")} title="Bullet List">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertFormatting("1. ", "")} title="Numbered List">
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertFormatting("> ", "")} title="Quote">
                <Quote className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertFormatting("`", "`")} title="Code">
                <Code className="w-4 h-4" />
              </Button>
            </div>

            {/* Comment Tools */}
            <div className="flex items-center space-x-2 border-l border-gray-600 pl-4">
              <Button
                variant={isCommentMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsCommentMode(!isCommentMode)}
                title="Add Comment"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button
                variant={showComments ? "default" : "outline"}
                size="sm"
                onClick={() => setShowComments(!showComments)}
                title="Show Comments"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Save Status */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">Last saved: {lastSaved.toLocaleTimeString()}</div>
            <Button variant="outline" size="sm" onClick={saveDocument}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Editor and Sidebar */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardContent className="p-0 h-full relative">
              {renderUserCursors()}
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextChange}
                onSelect={handleSelectionChange}
                className="w-full h-full resize-none border-0 focus:ring-0 text-base leading-relaxed"
                placeholder="Start typing your document..."
                style={{ minHeight: "100%" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Active Users */}
          <Card className="m-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Collaborators ({users.length + 1})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Current user */}
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-400">You</p>
                  <p className="text-xs text-gray-400 capitalize">{userRole}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Editing
                </Badge>
              </div>

              {/* Other users */}
              {users.map((user) => (
                <div key={user.userId} className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                  {user.isActive && (
                    <Badge variant="outline" className="text-xs">
                      {user.selection ? "Editing" : "Viewing"}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comments */}
          {showComments && (
            <Card className="m-4 flex-1">
              <CardHeader>
                <CardTitle className="text-sm">Comments ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64">
                  <div className="p-4 space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-lg bg-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{comment.userName}</span>
                          <span className="text-xs text-gray-400">{comment.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-gray-300">{comment.content}</p>
                        {!comment.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setComments((prev) =>
                                prev.map((c) => (c.id === comment.id ? { ...c, resolved: true } : c)),
                              )
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Add Comment */}
          {isCommentMode && (
            <Card className="m-4">
              <CardHeader>
                <CardTitle className="text-sm">Add Comment</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment..."
                  className="mb-3"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={addComment}>
                    Add
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsCommentMode(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
