import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(req: Request) {
  logger.info("Received request for /api/demo/metrics")

  // Apply rate limiting
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1"
  const limit = rateLimit(ip)

  if (!limit.success) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`)
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  try {
    // Simulate fetching real-time system metrics
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

    const metrics = {
      cpuUsage: Number.parseFloat((Math.random() * (90 - 20) + 20).toFixed(2)), // 20-90%
      memoryUsage: Number.parseFloat((Math.random() * (80 - 30) + 30).toFixed(2)), // 30-80%
      networkLatency: Number.parseFloat((Math.random() * (150 - 10) + 10).toFixed(2)), // 10-150ms
      activeUsers: Math.floor(Math.random() * (500 - 50) + 50), // 50-500 users
      timestamp: new Date().toISOString(),
    }

    logger.info("Sending system metrics:", metrics)
    return NextResponse.json(metrics)
  } catch (error) {
    logger.error("Error in /api/demo/metrics:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
