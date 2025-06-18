export interface TranscriptionConfig {
  language: string
  model: "whisper-1" | "whisper-large" | "custom"
  accuracy: "standard" | "high" | "premium"
  realTimeProcessing: boolean
  speakerDiarization: boolean
  customVocabulary?: string[]
  noiseReduction: boolean
}

export interface TranscriptionResult {
  id: string
  text: string
  confidence: number
  speakerId?: string
  timestamp: number
  duration: number
  words: Array<{
    word: string
    start: number
    end: number
    confidence: number
  }>
  metadata: {
    language: string
    model: string
    processingTime: number
  }
}

export interface SpeakerProfile {
  id: string
  name: string
  voiceprint: Float32Array
  characteristics: {
    pitch: number
    tone: string
    speakingRate: number
    accent?: string
  }
}

export class AdvancedTranscriptionEngine {
  private audioContext: AudioContext | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioWorklet: AudioWorkletNode | null = null
  private speakerProfiles: Map<string, SpeakerProfile> = new Map()
  private processingQueue: Array<{ audio: Blob; timestamp: number }> = []
  private isProcessing = false

  // Event handlers
  onTranscriptionResult?: (result: TranscriptionResult) => void
  onSpeakerIdentified?: (speakerId: string, confidence: number) => void
  onProcessingError?: (error: Error) => void

  constructor(private config: TranscriptionConfig) {}

  async initialize(): Promise<void> {
    try {
      // Initialize Web Audio API
      this.audioContext = new AudioContext({
        sampleRate: 48000,
        latencyHint: "interactive",
      })

      // Load audio worklet for real-time processing
      await this.audioContext.audioWorklet.addModule("/audio-worklets/transcription-processor.js")

      console.log("Advanced transcription engine initialized")
    } catch (error) {
      console.error("Failed to initialize transcription engine:", error)
      throw error
    }
  }

  async startRealTimeTranscription(stream: MediaStream): Promise<void> {
    if (!this.audioContext) {
      throw new Error("Transcription engine not initialized")
    }

    try {
      // Create media recorder for audio capture
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000,
      })

      // Set up audio worklet for real-time processing
      const source = this.audioContext.createMediaStreamSource(stream)
      this.audioWorklet = new AudioWorkletNode(this.audioContext, "transcription-processor", {
        processorOptions: {
          sampleRate: this.audioContext.sampleRate,
          bufferSize: 4096,
        },
      })

      source.connect(this.audioWorklet)

      // Handle audio data from worklet
      this.audioWorklet.port.onmessage = (event) => {
        const { audioData, timestamp } = event.data
        this.processAudioChunk(audioData, timestamp)
      }

      // Set up media recorder for backup processing
      let audioChunks: Blob[] = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
          this.processingQueue.push({ audio: audioBlob, timestamp: Date.now() })
          audioChunks = []
          this.processQueue()
        }
      }

      // Start recording in chunks for continuous processing
      this.mediaRecorder.start(1000) // 1-second chunks
      this.startContinuousProcessing()

      console.log("Real-time transcription started")
    } catch (error) {
      console.error("Failed to start real-time transcription:", error)
      this.onProcessingError?.(error as Error)
    }
  }

  private async processAudioChunk(audioData: Float32Array, timestamp: number): Promise<void> {
    try {
      // Convert Float32Array to audio blob
      const audioBlob = await this.float32ArrayToBlob(audioData)

      // Add to processing queue
      this.processingQueue.push({ audio: audioBlob, timestamp })

      // Process if not already processing
      if (!this.isProcessing) {
        this.processQueue()
      }
    } catch (error) {
      console.error("Error processing audio chunk:", error)
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return
    }

    this.isProcessing = true

    try {
      while (this.processingQueue.length > 0) {
        const { audio, timestamp } = this.processingQueue.shift()!
        await this.transcribeAudio(audio, timestamp)
      }
    } catch (error) {
      console.error("Error processing transcription queue:", error)
      this.onProcessingError?.(error as Error)
    } finally {
      this.isProcessing = false
    }
  }

  private async transcribeAudio(audioBlob: Blob, timestamp: number): Promise<void> {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "audio.webm")
      formData.append("model", this.config.model)
      formData.append("language", this.config.language)
      formData.append("accuracy", this.config.accuracy)
      formData.append("speaker_diarization", this.config.speakerDiarization.toString())

      if (this.config.customVocabulary) {
        formData.append("custom_vocabulary", JSON.stringify(this.config.customVocabulary))
      }

      const response = await fetch("/api/ai/transcription/advanced", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Process transcription result
      const transcriptionResult: TranscriptionResult = {
        id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: result.text,
        confidence: result.confidence,
        speakerId: result.speaker_id,
        timestamp,
        duration: result.duration,
        words: result.words || [],
        metadata: {
          language: this.config.language,
          model: this.config.model,
          processingTime: result.processing_time,
        },
      }

      // Identify speaker if diarization is enabled
      if (this.config.speakerDiarization && result.speaker_features) {
        const speakerId = await this.identifySpeaker(result.speaker_features)
        transcriptionResult.speakerId = speakerId
        this.onSpeakerIdentified?.(speakerId, result.speaker_confidence || 0.8)
      }

      // Emit transcription result
      this.onTranscriptionResult?.(transcriptionResult)
    } catch (error) {
      console.error("Transcription error:", error)
      this.onProcessingError?.(error as Error)
    }
  }

  private async identifySpeaker(voiceFeatures: Float32Array): Promise<string> {
    // Compare with existing speaker profiles
    let bestMatch = { id: "unknown", similarity: 0 }

    for (const [speakerId, profile] of this.speakerProfiles) {
      const similarity = this.calculateVoiceSimilarity(voiceFeatures, profile.voiceprint)
      if (similarity > bestMatch.similarity && similarity > 0.7) {
        bestMatch = { id: speakerId, similarity }
      }
    }

    // If no good match found, create new speaker profile
    if (bestMatch.similarity < 0.7) {
      const newSpeakerId = `speaker_${this.speakerProfiles.size + 1}`
      this.speakerProfiles.set(newSpeakerId, {
        id: newSpeakerId,
        name: `Speaker ${this.speakerProfiles.size + 1}`,
        voiceprint: voiceFeatures,
        characteristics: {
          pitch: this.extractPitch(voiceFeatures),
          tone: this.extractTone(voiceFeatures),
          speakingRate: this.extractSpeakingRate(voiceFeatures),
        },
      })
      return newSpeakerId
    }

    return bestMatch.id
  }

  private calculateVoiceSimilarity(features1: Float32Array, features2: Float32Array): number {
    // Cosine similarity calculation
    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (let i = 0; i < Math.min(features1.length, features2.length); i++) {
      dotProduct += features1[i] * features2[i]
      norm1 += features1[i] * features1[i]
      norm2 += features2[i] * features2[i]
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  private extractPitch(features: Float32Array): number {
    // Simplified pitch extraction
    return features.reduce((sum, val) => sum + Math.abs(val), 0) / features.length
  }

  private extractTone(features: Float32Array): string {
    const energy = features.reduce((sum, val) => sum + val * val, 0) / features.length
    return energy > 0.5 ? "energetic" : energy > 0.2 ? "moderate" : "calm"
  }

  private extractSpeakingRate(features: Float32Array): number {
    // Simplified speaking rate calculation
    return features.filter((val) => Math.abs(val) > 0.1).length / features.length
  }

  private async float32ArrayToBlob(audioData: Float32Array): Promise<Blob> {
    // Convert Float32Array to WAV blob
    const buffer = new ArrayBuffer(44 + audioData.length * 2)
    const view = new DataView(buffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + audioData.length * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, 48000, true)
    view.setUint32(28, 48000 * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, audioData.length * 2, true)

    // Convert float samples to 16-bit PCM
    let offset = 44
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]))
      view.setInt16(offset, sample * 0x7fff, true)
      offset += 2
    }

    return new Blob([buffer], { type: "audio/wav" })
  }

  private startContinuousProcessing(): void {
    // Restart media recorder every second for continuous processing
    setInterval(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop()
        setTimeout(() => {
          if (this.mediaRecorder && this.mediaRecorder.state === "inactive") {
            this.mediaRecorder.start(1000)
          }
        }, 100)
      }
    }, 1000)
  }

  addSpeakerProfile(profile: SpeakerProfile): void {
    this.speakerProfiles.set(profile.id, profile)
  }

  getSpeakerProfiles(): SpeakerProfile[] {
    return Array.from(this.speakerProfiles.values())
  }

  updateConfig(newConfig: Partial<TranscriptionConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop()
    }

    if (this.audioWorklet) {
      this.audioWorklet.disconnect()
    }

    if (this.audioContext) {
      this.audioContext.close()
    }

    this.processingQueue = []
    this.isProcessing = false
  }
}
