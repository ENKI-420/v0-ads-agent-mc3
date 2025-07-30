import { streamText, type CoreMessage } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { logger } from "@/lib/logger"
import type { AidenMessage, UserProfile } from "@/lib/types"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize Upstash Redis for rate limiting
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
})

export async function initializeAidenSession(userId: string): Promise<AidenMessage[]> {
  logger.info(`Initializing Aiden session for user: ${userId}`)

  // Mock user profile initialization
  const mockUserProfile: UserProfile = {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    preferences: {
      theme: "dark",
      notifications: true,
    },
    goals: [
      { id: "g1", description: "Increase Q3 revenue by 15%", status: "in-progress" },
      { id: "g2", description: "Launch new product line", status: "not-started" },
    ],
    recentInteractions: [],
  }

  // Simulate fetching user profile from DB
  // In a real app, you'd fetch this from Supabase or another DB
  // const { data: userProfile, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
  // if (error) {
  //   logger.error(`Error fetching user profile: ${error.message}`);
  //   throw new Error("Failed to fetch user profile.");
  // }

  const welcomeMessageContent = `Hello ${mockUserProfile.name}! I'm Aiden, your AI Executive Assistant. How can I help you achieve your goals today?`

  const welcomeMessage: AidenMessage = {
    id: "welcome-message",
    role: "assistant",
    content: welcomeMessageContent,
    type: "welcome",
    timestamp: Date.now(),
  }

  logger.info(`Aiden session initialized for user: ${userId}`)
  return [welcomeMessage]
}

export async function processUserMessage(userId: string, messages: CoreMessage[]): Promise<ReadableStream> {
  logger.info(`Processing user message for user: ${userId}`)

  // Apply rate limiting
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(`chat_ratelimit:${userId}`)
  if (!success) {
    logger.warn(`Rate limit exceeded for user: ${userId}`)
    throw new Error("Rate limit exceeded. Please try again in a few moments.")
  }

  try {
    const { stream } = await streamText({
      model: openai("gpt-4o"),
      system: `You are Aiden, an AI Executive Assistant. Your primary goal is to help executives achieve their business objectives.
               You can provide insights, summarize data, suggest strategies, and help manage tasks.
               Be professional, concise, and action-oriented.
               Current user context:
               User ID: ${userId}
               User Goals: Increase Q3 revenue by 15%, Launch new product line.
               `,
      messages,
    })

    return stream.toReadableStream()
  } catch (error) {
    logger.error(`Error processing user message: ${error}`)
    throw new Error("Failed to process message with AI model.")
  }
}

export async function handleAskAidenContextual(userId: string, context: string): Promise<ReadableStream> {
  logger.info(`Handling contextual 'Ask Aiden' for user: ${userId} with context: ${context}`)

  // Apply rate limiting
  const { success } = await ratelimit.limit(`context_ratelimit:${userId}`)
  if (!success) {
    logger.warn(`Contextual 'Ask Aiden' rate limit exceeded for user: ${userId}`)
    throw new Error("Rate limit exceeded for contextual queries. Please try again later.")
  }

  try {
    const prompt = `Based on the following context, provide a concise executive summary or actionable insights:
    Context: ${context}
    `
    const { stream } = await streamText({
      model: openai("gpt-4o"),
      system: `You are Aiden, an AI Executive Assistant. Provide concise executive summaries and actionable insights based on the provided context.`,
      prompt: prompt,
    })

    return stream.toReadableStream()
  } catch (error) {
    logger.error(`Error handling contextual 'Ask Aiden': ${error}`)
    throw new Error("Failed to generate contextual insights with AI model.")
  }
}

export async function processInteraction(
  userId: string,
  interactionType: string,
  details: Record<string, any>,
): Promise<AidenMessage> {
  logger.info(`Processing interaction for user: ${userId}, type: ${interactionType}`)

  // Simulate saving interaction to DB
  // const { data, error } = await supabase.from('user_interactions').insert([{ userId, interactionType, details }]);
  // if (error) {
  //   logger.error(`Error saving interaction: ${error.message}`);
  //   throw new Error("Failed to save interaction.");
  // }

  let responseContent: string
  let messageType: AidenMessage["type"] = "default"

  switch (interactionType) {
    case "goal_update":
      responseContent = `Acknowledged: Goal "${details.goalName}" updated to "${details.status}".`
      messageType = "update"
      break
    case "resource_view":
      responseContent = `Noted: User viewed resource "${details.resourceName}".`
      messageType = "info"
      break
    case "session_join":
      responseContent = `Confirmed: User joined session "${details.sessionName}".`
      messageType = "success"
      break
    case "welcome":
      responseContent = `Welcome back! How can I assist you further today?`
      messageType = "welcome"
      break
    default:
      responseContent = `Interaction type "${interactionType}" processed.`
      messageType = "default"
  }

  const responseMessage: AidenMessage = {
    id: `interaction-${Date.now()}`,
    role: "assistant",
    content: responseContent,
    type: messageType,
    timestamp: Date.now(),
  }

  return responseMessage
}

export function clearError() {
  logger.info("Clearing error state.")
  // In a real application, this might involve clearing a specific error flag in a global state or database.
  // For this mock, it simply logs the action.
}
