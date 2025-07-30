import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  logger.info("Received request for /api/ai/chat")

  // Apply rate limiting
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1"
  const limit = rateLimit(ip)

  if (!limit.success) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`)
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  try {
    const { message } = await req.json()
    logger.info(`Processing chat message: "${message}"`)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    const aiResponse = `Echo: ${message}. I'm an AI chat assistant. How can I help you further?`
    logger.info(`Sending AI response: "${aiResponse}"`)

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    logger.error("Error in /api/ai/chat:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
