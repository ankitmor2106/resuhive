import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  iconClassName?: string
  textClassName?: string
}

export function Logo({ className, showText = false, iconClassName, textClassName }: LogoProps) {
  const svg = (
    <svg 
      viewBox="10 0 124 124" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={showText ? cn("h-full aspect-square", iconClassName) : cn("h-full aspect-square", className)}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Main Document Outline */}
      <path
        d="M 30,20 
           L 80,20 
           Q 90,20 90,30 
           L 90,90 
           L 60,120 
           L 30,120 
           Q 20,120 20,110 
           L 20,30 
           Q 20,20 30,20 Z"
        stroke="url(#logoGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The Fold */}
      <path
        d="M 88,91 L 68,91 Q 61,91 61,98 L 61,118 L 88,91 Z"
        fill="url(#logoGrad)"
      />

      {/* Avatar Head */}
      <circle cx="45" cy="45" r="8" fill="url(#logoGrad)" />
      {/* Avatar Shoulders */}
      <path d="M 32,62 C 32,54 58,54 58,62 Z" fill="url(#logoGrad)" />

      {/* Top Lines */}
      <rect x="65" y="40" width="16" height="4" rx="2" fill="url(#logoGrad)" />
      <rect x="65" y="50" width="10" height="4" rx="2" fill="url(#logoGrad)" />

      {/* Bullet 1 */}
      <circle cx="34" cy="77" r="3.5" fill="url(#logoGrad)" />
      <rect x="43" y="75" width="38" height="4" rx="2" fill="url(#logoGrad)" />
      
      {/* Bullet 2 */}
      <circle cx="34" cy="91" r="3.5" fill="url(#logoGrad)" />
      <rect x="43" y="89" width="38" height="4" rx="2" fill="url(#logoGrad)" />

      {/* Bullet 3 */}
      <circle cx="34" cy="105" r="3.5" fill="url(#logoGrad)" />
      <rect x="43" y="103" width="15" height="4" rx="2" fill="url(#logoGrad)" />

      {/* Sparkle 1 (Large) */}
      <path
        d="M 98,4 Q 98,22 116,22 Q 98,22 98,40 Q 98,22 80,22 Q 98,22 98,4 Z"
        fill="url(#logoGrad)"
      />
      
      {/* Sparkle 2 (Small) */}
      <path
        d="M 120,5 Q 120,13 128,13 Q 120,13 120,21 Q 120,13 112,13 Q 120,13 120,5 Z"
        fill="url(#logoGrad)"
      />
    </svg>
  )

  if (!showText) {
    return svg
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("h-12 w-auto", iconClassName)}>{svg}</div>
      <div className={cn("flex flex-col justify-center", textClassName)}>
        <div className="text-3xl font-extrabold tracking-tight leading-none">
          <span className="text-foreground">resu</span>
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">mate</span>
        </div>
        <div className="text-[0.6rem] font-bold tracking-[0.3em] text-muted-foreground mt-1 ml-1">
          AI RESUME BUILDER
        </div>
      </div>
    </div>
  )
}
