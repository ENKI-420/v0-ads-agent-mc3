import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, parameters } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const startTime = Date.now()

    // Build the generation prompt based on context
    let systemPrompt = "You are a professional AI assistant that generates high-quality content."
    let userPrompt = prompt

    if (context?.meetingType) {
      systemPrompt += ` You are generating content for a ${context.meetingType} context.`
    }

    if (context?.complianceRequirements?.length > 0) {
      systemPrompt += ` Ensure all content complies with: ${context.complianceRequirements.join(", ")}.`
    }

    if (parameters?.style) {
      systemPrompt += ` Use a ${parameters.style} writing style.`
    }

    // Add context if provided
    if (context?.previousContent) {
      userPrompt += `\n\nContext from previous content:\n${context.previousContent}`
    }

    if (context?.participants?.length > 0) {
      userPrompt += `\n\nParticipants: ${context.participants.join(", ")}`
    }

    const response = await openai.chat.completions.create({
      model: parameters?.quality === "high" ? "gpt-4" : "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: parameters?.style === "creative" ? 0.8 : 0.3,
      max_tokens: parameters?.quality === "high" ? 2000 : 1000,
    })

    const content = response.choices[0]?.message?.content || ""
    const processingTime = Date.now() - startTime

    return NextResponse.json({
      content,
      model: response.model,
      processingTime,
      confidence: 0.9,
      usage: response.usage,
    })
  } catch (error) {
    console.error("Text generation error:", error)
    return NextResponse.json({ error: "Text generation failed", details: error.message }, { status: 500 })
  }
}
