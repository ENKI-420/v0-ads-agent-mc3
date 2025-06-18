export interface WebRTCConfig {
  iceServers: RTCIceServer[]
  mediaConstraints: MediaStreamConstraints
  dataChannelConfig: RTCDataChannelInit
}

export interface ParticipantData {
  id: string
  name: string
  role: string
  isHost: boolean
  stream?: MediaStream
  audioEnabled: boolean
  videoEnabled: boolean
}

export interface TranscriptionEvent {
  participantId: string
  text: string
  timestamp: Date
  confidence: number
  isFinal: boolean
}

export class WebRTCConnectionManager {
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private localStream: MediaStream | null = null
  private dataChannels: Map<string, RTCDataChannel> = new Map()
  private participants: Map<string, ParticipantData> = new Map()
  private transcriptionProcessor: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null

  private config: WebRTCConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
    mediaConstraints: {
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
      },
    },
    dataChannelConfig: {
      ordered: true,
      maxRetransmits: 3,
    },
  }

  // Event handlers
  onParticipantJoined?: (participant: ParticipantData) => void
  onParticipantLeft?: (participantId: string) => void
  onStreamReceived?: (participantId: string, stream: MediaStream) => void
  onTranscription?: (event: TranscriptionEvent) => void
  onAIAnalysis?: (analysis: any) => void
  onConnectionStateChange?: (participantId: string, state: RTCPeerConnectionState) => void

  async initializeLocalMedia(): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(this.config.mediaConstraints)

      // Initialize audio analysis for transcription
      await this.initializeAudioAnalysis()

      return this.localStream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw new Error("Failed to access camera/microphone")
    }
  }

  private async initializeAudioAnalysis(): Promise<void> {
    if (!this.localStream) return

    this.audioContext = new AudioContext()
    this.analyser = this.audioContext.createAnalyser()

    const source = this.audioContext.createMediaStreamSource(this.localStream)
    source.connect(this.analyser)

    this.analyser.fftSize = 2048

    // Start continuous transcription
    this.startContinuousTranscription()
  }

  private startContinuousTranscription(): void {
    if (!this.localStream) return

    // Use MediaRecorder for audio capture
    this.transcriptionProcessor = new MediaRecorder(this.localStream, {
      mimeType: "audio/webm;codecs=opus",
    })

    let audioChunks: Blob[] = []

    this.transcriptionProcessor.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    this.transcriptionProcessor.onstop = async () => {
      if (audioChunks.length === 0) return

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
      audioChunks = []

      try {
        const transcription = await this.processAudioForTranscription(audioBlob)
        if (transcription && this.onTranscription) {
          this.onTranscription({
            participantId: "local",
            text: transcription.text,
            timestamp: new Date(),
            confidence: transcription.confidence,
            isFinal: true,
          })
        }
      } catch (error) {
        console.error("Transcription error:", error)
      }

      // Restart recording for continuous transcription
      if (this.transcriptionProcessor?.state === "inactive") {
        this.transcriptionProcessor.start(3000) // 3-second chunks
      }
    }

    // Start recording in 3-second intervals
    this.transcriptionProcessor.start(3000)
  }

  private async processAudioForTranscription(audioBlob: Blob): Promise<{ text: string; confidence: number } | null> {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "audio.webm")
      formData.append("model", "whisper-1")
      formData.append("language", "en")

      const response = await fetch("/api/ai/transcription", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Transcription failed")

      const result = await response.json()
      return {
        text: result.text,
        confidence: result.confidence || 0.9,
      }
    } catch (error) {
      console.error("Audio processing error:", error)
      return null
    }
  }

  async createPeerConnection(participantId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    })

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!)
      })
    }

    // Handle incoming streams
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      this.onStreamReceived?.(participantId, remoteStream)
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage(participantId, {
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateChange?.(participantId, peerConnection.connectionState)

      if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
        this.handleParticipantDisconnection(participantId)
      }
    }

    // Create data channel for secure messaging
    const dataChannel = peerConnection.createDataChannel("secure-messaging", this.config.dataChannelConfig)
    this.setupDataChannel(participantId, dataChannel)

    this.peerConnections.set(participantId, peerConnection)
    return peerConnection
  }

  private setupDataChannel(participantId: string, dataChannel: RTCDataChannel): void {
    dataChannel.onopen = () => {
      console.log(`Data channel opened with ${participantId}`)
      this.dataChannels.set(participantId, dataChannel)
    }

    dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        this.handleDataChannelMessage(participantId, message)
      } catch (error) {
        console.error("Data channel message error:", error)
      }
    }

    dataChannel.onerror = (error) => {
      console.error(`Data channel error with ${participantId}:`, error)
    }
  }

  private handleDataChannelMessage(participantId: string, message: any): void {
    switch (message.type) {
      case "transcription":
        this.onTranscription?.({
          participantId,
          text: message.text,
          timestamp: new Date(message.timestamp),
          confidence: message.confidence,
          isFinal: message.isFinal,
        })
        break
      case "ai-analysis":
        this.onAIAnalysis?.(message.analysis)
        break
    }
  }

  async createOffer(participantId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(participantId)
    if (!peerConnection) throw new Error("Peer connection not found")

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    return offer
  }

  async createAnswer(participantId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(participantId)
    if (!peerConnection) throw new Error("Peer connection not found")

    await peerConnection.setRemoteDescription(offer)
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    return answer
  }

  async handleAnswer(participantId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.peerConnections.get(participantId)
    if (!peerConnection) throw new Error("Peer connection not found")

    await peerConnection.setRemoteDescription(answer)
  }

  async handleIceCandidate(participantId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnections.get(participantId)
    if (!peerConnection) throw new Error("Peer connection not found")

    await peerConnection.addIceCandidate(candidate)
  }

  sendSecureMessage(participantId: string, message: any): void {
    const dataChannel = this.dataChannels.get(participantId)
    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(JSON.stringify(message))
    }
  }

  broadcastMessage(message: any): void {
    this.dataChannels.forEach((dataChannel, participantId) => {
      if (dataChannel.readyState === "open") {
        dataChannel.send(JSON.stringify(message))
      }
    })
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      })

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0]

      this.peerConnections.forEach(async (peerConnection) => {
        const sender = peerConnection.getSenders().find((s) => s.track && s.track.kind === "video")
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
      })

      return screenStream
    } catch (error) {
      console.error("Screen sharing error:", error)
      throw error
    }
  }

  private handleParticipantDisconnection(participantId: string): void {
    this.peerConnections.delete(participantId)
    this.dataChannels.delete(participantId)
    this.participants.delete(participantId)
    this.onParticipantLeft?.(participantId)
  }

  private sendSignalingMessage(participantId: string, message: any): void {
    // This would typically send through WebSocket or Socket.IO
    // For now, we'll use a placeholder
    console.log(`Signaling message to ${participantId}:`, message)
  }

  getAudioLevel(): number {
    if (!this.analyser) return 0

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    return average / 255 // Normalize to 0-1
  }

  disconnect(): void {
    // Stop transcription
    if (this.transcriptionProcessor && this.transcriptionProcessor.state === "recording") {
      this.transcriptionProcessor.stop()
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close()
    }

    // Close all peer connections
    this.peerConnections.forEach((peerConnection) => {
      peerConnection.close()
    })

    // Close all data channels
    this.dataChannels.forEach((dataChannel) => {
      dataChannel.close()
    })

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }

    // Clear all maps
    this.peerConnections.clear()
    this.dataChannels.clear()
    this.participants.clear()
  }
}
