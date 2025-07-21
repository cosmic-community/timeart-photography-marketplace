'use client'

import { useState, useEffect } from 'react'
import { formatTime } from '@/lib/utils'
import type { TimeDisplayProps } from '@/types'

export default function TimeDisplay({ format = '12hr', className = '' }: TimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className={`time-display text-6xl md:text-8xl lg:text-9xl ${className}`}>
        --:--:--
      </div>
    )
  }

  return (
    <div className="text-center animate-fade-in">
      <div className={`time-display text-6xl md:text-8xl lg:text-9xl ${className}`}>
        {formatTime(currentTime, format)}
      </div>
      <div className="text-white/80 text-lg md:text-xl mt-4 font-light tracking-wide">
        {currentTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  )
}