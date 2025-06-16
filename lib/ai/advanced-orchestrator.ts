import { domainModelManager } from "./domain-models"
import { promptManager } from "./prompt-templates"
import { complianceManager } from "../compliance"
import { vectorMemory } from "../vector-memory"

interface AIRequest {
  role: string
  task: string
  query: string
  context?: any
  sessionId?: string
  complianceMode: string[]
  userId: string
}

interface AIResponse {
  response: string
  confidence: number
  sources: any[]
  complianceStatus: string
  modelUsed: string
  processingTime: number
  recommendations?: string[]
}

export class AdvancedAIOrchestrator {
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()

    try {
      // 1. Compliance validation
      const complianceValid = complianceManager.validateDataAccess(request.role, request.task, request.complianceMode)

      if (!complianceValid) {
        throw new Error("Access denied: Insufficient compliance permissions")
      }

      // 2. Select optimal domain model
      const model = domainModelManager.selectOptimalModel(request.role, request.task, request.complianceMode)

      if (!model) {
        throw new Error("No suitable AI model available for this request")
      }

      // 3. Retrieve relevant context from vector memory
      const vectorContext = await vectorMemory.search({
        query: request.query,
        role: request.role,
        compliance: request.complianceMode,
        limit: 5,
      })

      // 4. Generate prompts
      const systemPrompt = promptManager.generateSystemPrompt(request.role, request.complianceMode)

      const taskPrompt = promptManager.generateTaskPrompt(request.role, request.task, {
        ...request.context,
        vectorContext,
      })

      const fullPrompt = `${systemPrompt}\n\nTASK: ${taskPrompt}\n\nQUERY: ${request.query}`

      // 5. Invoke AI model
      const aiResponse = await domainModelManager.invokeModel(model, fullPrompt, {
        vectorContext,
        userContext: request.context,
      })

      // 6. Post-process response
      const processedResponse = await this.postProcessResponse(aiResponse, request.role, request.complianceMode)

      // 7. Generate recommendations
      const recommendations = await this.generateRecommendations(request, processedResponse, vectorContext)

      // 8. Audit logging
      complianceManager.auditAccess(
        request.userId,
        `AI_QUERY_${request.task}`,
        `model:${model.id}`,
        request.complianceMode,
      )

      const processingTime = Date.now() - startTime

      return {
        response: processedResponse,
        confidence: this.calculateConfidence(model, vectorContext),
        sources: vectorContext.map((ctx) => ({
          id: ctx.id,
          title: ctx.title,
          relevance: ctx.score,
          snippet: ctx.content.substring(0, 200),
        })),
        complianceStatus: "COMPLIANT",
        modelUsed: model.name,
        processingTime,
        recommendations,
      }
    } catch (error) {
      console.error("AI Orchestrator Error:", error)

      return {
        response:
          "I apologize, but I'm unable to process your request at this time. Please try again or contact support.",
        confidence: 0,
        sources: [],
        complianceStatus: "ERROR",
        modelUsed: "none",
        processingTime: Date.now() - startTime,
      }
    }
  }

  private async postProcessResponse(response: string, role: string, complianceMode: string[]): Promise<string> {
    // Apply role-specific formatting
    let processedResponse = response

    // Add compliance disclaimers
    if (complianceMode.includes("HIPAA") && role === "clinician") {
      processedResponse +=
        "\n\n*This information is for clinical decision support only. Always use your professional judgment and follow institutional protocols.*"
    }

    if (complianceMode.includes("ABA") && role === "attorney") {
      processedResponse +=
        "\n\n*This analysis is for informational purposes only and does not constitute legal advice. Consult with qualified legal counsel for specific legal matters.*"
    }

    // Remove any potential sensitive information
    processedResponse = this.sanitizeResponse(processedResponse, complianceMode)

    return processedResponse
  }

  private sanitizeResponse(response: string, complianceMode: string[]): string {
    let sanitized = response

    // Remove potential PHI patterns
    if (complianceMode.includes("HIPAA")) {
      sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN-REDACTED]")
      sanitized = sanitized.replace(/\b\d{10,}\b/g, "[ID-REDACTED]")
    }

    // Remove potential classified information markers
    if (complianceMode.includes("ITAR")) {
      sanitized = sanitized.replace(/\b(SECRET|TOP SECRET|CONFIDENTIAL)\b/gi, "[CLASSIFIED]")
    }

    return sanitized
  }

  private calculateConfidence(model: any, vectorContext: any[]): number {
    // Base confidence on model accuracy
    let confidence = model.accuracy

    // Adjust based on context quality
    if (vectorContext.length > 0) {
      const avgRelevance = vectorContext.reduce((sum, ctx) => sum + ctx.score, 0) / vectorContext.length
      confidence = confidence * (0.7 + 0.3 * avgRelevance)
    } else {
      confidence = confidence * 0.8 // Lower confidence without context
    }

    return Math.round(confidence * 100) / 100
  }

  private async generateRecommendations(request: AIRequest, response: string, vectorContext: any[]): Promise<string[]> {
    const recommendations: string[] = []

    // Role-specific recommendations
    switch (request.role) {
      case "clinician":
        recommendations.push("Consider ordering additional diagnostic tests if clinically indicated")
        recommendations.push("Review patient's medication list for potential interactions")
        recommendations.push("Schedule appropriate follow-up based on clinical findings")
        break

      case "attorney":
        recommendations.push("Review relevant case law and recent legal developments")
        recommendations.push("Consider jurisdictional variations in applicable law")
        recommendations.push("Document all legal research and analysis for case file")
        break

      case "analyst":
        recommendations.push("Validate findings with additional intelligence sources")
        recommendations.push("Consider alternative hypotheses and scenarios")
        recommendations.push("Update threat assessment based on latest intelligence")
        break

      case "patient":
        recommendations.push("Discuss these findings with your healthcare provider")
        recommendations.push("Keep a record of your symptoms and questions")
        recommendations.push("Follow prescribed treatment plans and medication schedules")
        break

      case "enterprise":
        recommendations.push("Conduct cost-benefit analysis of proposed solutions")
        recommendations.push("Consider implementation timeline and resource requirements")
        recommendations.push("Monitor key performance indicators and metrics")
        break
    }

    // Context-based recommendations
    if (vectorContext.length > 0) {
      recommendations.push("Review related documents and resources for additional context")
    }

    return recommendations.slice(0, 3) // Limit to top 3 recommendations
  }

  async streamResponse(request: AIRequest): Promise<AsyncGenerator<string, void, unknown>> {
    // Implementation for streaming responses
    async function* streamGenerator() {
      const response = await this.processRequest(request)
      const words = response.response.split(" ")

      for (const word of words) {
        yield word + " "
        await new Promise((resolve) => setTimeout(resolve, 50)) // Simulate streaming delay
      }
    }

    return streamGenerator.call(this)
  }
}

export const advancedAIOrchestrator = new AdvancedAIOrchestrator()
