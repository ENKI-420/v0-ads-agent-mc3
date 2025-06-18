import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text, voice, language, speed, format } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Generate speech using OpenAI TTS
    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: voice === "professional" ? "nova" : voice || "alloy",
      input: text,
      speed: speed || 1.0,
      response_format: format || "mp3",
    })

    // Convert response to blob
    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": `audio/${format || "mp3"}`,
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Audio generation error:", error)
    return NextResponse.json({ error: "Audio generation failed", details: error.message }, { status: 500 })
  }
}
