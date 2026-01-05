"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AnimatedCounterProps {
  target: number
  label: string
  unit?: string
}

function AnimatedCounter({ target, label, unit = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [target])

  return (
    <div className="text-left sm:text-right">
      <div className="text-xs uppercase tracking-wider text-lorenzo-text-light/60 mb-2">{label}</div>
      <div className="text-5xl sm:text-6xl md:text-8xl font-black text-lorenzo-accent">
        {count}
        {unit}
      </div>
    </div>
  )
}

const videoUrls = [
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424190/NItya_Emcee_KWaa_idtfui.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424220/O3_Sport_Muay_Thai_Reel_ue6kdz.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424202/Nitya_Emcee_Welcore_1st_cut_wvfdnw.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424181/Nithya_IWAA_KWAA_slijab.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424153/Muro_Final_f1gpbv.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424146/Muay_thai_Reel_5_kcpuha.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424114/Muay_Thai_Final_Video_greuxp.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424124/Muay_Thai_Reel_2_pr696t.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424083/Leela_Final_huv23d.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424096/Monet_Final_d60elf.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424059/Glenn_Grant_Reel_2_Final_fj4reb.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767420310/1664_Final_Showreel_tja4ai.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424010/Fire_Ball_Reel_1_s99ot7.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767424039/GlenGrant_Reel_1_Final_oyo8ch.mp4",
  "https://res.cloudinary.com/dbbzsyl8u/video/upload/v1767423983/AOL_Final_cut_ndqmpq.mp4",
]

export default function VideoShowcase() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length)
    }, 8000) // Change video every 8 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="video" className="relative bg-lorenzo-dark px-6 md:px-12 overflow-hidden pb-5">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen">
          <div className="flex flex-col justify-center items-start lg:items-end lg:pr-12 order-2 lg:order-1">
            <div className="relative">
              {/* Large decorative quote */}
              <div
                className="absolute -left-4 sm:-left-16 -top-16 sm:-top-20 lg:-left-24 lg:-top-32 text-lorenzo-accent opacity-30 text-[160px] sm:text-[200px] lg:text-[280px] leading-none pointer-events-none select-none"
                style={{ fontFamily: "var(--font-alex-brush), cursive" }}
              >
                &ldquo;
              </div>

              {/* Main quote with improved spacing and hierarchy */}
              <blockquote className="relative z-10 max-w-xl">
                <p className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-lorenzo-text-light leading-[1.1] tracking-tight mb-8">
                  <span className="block mb-2">I CAPTURE</span>
                  <span className="block mb-2">STORIES THAT</span>
                  <span className="block text-lorenzo-accent font-brier normal-case text-5xl md:text-6xl -ml-1 lg:text-8xl">
                    INSPIRE
                  </span>
                  <span className="block mt-2">THROUGH THE</span>
                  <span className="block">LENS.</span>
                </p>
              </blockquote>

         {/* Author attribution */}
<div className="mt-4">
  <p className="text-base font-medium font-mono md:text-lg text-accent">
    – Rahul Vadhs
    <br />
    <span className="text-sm md:text-base text-muted-foreground">
      CO-founder at The Colour Box Studio, Professional Photographer & Videographer
    </span>
  </p>
</div>


              {/* Video stats */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                <AnimatedCounter target={1000} label="PROJECTS" unit="+" />
                <AnimatedCounter target={8} label="YEARS" unit="+" />
                <AnimatedCounter target={100} label="CLIENTS" unit="+" />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative w-full aspect-[9/16] sm:aspect-[4/5] md:aspect-square max-w-sm sm:max-w-lg mx-auto lg:mx-0 order-1 lg:order-2"
          >
            {/* Video Player */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <video
                key={currentVideoIndex}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                src={videoUrls[currentVideoIndex]}
              />
              
              {/* Video overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Video counter */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {currentVideoIndex + 1}/{videoUrls.length}
                </span>
              </div>
            </div>

            {/* Video thumbnails */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
              {videoUrls.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentVideoIndex === index ? "bg-lorenzo-accent w-6" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
