export interface UserProfile {
  id: string
  name: string
  email: string
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
  }
  goals: {
    id: string
    description: string
    status: "not-started" | "in-progress" | "completed"
  }[]
  recentInteractions: {
    type: string
    timestamp: number
    details: Record<string, any>
  }[]
}

export interface AidenMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  type?: "default" | "welcome" | "info" | "success" | "error" | "update"
  timestamp: number
  followUpPrompts?: string[]
}
