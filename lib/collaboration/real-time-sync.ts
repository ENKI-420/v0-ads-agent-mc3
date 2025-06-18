export interface CollaborationEvent {
  id: string
  type: "cursor" | "selection" | "edit" | "whiteboard" | "document" | "presence"
  userId: string
  sessionId: string
  timestamp: Date
  data: any
}

export interface UserPresence {
  userId: string
  name: string
  role: string
  cursor?: { x: number; y: number }
  selection?: { start: number; end: number; documentId?: string }
  isActive: boolean
  lastSeen: Date
  color: string
}

export interface WhiteboardElement {
  id: string
  type: "path" | "rectangle" | "circle" | "text" | "arrow" | "sticky"
  x: number
  y: number
  width?: number
  height?: number
  points?: number[]
  text?: string
  color: string
  strokeWidth: number
  userId: string
  timestamp: Date
}

export interface DocumentEdit {
  id: string
  documentId: string
  type: "insert" | "delete" | "format"
  position: number
  content?: string
  length?: number
  attributes?: Record<string, any>
  userId: string
  timestamp: Date
}

export class RealTimeCollaborationManager {
  private websocket: WebSocket | null = null
  private sessionId: string
  private userId: string
  private userPresence: Map<string, UserPresence> = new Map()
  private whiteboardElements: Map<string, WhiteboardElement> = new Map()
  private documentState: Map<string, string> = new Map()
  private pendingOperations: CollaborationEvent[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  // Event handlers
  onPresenceUpdate?: (users: UserPresence[]) => void
  onWhiteboardUpdate?: (elements: WhiteboardElement[]) => void
  onDocumentUpdate?: (documentId: string, content: string, edits: DocumentEdit[]) => void
  onCursorUpdate?: (userId: string, cursor: { x: number; y: number }) => void
  onConnectionStateChange?: (state: "connecting" | "connected" | "disconnected" | "error") => void

  constructor(sessionId: string, userId: string) {
    this.sessionId = sessionId
    this.userId = userId
  }

  async connect(): Promise<void> {
    try {
      this.onConnectionStateChange?.("connecting")

      // In production, this would be wss://your-domain.com/ws
      const wsUrl = `ws://localhost:3001/collaboration/${this.sessionId}`
      this.websocket = new WebSocket(wsUrl)

      this.websocket.onopen = () => {
        this.onConnectionStateChange?.("connected")
        this.reconnectAttempts = 0

        // Send initial presence
        this.sendEvent({
          type: "presence",
          data: {
            userId: this.userId,
            isActive: true,
            timestamp: new Date(),
          },
        })

        // Send any pending operations
        this.flushPendingOperations()
      }

      this.websocket.onmessage = (event) => {
        try {
          const collaborationEvent: CollaborationEvent = JSON.parse(event.data)
          this.handleIncomingEvent(collaborationEvent)
        } catch (error) {
          console.error("Failed to parse collaboration event:", error)
        }
      }

      this.websocket.onclose = () => {
        this.onConnectionStateChange?.("disconnected")
        this.attemptReconnect()
      }

      this.websocket.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.onConnectionStateChange?.("error")
      }
    } catch (error) {
      console.error("Failed to connect to collaboration server:", error)
      this.onConnectionStateChange?.("error")
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, delay)
    }
  }

  private handleIncomingEvent(event: CollaborationEvent): void {
    switch (event.type) {
      case "presence":
        this.handlePresenceUpdate(event)
        break
      case "cursor":
        this.handleCursorUpdate(event)
        break
      case "whiteboard":
        this.handleWhiteboardUpdate(event)
        break
      case "document":
        this.handleDocumentUpdate(event)
        break
      case "selection":
        this.handleSelectionUpdate(event)
        break
    }
  }

  private handlePresenceUpdate(event: CollaborationEvent): void {
    const presence: UserPresence = event.data
    this.userPresence.set(presence.userId, presence)
    this.onPresenceUpdate?.(Array.from(this.userPresence.values()))
  }

  private handleCursorUpdate(event: CollaborationEvent): void {
    const { userId, cursor } = event.data
    const user = this.userPresence.get(userId)
    if (user) {
      user.cursor = cursor
      this.userPresence.set(userId, user)
    }
    this.onCursorUpdate?.(userId, cursor)
  }

  private handleWhiteboardUpdate(event: CollaborationEvent): void {
    const { action, element } = event.data

    if (action === "add" || action === "update") {
      this.whiteboardElements.set(element.id, element)
    } else if (action === "delete") {
      this.whiteboardElements.delete(element.id)
    }

    this.onWhiteboardUpdate?.(Array.from(this.whiteboardElements.values()))
  }

  private handleDocumentUpdate(event: CollaborationEvent): void {
    const { documentId, edits } = event.data

    // Apply operational transformation for concurrent edits
    const transformedEdits = this.transformDocumentEdits(documentId, edits)

    // Update local document state
    let content = this.documentState.get(documentId) || ""
    for (const edit of transformedEdits) {
      content = this.applyDocumentEdit(content, edit)
    }
    this.documentState.set(documentId, content)

    this.onDocumentUpdate?.(documentId, content, transformedEdits)
  }

  private handleSelectionUpdate(event: CollaborationEvent): void {
    const { userId, selection } = event.data
    const user = this.userPresence.get(userId)
    if (user) {
      user.selection = selection
      this.userPresence.set(userId, user)
      this.onPresenceUpdate?.(Array.from(this.userPresence.values()))
    }
  }

  // Public methods for sending events
  updateCursor(x: number, y: number): void {
    this.sendEvent({
      type: "cursor",
      data: { userId: this.userId, cursor: { x, y } },
    })
  }

  addWhiteboardElement(element: Omit<WhiteboardElement, "id" | "userId" | "timestamp">): void {
    const whiteboardElement: WhiteboardElement = {
      ...element,
      id: this.generateId(),
      userId: this.userId,
      timestamp: new Date(),
    }

    this.whiteboardElements.set(whiteboardElement.id, whiteboardElement)

    this.sendEvent({
      type: "whiteboard",
      data: { action: "add", element: whiteboardElement },
    })
  }

  updateWhiteboardElement(elementId: string, updates: Partial<WhiteboardElement>): void {
    const element = this.whiteboardElements.get(elementId)
    if (!element) return

    const updatedElement = { ...element, ...updates, timestamp: new Date() }
    this.whiteboardElements.set(elementId, updatedElement)

    this.sendEvent({
      type: "whiteboard",
      data: { action: "update", element: updatedElement },
    })
  }

  deleteWhiteboardElement(elementId: string): void {
    const element = this.whiteboardElements.get(elementId)
    if (!element) return

    this.whiteboardElements.delete(elementId)

    this.sendEvent({
      type: "whiteboard",
      data: { action: "delete", element: { id: elementId } },
    })
  }

  editDocument(documentId: string, edit: Omit<DocumentEdit, "id" | "userId" | "timestamp">): void {
    const documentEdit: DocumentEdit = {
      ...edit,
      id: this.generateId(),
      userId: this.userId,
      timestamp: new Date(),
    }

    // Apply edit locally first
    let content = this.documentState.get(documentId) || ""
    content = this.applyDocumentEdit(content, documentEdit)
    this.documentState.set(documentId, content)

    this.sendEvent({
      type: "document",
      data: { documentId, edits: [documentEdit] },
    })
  }

  updateSelection(documentId: string, start: number, end: number): void {
    this.sendEvent({
      type: "selection",
      data: {
        userId: this.userId,
        selection: { start, end, documentId },
      },
    })
  }

  private sendEvent(eventData: Omit<CollaborationEvent, "id" | "userId" | "sessionId" | "timestamp">): void {
    const event: CollaborationEvent = {
      id: this.generateId(),
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      ...eventData,
    }

    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(event))
    } else {
      // Queue for when connection is restored
      this.pendingOperations.push(event)
    }
  }

  private flushPendingOperations(): void {
    while (this.pendingOperations.length > 0) {
      const operation = this.pendingOperations.shift()
      if (operation && this.websocket?.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify(operation))
      }
    }
  }

  private transformDocumentEdits(documentId: string, incomingEdits: DocumentEdit[]): DocumentEdit[] {
    // Simplified operational transformation
    // In production, use a library like ShareJS or Yjs
    return incomingEdits.map((edit) => {
      // Transform edit positions based on concurrent operations
      return edit
    })
  }

  private applyDocumentEdit(content: string, edit: DocumentEdit): string {
    switch (edit.type) {
      case "insert":
        return content.slice(0, edit.position) + (edit.content || "") + content.slice(edit.position)
      case "delete":
        return content.slice(0, edit.position) + content.slice(edit.position + (edit.length || 0))
      default:
        return content
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Cleanup
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
    this.userPresence.clear()
    this.whiteboardElements.clear()
    this.documentState.clear()
    this.pendingOperations = []
  }

  // Getters
  getPresence(): UserPresence[] {
    return Array.from(this.userPresence.values())
  }

  getWhiteboardElements(): WhiteboardElement[] {
    return Array.from(this.whiteboardElements.values())
  }

  getDocumentContent(documentId: string): string {
    return this.documentState.get(documentId) || ""
  }
}
