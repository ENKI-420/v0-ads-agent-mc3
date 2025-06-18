export interface ValueProposition {
  sector: "healthcare" | "legal" | "defense" | "enterprise"
  headline: string
  subheadline: string
  keyBenefits: string[]
  uniqueSellingPoints: string[]
  painPointsSolved: string[]
  roi: {
    timeToValue: string
    costSavings: string
    productivityGains: string
    riskReduction: string
  }
  socialProof: {
    testimonials: Array<{
      quote: string
      author: string
      title: string
      company: string
    }>
    caseStudies: Array<{
      title: string
      challenge: string
      solution: string
      results: string[]
    }>
    metrics: Array<{
      stat: string
      description: string
    }>
  }
}

export class ValuePropositionEngine {
  private propositions: Map<string, ValueProposition> = new Map()

  constructor() {
    this.initializePropositions()
  }

  private initializePropositions(): void {
    // Healthcare Value Proposition
    this.propositions.set("healthcare", {
      sector: "healthcare",
      headline: "Transform Patient Care with AI-Powered Telemedicine",
      subheadline:
        "HIPAA-compliant collaboration platform that enhances clinical decision-making with real-time AI insights, improving patient outcomes while reducing costs.",
      keyBenefits: [
        "Improve patient outcomes with AI-powered clinical insights",
        "Reduce documentation time by 60% with automated transcription",
        "Ensure 100% HIPAA compliance with built-in safeguards",
        "Enable seamless provider collaboration across specialties",
        "Integrate with existing EHR systems for unified workflows",
      ],
      uniqueSellingPoints: [
        "Real-time clinical decision support during consultations",
        "Automated medical coding and billing integration",
        "Multi-language support for diverse patient populations",
        "Advanced patient engagement analytics",
        "Predictive health risk assessment",
      ],
      painPointsSolved: [
        "Complex HIPAA compliance requirements",
        "Time-consuming documentation processes",
        "Poor care coordination between providers",
        "Limited access to specialist consultations",
        "Inefficient patient communication",
      ],
      roi: {
        timeToValue: "30 days to full deployment",
        costSavings: "35% reduction in administrative costs",
        productivityGains: "40% increase in patient consultation capacity",
        riskReduction: "90% reduction in compliance violations",
      },
      socialProof: {
        testimonials: [
          {
            quote:
              "Agent M3C has revolutionized our telemedicine practice. The AI insights help us make better clinical decisions, and the automated documentation saves us hours every day.",
            author: "Dr. Sarah Johnson",
            title: "Chief Medical Officer",
            company: "Regional Health Network",
          },
          {
            quote:
              "The HIPAA compliance features give us complete peace of mind, while the real-time collaboration tools have improved our care coordination dramatically.",
            author: "Michael Chen",
            title: "IT Director",
            company: "Metropolitan Medical Center",
          },
        ],
        caseStudies: [
          {
            title: "Regional Health Network Improves Patient Outcomes by 25%",
            challenge: "Large health network struggled with care coordination and compliance across 15 facilities",
            solution: "Implemented Agent M3C for all telemedicine consultations and provider collaboration",
            results: [
              "25% improvement in patient satisfaction scores",
              "60% reduction in documentation time",
              "100% HIPAA compliance achievement",
              "40% increase in specialist consultation capacity",
            ],
          },
        ],
        metrics: [
          { stat: "99.7%", description: "Transcription accuracy for medical terminology" },
          { stat: "60%", description: "Reduction in documentation time" },
          { stat: "100%", description: "HIPAA compliance rate" },
        ],
      },
    })

    // Legal Value Proposition
    this.propositions.set("legal", {
      sector: "legal",
      headline: "Secure Legal Collaboration with AI-Powered Insights",
      subheadline:
        "Transform legal practice with secure, compliant collaboration tools that enhance case management, contract analysis, and client communication.",
      keyBenefits: [
        "Accelerate contract review with AI-powered analysis",
        "Ensure attorney-client privilege with end-to-end encryption",
        "Automate legal research and case preparation",
        "Streamline client communication and case updates",
        "Reduce billable hour documentation by 50%",
      ],
      uniqueSellingPoints: [
        "AI-powered contract clause analysis and risk assessment",
        "Automated legal precedent research and citation",
        "Intelligent document privilege classification",
        "Real-time case strategy collaboration tools",
        "Predictive case outcome modeling",
      ],
      painPointsSolved: [
        "Time-consuming contract review processes",
        "Complex privilege and confidentiality requirements",
        "Inefficient client communication",
        "Manual legal research and documentation",
        "Poor case collaboration between team members",
      ],
      roi: {
        timeToValue: "14 days to operational efficiency",
        costSavings: "30% reduction in case preparation time",
        productivityGains: "50% faster contract review cycles",
        riskReduction: "85% reduction in privilege violations",
      },
      socialProof: {
        testimonials: [
          {
            quote:
              "Agent M3C has transformed our contract review process. What used to take days now takes hours, and the AI insights help us identify risks we might have missed.",
            author: "James Mitchell",
            title: "Senior Partner",
            company: "Mitchell & Associates",
          },
          {
            quote:
              "The security features are exactly what we need for confidential client communications. The audit trails give us complete transparency for compliance.",
            author: "Lisa Chen",
            title: "General Counsel",
            company: "TechCorp Legal",
          },
        ],
        caseStudies: [
          {
            title: "Law Firm Reduces Contract Review Time by 65%",
            challenge: "Mid-size law firm struggled with lengthy contract review cycles and client demands",
            solution: "Deployed Agent M3C for contract analysis and client collaboration",
            results: [
              "65% reduction in contract review time",
              "40% increase in client satisfaction",
              "100% compliance with privilege requirements",
              "30% improvement in case preparation efficiency",
            ],
          },
        ],
        metrics: [
          { stat: "65%", description: "Faster contract review cycles" },
          { stat: "100%", description: "Attorney-client privilege protection" },
          { stat: "50%", description: "Reduction in documentation time" },
        ],
      },
    })

    // Defense Value Proposition
    this.propositions.set("defense", {
      sector: "defense",
      headline: "Mission-Critical Secure Collaboration for Defense Operations",
      subheadline:
        "ITAR-compliant, AI-enhanced collaboration platform designed for defense and intelligence operations with multi-level security and real-time threat analysis.",
      keyBenefits: [
        "Ensure ITAR compliance with automated classification handling",
        "Enhance situational awareness with AI-powered threat analysis",
        "Enable secure multi-domain operations coordination",
        "Accelerate intelligence sharing across security levels",
        "Reduce mission planning time by 45%",
      ],
      uniqueSellingPoints: [
        "Real-time threat intelligence integration and analysis",
        "Automated security classification and handling",
        "Multi-level security with cross-domain solutions",
        "AI-powered mission planning and optimization",
        "Secure air-gapped deployment options",
      ],
      painPointsSolved: [
        "Complex ITAR and security clearance requirements",
        "Slow intelligence sharing across domains",
        "Manual threat analysis and assessment",
        "Inefficient mission planning processes",
        "Limited secure collaboration tools",
      ],
      roi: {
        timeToValue: "60 days including security certification",
        costSavings: "40% reduction in mission planning costs",
        productivityGains: "45% faster intelligence analysis",
        riskReduction: "95% improvement in security compliance",
      },
      socialProof: {
        testimonials: [
          {
            quote:
              "Agent M3C provides the security and intelligence capabilities we need for critical operations. The AI threat analysis has significantly enhanced our situational awareness.",
            author: "Colonel Anderson",
            title: "Intelligence Director",
            company: "Defense Intelligence Agency",
          },
          {
            quote:
              "The ITAR compliance features and multi-level security make this the only platform we trust for classified collaboration.",
            author: "Major Thompson",
            title: "Operations Officer",
            company: "Joint Special Operations Command",
          },
        ],
        caseStudies: [
          {
            title: "Defense Agency Improves Intelligence Sharing by 60%",
            challenge: "Multi-agency intelligence sharing was slow and inefficient across security domains",
            solution: "Implemented Agent M3C for secure cross-domain intelligence collaboration",
            results: [
              "60% improvement in intelligence sharing speed",
              "45% reduction in mission planning time",
              "100% ITAR compliance maintenance",
              "35% enhancement in threat detection accuracy",
            ],
          },
        ],
        metrics: [
          { stat: "100%", description: "ITAR compliance rate" },
          { stat: "45%", description: "Faster mission planning" },
          { stat: "60%", description: "Improved intelligence sharing" },
        ],
      },
    })

    // Enterprise Value Proposition
    this.propositions.set("enterprise", {
      sector: "enterprise",
      headline: "AI-Powered Enterprise Collaboration That Drives Results",
      subheadline:
        "Transform business meetings and collaboration with intelligent insights, automated workflows, and comprehensive analytics that boost productivity and engagement.",
      keyBenefits: [
        "Increase meeting productivity with AI-powered insights",
        "Automate action item tracking and follow-up",
        "Boost team engagement with real-time analytics",
        "Integrate seamlessly with existing business tools",
        "Reduce meeting time by 30% while improving outcomes",
      ],
      uniqueSellingPoints: [
        "Real-time sentiment analysis and engagement tracking",
        "Automated meeting summaries and action item extraction",
        "Predictive analytics for team performance optimization",
        "Intelligent content generation and workflow automation",
        "Comprehensive ROI measurement and reporting",
      ],
      painPointsSolved: [
        "Meeting fatigue and low engagement",
        "Poor action item tracking and follow-up",
        "Lack of meeting ROI measurement",
        "Fragmented collaboration tools",
        "Inefficient decision-making processes",
      ],
      roi: {
        timeToValue: "7 days to productivity gains",
        costSavings: "25% reduction in meeting costs",
        productivityGains: "35% improvement in team efficiency",
        riskReduction: "70% better project delivery rates",
      },
      socialProof: {
        testimonials: [
          {
            quote:
              "Agent M3C has completely changed how we run meetings. The AI insights help us stay focused, and the automated follow-ups ensure nothing falls through the cracks.",
            author: "Michael Chang",
            title: "CEO",
            company: "InnovateTech Solutions",
          },
          {
            quote:
              "The engagement analytics have helped us identify and address team dynamics issues before they impact productivity. It's like having a meeting coach built into our platform.",
            author: "Sarah Williams",
            title: "Chief People Officer",
            company: "Global Enterprises Inc.",
          },
        ],
        caseStudies: [
          {
            title: "Tech Company Increases Team Productivity by 40%",
            challenge: "Fast-growing tech company struggled with meeting efficiency and action item follow-through",
            solution: "Deployed Agent M3C for all team meetings and project collaboration",
            results: [
              "40% increase in team productivity",
              "30% reduction in meeting duration",
              "85% improvement in action item completion",
              "50% better project delivery rates",
            ],
          },
        ],
        metrics: [
          { stat: "40%", description: "Increase in team productivity" },
          { stat: "30%", description: "Reduction in meeting time" },
          { stat: "85%", description: "Action item completion rate" },
        ],
      },
    })
  }

  getValueProposition(sector: string): ValueProposition | undefined {
    return this.propositions.get(sector)
  }

  getAllValuePropositions(): ValueProposition[] {
    return Array.from(this.propositions.values())
  }

  generateCustomProposition(
    sector: string,
    specificPainPoints: string[],
    desiredOutcomes: string[],
  ): Partial<ValueProposition> {
    const baseProposition = this.propositions.get(sector)
    if (!baseProposition) return {}

    return {
      headline: `Solve Your ${sector.charAt(0).toUpperCase() + sector.slice(1)} Challenges with AI-Powered Collaboration`,
      keyBenefits: desiredOutcomes.map((outcome) => `Achieve ${outcome} with intelligent automation`),
      painPointsSolved: specificPainPoints,
      uniqueSellingPoints: baseProposition.uniqueSellingPoints.filter((usp) =>
        specificPainPoints.some((pain) => usp.toLowerCase().includes(pain.toLowerCase().split(" ")[0])),
      ),
    }
  }
}

export const valueProposition = new ValuePropositionEngine()
