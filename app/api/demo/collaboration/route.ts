import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  logger.info("Received request for /api/demo/collaboration")

  // Apply rate limiting
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1"
  const limit = rateLimit(ip)

  if (!limit.success) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`)
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  try {
    const { action, data } = await req.json()
    logger.info(`Processing collaboration action: "${action}" with data:`, data)

    // Simulate real-time collaboration update
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay

    let responseMessage: string
    switch (action) {
      case "document_edit":
        responseMessage = `User ${data.userId} edited document "${data.documentId}" at line ${data.lineNumber}.`
        break
      case "comment_add":
        responseMessage = `User ${data.userId} added a comment: "${data.comment}".`
        break
      case "task_assign":
        responseMessage = `User ${data.userId} assigned task "${data.taskId}" to ${data.assigneeId}.`
        break
      default:
        responseMessage = `Unknown collaboration action: ${action}.`
    }

    logger.info(`Sending collaboration response: "${responseMessage}"`)
    return NextResponse.json({ status: "success", message: responseMessage })
  } catch (error) {
    logger.error("Error in /api/demo/collaboration:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
