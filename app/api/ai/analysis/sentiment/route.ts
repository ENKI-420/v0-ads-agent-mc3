import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text, speakerId, timestamp, includeEmotions } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Perform sentiment analysis using GPT-4
    const sentimentPrompt = `Analyze the sentiment and emotional content of the following text. Provide a detailed analysis including:

1. Overall sentiment (positive, neutral, negative)
2. Sentiment score (-1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive)
3. Confidence level (0 to 1)
${includeEmotions ? "4. Emotional breakdown (joy, anger, fear, sadness, surprise, disgust) with scores 0-1" : ""}

Text to analyze: "${text}"

Respond in JSON format with the following structure:
{
  "overall": "positive|neutral|negative",
  "score": number,
  "confidence": number,
  "emotions": {
    "joy": number,
    "anger": number,
    "fear": number,
    "sadness": number,
    "surprise": number,
    "disgust": number
  },
  "reasoning": "brief explanation"
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert sentiment analysis AI. Provide accurate, nuanced sentiment analysis with confidence scores.",
        },
        {
          role: "user",
          content: sentimentPrompt,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    })

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}")

    // Add timeline data
    const result = {
      ...analysis,
      timeline: [
        {
          timestamp,
          sentiment: analysis.score,
          emotion: analysis.overall,
        },
      ],
      speakerId,
      timestamp,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    return NextResponse.json({ error: "Sentiment analysis failed", details: error.message }, { status: 500 })
  }
}
