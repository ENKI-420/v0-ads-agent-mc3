import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    // Simulate real-time metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        cpu: Math.floor(Math.random() * 30) + 40, // 40-70%
        memory: Math.floor(Math.random() * 20) + 60, // 60-80%
        network: Math.floor(Math.random() * 15) + 80, // 80-95%
        storage: Math.floor(Math.random() * 10) + 70, // 70-80%
      },
      ai: {
        activeAgents: Math.floor(Math.random() * 5) + 3, // 3-8
        requestsPerMinute: Math.floor(Math.random() * 100) + 150, // 150-250
        averageResponseTime: Math.floor(Math.random() * 200) + 300, // 300-500ms
        accuracy: 95 + Math.random() * 4, // 95-99%
      },
      collaboration: {
        activeUsers: Math.floor(Math.random() * 50) + 100, // 100-150
        activeRooms: Math.floor(Math.random() * 20) + 25, // 25-45
        messagesPerMinute: Math.floor(Math.random() * 200) + 300, // 300-500
        uptime: 99.9,
      },
    }

    return NextResponse.json(metrics)
  } catch (error) {
    logger.error("Metrics API error", { error })
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
