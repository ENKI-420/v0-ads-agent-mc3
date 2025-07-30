export type AidenRole = "user" | "assistant" | "system"

export type AidenMessageType = "default" | "welcome" | "error" | "warning" | "info" | "response"

export type AidenInteractionType = "text" | "voice" | "system_trigger" | "context_request"

export interface AidenMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  type?: AidenMessageType
  followUpPrompts?: string[]
}

export interface AidenSession {
  id: string
  userId: string
  messages: AidenMessage[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AidenUserProfile {
  name: string
  role: string
  avatar?: string
}

export interface AidenEngineRequest {
  type: AidenInteractionType
  content: string
  context: {
    userId: string
    sessionId: string
    metadata?: any
  }
}

export interface AidenEngineResponse {
  success: boolean
  message: string
  error?: string
  followUpPrompts?: string[]
  metadata?: any
}

export interface AidenStore {
  // State
  isVisible: boolean
  isLoading: boolean
  currentSession: AidenSession | null
  error: string | null
  userProfile: AidenUserProfile | null

  // Actions
  setVisible: (visible: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  setUserProfile: (profile: AidenUserProfile) => void
  initializeSession: (userId: string) => void
  addMessage: (message: Omit<AidenMessage, "id" | "timestamp">) => void
  sendMessage: (content: string, type?: AidenInteractionType) => Promise<void>
  initializeAidenSession: () => Promise<void>
}
