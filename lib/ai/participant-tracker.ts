export interface ParticipantMetrics {
  id: string
  name: string
  role: string
  joinTime: Date
  lastActivity: Date

  // Speaking metrics
  totalSpeakingTime: number
  speakingSegments: Array<{
    start: number
    end: number
    duration: number
    wordCount: number
    confidence: number
  }>

  // Engagement metrics
  engagementScore: number // 0-100
  attentionLevel: "low" | "medium" | "high"
  participationRate: number // percentage of meeting participation

  // Emotional analysis
  emotionalState: {
    current: string
    confidence: number
    history: Array<{
      timestamp: number
      emotion: string
      intensity: number
      confidence: number
    }>
    stability: number // how stable emotions are
  }

  // Communication analysis
  communicationStyle: {
    assertiveness: number // 0-1
    formality: number // 0-1
    clarity: number // 0-1
    pace: "very_slow" | "slow" | "normal" | "fast" | "very_fast"
    volume: "quiet" | "normal" | "loud"
  }

  // Interaction patterns
  interactions: {
    questionsAsked: number
    questionsAnswered: number
    interruptions: number
    agreements: number
    disagreements: number
    topicInitiations: number
  }

  // Focus and attention
  focusMetrics: {
    screenTime: number // time with screen active
    cameraOnTime: number
    microphoneOnTime: number
    backgroundNoise: number
    multitasking: boolean
  }
}

export interface MeetingDynamics {
  dominancePattern: Array<{
    participantId: string
    dominanceScore: number
    timeSlots: Array<{
      start: number
      end: number
      dominance: number
    }>
  }>

  interactionFlow: Array<{
    from: string
    to: string
    type: "question" | "response" | "interruption" | "agreement"
    timestamp: number
    context: string
  }>

  groupDynamics: {
    cohesion: number // 0-1
    conflict: number // 0-1
    collaboration: number // 0-1
    energy: number // 0-1
  }

  conversationFlow: {
    naturalPauses: number
    overlappingSpeech: number
    silentMoments: Array<{
      start: number
      duration: number
      context: string
    }>
  }
}

export class ParticipantTracker {
  private participants: Map<string, ParticipantMetrics> = new Map()
  private meetingStartTime: Date = new Date()
  private audioAnalyzer: AudioAnalyzer
  private videoAnalyzer: VideoAnalyzer
  private interactionHistory: Array<any> = []

  // Event handlers
  onParticipantUpdate?: (participant: ParticipantMetrics) => void
  onEngagementAlert?: (participantId: string, level: string, reason: string) => void
  onInteractionDetected?: (interaction: any) => void
  onMeetingDynamicsUpdate?: (dynamics: MeetingDynamics) => void

  constructor() {
    this.audioAnalyzer = new AudioAnalyzer()
    this.videoAnalyzer = new VideoAnalyzer()
  }

  addParticipant(id: string, name: string, role: string): void {
    const participant: ParticipantMetrics = {
      id,
      name,
      role,
      joinTime: new Date(),
      lastActivity: new Date(),
      totalSpeakingTime: 0,
      speakingSegments: [],
      engagementScore: 50,
      attentionLevel: "medium",
      participationRate: 0,
      emotionalState: {
        current: "neutral",
        confidence: 0.5,
        history: [],
        stability: 0.5,
      },
      communicationStyle: {
        assertiveness: 0.5,
        formality: 0.5,
        clarity: 0.5,
        pace: "normal",
        volume: "normal",
      },
      interactions: {
        questionsAsked: 0,
        questionsAnswered: 0,
        interruptions: 0,
        agreements: 0,
        disagreements: 0,
        topicInitiations: 0,
      },
      focusMetrics: {
        screenTime: 0,
        cameraOnTime: 0,
        microphoneOnTime: 0,
        backgroundNoise: 0,
        multitasking: false,
      },
    }

    this.participants.set(id, participant)
    this.onParticipantUpdate?.(participant)
  }

  updateSpeakingActivity(
    participantId: string,
    transcription: string,
    audioData: Float32Array,
    timestamp: number,
    duration: number,
  ): void {
    const participant = this.participants.get(participantId)
    if (!participant) return

    // Update speaking metrics
    participant.totalSpeakingTime += duration
    participant.lastActivity = new Date()

    const wordCount = transcription.split(" ").length
    participant.speakingSegments.push({
      start: timestamp,
      end: timestamp + duration,
      duration,
      wordCount,
      confidence: 0.9, // Would come from transcription engine
    })

    // Analyze audio characteristics
    const audioAnalysis = this.audioAnalyzer.analyze(audioData)
    this.updateCommunicationStyle(participant, audioAnalysis, transcription)

    // Analyze emotional state
    this.updateEmotionalState(participant, transcription, audioAnalysis, timestamp)

    // Update engagement metrics
    this.updateEngagementMetrics(participant)

    // Detect interactions
    this.detectInteractions(participantId, transcription, timestamp)

    this.onParticipantUpdate?.(participant)
  }

  updateVideoActivity(participantId: string, videoFrame: ImageData, timestamp: number): void {
    const participant = this.participants.get(participantId)
    if (!participant) return

    // Analyze video for engagement cues
    const videoAnalysis = this.videoAnalyzer.analyze(videoFrame)

    // Update attention level based on gaze direction, posture, etc.
    participant.attentionLevel = this.calculateAttentionLevel(videoAnalysis)

    // Update emotional state from facial expressions
    if (videoAnalysis.emotion) {
      participant.emotionalState.history.push({
        timestamp,
        emotion: videoAnalysis.emotion.dominant,
        intensity: videoAnalysis.emotion.intensity,
        confidence: videoAnalysis.emotion.confidence,
      })

      participant.emotionalState.current = videoAnalysis.emotion.dominant
      participant.emotionalState.confidence = videoAnalysis.emotion.confidence
    }

    // Detect multitasking or distraction
    participant.focusMetrics.multitasking = videoAnalysis.multitasking || false

    this.onParticipantUpdate?.(participant)
  }

  private updateCommunicationStyle(participant: ParticipantMetrics, audioAnalysis: any, transcription: string): void {
    // Analyze assertiveness from speech patterns
    const assertivenessIndicators = ["I think", "I believe", "definitely", "certainly", "absolutely"]
    const assertivenessScore = assertivenessIndicators.reduce(
      (score, indicator) => score + (transcription.toLowerCase().includes(indicator) ? 0.1 : 0),
      0,
    )

    participant.communicationStyle.assertiveness = Math.min(
      1,
      participant.communicationStyle.assertiveness * 0.8 + assertivenessScore * 0.2,
    )

    // Analyze formality
    const formalWords = ["please", "thank you", "certainly", "absolutely", "regarding"]
    const informalWords = ["yeah", "okay", "sure", "got it", "cool"]

    const formalityScore =
      (formalWords.reduce((score, word) => score + (transcription.toLowerCase().includes(word) ? 1 : 0), 0) -
        informalWords.reduce((score, word) => score + (transcription.toLowerCase().includes(word) ? 1 : 0), 0)) /
      transcription.split(" ").length

    participant.communicationStyle.formality = Math.max(
      0,
      Math.min(1, participant.communicationStyle.formality * 0.8 + (formalityScore + 0.5) * 0.2),
    )

    // Update pace from audio analysis
    if (audioAnalysis.speakingRate) {
      participant.communicationStyle.pace =
        audioAnalysis.speakingRate > 180
          ? "very_fast"
          : audioAnalysis.speakingRate > 150
            ? "fast"
            : audioAnalysis.speakingRate > 120
              ? "normal"
              : audioAnalysis.speakingRate > 90
                ? "slow"
                : "very_slow"
    }

    // Update volume
    if (audioAnalysis.volume) {
      participant.communicationStyle.volume =
        audioAnalysis.volume > 0.7 ? "loud" : audioAnalysis.volume > 0.3 ? "normal" : "quiet"
    }
  }

  private updateEmotionalState(
    participant: ParticipantMetrics,
    transcription: string,
    audioAnalysis: any,
    timestamp: number,
  ): void {
    // Simple sentiment analysis for emotional state
    const positiveWords = ["great", "excellent", "good", "happy", "pleased", "excited"]
    const negativeWords = ["bad", "terrible", "awful", "frustrated", "angry", "disappointed"]
    const neutralWords = ["okay", "fine", "normal", "standard", "regular"]

    const words = transcription.toLowerCase().split(" ")
    const positiveCount = positiveWords.reduce((count, word) => count + words.filter((w) => w.includes(word)).length, 0)
    const negativeCount = negativeWords.reduce((count, word) => count + words.filter((w) => w.includes(word)).length, 0)

    let emotion = "neutral"
    let confidence = 0.5

    if (positiveCount > negativeCount) {
      emotion = "positive"
      confidence = Math.min(0.9, 0.5 + (positiveCount / words.length) * 2)
    } else if (negativeCount > positiveCount) {
      emotion = "negative"
      confidence = Math.min(0.9, 0.5 + (negativeCount / words.length) * 2)
    }

    // Combine with audio analysis if available
    if (audioAnalysis.emotion) {
      emotion = audioAnalysis.emotion
      confidence = Math.max(confidence, audioAnalysis.emotionConfidence || 0.5)
    }

    participant.emotionalState.history.push({
      timestamp,
      emotion,
      intensity: confidence,
      confidence,
    })

    participant.emotionalState.current = emotion
    participant.emotionalState.confidence = confidence

    // Calculate emotional stability
    const recentEmotions = participant.emotionalState.history.slice(-10)
    const emotionVariance = this.calculateEmotionVariance(recentEmotions)
    participant.emotionalState.stability = Math.max(0, 1 - emotionVariance)
  }

  private calculateEmotionVariance(emotions: any[]): number {
    if (emotions.length < 2) return 0

    const emotionScores = emotions.map((e) => {
      switch (e.emotion) {
        case "positive":
          return 1
        case "negative":
          return -1
        default:
          return 0
      }
    })

    const mean = emotionScores.reduce((sum, score) => sum + score, 0) / emotionScores.length
    const variance = emotionScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / emotionScores.length

    return Math.sqrt(variance)
  }

  private updateEngagementMetrics(participant: ParticipantMetrics): void {
    const meetingDuration = Date.now() - this.meetingStartTime.getTime()
    const participationRate = (participant.totalSpeakingTime * 1000) / meetingDuration

    participant.participationRate = Math.min(100, participationRate * 100)

    // Calculate engagement score based on multiple factors
    const factors = {
      participation: participant.participationRate / 100,
      recentActivity: this.getRecentActivityScore(participant),
      emotionalStability: participant.emotionalState.stability,
      interactionQuality: this.getInteractionQualityScore(participant),
    }

    participant.engagementScore = Math.round(
      (factors.participation * 0.3 +
        factors.recentActivity * 0.3 +
        factors.emotionalStability * 0.2 +
        factors.interactionQuality * 0.2) *
        100,
    )

    // Update attention level
    participant.attentionLevel =
      participant.engagementScore > 70 ? "high" : participant.engagementScore > 40 ? "medium" : "low"

    // Check for engagement alerts
    if (participant.engagementScore < 30) {
      this.onEngagementAlert?.(participant.id, "low", "Low engagement detected")
    }
  }

  private getRecentActivityScore(participant: ParticipantMetrics): number {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    const recentActivity = participant.lastActivity.getTime() > fiveMinutesAgo
    return recentActivity ? 1 : 0
  }

  private getInteractionQualityScore(participant: ParticipantMetrics): number {
    const totalInteractions = Object.values(participant.interactions).reduce((sum, count) => sum + count, 0)

    if (totalInteractions === 0) return 0.5

    const qualityScore =
      (participant.interactions.questionsAsked * 0.3 +
        participant.interactions.questionsAnswered * 0.3 +
        participant.interactions.agreements * 0.2 +
        participant.interactions.topicInitiations * 0.2 -
        participant.interactions.interruptions * 0.1) /
      totalInteractions

    return Math.max(0, Math.min(1, qualityScore))
  }

  private detectInteractions(participantId: string, transcription: string, timestamp: number): void {
    const participant = this.participants.get(participantId)
    if (!participant) return

    const text = transcription.toLowerCase()

    // Detect questions
    if (
      text.includes("?") ||
      text.startsWith("what") ||
      text.startsWith("how") ||
      text.startsWith("when") ||
      text.startsWith("where") ||
      text.startsWith("why")
    ) {
      participant.interactions.questionsAsked++
      this.recordInteraction(participantId, "question", transcription, timestamp)
    }

    // Detect agreements
    if (
      text.includes("yes") ||
      text.includes("agree") ||
      text.includes("exactly") ||
      text.includes("right") ||
      text.includes("correct")
    ) {
      participant.interactions.agreements++
      this.recordInteraction(participantId, "agreement", transcription, timestamp)
    }

    // Detect disagreements
    if (
      text.includes("no") ||
      text.includes("disagree") ||
      text.includes("wrong") ||
      text.includes("incorrect") ||
      text.includes("but")
    ) {
      participant.interactions.disagreements++
      this.recordInteraction(participantId, "disagreement", transcription, timestamp)
    }

    // Detect topic initiations
    if (
      text.startsWith("let's talk about") ||
      text.startsWith("i want to discuss") ||
      text.startsWith("regarding") ||
      text.startsWith("about")
    ) {
      participant.interactions.topicInitiations++
      this.recordInteraction(participantId, "topic_initiation", transcription, timestamp)
    }
  }

  private recordInteraction(participantId: string, type: string, content: string, timestamp: number): void {
    const interaction = {
      participantId,
      type,
      content,
      timestamp,
      context: this.getRecentContext(),
    }

    this.interactionHistory.push(interaction)
    this.onInteractionDetected?.(interaction)
  }

  private getRecentContext(): string {
    return this.interactionHistory
      .slice(-3)
      .map((i) => i.content)
      .join(" ")
  }

  private calculateAttentionLevel(videoAnalysis: any): "low" | "medium" | "high" {
    const factors = {
      gazeDirection: videoAnalysis.gazeDirection === "camera" ? 1 : 0,
      posture: videoAnalysis.posture === "upright" ? 1 : 0.5,
      facialExpression: videoAnalysis.engagement || 0.5,
      movement: videoAnalysis.movement < 0.3 ? 1 : 0.5, // less movement = more attention
    }

    const attentionScore = Object.values(factors).reduce((sum, score) => sum + score, 0) / 4

    return attentionScore > 0.7 ? "high" : attentionScore > 0.4 ? "medium" : "low"
  }

  getMeetingDynamics(): MeetingDynamics {
    const participants = Array.from(this.participants.values())

    // Calculate dominance patterns
    const totalSpeakingTime = participants.reduce((sum, p) => sum + p.totalSpeakingTime, 0)
    const dominancePattern = participants.map((p) => ({
      participantId: p.id,
      dominanceScore: totalSpeakingTime > 0 ? p.totalSpeakingTime / totalSpeakingTime : 0,
      timeSlots: this.calculateTimeSlotDominance(p),
    }))

    // Calculate group dynamics
    const avgEngagement = participants.reduce((sum, p) => sum + p.engagementScore, 0) / participants.length
    const emotionalVariance = this.calculateGroupEmotionalVariance(participants)
    const interactionDensity = this.interactionHistory.length / participants.length

    const groupDynamics = {
      cohesion: Math.min(1, avgEngagement / 100),
      conflict: Math.min(1, emotionalVariance),
      collaboration: Math.min(1, interactionDensity / 10),
      energy: Math.min(1, avgEngagement / 80),
    }

    return {
      dominancePattern,
      interactionFlow: this.interactionHistory.slice(-20), // Recent interactions
      groupDynamics,
      conversationFlow: {
        naturalPauses: 0, // Would be calculated from audio analysis
        overlappingSpeech: 0, // Would be calculated from audio analysis
        silentMoments: [], // Would be calculated from audio analysis
      },
    }
  }

  private calculateTimeSlotDominance(participant: ParticipantMetrics): any[] {
    // Divide meeting into 5-minute slots and calculate dominance for each
    const slotDuration = 5 * 60 * 1000 // 5 minutes in milliseconds
    const meetingDuration = Date.now() - this.meetingStartTime.getTime()
    const numSlots = Math.ceil(meetingDuration / slotDuration)

    return Array.from({ length: numSlots }, (_, i) => {
      const slotStart = i * slotDuration
      const slotEnd = (i + 1) * slotDuration

      const slotSpeakingTime = participant.speakingSegments
        .filter((segment) => segment.start >= slotStart && segment.end <= slotEnd)
        .reduce((sum, segment) => sum + segment.duration, 0)

      return {
        start: slotStart,
        end: slotEnd,
        dominance: slotSpeakingTime / slotDuration,
      }
    })
  }

  private calculateGroupEmotionalVariance(participants: ParticipantMetrics[]): number {
    const emotionScores = participants.map((p) => {
      switch (p.emotionalState.current) {
        case "positive":
          return 1
        case "negative":
          return -1
        default:
          return 0
      }
    })

    if (emotionScores.length < 2) return 0

    const mean = emotionScores.reduce((sum, score) => sum + score, 0) / emotionScores.length
    const variance = emotionScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / emotionScores.length

    return Math.sqrt(variance)
  }

  getParticipant(id: string): ParticipantMetrics | undefined {
    return this.participants.get(id)
  }

  getAllParticipants(): ParticipantMetrics[] {
    return Array.from(this.participants.values())
  }

  removeParticipant(id: string): void {
    this.participants.delete(id)
  }

  reset(): void {
    this.participants.clear()
    this.interactionHistory = []
    this.meetingStartTime = new Date()
  }
}

// Helper classes for audio and video analysis
class AudioAnalyzer {
  analyze(audioData: Float32Array): any {
    // Simplified audio analysis
    const volume = this.calculateVolume(audioData)
    const speakingRate = this.estimateSpeakingRate(audioData)

    return {
      volume,
      speakingRate,
      emotion: this.detectEmotionFromAudio(audioData),
      emotionConfidence: 0.7,
    }
  }

  private calculateVolume(audioData: Float32Array): number {
    const sum = audioData.reduce((acc, val) => acc + Math.abs(val), 0)
    return sum / audioData.length
  }

  private estimateSpeakingRate(audioData: Float32Array): number {
    // Simplified speaking rate estimation
    const energyThreshold = 0.1
    const energyPeaks = audioData.filter((val) => Math.abs(val) > energyThreshold).length
    return (energyPeaks / audioData.length) * 150 // Rough estimation
  }

  private detectEmotionFromAudio(audioData: Float32Array): string {
    // Simplified emotion detection from audio characteristics
    const volume = this.calculateVolume(audioData)
    const variance = this.calculateVariance(audioData)

    if (volume > 0.6 && variance > 0.3) return "excited"
    if (volume < 0.3 && variance < 0.2) return "calm"
    if (variance > 0.5) return "stressed"

    return "neutral"
  }

  private calculateVariance(audioData: Float32Array): number {
    const mean = audioData.reduce((sum, val) => sum + val, 0) / audioData.length
    const variance = audioData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / audioData.length
    return Math.sqrt(variance)
  }
}

class VideoAnalyzer {
  analyze(videoFrame: ImageData): any {
    // Simplified video analysis
    // In a real implementation, this would use computer vision libraries
    return {
      gazeDirection: "camera", // 'camera', 'away', 'down'
      posture: "upright", // 'upright', 'slouched', 'leaning'
      engagement: 0.8, // 0-1 engagement score
      movement: 0.2, // 0-1 movement score
      multitasking: false,
      emotion: {
        dominant: "neutral",
        intensity: 0.5,
        confidence: 0.7,
      },
    }
  }
}
