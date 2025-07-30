import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type {
  AidenStore,
  AidenMessage,
  AidenSession,
  AidenInteractionType,
  AidenEngineRequest,
  AidenEngineResponse,
} from "@/lib/types/aiden"

export const useAidenStore = create<AidenStore>()(
  devtools(
    (set, get) => ({
      // State
      isVisible: false,
      isLoading: false,
      currentSession: null,
      error: null,
      userProfile: null,

      // Actions
      setVisible: (visible: boolean) => {
        set({ isVisible: visible }, false, "setVisible")
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, "setLoading")
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError")
      },

      clearError: () => {
        set({ error: null }, false, "clearError")
      },

      setUserProfile: (profile) => {
        set({ userProfile: profile }, false, "setUserProfile")
      },

      initializeSession: (userId: string) => {
        const newSession: AidenSession = {
          id: `session_${Date.now()}`,
          userId,
          messages: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set({ currentSession: newSession }, false, "initializeSession")
      },

      addMessage: (message: Omit<AidenMessage, "id" | "timestamp">) => {
        const { currentSession } = get()
        if (!currentSession) return

        const newMessage: AidenMessage = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        }

        const updatedSession: AidenSession = {
          ...currentSession,
          messages: [...currentSession.messages, newMessage],
          updatedAt: new Date(),
        }

        set({ currentSession: updatedSession }, false, "addMessage")
      },

      sendMessage: async (content: string, type: AidenInteractionType = "text") => {
        const { addMessage, setLoading, setError, currentSession } = get()

        if (!currentSession) {
          setError("No active session")
          return
        }

        try {
          setLoading(true)
          setError(null)

          // Add user message
          addMessage({
            content,
            isUser: true,
          })

          // Prepare request
          const request: AidenEngineRequest = {
            type,
            content,
            context: {
              userId: currentSession.userId,
              sessionId: currentSession.id,
            },
          }

          // Send to API
          const response = await fetch("/api/aiden/orchestrate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const aiResponse: AidenEngineResponse = await response.json()

          if (!aiResponse.success) {
            throw new Error(aiResponse.error || "AI response failed")
          }

          // Add AI response
          addMessage({
            content: aiResponse.message,
            isUser: false,
            type: "response",
            followUpPrompts: aiResponse.followUpPrompts,
          })
        } catch (error) {
          console.error("Error sending message:", error)
          setError(error instanceof Error ? error.message : "Failed to send message")

          // Add error message
          addMessage({
            content: "I apologize, but I encountered an error processing your request. Please try again.",
            isUser: false,
            type: "error",
          })
        } finally {
          setLoading(false)
        }
      },

      initializeAidenSession: async () => {
        const { currentSession, sendMessage, setUserProfile } = get()

        // Initialize user profile if not set
        if (!get().userProfile) {
          setUserProfile({
            name: "Executive User",
            role: "Chief Executive",
            avatar: "/placeholder-user.jpg",
          })
        }

        // Only initialize if no session exists or session has no messages
        if (!currentSession || currentSession.messages.length === 0) {
          // Initialize session if needed
          if (!currentSession) {
            get().initializeSession("user_executive")
          }

          // Send system trigger to initialize welcome
          await sendMessage("Initialize welcome sequence", "system_trigger")
        }
      },
    }),
    {
      name: "aiden-store",
    },
  ),
)
