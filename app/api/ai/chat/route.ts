import { type NextRequest, NextResponse } from "next/server"
import { ratelimit } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"

// Mock AI response for demo purposes
async function generateMockAIResponse(message: string, context?: string): Promise<string> {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  const responses = [
    `I understand you're asking about "${message}". As AGENT-M3c, I can help you analyze this request and provide insights based on our platform's capabilities.`,
    `That's an interesting question about "${message}". Our AI-powered collaboration platform can assist with document analysis, real-time collaboration, and strategic insights.`,
    `Based on your query "${message}", I can provide several recommendations. Our platform excels at processing complex information and providing actionable insights.`,
    `Thank you for asking about "${message}". Our multi-agent AI system can help break down complex problems and provide comprehensive solutions.`,
    `I see you're interested in "${message}". Our platform's AI capabilities include real-time analysis, collaboration tools, and enterprise-grade security features.`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? "127.0.0.1"
    const { success } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate AI response (using mock for demo)
    const response = await generateMockAIResponse(message, context)

    logger.info("AI chat response generated", {
      messageLength: message.length,
      responseLength: response.length,
      context,
    })

    return NextResponse.json({ response })
  } catch (error) {
    logger.error("AI chat error", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
