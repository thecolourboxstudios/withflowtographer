"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"

const socialImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", // Center image
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80",
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&q=80", // Added to reach 7
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", // Added to reach 7
]

const handIcons = [
  {
    id: "camera",
    viewBox: "0 0 24 24",
    path: "M9 4h6l1 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1-2Zm3 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  },
  {
    id: "aperture",
    viewBox: "0 0 24 24",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.7 3.2 3.2 5.6H13L9.6 5.2a8.1 8.1 0 0 1 4.1 0ZM6.2 6.8 10 13H3.7a8 8 0 0 1 2.5-6.2Zm-2.5 8.4H11l-3.3 5.7a8 8 0 0 1-4-5.7Zm6.8 6 3.2-5.6h6.5a8 8 0 0 1-9.7 5.6Zm11.3-7.8H14l3.3-5.7a8 8 0 0 1 4.5 5.7Z",
  },
  {
    id: "video",
    viewBox: "0 0 24 24",
    path: "M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2l4-2v12l-4-2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z",
  },
  {
    id: "film",
    viewBox: "0 0 24 24",
    path: "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm4 0v2H6V5h2Zm10 0v2h-2V5h2ZM8 17v2H6v-2h2Zm10 0v2h-2v-2h2ZM9 7h6v10H9V7Z",
  },
  {
    id: "gallery",
    viewBox: "0 0 24 24",
    path: "M4 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1H4a2 2 0 0 1-2-2V6Zm3 14h11v-9H7v9Zm0-11h8V6H6v11h1V9Z",
  },
]

export default function SocialSection() {
  const [currentIconIndex, setCurrentIconIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % handIcons.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <section id="social" className="relative bg-[#F5F1E8] text-black py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-32 flex items-center justify-center mt-16">
          {/* Replaced static image with animated icon switcher */}
          <div className="relative h-full w-auto max-h-[60px] aspect-square">
            {handIcons.map((icon, index) => (
              <div
                key={icon.id}
                className={`absolute inset-0 transition-opacity duration-0 flex items-center justify-center ${
                  index === currentIconIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox={icon.viewBox}
                  fill="none"
                  className="text-lorenzo-accent"
                  aria-hidden="true"
                >
                  <path d={icon.path} fill="currentColor" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-2.5"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none leading-[2.25] text-lorenzo-dark lg:text-6xl">
            WHAT'S UP
          </h2>
          <h3 className="text-4xl md:text-6xl font-brier mt-2 lg:text-6xl leading-10 text-lorenzo-dark">ON SOCIALS</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative h-[600px] md:h-[700px] mb-16 flex items-center justify-center"
        >
          {socialImages.map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: 0, scale: 0 }}
              whileInView={{
                opacity: 1,
                rotate: (i - 3) * 6, // Adjusted rotation for 7 items (centered at index 3)
                scale: 1 - Math.abs(i - 3) * 0.02, // Reduced scale drop-off
                x: (i - 3) * (isMobile ? 44 : 90), // Reduce spread on mobile to prevent overflow
                y: Math.abs(i - 3) * (isMobile ? 20 : 35), // Reduce vertical curve on mobile
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.1,
                type: "spring",
                stiffness: 60,
                damping: 12,
              }}
              viewport={{ once: true }}
              whileHover={{
                rotate: 0,
                scale: 1.1,
                zIndex: 20,
                y: -40,
                transition: { duration: 0.3 },
              }}
              className="absolute w-48 sm:w-60 md:w-80 h-72 sm:h-80 md:h-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer origin-bottom"
              style={{ zIndex: 10 - Math.abs(i - 3) }} // Adjusted z-index logic for 7 items
            >
              <div className="relative w-full h-full">
                <Image src={image || "/placeholder.svg"} alt={`Social post ${i + 1}`} fill className="object-cover" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <p className="text-lg md:text-xl font-serif text-black/80 font-medium">Follow Rahul on social media</p>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "TWITTER", url: "https://x.com/RVadhs76595" },
              { name: "INSTAGRAM", url: "https://www.instagram.com/withtheflowtographer/" },
              { name: "EMAIL", url: "mailto:rahulvadhs@gmail.com" },
              { name: "PHONE", url: "tel:9769926713" },
            ].map((platform) => (
              <motion.a
                key={platform.name}
                href={platform.url}
                target={platform.url.startsWith("http") ? "_blank" : undefined}
                rel={platform.url.startsWith("http") ? "noopener noreferrer" : undefined}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="font-black uppercase text-sm tracking-wider text-black hover:text-black/60 transition-colors"
              >
                {platform.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
