import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text, timestamp, customKeywords, confidenceThreshold } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const topicPrompt = `Extract and analyze the key topics from the following text. Provide:

1. Main topics with confidence scores
2. Keywords for each topic
3. Topic categories and subcategories
4. Relevance scores

${customKeywords ? `Pay special attention to these custom keywords: ${customKeywords.join(", ")}` : ""}

Text to analyze: "${text}"

Respond in JSON format:
{
  "topics": [
    {
      "name": "topic name",
      "confidence": number (0-1),
      "keywords": ["keyword1", "keyword2"],
      "mentions": number,
      "firstMention": timestamp,
      "lastMention": timestamp
    }
  ],
  "categories": [
    {
      "category": "category name",
      "relevance": number (0-1),
      "subcategories": ["sub1", "sub2"]
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert topic extraction AI. Identify key topics, themes, and categories with high accuracy.",
        },
        {
          role: "user",
          content: topicPrompt,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    })

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}")

    // Filter topics by confidence threshold
    if (confidenceThreshold) {
      analysis.topics = analysis.topics?.filter((topic: any) => topic.confidence >= confidenceThreshold) || []
    }

    // Add timestamp information
    analysis.topics?.forEach((topic: any) => {
      topic.firstMention = topic.firstMention || timestamp
      topic.lastMention = topic.lastMention || timestamp
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Topic extraction error:", error)
    return NextResponse.json({ error: "Topic extraction failed", details: error.message }, { status: 500 })
  }
}
