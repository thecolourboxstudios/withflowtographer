"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader() {
  const [showStartButton, setShowStartButton] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number; duration: number }>>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Generate particle positions on client side only
    const particleData = Array.from({ length: 30 }, () => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4
    }))
    setParticles(particleData)

    // Preload audio
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/camera-shutter.mp3')
      audioRef.current.volume = 1.0
      audioRef.current.preload = 'auto'
      audioRef.current.load()
    }
  }, [])

  const handleStart = () => {
    setShowStartButton(false)
    document.body.style.overflow = "hidden"

    // Smooth loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        const newProgress = prev < 60 ? prev + 1.5 : prev < 90 ? prev + 2.5 : Math.min(prev + 5, 100)
        
        // Play camera sound when reaching 100%
        if (prev < 100 && newProgress >= 100) {
          if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(err => console.log('Audio play failed:', err))
          }
        }
        
        return newProgress
      })
    }, 40)

    const timer = setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = "unset"
    }, 3800)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden"
          style={{ position: 'fixed' }}
        >
          {/* Ambient Light Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-radial from-[#ff5f1f]/20 via-transparent to-transparent blur-3xl"
          />

          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: particle.x,
                  y: particle.y,
                  opacity: 0
                }}
                animate={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : particle.x),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : particle.y),
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-[#ff5f1f] rounded-full"
                style={{
                  boxShadow: "0 0 10px #ff5f1f"
                }}
              />
            ))}
          </div>

          {!showStartButton && (
            <>
              {/* Camera Shutter Animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 1, opacity: 0.8 }}
                    animate={{
                      scaleY: 0,
                      opacity: 0,
                      transition: {
                        duration: 0.7,
                        delay: 2.8 + i * 0.04,
                        ease: [0.85, 0, 0.15, 1]
                      }
                    }}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(${i * 45}deg, rgba(255, 95, 31, 0.15) 0%, transparent 70%)`,
                      transformOrigin: "center",
                      transform: `rotate(${i * 45}deg)`
                    }}
                  />
                ))}
              </div>

              {/* Camera Flash Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: 0.4,
                  delay: 2.5,
                  times: [0, 0.5, 1],
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[#ffffff] pointer-events-none"
              />
            </>
          )}

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-6 md:gap-10 px-4">
            {/* Photographer Image with Enhanced Effects */}
            <div className="relative">
              {/* Outer Rings */}
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 360,
                  opacity: 1
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className="absolute inset-0 -m-6 rounded-full border-2 border-[#ff5f1f]/20"
              />
              
              <motion.div
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: -360,
                  opacity: 1
                }}
                transition={{ 
                  duration: 1.4, 
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: 0.1
                }}
                className="absolute inset-0 -m-10 rounded-full border border-[#ff5f1f]/10"
              />

              {/* Image Container with Aperture Effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 1, 
                  delay: 0.3, 
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden"
              >
                {/* Aperture Blades Effect */}
                {!showStartButton && (
                  <div className="absolute inset-0 z-10">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ 
                          scaleX: 1,
                          opacity: 0.3
                        }}
                        transition={{
                          duration: 0.6,
                          delay: 0.6 + i * 0.08,
                          ease: "easeOut"
                        }}
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(${45 * i}deg, rgba(255, 95, 31, 0.3) 0%, transparent 60%)`,
                          transformOrigin: "center",
                          transform: `rotate(${45 * i}deg)`,
                          clipPath: "polygon(50% 50%, 50% 0%, 100% 0%)"
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Photographer Image */}
                <motion.img
                  src="https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767450385/Screenshot_2026-01-03_195554_rv8xci.jpg"
                  alt="Photographer"
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                  className="w-full h-full object-cover"
                />

                {/* Animated Border Glow */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 95, 31, 0.4), inset 0 0 20px rgba(255, 95, 31, 0.1)",
                      "0 0 40px rgba(255, 95, 31, 0.7), inset 0 0 30px rgba(255, 95, 31, 0.2)",
                      "0 0 20px rgba(255, 95, 31, 0.4), inset 0 0 20px rgba(255, 95, 31, 0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full border-[3px] border-[#ff5f1f]"
                />
              </motion.div>

              {/* Orbiting Camera Icons */}
              {!showStartButton && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 25, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 -m-8 md:-m-12"
                >
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        opacity: 1
                      }}
                      transition={{ 
                        delay: 1.2 + i * 0.15, 
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="absolute w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#ff5f1f] drop-shadow-[0_0_8px_rgba(255,95,31,0.8)]"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `rotate(${i * 90}deg) translateY(-110px) rotate(-${i * 90}deg)`,
                      }}
                    >
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        animate={{
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                      >
                        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </motion.svg>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Text Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: showStartButton ? 0.8 : 1, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center px-4"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#ff5f1f] mb-3 md:mb-4"
                initial={{ opacity: 0, letterSpacing: "0.3em", scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  letterSpacing: "-0.02em",
                  scale: 1
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: showStartButton ? 1 : 1.2,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                style={{
                  textShadow: "0 0 30px rgba(255, 95, 31, 0.5), 0 0 60px rgba(255, 95, 31, 0.3)"
                }}
              >
                Rahul Vadhs
              </motion.h1>
              
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ 
                  duration: 1, 
                  delay: showStartButton ? 1.3 : 1.5,
                  ease: "easeOut"
                }}
                className="h-0.5 md:h-1 bg-gradient-to-r from-transparent via-[#ff5f1f] to-transparent mx-auto mb-3 md:mb-4"
                style={{
                  boxShadow: "0 0 10px rgba(255, 95, 31, 0.6)"
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: showStartButton ? 1.5 : 1.7, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl font-light text-white/80 tracking-[0.3em] uppercase"
              >
                Photography
              </motion.p>
            </motion.div>

            {/* Start Button */}
            {showStartButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                onClick={handleStart}
                className="relative mt-8 group"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 95, 31, 0.5)",
                      "0 0 40px rgba(255, 95, 31, 0.8)",
                      "0 0 20px rgba(255, 95, 31, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-[#ff5f1f] to-[#ff8f5f] rounded-full text-white font-semibold text-lg md:text-xl tracking-wider uppercase flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Enter Portfolio
                </motion.div>
              </motion.button>
            )}
          </div>

          {/* Enhanced Loading Progress Bar */}
          {!showStartButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 w-[280px] sm:w-80 md:w-96 px-4"
            >
              <div className="relative h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#ff5f1f] to-[#ff8f5f] rounded-full relative"
                  style={{
                    boxShadow: "0 0 20px rgba(255, 95, 31, 0.6)"
                  }}
                >
                  {/* Progress glow effect */}
                  <motion.div
                    animate={{
                      x: [-20, 200],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-3 md:mt-4 text-center"
              >
                <motion.span
                  key={progress}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#ff5f1f] text-sm md:text-base font-semibold tracking-wider"
                  style={{
                    textShadow: "0 0 10px rgba(255, 95, 31, 0.5)"
                  }}
                >
                  {Math.floor(progress)}%
                </motion.span>
              </motion.div>
            </motion.div>
          )}

          {/* Film Strip Top */}
          <div className="absolute top-0 left-0 w-full h-6 md:h-8 flex justify-around bg-gradient-to-b from-black to-transparent border-b border-[#ff5f1f]/30">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ 
                  delay: i * 0.02, 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="w-3 md:w-4 h-full bg-[#ff5f1f]/40"
                style={{
                  boxShadow: "0 0 5px rgba(255, 95, 31, 0.3)"
                }}
              />
            ))}
          </div>

          {/* Film Strip Bottom */}
          <div className="absolute bottom-0 left-0 w-full h-6 md:h-8 flex justify-around bg-gradient-to-t from-black to-transparent border-t border-[#ff5f1f]/30">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ 
                  delay: i * 0.02, 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="w-3 md:w-4 h-full bg-[#ff5f1f]/30"
              />
            ))}
          </div>

          {/* Vignette Effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}