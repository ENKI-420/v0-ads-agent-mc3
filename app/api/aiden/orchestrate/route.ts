import { type NextRequest, NextResponse } from "next/server"
import type { AidenEngineRequest, AidenEngineResponse } from "@/lib/types/aiden"

// Mock responses for different types of interactions
const getMockResponse = (request: AidenEngineRequest): AidenEngineResponse => {
  const { type, content } = request

  // System trigger for welcome message
  if (type === "system_trigger" && content.includes("Initialize welcome")) {
    return {
      success: true,
      message:
        "Hello! I'm Aiden, your AI executive assistant. I'm here to help you with strategic insights, data analysis, and executive decision-making. How can I assist you today?",
      followUpPrompts: [
        "Show me my dashboard overview",
        "Analyze recent performance metrics",
        "Help me prioritize my tasks",
        "Generate a strategic report",
      ],
    }
  }

  // Dashboard-related queries
  if (content.toLowerCase().includes("dashboard") || content.toLowerCase().includes("overview")) {
    return {
      success: true,
      message:
        "Based on your current dashboard, I can see strong performance across key metrics. Your strategic objectives are 80% complete, operational efficiency is at 94%, and team performance is solid at 87%. Would you like me to dive deeper into any specific area?",
      followUpPrompts: [
        "Analyze strategic objectives",
        "Review operational efficiency",
        "Examine team performance trends",
        "Show upcoming priorities",
      ],
    }
  }

  // Performance analysis
  if (content.toLowerCase().includes("performance") || content.toLowerCase().includes("metrics")) {
    return {
      success: true,
      message:
        "Your performance metrics show positive trends across all key areas. Revenue growth is up 12% this quarter, customer satisfaction has improved by 8%, and operational costs have decreased by 5%. The cybersecurity score remains excellent at 98%.",
      followUpPrompts: [
        "Deep dive into revenue trends",
        "Review customer satisfaction data",
        "Analyze cost optimization",
        "Security assessment details",
      ],
    }
  }

  // Task prioritization
  if (content.toLowerCase().includes("task") || content.toLowerCase().includes("priorit")) {
    return {
      success: true,
      message:
        "Based on your current workload and strategic goals, I recommend prioritizing: 1) Budget proposal reviews (due today), 2) Strategic planning session preparation, 3) Department performance reviews. These align with your Q4 objectives and have the highest impact potential.",
      followUpPrompts: [
        "Schedule budget review time",
        "Prepare strategic planning agenda",
        "Set up performance review meetings",
        "Review Q4 objectives",
      ],
    }
  }

  // Report generation
  if (content.toLowerCase().includes("report") || content.toLowerCase().includes("strategic")) {
    return {
      success: true,
      message:
        "I can generate a comprehensive strategic report covering your key performance indicators, market position, operational efficiency, and growth opportunities. The report will include executive summary, detailed analytics, and actionable recommendations.",
      followUpPrompts: [
        "Generate executive summary",
        "Include market analysis",
        "Add operational insights",
        "Create action plan",
      ],
    }
  }

  // General business queries
  if (content.toLowerCase().includes("business") || content.toLowerCase().includes("strategy")) {
    return {
      success: true,
      message:
        "From a strategic perspective, your organization is well-positioned for growth. Key strengths include strong operational efficiency, robust security posture, and engaged team performance. I recommend focusing on digital transformation initiatives and market expansion opportunities.",
      followUpPrompts: [
        "Explore digital transformation",
        "Analyze market opportunities",
        "Review competitive landscape",
        "Assess growth strategies",
      ],
    }
  }

  // Default response for general queries
  return {
    success: true,
    message:
      "I understand your request and I'm here to help. As your AI executive assistant, I can provide insights on strategic planning, performance analysis, operational efficiency, and decision support. What specific area would you like to explore?",
    followUpPrompts: [
      "Strategic planning assistance",
      "Performance data analysis",
      "Operational insights",
      "Decision support tools",
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AidenEngineRequest = await request.json()

    // Validate request
    if (!body.type || !body.content || !body.context) {
      return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 })
    }

    // Simulate processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate mock response
    const response = getMockResponse(body)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in Aiden orchestrate API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}
