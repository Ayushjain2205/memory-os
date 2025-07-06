"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  text: string
  color: string
}

export default function LandingPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const memoryTexts = [
    "I prefer coffee in the morning",
    "Meeting with Sarah at 3pm",
    "Learn React this month",
    "Favorite restaurant: Luigi's",
    "Password for work laptop",
    "Mom's birthday is March 15th",
    "Project deadline Friday",
    "Gym membership expires soon",
    "Book recommendation: Atomic Habits",
    "Team prefers Slack over email",
    "Allergic to shellfish",
    "Car needs oil change",
  ]

  const colors = [
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#10B981", // green
    "#F59E0B", // amber
    "#EF4444", // red
    "#06B6D4", // cyan
  ]

  useEffect(() => {
    const initialParticles: Particle[] = memoryTexts.map((text, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 4 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.4,
      text,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setParticles(initialParticles)

    const animate = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + particle.vx
          let newY = particle.y + particle.vy
          let newVx = particle.vx
          let newVy = particle.vy

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth) newVx *= -1
          if (newY <= 0 || newY >= window.innerHeight) newVy *= -1

          // Keep in bounds
          newX = Math.max(0, Math.min(window.innerWidth, newX))
          newY = Math.max(0, Math.min(window.innerHeight, newY))

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          }
        }),
      )
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Floating memory particles */}
      {particles.map((particle) => {
        const distanceToMouse = Math.sqrt(Math.pow(particle.x - mousePos.x, 2) + Math.pow(particle.y - mousePos.y, 2))
        const isNearMouse = distanceToMouse < 150

        return (
          <div
            key={particle.id}
            className="absolute pointer-events-none transition-all duration-300 ease-out"
            style={{
              left: particle.x,
              top: particle.y,
              transform: `translate(-50%, -50%) scale(${isNearMouse ? 1.2 : 1})`,
            }}
          >
            <div
              className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300"
              style={{
                backgroundColor: particle.color,
                opacity: isNearMouse ? 0.9 : particle.opacity,
              }}
            >
              {particle.text}
            </div>

            {/* Connection lines to nearby particles */}
            {particles
              .filter((other) => {
                const distance = Math.sqrt(Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2))
                return other.id !== particle.id && distance < 200
              })
              .slice(0, 2)
              .map((other) => (
                <svg
                  key={`${particle.id}-${other.id}`}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{
                    width: Math.abs(other.x - particle.x),
                    height: Math.abs(other.y - particle.y),
                    transform: `translate(${other.x > particle.x ? 0 : other.x - particle.x}px, ${other.y > particle.y ? 0 : other.y - particle.y}px)`,
                  }}
                >
                  <line
                    x1={other.x > particle.x ? 0 : Math.abs(other.x - particle.x)}
                    y1={other.y > particle.y ? 0 : Math.abs(other.y - particle.y)}
                    x2={other.x > particle.x ? Math.abs(other.x - particle.x) : 0}
                    y2={other.y > particle.y ? Math.abs(other.y - particle.y) : 0}
                    stroke={particle.color}
                    strokeWidth="1"
                    opacity="0.2"
                    className="transition-opacity duration-300"
                  />
                </svg>
              ))}
          </div>
        )
      })}

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src="/logo.png" alt="MemoryOS" className="w-16 h-16" />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">MemoryOS</h1>
              <p className="text-gray-600">Your AI Memory Vault</p>
            </div>
          </div>

          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Information flows.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Memories form.
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Watch your scattered thoughts and data naturally organize into structured, searchable memories. Move your
            cursor to see connections emerge.
          </p>

          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href="/memory">
              Enter Your Memory Vault
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
