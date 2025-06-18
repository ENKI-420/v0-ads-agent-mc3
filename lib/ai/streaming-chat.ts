import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    sources?: string[]
    compliance?: string[]
    capabilities?: string[]
  }
}

export interface StreamingChatOptions {
  role: string
  sessionId?: string
  complianceMode?: "HIPAA" | "SOC2" | "GDPR" | "DEFENSE"
  capabilities?: string[]
}

const rolePrompts = {
  enterprise: `You are the ADSTech Enterprise AI Assistant, a sophisticated AI copilot specialized in business intelligence, process optimization, and enterprise solutions. You have expertise in:

- Strategic business analysis and decision support
- Workflow automation and process optimization  
- Data analytics and business intelligence
- Compliance management (SOC2, GDPR)
- Enterprise integrations and API management
- Risk assessment and mitigation strategies

Maintain a professional, authoritative tone while being helpful and insightful. Always consider security and compliance implications in your responses. Keep responses concise but comprehensive.`,

  clinician: `You are the ADSTech Clinical AI Assistant, specialized in medical decision support with HIPAA compliance. You provide evidence-based clinical guidance while maintaining strict patient privacy and regulatory compliance.`,

  attorney: `You are the ADSTech Legal AI Assistant, specialized in legal research, case analysis, and regulatory compliance. You provide accurate legal insights while maintaining attorney-client privilege and professional ethics.`,

  analyst: `You are the ADSTech Defense Intelligence Assistant, specialized in threat assessment, geospatial analysis, and strategic intelligence with ITAR compliance and classified data handling protocols.`,

  patient: `You are the ADSTech Personal Health Assistant, helping patients understand their health information, track symptoms, and communicate effectively with their care team while maintaining HIPAA compliance.`,
}

export async function createStreamingChat(messages: ChatMessage[], options: StreamingChatOptions) {
  const systemPrompt = rolePrompts[options.role as keyof typeof rolePrompts] || rolePrompts.enterprise

  const complianceInstructions = {
    HIPAA:
      "Ensure all responses comply with HIPAA regulations. Never request or process PHI without proper authorization.",
    SOC2: "Maintain SOC2 compliance standards. Ensure data security and access controls in all recommendations.",
    GDPR: "Follow GDPR data protection principles. Respect user privacy and data minimization requirements.",
    DEFENSE:
      "Adhere to ITAR and defense security protocols. Handle all information with appropriate classification levels.",
  }

  const complianceNote = options.complianceMode
    ? `\n\nCOMPLIANCE MODE: ${options.complianceMode} - ${complianceInstructions[options.complianceMode]}`
    : ""

  try {
    const result = await streamText({
      model: openai("gpt-4-turbo-preview"),
      system: systemPrompt + complianceNote,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result
  } catch (error) {
    console.error("Streaming chat error:", error)
    throw new Error("Failed to create streaming chat response")
  }
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function createSystemMessage(role: string, capabilities: string[]): ChatMessage {
  const capabilityList = capabilities.length > 0 ? `\n\nAvailable capabilities: ${capabilities.join(", ")}` : ""

  return {
    id: generateMessageId(),
    role: "system",
    content: `Welcome to ADSTech AI Platform. I'm your ${role} AI assistant, ready to help with domain-specific expertise and enterprise-grade security.${capabilityList}`,
    timestamp: new Date(),
    metadata: {
      confidence: 100,
      compliance: ["SOC2", "GDPR"],
      capabilities,
    },
  }
}
