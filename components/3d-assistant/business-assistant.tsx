"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Sphere, Box, Cylinder } from "@react-three/drei"
import type * as THREE from "three"

// Animated floating orb component
function FloatingOrb({
  position,
  color,
  scale = 1,
}: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <Sphere ref={meshRef} position={position} scale={scale} args={[0.5, 32, 32]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </Sphere>
  )
}

// Data visualization cubes
function DataCube({
  position,
  color,
  height = 1,
}: { position: [number, number, number]; color: string; height?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.scale.y = height + Math.sin(state.clock.elapsedTime * 3) * 0.1
    }
  })

  return (
    <Box ref={meshRef} position={position} args={[0.3, height, 0.3]}>
      <meshStandardMaterial color={color} />
    </Box>
  )
}

// Central AI core
function AiCore() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.3} transparent opacity={0.8} />
      </Sphere>

      {/* Orbiting rings */}
      {[0, 1, 2].map((i) => (
        <Cylinder
          key={i}
          args={[1.2, 1.2, 0.05, 32]}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
        >
          <meshStandardMaterial color="#06b6d4" transparent opacity={0.3} wireframe />
        </Cylinder>
      ))}
    </group>
  )
}

// Scene component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

      {/* Central AI Core */}
      <AiCore />

      {/* Floating orbs representing different AI capabilities */}
      <FloatingOrb position={[3, 2, 0]} color="#10b981" scale={0.6} />
      <FloatingOrb position={[-3, 1, 2]} color="#f59e0b" scale={0.8} />
      <FloatingOrb position={[2, -1, -3]} color="#ef4444" scale={0.7} />
      <FloatingOrb position={[-2, 2, -1]} color="#8b5cf6" scale={0.5} />

      {/* Data visualization cubes */}
      <DataCube position={[4, -2, 1]} color="#06b6d4" height={1.5} />
      <DataCube position={[-4, -2, -1]} color="#10b981" height={2} />
      <DataCube position={[1, -2, 4]} color="#f59e0b" height={1.2} />
      <DataCube position={[-1, -2, -4]} color="#ef4444" height={1.8} />

      {/* Floating text */}
      <Text position={[0, 3, 0]} fontSize={0.5} color="#4f46e5" anchorX="center" anchorY="middle">
        AI Business Assistant
      </Text>

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export const BusinessAssistant: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
