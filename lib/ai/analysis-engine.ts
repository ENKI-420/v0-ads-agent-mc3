export interface AnalysisConfig {
  enableSentimentAnalysis: boolean
  enableTopicExtraction: boolean
  enableActionItemDetection: boolean
  enableComplianceMonitoring: boolean
  enableEmotionDetection: boolean
  complianceStandards: ("HIPAA" | "SOC2" | "GDPR" | "ITAR")[]
  customKeywords?: string[]
  confidenceThreshold: number
}

export interface SentimentAnalysis {
  overall: "positive" | "neutral" | "negative"
  score: number // -1 to 1
  confidence: number
  emotions: {
    joy: number
    anger: number
    fear: number
    sadness: number
    surprise: number
    disgust: number
  }
  timeline: Array<{
    timestamp: number
    sentiment: number
    emotion: string
  }>
}

export interface TopicExtraction {
  topics: Array<{
    name: string
    confidence: number
    keywords: string[]
    mentions: number
    firstMention: number
    lastMention: number
  }>
  categories: Array<{
    category: string
    relevance: number
    subcategories: string[]
  }>
}

export interface ActionItem {
  id: string
  text: string
  assignee?: string
  dueDate?: Date
  priority: "low" | "medium" | "high" | "urgent"
  confidence: number
  extractedFrom: {
    speakerId: string
    timestamp: number
    context: string
  }
  status: "identified" | "confirmed" | "assigned" | "completed"
}

export interface ComplianceFlag {
  id: string
  type: "HIPAA" | "SOC2" | "GDPR" | "ITAR"
  severity: "info" | "warning" | "violation" | "critical"
  description: string
  recommendation: string
  timestamp: number
  speakerId?: string
  confidence: number
  autoResolved: boolean
}

export interface ParticipantAnalytics {
  participantId: string
  speakingTime: number
  wordCount: number
  averageConfidence: number
  engagementLevel: "low" | "medium" | "high"
  emotionalState: {
    dominant: string
    stability: number
    changes: Array<{
      timestamp: number
      emotion: string
      intensity: number
    }>
  }
  communicationStyle: {
    assertiveness: number
    formality: number
    clarity: number
    pace: "slow" | "normal" | "fast"
  }
  topicContributions: Array<{
    topic: string
    contribution: number
  }>
}

export class AIAnalysisEngine {
  private analysisHistory: Array<{
    timestamp: number
    transcription: string
    analysis: any
  }> = []

  private participantMetrics: Map<string, ParticipantAnalytics> = new Map()
  private actionItems: ActionItem[] = []
  private complianceFlags: ComplianceFlag[] = []

  // Event handlers
  onSentimentUpdate?: (sentiment: SentimentAnalysis) => void
  onTopicsUpdate?: (topics: TopicExtraction) => void
  onActionItemDetected?: (actionItem: ActionItem) => void
  onComplianceFlag?: (flag: ComplianceFlag) => void
  onParticipantAnalytics?: (analytics: ParticipantAnalytics) => void

  constructor(private config: AnalysisConfig) {}

  async analyzeTranscription(
    transcription: string,
    speakerId: string,
    timestamp: number,
    context?: any,
  ): Promise<void> {
    try {
      // Store for historical analysis
      this.analysisHistory.push({
        timestamp,
        transcription,
        analysis: context,
      })

      // Run parallel analysis
      const analysisPromises = []

      if (this.config.enableSentimentAnalysis) {
        analysisPromises.push(this.analyzeSentiment(transcription, speakerId, timestamp))
      }

      if (this.config.enableTopicExtraction) {
        analysisPromises.push(this.extractTopics(transcription, timestamp))
      }

      if (this.config.enableActionItemDetection) {
        analysisPromises.push(this.detectActionItems(transcription, speakerId, timestamp))
      }

      if (this.config.enableComplianceMonitoring) {
        analysisPromises.push(this.monitorCompliance(transcription, speakerId, timestamp))
      }

      // Update participant metrics
      this.updateParticipantMetrics(speakerId, transcription, timestamp)

      // Execute all analyses
      await Promise.all(analysisPromises)
    } catch (error) {
      console.error("Analysis error:", error)
    }
  }

  private async analyzeSentiment(text: string, speakerId: string, timestamp: number): Promise<void> {
    try {
      const response = await fetch("/api/ai/analysis/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          speakerId,
          timestamp,
          includeEmotions: this.config.enableEmotionDetection,
        }),
      })

      if (!response.ok) throw new Error("Sentiment analysis failed")

      const sentimentData = await response.json()

      const sentiment: SentimentAnalysis = {
        overall: sentimentData.overall,
        score: sentimentData.score,
        confidence: sentimentData.confidence,
        emotions: sentimentData.emotions || {
          joy: 0,
          anger: 0,
          fear: 0,
          sadness: 0,
          surprise: 0,
          disgust: 0,
        },
        timeline: sentimentData.timeline || [],
      }

      this.onSentimentUpdate?.(sentiment)
    } catch (error) {
      console.error("Sentiment analysis error:", error)
    }
  }

  private async extractTopics(text: string, timestamp: number): Promise<void> {
    try {
      const response = await fetch("/api/ai/analysis/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          timestamp,
          customKeywords: this.config.customKeywords,
          confidenceThreshold: this.config.confidenceThreshold,
        }),
      })

      if (!response.ok) throw new Error("Topic extraction failed")

      const topicData = await response.json()

      const topics: TopicExtraction = {
        topics: topicData.topics || [],
        categories: topicData.categories || [],
      }

      this.onTopicsUpdate?.(topics)
    } catch (error) {
      console.error("Topic extraction error:", error)
    }
  }

  private async detectActionItems(text: string, speakerId: string, timestamp: number): Promise<void> {
    try {
      const response = await fetch("/api/ai/analysis/action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          speakerId,
          timestamp,
          context: this.getRecentContext(),
        }),
      })

      if (!response.ok) throw new Error("Action item detection failed")

      const actionItemData = await response.json()

      for (const item of actionItemData.actionItems || []) {
        const actionItem: ActionItem = {
          id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: item.text,
          assignee: item.assignee,
          dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
          priority: item.priority || "medium",
          confidence: item.confidence,
          extractedFrom: {
            speakerId,
            timestamp,
            context: text,
          },
          status: "identified",
        }

        this.actionItems.push(actionItem)
        this.onActionItemDetected?.(actionItem)
      }
    } catch (error) {
      console.error("Action item detection error:", error)
    }
  }

  private async monitorCompliance(text: string, speakerId: string, timestamp: number): Promise<void> {
    try {
      const response = await fetch("/api/ai/analysis/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          speakerId,
          timestamp,
          standards: this.config.complianceStandards,
        }),
      })

      if (!response.ok) throw new Error("Compliance monitoring failed")

      const complianceData = await response.json()

      for (const flag of complianceData.flags || []) {
        const complianceFlag: ComplianceFlag = {
          id: `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: flag.type,
          severity: flag.severity,
          description: flag.description,
          recommendation: flag.recommendation,
          timestamp,
          speakerId,
          confidence: flag.confidence,
          autoResolved: flag.autoResolved || false,
        }

        this.complianceFlags.push(complianceFlag)
        this.onComplianceFlag?.(complianceFlag)
      }
    } catch (error) {
      console.error("Compliance monitoring error:", error)
    }
  }

  private updateParticipantMetrics(speakerId: string, transcription: string, timestamp: number): void {
    let metrics = this.participantMetrics.get(speakerId)

    if (!metrics) {
      metrics = {
        participantId: speakerId,
        speakingTime: 0,
        wordCount: 0,
        averageConfidence: 0,
        engagementLevel: "medium",
        emotionalState: {
          dominant: "neutral",
          stability: 0.5,
          changes: [],
        },
        communicationStyle: {
          assertiveness: 0.5,
          formality: 0.5,
          clarity: 0.5,
          pace: "normal",
        },
        topicContributions: [],
      }
    }

    // Update metrics
    const words = transcription.split(" ").length
    metrics.wordCount += words
    metrics.speakingTime += this.estimateSpeakingTime(transcription)

    // Update engagement level based on participation
    const totalWords = Array.from(this.participantMetrics.values()).reduce((sum, p) => sum + p.wordCount, 0) + words

    const participationRatio = metrics.wordCount / totalWords
    metrics.engagementLevel = participationRatio > 0.4 ? "high" : participationRatio > 0.2 ? "medium" : "low"

    this.participantMetrics.set(speakerId, metrics)
    this.onParticipantAnalytics?.(metrics)
  }

  private estimateSpeakingTime(text: string): number {
    // Estimate speaking time based on word count (average 150 words per minute)
    const words = text.split(" ").length
    return (words / 150) * 60 // seconds
  }

  private getRecentContext(): string {
    // Get last 5 transcriptions for context
    return this.analysisHistory
      .slice(-5)
      .map((entry) => entry.transcription)
      .join(" ")
  }

  // Public methods for retrieving analysis results
  getActionItems(): ActionItem[] {
    return [...this.actionItems]
  }

  getComplianceFlags(): ComplianceFlag[] {
    return [...this.complianceFlags]
  }

  getParticipantAnalytics(): ParticipantAnalytics[] {
    return Array.from(this.participantMetrics.values())
  }

  updateActionItemStatus(actionItemId: string, status: ActionItem["status"]): void {
    const actionItem = this.actionItems.find((item) => item.id === actionItemId)
    if (actionItem) {
      actionItem.status = status
    }
  }

  resolveComplianceFlag(flagId: string): void {
    const flag = this.complianceFlags.find((f) => f.id === flagId)
    if (flag) {
      flag.autoResolved = true
    }
  }

  getAnalysisSummary(): {
    totalTranscriptions: number
    averageSentiment: number
    topTopics: string[]
    activeActionItems: number
    complianceIssues: number
    participantCount: number
  } {
    const sentiments = this.analysisHistory
      .map((entry) => entry.analysis?.sentiment?.score || 0)
      .filter((score) => score !== 0)

    return {
      totalTranscriptions: this.analysisHistory.length,
      averageSentiment:
        sentiments.length > 0 ? sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length : 0,
      topTopics: [], // Would be populated from topic analysis
      activeActionItems: this.actionItems.filter((item) => item.status !== "completed").length,
      complianceIssues: this.complianceFlags.filter((flag) => !flag.autoResolved && flag.severity !== "info").length,
      participantCount: this.participantMetrics.size,
    }
  }

  reset(): void {
    this.analysisHistory = []
    this.participantMetrics.clear()
    this.actionItems = []
    this.complianceFlags = []
  }
}
