import { type NextRequest, NextResponse } from "next/server"
import { multiModalProcessor } from "@/lib/ai/multi-modal-processor"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const role = formData.get("role") as string
    const complianceMode = JSON.parse((formData.get("complianceMode") as string) || "[]")
    const text = formData.get("text") as string

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    const input: any = {
      metadata: {
        role,
        complianceMode,
        type: "text" as const,
      },
    }

    if (file) {
      const buffer = await file.arrayBuffer()
      const fileType = file.type

      if (fileType.startsWith("image/")) {
        input.image = buffer
        input.metadata.type = "image"
        input.metadata.format = fileType
      } else if (fileType.startsWith("audio/")) {
        input.audio = buffer
        input.metadata.type = "audio"
        input.metadata.format = fileType
      } else if (fileType.startsWith("video/")) {
        input.video = buffer
        input.metadata.type = "video"
        input.metadata.format = fileType
      } else if (fileType === "application/pdf" || fileType.includes("document")) {
        input.document = buffer
        input.metadata.type = "document"
        input.metadata.format = fileType
      } else {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
      }
    } else if (text) {
      input.text = text
      input.metadata.type = "text"
    } else {
      return NextResponse.json({ error: "No input provided" }, { status: 400 })
    }

    const result = await multiModalProcessor.processInput(input)

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Multi-modal processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
