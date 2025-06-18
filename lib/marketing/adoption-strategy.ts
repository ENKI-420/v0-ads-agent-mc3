export interface AdoptionStrategy {
  sector: "healthcare" | "legal" | "defense" | "enterprise"
  targetAudience: {
    primary: string[]
    secondary: string[]
    influencers: string[]
  }
  channels: {
    digital: string[]
    traditional: string[]
    partnerships: string[]
    events: string[]
  }
  messaging: {
    awareness: string
    consideration: string
    decision: string
    retention: string
  }
  tactics: {
    freemium: boolean
    trial: {
      duration: number
      features: string[]
    }
    demos: {
      type: "live" | "self-service" | "both"
      duration: number
    }
    contentMarketing: string[]
    thoughtLeadership: string[]
  }
  timeline: {
    phase: string
    duration: string
    objectives: string[]
    metrics: string[]
  }[]
  budget: {
    total: number
    allocation: Record<string, number>
  }
}

export class AdoptionStrategyEngine {
  private strategies: Map<string, AdoptionStrategy> = new Map()

  constructor() {
    this.initializeStrategies()
  }

  private initializeStrategies(): void {
    // Healthcare Adoption Strategy
    this.strategies.set("healthcare", {
      sector: "healthcare",
      targetAudience: {
        primary: ["Chief Medical Officers", "Practice Managers", "Telemedicine Directors"],
        secondary: ["IT Directors", "Compliance Officers", "Department Heads"],
        influencers: ["Medical Association Leaders", "Healthcare Consultants", "EHR Vendors"],
      },
      channels: {
        digital: [
          "Healthcare IT publications",
          "Medical association websites",
          "LinkedIn healthcare groups",
          "Google Ads (healthcare keywords)",
          "Healthcare podcasts",
        ],
        traditional: ["Medical journals", "Healthcare conferences", "Direct mail to practices"],
        partnerships: ["EHR vendors", "Healthcare consultants", "Medical device companies"],
        events: ["HIMSS", "ATA Annual Conference", "Regional medical conferences"],
      },
      messaging: {
        awareness: "Discover how AI is transforming patient care and clinical outcomes",
        consideration: "See how leading healthcare organizations improve efficiency with AI-powered telemedicine",
        decision: "Join 500+ healthcare providers already using Agent M3C to enhance patient care",
        retention: "Maximize your investment with advanced AI features and continuous platform updates",
      },
      tactics: {
        freemium: false,
        trial: {
          duration: 30,
          features: ["Basic telemedicine", "HIPAA compliance", "AI transcription", "Basic analytics"],
        },
        demos: {
          type: "both",
          duration: 45,
        },
        contentMarketing: [
          "HIPAA compliance guides",
          "Telemedicine best practices",
          "AI in healthcare whitepapers",
          "ROI calculators",
        ],
        thoughtLeadership: [
          "Healthcare AI conferences",
          "Medical journal articles",
          "Podcast appearances",
          "Webinar series",
        ],
      },
      timeline: [
        {
          phase: "Market Education",
          duration: "3 months",
          objectives: ["Build awareness", "Establish thought leadership", "Generate leads"],
          metrics: ["Website traffic", "Content engagement", "Lead generation"],
        },
        {
          phase: "Pilot Programs",
          duration: "6 months",
          objectives: ["Secure pilot customers", "Gather testimonials", "Refine product"],
          metrics: ["Pilot conversions", "Customer satisfaction", "Feature usage"],
        },
        {
          phase: "Scale Adoption",
          duration: "12 months",
          objectives: ["Accelerate sales", "Expand market share", "Build partnerships"],
          metrics: ["Revenue growth", "Market penetration", "Partner acquisitions"],
        },
      ],
      budget: {
        total: 2500000,
        allocation: {
          "digital-marketing": 40,
          "events-conferences": 25,
          "content-creation": 15,
          partnerships: 10,
          "sales-enablement": 10,
        },
      },
    })

    // Legal Adoption Strategy
    this.strategies.set("legal", {
      sector: "legal",
      targetAudience: {
        primary: ["Managing Partners", "General Counsel", "Practice Administrators"],
        secondary: ["IT Directors", "Compliance Officers", "Senior Associates"],
        influencers: ["Bar Association Leaders", "Legal Technology Consultants", "Law School Professors"],
      },
      channels: {
        digital: [
          "Legal technology publications",
          "Bar association websites",
          "LinkedIn legal groups",
          "Legal podcasts",
          "Law firm blogs",
        ],
        traditional: ["Legal journals", "Bar publications", "Direct outreach to firms"],
        partnerships: ["Legal technology vendors", "Practice management consultants", "Bar associations"],
        events: ["ABA TECHSHOW", "ILTA Conference", "Regional bar events"],
      },
      messaging: {
        awareness: "Transform legal practice with AI-powered collaboration and document analysis",
        consideration: "See how top law firms accelerate case work while maintaining strict confidentiality",
        decision: "Join leading legal professionals using Agent M3C to win more cases efficiently",
        retention: "Stay ahead with cutting-edge legal AI features and continuous security updates",
      },
      tactics: {
        freemium: false,
        trial: {
          duration: 21,
          features: ["Secure collaboration", "Document sharing", "Basic AI analysis", "Audit trails"],
        },
        demos: {
          type: "live",
          duration: 60,
        },
        contentMarketing: [
          "Legal technology guides",
          "Privilege protection best practices",
          "AI in legal practice whitepapers",
          "Efficiency calculators",
        ],
        thoughtLeadership: [
          "Legal technology conferences",
          "Bar journal articles",
          "Legal podcast appearances",
          "CLE presentations",
        ],
      },
      timeline: [
        {
          phase: "Relationship Building",
          duration: "4 months",
          objectives: ["Build trust", "Establish credibility", "Generate qualified leads"],
          metrics: ["Engagement rates", "Demo requests", "Referral generation"],
        },
        {
          phase: "Proof of Concept",
          duration: "6 months",
          objectives: ["Secure early adopters", "Develop case studies", "Refine legal features"],
          metrics: ["Trial conversions", "User satisfaction", "Feature adoption"],
        },
        {
          phase: "Market Expansion",
          duration: "18 months",
          objectives: ["Scale to mid-market", "Build channel partnerships", "Expand geographically"],
          metrics: ["Revenue growth", "Market share", "Geographic expansion"],
        },
      ],
      budget: {
        total: 1800000,
        allocation: {
          "relationship-building": 35,
          "events-conferences": 25,
          "content-creation": 20,
          partnerships: 10,
          "digital-marketing": 10,
        },
      },
    })

    // Defense Adoption Strategy
    this.strategies.set("defense", {
      sector: "defense",
      targetAudience: {
        primary: ["Program Managers", "CISOs", "Contracting Officers"],
        secondary: ["Mission Commanders", "Intelligence Directors", "IT Specialists"],
        influencers: ["Defense Contractors", "Government Technology Leaders", "Security Consultants"],
      },
      channels: {
        digital: [
          "Defense technology publications",
          "Government contractor websites",
          "Federal IT communities",
          "Defense industry forums",
        ],
        traditional: ["Defense journals", "Government publications", "Direct government outreach"],
        partnerships: ["Prime contractors", "System integrators", "Security consultants"],
        events: ["AFCEA", "NDIA conferences", "Government technology summits"],
      },
      messaging: {
        awareness: "Secure, ITAR-compliant collaboration platform designed for mission-critical operations",
        consideration: "Trusted by defense agencies for secure intelligence sharing and mission planning",
        decision: "Deploy the only AI-powered collaboration platform certified for classified environments",
        retention: "Maintain operational superiority with continuous security updates and new capabilities",
      },
      tactics: {
        freemium: false,
        trial: {
          duration: 60,
          features: ["Secure collaboration", "Basic classification handling", "Audit trails", "Compliance monitoring"],
        },
        demos: {
          type: "live",
          duration: 90,
        },
        contentMarketing: [
          "ITAR compliance guides",
          "Secure collaboration best practices",
          "Defense AI whitepapers",
          "Security assessment tools",
        ],
        thoughtLeadership: [
          "Defense technology conferences",
          "Government publications",
          "Security summit presentations",
          "Policy roundtables",
        ],
      },
      timeline: [
        {
          phase: "Certification & Compliance",
          duration: "6 months",
          objectives: ["Achieve security certifications", "Build government relationships", "Establish credibility"],
          metrics: ["Certifications obtained", "Government contacts", "Security assessments"],
        },
        {
          phase: "Pilot Deployments",
          duration: "12 months",
          objectives: ["Secure pilot contracts", "Demonstrate value", "Build references"],
          metrics: ["Contract awards", "Performance metrics", "User feedback"],
        },
        {
          phase: "Program Expansion",
          duration: "24 months",
          objectives: ["Scale to major programs", "Expand agency adoption", "Build prime partnerships"],
          metrics: ["Contract value", "Agency adoption", "Partner relationships"],
        },
      ],
      budget: {
        total: 3200000,
        allocation: {
          "certification-compliance": 30,
          "relationship-building": 25,
          "events-conferences": 20,
          partnerships: 15,
          "content-creation": 10,
        },
      },
    })

    // Enterprise Adoption Strategy
    this.strategies.set("enterprise", {
      sector: "enterprise",
      targetAudience: {
        primary: ["CIOs", "CTOs", "HR Directors"],
        secondary: ["Operations Managers", "Team Leaders", "IT Managers"],
        influencers: ["Technology Analysts", "Business Consultants", "Industry Thought Leaders"],
      },
      channels: {
        digital: [
          "Business technology publications",
          "LinkedIn business groups",
          "Google Ads (productivity keywords)",
          "Business podcasts",
          "Industry blogs",
        ],
        traditional: ["Business magazines", "Trade publications", "Direct sales outreach"],
        partnerships: ["Technology integrators", "Business consultants", "Software vendors"],
        events: ["Enterprise tech conferences", "HR summits", "Business productivity events"],
      },
      messaging: {
        awareness: "AI-powered collaboration that transforms how teams work and make decisions",
        consideration: "See how leading companies boost productivity and engagement with intelligent meetings",
        decision: "Join thousands of teams already using Agent M3C to achieve better business outcomes",
        retention: "Maximize team performance with advanced analytics and continuous AI improvements",
      },
      tactics: {
        freemium: true,
        trial: {
          duration: 14,
          features: ["Basic collaboration", "AI insights", "Meeting analytics", "Action item tracking"],
        },
        demos: {
          type: "both",
          duration: 30,
        },
        contentMarketing: [
          "Productivity guides",
          "Meeting best practices",
          "AI in business whitepapers",
          "ROI calculators",
        ],
        thoughtLeadership: ["Business conferences", "Industry publications", "Podcast appearances", "Webinar series"],
      },
      timeline: [
        {
          phase: "Product-Market Fit",
          duration: "2 months",
          objectives: ["Validate value proposition", "Optimize user experience", "Build initial traction"],
          metrics: ["User engagement", "Feature adoption", "Customer feedback"],
        },
        {
          phase: "Growth Acceleration",
          duration: "6 months",
          objectives: ["Scale user acquisition", "Improve conversion rates", "Build brand awareness"],
          metrics: ["User growth", "Conversion rates", "Brand recognition"],
        },
        {
          phase: "Market Leadership",
          duration: "12 months",
          objectives: ["Establish market position", "Expand enterprise accounts", "Build ecosystem"],
          metrics: ["Market share", "Enterprise revenue", "Partner ecosystem"],
        },
      ],
      budget: {
        total: 1500000,
        allocation: {
          "digital-marketing": 45,
          "content-creation": 20,
          "events-conferences": 15,
          partnerships: 10,
          "sales-enablement": 10,
        },
      },
    })
  }

  getAdoptionStrategy(sector: string): AdoptionStrategy | undefined {
    return this.strategies.get(sector)
  }

  getAllAdoptionStrategies(): AdoptionStrategy[] {
    return Array.from(this.strategies.values())
  }

  calculateROI(
    sector: string,
    investment: number,
    timeframe: number,
  ): {
    expectedRevenue: number
    customerAcquisitionCost: number
    lifetimeValue: number
    paybackPeriod: number
    roi: number
  } {
    const strategy = this.strategies.get(sector)
    if (!strategy) {
      return { expectedRevenue: 0, customerAcquisitionCost: 0, lifetimeValue: 0, paybackPeriod: 0, roi: 0 }
    }

    // Sector-specific metrics
    const metrics = {
      healthcare: { conversionRate: 0.15, avgDealSize: 85000, churnRate: 0.08 },
      legal: { conversionRate: 0.12, avgDealSize: 45000, churnRate: 0.12 },
      defense: { conversionRate: 0.08, avgDealSize: 250000, churnRate: 0.05 },
      enterprise: { conversionRate: 0.25, avgDealSize: 25000, churnRate: 0.15 },
    }

    const sectorMetrics = metrics[sector as keyof typeof metrics]
    const leads = investment / 150 // Assume $150 cost per lead
    const customers = leads * sectorMetrics.conversionRate
    const expectedRevenue = customers * sectorMetrics.avgDealSize
    const customerAcquisitionCost = investment / customers
    const lifetimeValue = sectorMetrics.avgDealSize / sectorMetrics.churnRate
    const paybackPeriod = customerAcquisitionCost / (sectorMetrics.avgDealSize / 12)
    const roi = (expectedRevenue - investment) / investment

    return {
      expectedRevenue,
      customerAcquisitionCost,
      lifetimeValue,
      paybackPeriod,
      roi,
    }
  }

  generateGoToMarketPlan(sector: string): {
    phases: Array<{
      name: string
      duration: string
      objectives: string[]
      tactics: string[]
      budget: number
      metrics: string[]
    }>
    totalTimeline: string
    totalBudget: number
    keyMilestones: string[]
  } {
    const strategy = this.strategies.get(sector)
    if (!strategy) {
      return { phases: [], totalTimeline: "", totalBudget: 0, keyMilestones: [] }
    }

    return {
      phases: strategy.timeline.map((phase, index) => ({
        name: phase.phase,
        duration: phase.duration,
        objectives: phase.objectives,
        tactics: this.getTacticsForPhase(sector, index),
        budget: strategy.budget.total / strategy.timeline.length,
        metrics: phase.metrics,
      })),
      totalTimeline:
        strategy.timeline.reduce((total, phase) => {
          const months = Number.parseInt(phase.duration.split(" ")[0])
          return total + months
        }, 0) + " months",
      totalBudget: strategy.budget.total,
      keyMilestones: this.getKeyMilestones(sector),
    }
  }

  private getTacticsForPhase(sector: string, phaseIndex: number): string[] {
    const commonTactics = [
      ["Content marketing", "Thought leadership", "Digital advertising"],
      ["Pilot programs", "Case studies", "Partnership development"],
      ["Sales acceleration", "Market expansion", "Customer success"],
    ]

    return commonTactics[phaseIndex] || []
  }

  private getKeyMilestones(sector: string): string[] {
    const milestones = {
      healthcare: [
        "HIPAA compliance certification",
        "First healthcare pilot customer",
        "10 healthcare organizations onboarded",
        "EHR integration partnerships",
        "100 healthcare customers milestone",
      ],
      legal: [
        "First law firm customer",
        "Bar association partnership",
        "Legal technology award",
        "50 law firms onboarded",
        "Major legal enterprise customer",
      ],
      defense: [
        "Security certifications obtained",
        "First government contract",
        "Prime contractor partnership",
        "Classified environment deployment",
        "Major defense program award",
      ],
      enterprise: [
        "Product-market fit validation",
        "1000 active users",
        "First enterprise customer",
        "10,000 active users",
        "Market leadership position",
      ],
    }

    return milestones[sector as keyof typeof milestones] || []
  }
}

export const adoptionStrategy = new AdoptionStrategyEngine()
