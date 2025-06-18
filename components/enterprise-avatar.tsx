"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Text, Float, Environment } from "@react-three/drei"
import { useSpring, animated as a } from "@react-spring/three"
import { Shield, Target, Users, Brain, Video, FileText, Zap, Lock } from "lucide-react"
import { AIChatInterface } from "./ai-chat-interface"

// Enhanced particle system with physics-inspired motion
function SwirlingParticles({
  mouse,
  intensity = 1,
}: { mouse: React.MutableRefObject<[number, number]>; intensity?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const particleCount = 150
  const positions = useRef(new Float32Array(particleCount * 3))
  const velocities = useRef(new Float32Array(particleCount * 3))
  const originalPositions = useRef(new Float32Array(particleCount * 3))

  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      // Create a more complex vortex pattern
      const angle = (i / particleCount) * Math.PI * 6
      const radius = 2 + Math.sin(angle * 2) * 0.8
      const height = (i / particleCount - 0.5) * 3

      const x = radius * Math.cos(angle) + (Math.random() - 0.5) * 0.5
      const y = height + Math.sin(angle * 4) * 0.3
      const z = radius * Math.sin(angle) + (Math.random() - 0.5) * 0.5

      positions.current[i * 3] = x
      positions.current[i * 3 + 1] = y
      positions.current[i * 3 + 2] = z

      originalPositions.current[i * 3] = x
      originalPositions.current[i * 3 + 1] = y
      originalPositions.current[i * 3 + 2] = z

      velocities.current[i * 3] = (Math.random() - 0.5) * 0.003
      velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const time = clock.getElapsedTime()
    const pos = positions.current
    const vel = velocities.current
    const orig = originalPositions.current

    // Mouse influence (normalized)
    const mx = (mouse.current[0] / window.innerWidth) * 2 - 1
    const my = -((mouse.current[1] / window.innerHeight) * 2 - 1)

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3

      // Add orbital motion
      const orbitalSpeed = 0.5 + (i % 10) * 0.1
      const orbitalRadius = 0.3

      // Mouse attraction with falloff
      const mouseInfluence = 0.0005 * intensity
      vel[ix] += mx * mouseInfluence - vel[ix] * 0.02
      vel[ix + 2] += my * mouseInfluence - vel[ix + 2] * 0.02

      // Orbital motion around original position
      const orbitalX = Math.cos(time * orbitalSpeed + i) * orbitalRadius
      const orbitalZ = Math.sin(time * orbitalSpeed + i) * orbitalRadius

      // Update positions with orbital motion and mouse influence
      pos[ix] = orig[ix] + orbitalX + vel[ix] * 100
      pos[ix + 1] = orig[ix + 1] + Math.sin(time * 2 + i * 0.1) * 0.1
      pos[ix + 2] = orig[ix + 2] + orbitalZ + vel[ix + 2] * 100
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions.current} count={particleCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#fbbf24"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.6 * intensity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Enhanced avatar with breathing and state animations
const EnterpriseAvatarMesh = forwardRef<
  any,
  {
    speaking: boolean
    listening: boolean
    intensity: number
    chatActive?: boolean
  }
>(({ speaking, listening, intensity, chatActive }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Mesh>(null!)

  const { scale, emissiveIntensity, rotationY } = useSpring({
    scale: speaking ? 1.2 : listening ? 1.1 : 1,
    emissiveIntensity: listening ? 1.5 : speaking ? 2.0 : 0.8,
    rotationY: speaking ? Math.PI * 2 : 0,
    config: { tension: 120, friction: 25 },
  })

  useImperativeHandle(ref, () => ({
    startSpeaking: () => {},
    stopSpeaking: () => {},
    startListening: () => {},
    stopListening: () => {},
  }))

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Breathing animation
    const breathScale = 1 + Math.sin(t * 1.5) * 0.05
    if (meshRef.current) {
      meshRef.current.scale.setScalar(breathScale * scale.get())
    }

    // Glow pulse
    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = (0.15 + Math.sin(t * 3) * 0.1) * intensity
    }

    // Emissive intensity update
    if (meshRef.current && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.emissiveIntensity = emissiveIntensity.get() * intensity
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <a.group rotation-y={rotationY}>
        {/* Main avatar geometry */}
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            metalness={0.7}
            roughness={0.2}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Outer glow ring */}
        <mesh ref={glowRef} scale={[1.3, 1.3, 1.3]} position={[0, 0, 0]}>
          <torusGeometry args={[1.5, 0.1, 8, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.2} />
        </mesh>

        {/* Floating text */}
        <Text
          ref={textRef}
          position={[0, -2.5, 0]}
          fontSize={0.3}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
        >
          ADSTech AI
        </Text>
      </a.group>
    </Float>
  )
})

EnterpriseAvatarMesh.displayName = "EnterpriseAvatarMesh"

// Capability data with enhanced descriptions
const capabilities = [
  {
    title: "Defense-Grade Security",
    description:
      "Military-standard encryption with HIPAA, SOC2, and GDPR compliance modes. Zero-trust architecture with role-based access control.",
    icon: Shield,
    color: "text-green-400",
  },
  {
    title: "Domain AI Specialists",
    description:
      "Expert-tuned models for oncology, defense, legal, and enterprise verticals with superior accuracy and regulatory compliance.",
    icon: Target,
    color: "text-blue-400",
  },
  {
    title: "Multi-Agent Collaboration",
    description:
      "Specialized AI copilots for clinicians, attorneys, analysts, and enterprise users with role-specific vocabularies and protocols.",
    icon: Users,
    color: "text-purple-400",
  },
  {
    title: "Vector Memory & RAG",
    description:
      "Encrypted vector database for long-term knowledge retention with fast, low-latency retrieval-augmented generation.",
    icon: Brain,
    color: "text-pink-400",
  },
  {
    title: "Real-Time Multi-Modal",
    description:
      "WebRTC video conferencing with AI transcription, live analysis, and collaborative intelligence features.",
    icon: Video,
    color: "text-red-400",
  },
  {
    title: "Secure Document Intelligence",
    description:
      "Permission-tagged document processing with Epic FHIR, Redox integration, and enterprise knowledge connectors.",
    icon: FileText,
    color: "text-orange-400",
  },
]

// Enhanced capability card with animations
function CapabilityCard({
  capability,
  isActive,
  onHover,
  onLeave,
}: {
  capability: (typeof capabilities)[0]
  isActive: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = capability.icon

  const handlePointerOver = () => {
    setHovered(true)
    onHover()
  }

  const handlePointerOut = () => {
    setHovered(false)
    onLeave()
  }

  return (
    <article
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      tabIndex={0}
      onFocus={handlePointerOver}
      onBlur={handlePointerOut}
      className={`
        group p-6 rounded-xl border transition-all duration-500 ease-out cursor-pointer
        ${
          isActive || hovered
            ? "border-gold-400 bg-gold-500/10 shadow-lg shadow-gold-500/20 scale-105"
            : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
        }
        backdrop-blur-sm
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`
          p-3 rounded-lg transition-all duration-300
          ${isActive || hovered ? "bg-gold-500/20" : "bg-gray-700/50"}
        `}
        >
          <Icon
            className={`w-6 h-6 ${capability.color} transition-transform duration-300 ${hovered ? "scale-110" : ""}`}
          />
        </div>
        <div className="flex-1">
          <h3
            className={`
            text-xl font-semibold mb-2 transition-colors duration-300
            ${isActive || hovered ? "text-gold-400" : "text-white"}
          `}
          >
            {capability.title}
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm">{capability.description}</p>
        </div>
      </div>
    </article>
  )
}

// Main Enterprise Avatar component
export default function EnterpriseAvatar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [manualControl, setManualControl] = useState(false)
  const [intensity, setIntensity] = useState(1)
  const [showChat, setShowChat] = useState(false)
  const [chatSpeaking, setChatSpeaking] = useState(false)
  const [chatListening, setChatListening] = useState(false)

  const mouse = useRef<[number, number]>([0, 0])
  const avatarRef = useRef<any>(null)
  const cycleTimeoutRef = useRef<NodeJS.Timeout>()
  const fadeTimeoutRef = useRef<NodeJS.Timeout>()

  // Welcome message on mount
  useEffect(() => {
    const welcomeTimeout = setTimeout(() => {
      if (voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(
          "Welcome to ADSTech. Your next-generation AI platform for secure, domain-specialized solutions is ready.",
        )
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 0.8
        window.speechSynthesis.speak(utterance)
      }
    }, 1000)

    return () => clearTimeout(welcomeTimeout)
  }, [voiceEnabled])

  // Capability cycling with voice synthesis
  useEffect(() => {
    if (manualControl) return

    cycleTimeoutRef.current = setInterval(() => {
      setIsVisible(false)

      fadeTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % capabilities.length)
        setIsVisible(true)

        // Voice synthesis for new capability
        if (voiceEnabled) {
          setSpeaking(true)
          const capability = capabilities[(currentIndex + 1) % capabilities.length]
          const utterance = new SpeechSynthesisUtterance(`${capability.title}. ${capability.description}`)
          utterance.rate = 0.9
          utterance.pitch = 1.1
          utterance.volume = 0.7

          utterance.onstart = () => setSpeaking(true)
          utterance.onend = () => {
            setSpeaking(false)
            setListening(true)
            setTimeout(() => setListening(false), 2000)
          }

          window.speechSynthesis.speak(utterance)
        }
      }, 500)
    }, 8000)

    return () => {
      clearInterval(cycleTimeoutRef.current)
      clearTimeout(fadeTimeoutRef.current)
    }
  }, [manualControl, voiceEnabled, currentIndex])

  // Mouse tracking for particle interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = [e.clientX, e.clientY]
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Intensity based on activity
  useEffect(() => {
    setIntensity(speaking || chatSpeaking ? 1.5 : listening || chatListening ? 1.2 : 1)
  }, [speaking, listening, chatSpeaking, chatListening])

  const handleCapabilityHover = useCallback((index: number) => {
    setCurrentIndex(index)
    setManualControl(true)
  }, [])

  const handleCapabilityLeave = useCallback(() => {
    setManualControl(false)
  }, [])

  return (
    <section className="w-full max-w-7xl mx-auto p-8 flex flex-col lg:flex-row items-center gap-12 text-white">
      {/* 3D Avatar Canvas */}
      <div className="w-full lg:w-2/5 h-[500px] rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl overflow-hidden">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <Environment preset="night" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#fbbf24" />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />

          <SwirlingParticles mouse={mouse} intensity={intensity} />
          <EnterpriseAvatarMesh
            ref={avatarRef}
            speaking={speaking || chatSpeaking}
            listening={listening || chatListening}
            intensity={intensity}
            chatActive={showChat}
          />
        </Canvas>
      </div>

      {/* Content Panel */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-gold-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              ADSTech Platform
            </h1>
          </div>
          <p className="text-xl text-gray-300 leading-relaxed">
            Next-generation AI platform delivering defense-grade security with domain specialization across oncology,
            legal, defense, and enterprise verticals.
          </p>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${
                  voiceEnabled
                    ? "bg-gold-500 text-gray-900 hover:bg-gold-400"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }
              `}
            >
              {voiceEnabled ? "Voice On" : "Voice Off"}
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${showChat ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}
              `}
            >
              {showChat ? "Hide Chat" : "Start Chat"}
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Defense-Grade Secure</span>
            </div>
          </div>
        </header>

        {/* Capabilities Grid */}
        <div
          className={`
            grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-70 translate-y-2"}
          `}
        >
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.title}
              capability={capability}
              isActive={index === currentIndex}
              onHover={() => handleCapabilityHover(index)}
              onLeave={handleCapabilityLeave}
            />
          ))}
        </div>

        {/* AI Chat Interface */}
        {showChat && (
          <div className="mt-8">
            <AIChatInterface
              role="enterprise"
              complianceMode="SOC2"
              capabilities={capabilities.map((c) => c.title)}
              onSpeakingChange={setChatSpeaking}
              onListeningChange={setChatListening}
              className="max-w-4xl mx-auto"
            />
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex items-center gap-6 text-sm">
          <div className={`flex items-center gap-2 ${speaking ? "text-gold-400" : "text-gray-500"}`}>
            <div className={`w-2 h-2 rounded-full ${speaking ? "bg-gold-400 animate-pulse" : "bg-gray-500"}`} />
            <span>AI Speaking</span>
          </div>
          <div className={`flex items-center gap-2 ${listening ? "text-blue-400" : "text-gray-500"}`}>
            <div className={`w-2 h-2 rounded-full ${listening ? "bg-blue-400 animate-pulse" : "bg-gray-500"}`} />
            <span>AI Listening</span>
          </div>
        </div>
      </div>
    </section>
  )
}
