import { type NextRequest, NextResponse } from "next/server"
import { createStreamingChat } from "@/lib/ai/streaming-chat"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()
    const { messages, role, sessionId, complianceMode, capabilities } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    // Create streaming response
    const result = await createStreamingChat(messages, {
      role,
      sessionId,
      complianceMode,
      capabilities,
    })

    // Return streaming response
    return new Response(result.toAIStream(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Streaming chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
