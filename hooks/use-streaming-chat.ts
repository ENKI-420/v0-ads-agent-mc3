"use client"

import { useState, useCallback, useRef } from "react"
import { useChat } from "ai/react"
import type { SpeechRecognition } from "speech-recognition-polyfill"

export interface UseStreamingChatOptions {
  role: string
  sessionId?: string
  complianceMode?: "HIPAA" | "SOC2" | "GDPR" | "DEFENSE"
  capabilities?: string[]
  onMessageStart?: () => void
  onMessageComplete?: (message: string) => void
  onError?: (error: Error) => void
}

export function useStreamingChat(options: UseStreamingChatOptions) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages, append, reload, stop } =
    useChat({
      api: "/api/ai/streaming-chat",
      body: {
        role: options.role,
        sessionId: options.sessionId,
        complianceMode: options.complianceMode,
        capabilities: options.capabilities,
      },
      onResponse: () => {
        options.onMessageStart?.()
      },
      onFinish: (message) => {
        options.onMessageComplete?.(message.content)

        // Auto-speak AI responses if voice is enabled
        if (voiceEnabled && message.role === "assistant") {
          speakMessage(message.content)
        }
      },
      onError: (error) => {
        options.onError?.(error)
      },
    })

  // Speech synthesis
  const speakMessage = useCallback(
    (text: string) => {
      if (!voiceEnabled || !window.speechSynthesis) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8
      utterance.voice =
        window.speechSynthesis
          .getVoices()
          .find((voice) => voice.name.includes("Google") || voice.name.includes("Microsoft")) || null

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [voiceEnabled],
  )

  // Speech recognition
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition not supported")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      append({ role: "user", content: transcript })
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [append])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      if (prev) {
        stopSpeaking()
      }
      return !prev
    })
  }, [stopSpeaking])

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return

      await append({ role: "user", content: message })
    },
    [append],
  )

  return {
    // Chat state
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    reload,
    stop,
    sendMessage,

    // Voice state
    isListening,
    isSpeaking,
    voiceEnabled,

    // Voice controls
    startListening,
    stopListening,
    stopSpeaking,
    toggleVoice,
    speakMessage,
  }
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
