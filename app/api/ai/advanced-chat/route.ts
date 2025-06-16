import { type NextRequest, NextResponse } from "next/server"
import { advancedAIOrchestrator } from "@/lib/ai/advanced-orchestrator"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const {
      role,
      task,
      query,
      context,
      sessionId,
      complianceMode = [],
      userId,
      streaming = false,
    } = await request.json()

    if (!role || !task || !query || !userId) {
      return NextResponse.json({ error: "Missing required fields: role, task, query, userId" }, { status: 400 })
    }

    const aiRequest = {
      role,
      task,
      query,
      context,
      sessionId,
      complianceMode,
      userId,
    }

    if (streaming) {
      // Return streaming response
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const responseStream = await advancedAIOrchestrator.streamResponse(aiRequest)

            for await (const chunk of responseStream) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ chunk })}\n\n`))
            }

            controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    } else {
      // Return complete response
      const response = await advancedAIOrchestrator.processRequest(aiRequest)

      return NextResponse.json({
        success: true,
        ...response,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Advanced AI Chat Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
}
