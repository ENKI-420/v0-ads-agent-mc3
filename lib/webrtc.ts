interface WebRTCConfig {
  iceServers: RTCIceServer[]
  mediaConstraints: MediaStreamConstraints
  dataChannelConfig: RTCDataChannelInit
}

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private dataChannel: RTCDataChannel | null = null
  private isInitiator = false

  private config: WebRTCConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    mediaConstraints: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    },
    dataChannelConfig: {
      ordered: true,
      maxRetransmits: 3,
    },
  }

  async initializeConnection(isInitiator = false): Promise<void> {
    this.isInitiator = isInitiator

    // Create peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    })

    // Set up event handlers
    this.setupEventHandlers()

    // Get user media
    await this.getUserMedia()

    // Create data channel for secure messaging
    if (this.isInitiator) {
      this.createDataChannel()
    }
  }

  private setupEventHandlers(): void {
    if (!this.peerConnection) return

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
      this.onRemoteStreamReceived?.(this.remoteStream)
    }

    this.peerConnection.ondatachannel = (event) => {
      const channel = event.channel
      this.setupDataChannelHandlers(channel)
    }

    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", this.peerConnection?.connectionState)
      this.onConnectionStateChange?.(this.peerConnection?.connectionState || "closed")
    }
  }

  private async getUserMedia(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(this.config.mediaConstraints)

      // Add tracks to peer connection
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!)
      })

      this.onLocalStreamReceived?.(this.localStream)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw error
    }
  }

  private createDataChannel(): void {
    if (!this.peerConnection) return

    this.dataChannel = this.peerConnection.createDataChannel("secure-messaging", this.config.dataChannelConfig)

    this.setupDataChannelHandlers(this.dataChannel)
  }

  private setupDataChannelHandlers(channel: RTCDataChannel): void {
    channel.onopen = () => {
      console.log("Data channel opened")
      this.onDataChannelOpen?.()
    }

    channel.onmessage = (event) => {
      const message = JSON.parse(event.data)
      this.onSecureMessageReceived?.(message)
    }

    channel.onerror = (error) => {
      console.error("Data channel error:", error)
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    return offer
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")

    await this.peerConnection.setRemoteDescription(offer)
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)
    return answer
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")
    await this.peerConnection.setRemoteDescription(answer)
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) throw new Error("Peer connection not initialized")
    await this.peerConnection.addIceCandidate(candidate)
  }

  sendSecureMessage(message: any): void {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(JSON.stringify(message))
    }
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
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    })

    // Replace video track
    const videoTrack = screenStream.getVideoTracks()[0]
    const sender = this.peerConnection?.getSenders().find((s) => s.track && s.track.kind === "video")

    if (sender) {
      await sender.replaceTrack(videoTrack)
    }

    return screenStream
  }

  disconnect(): void {
    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close()
      this.dataChannel = null
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
  }

  // Event handlers (to be set by consumers)
  onLocalStreamReceived?: (stream: MediaStream) => void
  onRemoteStreamReceived?: (stream: MediaStream) => void
  onDataChannelOpen?: () => void
  onSecureMessageReceived?: (message: any) => void
  onConnectionStateChange?: (state: string) => void

  private sendSignalingMessage(message: any): void {
    // This would typically send through WebSocket or Socket.IO
    console.log("Signaling message:", message)
  }
}
