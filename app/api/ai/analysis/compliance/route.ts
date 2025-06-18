import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"

const COMPLIANCE_RULES = {
  HIPAA: {
    name: "Health Insurance Portability and Accountability Act",
    rules: [
      "No sharing of patient names or identifiers",
      "No discussion of specific medical conditions without consent",
      "No sharing of treatment details",
      "Proper authorization required for health information disclosure",
    ],
    keywords: ["patient", "medical", "health", "treatment", "diagnosis", "medication"],
  },
  SOC2: {
    name: "Service Organization Control 2",
    rules: [
      "No sharing of customer data without authorization",
      "Proper access controls must be maintained",
      "Security incidents must be reported",
      "Data processing must follow established procedures",
    ],
    keywords: ["customer data", "access", "security", "breach", "unauthorized"],
  },
  GDPR: {
    name: "General Data Protection Regulation",
    rules: [
      "No processing of personal data without consent",
      "Right to be forgotten must be respected",
      "Data minimization principles must be followed",
      "Cross-border data transfers must be compliant",
    ],
    keywords: ["personal data", "consent", "privacy", "data subject", "processing"],
  },
  ITAR: {
    name: "International Traffic in Arms Regulations",
    rules: [
      "No sharing of defense articles or technical data",
      "Export controls must be followed",
      "Foreign person access must be controlled",
      "Proper classification of technical data required",
    ],
    keywords: ["defense", "technical data", "export", "foreign person", "classified"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { text, speakerId, timestamp, standards } = await request.json()

    if (!text || !standards || standards.length === 0) {
      return NextResponse.json({ error: "Text and compliance standards required" }, { status: 400 })
    }

    const flags = []

    for (const standard of standards) {
      const complianceRules = COMPLIANCE_RULES[standard as keyof typeof COMPLIANCE_RULES]
      if (!complianceRules) continue

      const compliancePrompt = `Analyze the following text for ${complianceRules.name} (${standard}) compliance violations.

Rules to check:
${complianceRules.rules.map((rule, i) => `${i + 1}. ${rule}`).join("\n")}

Text to analyze: "${text}"

Look for potential violations and respond in JSON format:
{
  "violations": [
    {
      "type": "${standard}",
      "severity": "info|warning|violation|critical",
      "description": "description of the issue",
      "recommendation": "how to address the issue",
      "confidence": number (0-1),
      "autoResolved": boolean
    }
  ]
}`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a compliance monitoring AI expert in ${complianceRules.name}. Identify potential violations with high accuracy and provide actionable recommendations.`,
          },
          {
            role: "user",
            content: compliancePrompt,
          },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      })

      const analysis = JSON.parse(response.choices[0]?.message?.content || "{}")

      if (analysis.violations) {
        flags.push(...analysis.violations)
      }
    }

    // Add additional metadata
    const result = {
      flags: flags.map((flag) => ({
        ...flag,
        timestamp,
        speakerId,
        id: `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Compliance monitoring error:", error)
    return NextResponse.json({ error: "Compliance monitoring failed", details: error.message }, { status: 500 })
  }
}
