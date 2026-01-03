"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    const timer = setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = "unset"
    }, 3500)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
      document.body.style.overflow = "unset"
    }
  }, [])

  // Shutter blade animation variants
  const shutterVariants = {
    initial: { scaleY: 1 },
    animate: { scaleY: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.3 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-[#ccff00] via-transparent to-[#ccff00]"
          />

          {/* Camera Shutter Animation Overlays */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 1, opacity: 1 }}
                animate={{
                  scaleY: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.6,
                    delay: 2.5 + i * 0.05,
                    ease: [0.76, 0, 0.24, 1]
                  }
                }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(${i * 45}deg, rgba(204, 255, 0, 0.1) 0%, transparent 100%)`,
                  transformOrigin: "center",
                  transform: `rotate(${i * 45}deg)`
                }}
              />
            ))}
          </div>

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-8">
            {/* Photographer Image with Camera Aperture Effect */}
            <div className="relative">
              {/* Outer Ring */}
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 -m-4 rounded-full border-4 border-[#ccff00]/30"
              />

              {/* Image Container with Aperture Blades */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden"
              >
                {/* Aperture Blades Effect */}
                <div className="absolute inset-0 z-10">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + i * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(${60 * i}deg, rgba(204, 255, 0, 0.2) 0%, transparent 50%)`,
                        transformOrigin: "center",
                        transform: `rotate(${60 * i}deg)`,
                        clipPath: "polygon(50% 50%, 50% 0%, 100% 0%)"
                      }}
                    />
                  ))}
                </div>

                {/* Photographer Image */}
                <motion.img
                  src="https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767450385/Screenshot_2026-01-03_195554_rv8xci.jpg"
                  alt="Photographer"
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="w-full h-full object-cover"
                />

                {/* Border Glow */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(204, 255, 0, 0.3)",
                      "0 0 40px rgba(204, 255, 0, 0.6)",
                      "0 0 20px rgba(204, 255, 0, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-[#ccff00]"
                />
              </motion.div>

              {/* Rotating Camera Icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-8"
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                    className="absolute w-6 h-6 md:w-8 md:h-8 text-[#ccff00]"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `rotate(${i * 90}deg) translateY(-140px) rotate(-${i * 90}deg)`
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Text Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold tracking-tighter text-[#ccff00] mb-2"
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "-0.05em" }}
                transition={{ duration: 1, delay: 1 }}
              >
                Rahul Vadhs
              </motion.h1>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="h-1 bg-[#ccff00] mx-auto mb-3"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-xl md:text-2xl font-light text-white/90 tracking-widest uppercase"
              >
                Photography
              </motion.p>
            </motion.div>
          </div>

          {/* Loading Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 w-64 md:w-96"
          >
            <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#ccff00] rounded-full"
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-3 text-center text-[#ccff00] text-sm font-medium tracking-wider"
            >
              {progress}%
            </motion.div>
          </motion.div>

          {/* Film Strip Decoration */}
          <div className="absolute top-0 left-0 w-full h-8 flex justify-around bg-black border-b-2 border-[#ccff00]/30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="w-4 h-full bg-[#ccff00]/20"
              />
            ))}
          </div>

          {/* Bottom Film Strip */}
          <div className="absolute bottom-0 left-0 w-full h-8 flex justify-around bg-black border-t-2 border-[#ccff00]/30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="w-4 h-full bg-[#ccff00]/20"
              />
            ))}
          </div>

          {/* Flash Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.3,
              delay: 2,
              times: [0, 0.5, 1]
            }}
            className="absolute inset-0 bg-[#ccff00] pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}