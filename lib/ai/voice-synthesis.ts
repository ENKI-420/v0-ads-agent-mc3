export interface VoiceSynthesisOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: string
  lang?: string
}

export class VoiceSynthesisManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private defaultOptions: VoiceSynthesisOptions = {
    rate: 0.9,
    pitch: 1.1,
    volume: 0.8,
    lang: "en-US",
  }

  constructor(options?: Partial<VoiceSynthesisOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }

  async speak(text: string, options?: Partial<VoiceSynthesisOptions>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error("Speech synthesis not supported"))
        return
      }

      // Cancel any ongoing speech
      this.stop()

      const utterance = new SpeechSynthesisUtterance(text)
      const finalOptions = { ...this.defaultOptions, ...options }

      utterance.rate = finalOptions.rate!
      utterance.pitch = finalOptions.pitch!
      utterance.volume = finalOptions.volume!
      utterance.lang = finalOptions.lang!

      // Set voice if specified
      if (finalOptions.voice) {
        const voices = window.speechSynthesis.getVoices()
        const selectedVoice = voices.find(
          (voice) => voice.name.includes(finalOptions.voice!) || voice.voiceURI.includes(finalOptions.voice!),
        )
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      utterance.onend = () => {
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (event) => {
        this.currentUtterance = null
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      this.currentUtterance = utterance
      window.speechSynthesis.speak(utterance)
    })
  }

  stop(): void {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    this.currentUtterance = null
  }

  pause(): void {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause()
    }
  }

  resume(): void {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume()
    }
  }

  isSpeaking(): boolean {
    return window.speechSynthesis?.speaking || false
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return window.speechSynthesis?.getVoices() || []
  }

  getPreferredVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices()

    // Prefer high-quality voices
    const preferredNames = ["Google US English", "Microsoft Zira", "Alex", "Samantha"]

    for (const name of preferredNames) {
      const voice = voices.find((v) => v.name.includes(name))
      if (voice) return voice
    }

    // Fallback to first English voice
    return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null
  }
}

export const voiceSynthesis = new VoiceSynthesisManager()
