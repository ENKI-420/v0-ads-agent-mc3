"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ExecutiveAnimatedBackgroundProps {
  className?: string
}

export function ExecutiveAnimatedBackground({ className }: ExecutiveAnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let particles: Particle[] = []
    let lightRays: LightRay[] = []

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      particles = [] // Clear particles on resize
      lightRays = [] // Clear light rays on resize
      initParticles()
      initLightRays()
    }

    class Particle {
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
      alpha: number

      constructor(x: number, y: number, radius: number, color: string) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
        }
        this.alpha = Math.random() * 0.8 + 0.2
      }

      draw() {
        ctx!.save()
        ctx!.globalAlpha = this.alpha
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx!.fillStyle = this.color
        ctx!.fill()
        ctx!.restore()
      }

      update() {
        this.x += this.velocity.x
        this.y += this.velocity.y

        if (this.x - this.radius < 0 || this.x + this.radius > width) {
          this.velocity.x = -this.velocity.x
        }
        if (this.y - this.radius < 0 || this.y + this.radius > height) {
          this.velocity.y = -this.velocity.y
        }

        this.draw()
      }
    }

    class LightRay {
      x: number
      y: number
      length: number
      angle: number
      speed: number
      alpha: number

      constructor(x: number, y: number, length: number, angle: number, speed: number) {
        this.x = x
        this.y = y
        this.length = length
        this.angle = angle
        this.speed = speed
        this.alpha = Math.random() * 0.3 + 0.1
      }

      draw() {
        ctx!.save()
        ctx!.globalAlpha = this.alpha
        ctx!.beginPath()
        ctx!.moveTo(this.x, this.y)
        ctx!.lineTo(this.x + Math.cos(this.angle) * this.length, this.y + Math.sin(this.angle) * this.length)
        ctx!.strokeStyle = "rgba(100, 100, 255, 0.7)" // Blueish light
        ctx!.lineWidth = 1.5
        ctx!.stroke()
        ctx!.restore()
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Reset ray if it goes off screen
        if (
          this.x < -this.length ||
          this.x > width + this.length ||
          this.y < -this.length ||
          this.y > height + this.length
        ) {
          this.x = Math.random() * width
          this.y = Math.random() * height
          this.angle = Math.random() * Math.PI * 2
        }
        this.draw()
      }
    }

    const initParticles = () => {
      for (let i = 0; i < 50; i++) {
        const radius = Math.random() * 2 + 0.5
        const x = Math.random() * (width - radius * 2) + radius
        const y = Math.random() * (height - radius * 2) + radius
        particles.push(new Particle(x, y, radius, "rgba(200, 200, 255, 0.8)")) // Light blue/white particles
      }
    }

    const initLightRays = () => {
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const length = Math.random() * 100 + 50
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.5 + 0.1
        lightRays.push(new LightRay(x, y, length, angle, speed))
      }
    }

    const animate = () => {
      ctx!.clearRect(0, 0, width, height)
      ctx!.fillStyle = "rgba(0, 0, 0, 0.05)" // Subtle dark overlay for trail effect
      ctx!.fillRect(0, 0, width, height)

      // Draw subtle geometric grid
      ctx!.strokeStyle = "rgba(50, 50, 100, 0.1)" // Dark blue/purple grid
      ctx!.lineWidth = 0.5
      const gridSize = 50
      for (let x = 0; x < width; x += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, height)
        ctx!.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(width, y)
        ctx!.stroke()
      }

      particles.forEach((particle) => particle.update())
      lightRays.forEach((ray) => ray.update())

      animationFrameId.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full z-0", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  )
}
