export interface Participant {
  id: string
  name: string
  role: string
  avatar?: string
  status: "online" | "away" | "busy" | "offline"
  permissions: ParticipantPermissions
  joinedAt: Date
  lastActive: Date
  deviceInfo: {
    type: "desktop" | "mobile" | "tablet"
    browser: string
    os: string
  }
  mediaState: {
    audio: boolean
    video: boolean
    screen: boolean
  }
  location?: {
    cursor?: { x: number; y: number }
    viewport?: { x: number; y: number; width: number; height: number }
    activeElement?: string
  }
}

export interface ParticipantPermissions {
  canEdit: boolean
  canComment: boolean
  canShare: boolean
  canInvite: boolean
  canModerate: boolean
  canRecord: boolean
  canViewSensitive: boolean
  maxParticipants?: number
}

export interface CollaborationSession {
  id: string
  title: string
  type: "meeting" | "document" | "whiteboard" | "presentation"
  vertical: "healthcare" | "legal" | "defense" | "enterprise"
  participants: Map<string, Participant>
  moderators: string[]
  settings: SessionSettings
  state: SessionState
  createdAt: Date
  updatedAt: Date
}

export interface SessionSettings {
  maxParticipants: number
  allowAnonymous: boolean
  requireApproval: boolean
  recordingEnabled: boolean
  transcriptionEnabled: boolean
  aiInsightsEnabled: boolean
  complianceMode: string
  encryption: "standard" | "enhanced" | "military"
}

export interface SessionState {
  status: "waiting" | "active" | "paused" | "ended"
  startTime?: Date
  endTime?: Date
  duration: number
  activeFeatures: string[]
  sharedContent: SharedContent[]
  chatMessages: ChatMessage[]
  aiInsights: AIInsight[]
}

export interface SharedContent {
  id: string
  type: "document" | "screen" | "whiteboard" | "presentation" | "file"
  title: string
  ownerId: string
  permissions: ContentPermissions
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface ContentPermissions {
  viewers: string[]
  editors: string[]
  commenters: string[]
  isPublic: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  content: string
  type: "text" | "file" | "system" | "ai"
  timestamp: Date
  reactions: MessageReaction[]
  threadId?: string
  mentions: string[]
  attachments?: FileAttachment[]
}

export interface MessageReaction {
  emoji: string
  userId: string
  timestamp: Date
}

export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnail?: string
}

export interface AIInsight {
  id: string
  type: "summary" | "action_item" | "sentiment" | "topic" | "compliance" | "suggestion"
  content: string
  confidence: number
  participants: string[]
  timestamp: Date
  metadata: Record<string, any>
}

export class MultiParticipantManager {
  private websocket: WebSocket | null = null
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private localStream: MediaStream | null = null
  private session: CollaborationSession
  private currentParticipant: Participant
  private eventHandlers: Map<string, Function[]> = new Map()

  // Configuration
  private iceServers = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }]

  constructor(sessionId: string, participant: Participant) {
    this.currentParticipant = participant
    this.session = {
      id: sessionId,
      title: "",
      type: "meeting",
      vertical: "enterprise",
      participants: new Map(),
      moderators: [],
      settings: this.getDefaultSettings(),
      state: this.getDefaultState(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // Connection Management
  async connect(): Promise<void> {
    try {
      // Connect to signaling server
      const wsUrl = `wss://collaboration.agent-m3c.com/sessions/${this.session.id}`
      this.websocket = new WebSocket(wsUrl)

      this.websocket.onopen = () => {
        this.emit("connection:established")
        this.joinSession()
      }

      this.websocket.onmessage = (event) => {
        this.handleSignalingMessage(JSON.parse(event.data))
      }

      this.websocket.onclose = () => {
        this.emit("connection:lost")
        this.attemptReconnection()
      }

      this.websocket.onerror = (error) => {
        this.emit("connection:error", error)
      }
    } catch (error) {
      console.error("Failed to connect:", error)
      throw error
    }
  }

  private async joinSession(): Promise<void> {
    const message = {
      type: "join_session",
      sessionId: this.session.id,
      participant: this.currentParticipant,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(message)
  }

  // Participant Management
  async inviteParticipant(email: string, role: string, permissions: ParticipantPermissions): Promise<void> {
    const invitation = {
      type: "invite_participant",
      sessionId: this.session.id,
      inviteeEmail: email,
      role,
      permissions,
      invitedBy: this.currentParticipant.id,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(invitation)
    this.emit("participant:invited", { email, role })
  }

  async removeParticipant(participantId: string, reason?: string): Promise<void> {
    if (!this.canModerate()) {
      throw new Error("Insufficient permissions to remove participant")
    }

    const message = {
      type: "remove_participant",
      sessionId: this.session.id,
      participantId,
      reason,
      removedBy: this.currentParticipant.id,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(message)
    this.cleanupPeerConnection(participantId)
  }

  async updateParticipantPermissions(participantId: string, permissions: ParticipantPermissions): Promise<void> {
    if (!this.canModerate()) {
      throw new Error("Insufficient permissions to update participant permissions")
    }

    const message = {
      type: "update_permissions",
      sessionId: this.session.id,
      participantId,
      permissions,
      updatedBy: this.currentParticipant.id,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(message)
  }

  // Media Management
  async enableAudio(): Promise<void> {
    try {
      if (!this.localStream) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
      }

      this.currentParticipant.mediaState.audio = true
      this.broadcastMediaState()
      this.addStreamToPeers()
      this.emit("media:audio_enabled")
    } catch (error) {
      console.error("Failed to enable audio:", error)
      throw error
    }
  }

  async enableVideo(): Promise<void> {
    try {
      if (!this.localStream) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
      }

      this.currentParticipant.mediaState.video = true
      this.broadcastMediaState()
      this.addStreamToPeers()
      this.emit("media:video_enabled", this.localStream)
    } catch (error) {
      console.error("Failed to enable video:", error)
      throw error
    }
  }

  async shareScreen(): Promise<void> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 15 },
        },
        audio: true,
      })

      this.currentParticipant.mediaState.screen = true
      this.broadcastMediaState()

      // Replace video track with screen share
      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video")
        if (sender) {
          sender.replaceTrack(screenStream.getVideoTracks()[0])
        }
      })

      this.emit("media:screen_shared", screenStream)

      // Handle screen share end
      screenStream.getVideoTracks()[0].onended = () => {
        this.stopScreenShare()
      }
    } catch (error) {
      console.error("Failed to share screen:", error)
      throw error
    }
  }

  async stopScreenShare(): Promise<void> {
    this.currentParticipant.mediaState.screen = false
    this.broadcastMediaState()

    // Restore camera if available
    if (this.localStream && this.currentParticipant.mediaState.video) {
      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video")
        if (sender && this.localStream) {
          sender.replaceTrack(this.localStream.getVideoTracks()[0])
        }
      })
    }

    this.emit("media:screen_share_stopped")
  }

  // Real-time Communication
  async sendChatMessage(
    content: string,
    type: "text" | "file" = "text",
    attachments?: FileAttachment[],
  ): Promise<void> {
    const message: ChatMessage = {
      id: this.generateId(),
      senderId: this.currentParticipant.id,
      content,
      type,
      timestamp: new Date(),
      reactions: [],
      mentions: this.extractMentions(content),
      attachments,
    }

    this.session.state.chatMessages.push(message)

    const broadcastMessage = {
      type: "chat_message",
      sessionId: this.session.id,
      message,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(broadcastMessage)
    this.emit("chat:message_sent", message)
  }

  async reactToMessage(messageId: string, emoji: string): Promise<void> {
    const message = this.session.state.chatMessages.find((m) => m.id === messageId)
    if (!message) return

    const existingReaction = message.reactions.find((r) => r.userId === this.currentParticipant.id && r.emoji === emoji)

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter((r) => r !== existingReaction)
    } else {
      // Add reaction
      message.reactions.push({
        emoji,
        userId: this.currentParticipant.id,
        timestamp: new Date(),
      })
    }

    const reactionMessage = {
      type: "message_reaction",
      sessionId: this.session.id,
      messageId,
      emoji,
      userId: this.currentParticipant.id,
      action: existingReaction ? "remove" : "add",
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(reactionMessage)
    this.emit("chat:reaction_updated", { messageId, emoji, action: existingReaction ? "remove" : "add" })
  }

  // Collaborative Features
  async shareContent(content: SharedContent): Promise<void> {
    if (!this.currentParticipant.permissions.canShare) {
      throw new Error("Insufficient permissions to share content")
    }

    this.session.state.sharedContent.push(content)

    const shareMessage = {
      type: "content_shared",
      sessionId: this.session.id,
      content,
      sharedBy: this.currentParticipant.id,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(shareMessage)
    this.emit("content:shared", content)
  }

  async updateCursor(x: number, y: number): Promise<void> {
    this.currentParticipant.location = {
      ...this.currentParticipant.location,
      cursor: { x, y },
    }

    const cursorMessage = {
      type: "cursor_update",
      sessionId: this.session.id,
      participantId: this.currentParticipant.id,
      cursor: { x, y },
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(cursorMessage)
  }

  async broadcastPresence(): Promise<void> {
    this.currentParticipant.lastActive = new Date()

    const presenceMessage = {
      type: "presence_update",
      sessionId: this.session.id,
      participant: this.currentParticipant,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(presenceMessage)
  }

  // AI Integration
  async requestAIInsight(type: string, context?: any): Promise<void> {
    const request = {
      type: "ai_insight_request",
      sessionId: this.session.id,
      insightType: type,
      context,
      requestedBy: this.currentParticipant.id,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(request)
    this.emit("ai:insight_requested", { type, context })
  }

  // Session Management
  async startRecording(): Promise<void> {
    if (!this.canModerate() || !this.session.settings.recordingEnabled) {
      throw new Error("Insufficient permissions or recording disabled")
    }

    const recordingMessage = {
      type: "start_recording",
      sessionId: this.session.id,
      startedBy: this.currentParticipant.id,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(recordingMessage)
    this.emit("session:recording_started")
  }

  async endSession(): Promise<void> {
    if (!this.canModerate()) {
      throw new Error("Insufficient permissions to end session")
    }

    this.session.state.status = "ended"
    this.session.state.endTime = new Date()

    const endMessage = {
      type: "end_session",
      sessionId: this.session.id,
      endedBy: this.currentParticipant.id,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(endMessage)
    this.cleanup()
    this.emit("session:ended")
  }

  // WebRTC Peer Connection Management
  private async createPeerConnection(participantId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: "ice_candidate",
          sessionId: this.session.id,
          targetParticipant: participantId,
          candidate: event.candidate,
          timestamp: new Date().toISOString(),
        })
      }
    }

    pc.ontrack = (event) => {
      this.emit("media:remote_stream", {
        participantId,
        stream: event.streams[0],
      })
    }

    pc.onconnectionstatechange = () => {
      this.emit("peer:connection_state_changed", {
        participantId,
        state: pc.connectionState,
      })
    }

    this.peerConnections.set(participantId, pc)
    return pc
  }

  private async addStreamToPeers(): Promise<void> {
    if (!this.localStream) return

    this.peerConnections.forEach((pc) => {
      this.localStream!.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!)
      })
    })
  }

  private cleanupPeerConnection(participantId: string): void {
    const pc = this.peerConnections.get(participantId)
    if (pc) {
      pc.close()
      this.peerConnections.delete(participantId)
    }
  }

  // Message Handling
  private async handleSignalingMessage(message: any): Promise<void> {
    switch (message.type) {
      case "participant_joined":
        await this.handleParticipantJoined(message)
        break
      case "participant_left":
        this.handleParticipantLeft(message)
        break
      case "offer":
        await this.handleOffer(message)
        break
      case "answer":
        await this.handleAnswer(message)
        break
      case "ice_candidate":
        await this.handleIceCandidate(message)
        break
      case "chat_message":
        this.handleChatMessage(message)
        break
      case "content_shared":
        this.handleContentShared(message)
        break
      case "ai_insight":
        this.handleAIInsight(message)
        break
      case "session_update":
        this.handleSessionUpdate(message)
        break
    }
  }

  private async handleParticipantJoined(message: any): Promise<void> {
    const participant: Participant = message.participant
    this.session.participants.set(participant.id, participant)

    // Create peer connection for new participant
    const pc = await this.createPeerConnection(participant.id)

    // Add local stream if available
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!)
      })
    }

    // Create offer for new participant
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    this.sendSignalingMessage({
      type: "offer",
      sessionId: this.session.id,
      targetParticipant: participant.id,
      offer,
      timestamp: new Date().toISOString(),
    })

    this.emit("participant:joined", participant)
  }

  private handleParticipantLeft(message: any): void {
    const participantId = message.participantId
    this.session.participants.delete(participantId)
    this.cleanupPeerConnection(participantId)
    this.emit("participant:left", { participantId })
  }

  private async handleOffer(message: any): Promise<void> {
    const pc = await this.createPeerConnection(message.fromParticipant)
    await pc.setRemoteDescription(message.offer)

    // Add local stream if available
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!)
      })
    }

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    this.sendSignalingMessage({
      type: "answer",
      sessionId: this.session.id,
      targetParticipant: message.fromParticipant,
      answer,
      timestamp: new Date().toISOString(),
    })
  }

  private async handleAnswer(message: any): Promise<void> {
    const pc = this.peerConnections.get(message.fromParticipant)
    if (pc) {
      await pc.setRemoteDescription(message.answer)
    }
  }

  private async handleIceCandidate(message: any): Promise<void> {
    const pc = this.peerConnections.get(message.fromParticipant)
    if (pc) {
      await pc.addIceCandidate(message.candidate)
    }
  }

  private handleChatMessage(message: any): void {
    this.session.state.chatMessages.push(message.message)
    this.emit("chat:message_received", message.message)
  }

  private handleContentShared(message: any): void {
    this.session.state.sharedContent.push(message.content)
    this.emit("content:shared", message.content)
  }

  private handleAIInsight(message: any): void {
    this.session.state.aiInsights.push(message.insight)
    this.emit("ai:insight_received", message.insight)
  }

  private handleSessionUpdate(message: any): void {
    this.session = { ...this.session, ...message.updates }
    this.emit("session:updated", message.updates)
  }

  // Utility Methods
  private sendSignalingMessage(message: any): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message))
    }
  }

  private broadcastMediaState(): void {
    const message = {
      type: "media_state_update",
      sessionId: this.session.id,
      participantId: this.currentParticipant.id,
      mediaState: this.currentParticipant.mediaState,
      timestamp: new Date().toISOString(),
    }

    this.sendSignalingMessage(message)
  }

  private canModerate(): boolean {
    return (
      this.currentParticipant.permissions.canModerate || this.session.moderators.includes(this.currentParticipant.id)
    )
  }

  private extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1])
    }

    return mentions
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private attemptReconnection(): void {
    setTimeout(() => {
      this.connect()
    }, 3000)
  }

  private cleanup(): void {
    this.peerConnections.forEach((pc) => pc.close())
    this.peerConnections.clear()

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  }

  private getDefaultSettings(): SessionSettings {
    return {
      maxParticipants: 50,
      allowAnonymous: false,
      requireApproval: true,
      recordingEnabled: true,
      transcriptionEnabled: true,
      aiInsightsEnabled: true,
      complianceMode: "standard",
      encryption: "enhanced",
    }
  }

  private getDefaultState(): SessionState {
    return {
      status: "waiting",
      duration: 0,
      activeFeatures: [],
      sharedContent: [],
      chatMessages: [],
      aiInsights: [],
    }
  }

  // Event System
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  // Getters
  getSession(): CollaborationSession {
    return this.session
  }

  getParticipants(): Participant[] {
    return Array.from(this.session.participants.values())
  }

  getCurrentParticipant(): Participant {
    return this.currentParticipant
  }

  getSharedContent(): SharedContent[] {
    return this.session.state.sharedContent
  }

  getChatMessages(): ChatMessage[] {
    return this.session.state.chatMessages
  }

  getAIInsights(): AIInsight[] {
    return this.session.state.aiInsights
  }
}
