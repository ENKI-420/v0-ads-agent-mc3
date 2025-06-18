import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text, speakerId, timestamp, context } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const actionItemPrompt = `Identify action items from the following text. Look for:

1. Tasks that need to be completed
2. Assignments to specific people
3. Deadlines or time commitments
4. Follow-up actions
5. Decisions that require implementation

Context: ${context || "No additional context"}
Current text: "${text}"

Respond in JSON format:
{
  "actionItems": [
    {
      "text": "description of the action item",
      "assignee": "person assigned (if mentioned)",
      "dueDate": "ISO date string (if mentioned)",
      "priority": "low|medium|high|urgent",
      "confidence": number (0-1),
      "category": "type of action item"
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at identifying action items and tasks from meeting transcriptions. Be precise and only identify clear, actionable items.",
        },
        {
          role: "user",
          content: actionItemPrompt,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    })

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}")

    // Add metadata to each action item
    analysis.actionItems?.forEach((item: any) => {
      item.extractedFrom = {
        speakerId,
        timestamp,
        context: text,
      }
      item.id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      item.status = "identified"
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Action item detection error:", error)
    return NextResponse.json({ error: "Action item detection failed", details: error.message }, { status: 500 })
  }
}
