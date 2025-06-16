interface DomainModel {
  id: string
  name: string
  description: string
  specialization: string[]
  accuracy: number
  complianceLevel: string[]
  modelEndpoint: string
  contextWindow: number
  maxTokens: number
}

export const domainModels: Record<string, DomainModel[]> = {
  oncology: [
    {
      id: "biogpt-oncology",
      name: "BioGPT Oncology Specialist",
      description: "Expert-tuned model for cancer diagnosis, treatment protocols, and clinical decision support",
      specialization: ["tumor_analysis", "treatment_planning", "drug_interactions", "clinical_trials"],
      accuracy: 0.94,
      complianceLevel: ["HIPAA", "FDA"],
      modelEndpoint: "/api/ai/biogpt",
      contextWindow: 8192,
      maxTokens: 2048,
    },
    {
      id: "pathology-vision",
      name: "PathologyVision AI",
      description: "Computer vision model for histopathology image analysis and cancer detection",
      specialization: ["histopathology", "image_analysis", "cancer_detection", "biomarker_identification"],
      accuracy: 0.96,
      complianceLevel: ["HIPAA", "CAP"],
      modelEndpoint: "/api/ai/pathology-vision",
      contextWindow: 4096,
      maxTokens: 1024,
    },
  ],
  defense: [
    {
      id: "intel-analyst",
      name: "Defense Intelligence Analyst",
      description: "Classified-ready AI for threat assessment, geospatial analysis, and strategic intelligence",
      specialization: ["threat_assessment", "geospatial_intel", "pattern_recognition", "risk_modeling"],
      accuracy: 0.92,
      complianceLevel: ["ITAR", "NIST", "FedRAMP"],
      modelEndpoint: "/api/ai/intel-analyst",
      contextWindow: 16384,
      maxTokens: 4096,
    },
    {
      id: "cyber-sentinel",
      name: "Cyber Threat Sentinel",
      description: "Advanced cybersecurity AI for threat detection and incident response",
      specialization: ["threat_detection", "malware_analysis", "incident_response", "vulnerability_assessment"],
      accuracy: 0.95,
      complianceLevel: ["NIST", "ISO27001"],
      modelEndpoint: "/api/ai/cyber-sentinel",
      contextWindow: 12288,
      maxTokens: 3072,
    },
  ],
  legal: [
    {
      id: "legal-counsel",
      name: "AI Legal Counsel",
      description: "Expert legal AI for case law research, contract analysis, and compliance review",
      specialization: ["case_law_research", "contract_analysis", "compliance_review", "legal_writing"],
      accuracy: 0.91,
      complianceLevel: ["ABA", "GDPR", "SOX"],
      modelEndpoint: "/api/ai/legal-counsel",
      contextWindow: 32768,
      maxTokens: 8192,
    },
    {
      id: "contract-analyzer",
      name: "Contract Intelligence",
      description: "Specialized AI for contract review, risk assessment, and clause optimization",
      specialization: ["contract_review", "risk_assessment", "clause_analysis", "negotiation_support"],
      accuracy: 0.93,
      complianceLevel: ["ABA", "SOC2"],
      modelEndpoint: "/api/ai/contract-analyzer",
      contextWindow: 16384,
      maxTokens: 4096,
    },
  ],
  enterprise: [
    {
      id: "business-intelligence",
      name: "Enterprise Business Intelligence",
      description: "AI-powered business analytics, process optimization, and strategic insights",
      specialization: ["business_analytics", "process_optimization", "financial_analysis", "market_intelligence"],
      accuracy: 0.89,
      complianceLevel: ["SOC2", "GDPR", "SOX"],
      modelEndpoint: "/api/ai/business-intelligence",
      contextWindow: 8192,
      maxTokens: 2048,
    },
  ],
}

export class DomainModelManager {
  private activeModels: Map<string, DomainModel> = new Map()

  getModelsForRole(role: string): DomainModel[] {
    const roleModelMap: Record<string, string> = {
      clinician: "oncology",
      patient: "oncology",
      attorney: "legal",
      analyst: "defense",
      enterprise: "enterprise",
    }

    const domain = roleModelMap[role]
    return domain ? domainModels[domain] || [] : []
  }

  selectOptimalModel(role: string, task: string, complianceRequirements: string[]): DomainModel | null {
    const availableModels = this.getModelsForRole(role)

    // Filter by compliance requirements
    const compliantModels = availableModels.filter((model) =>
      complianceRequirements.every((req) => model.complianceLevel.includes(req)),
    )

    if (compliantModels.length === 0) return null

    // Select model with highest accuracy for the task
    return compliantModels.reduce((best, current) => {
      const currentTaskMatch = current.specialization.some((spec) =>
        task.toLowerCase().includes(spec.replace("_", " ")),
      )
      const bestTaskMatch = best.specialization.some((spec) => task.toLowerCase().includes(spec.replace("_", " ")))

      if (currentTaskMatch && !bestTaskMatch) return current
      if (!currentTaskMatch && bestTaskMatch) return best

      return current.accuracy > best.accuracy ? current : best
    })
  }

  async invokeModel(model: DomainModel, prompt: string, context: any): Promise<string> {
    const response = await fetch(model.modelEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model.id,
        prompt,
        context,
        max_tokens: model.maxTokens,
        temperature: 0.1, // Low temperature for professional accuracy
      }),
    })

    const result = await response.json()
    return result.response || result.choices?.[0]?.message?.content || ""
  }
}

export const domainModelManager = new DomainModelManager()
