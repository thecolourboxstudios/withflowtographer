"use client"

import { motion, PanInfo } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"

type CloudinaryImage = {
  id: number
  public_id: string
  format: string
  width: number
  height: number
}

type CloudinaryResponse = {
  cloudName: string
  resources: CloudinaryImage[]
}

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
  const [currentImageIndex, setCurrentImageIndex] = useState(3)
  const [socialImages, setSocialImages] = useState<string[]>([])
  const [cloudName, setCloudName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch images from Cloudinary
  useEffect(() => {
    const fetchCloudinaryImages = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/cloudinary")
        
        if (!response.ok) {
          throw new Error("Failed to fetch images from Cloudinary")
        }

        const data: CloudinaryResponse = await response.json()
        
        if (data.resources && data.resources.length > 0) {
          // Convert Cloudinary resources to image URLs
          const imageUrls = data.resources.map((resource) => {
            return `https://res.cloudinary.com/${data.cloudName}/image/upload/w_600,q_80/${resource.public_id}.${resource.format}`
          })
          
          setSocialImages(imageUrls)
          setCloudName(data.cloudName)
          
          // Set center image based on available images
          setCurrentImageIndex(Math.floor(imageUrls.length / 2))
        } else {
          setError("No images found in Cloudinary folder")
        }
      } catch (err) {
        console.error("Error fetching Cloudinary images:", err)
        setError(err instanceof Error ? err.message : "Failed to load images")
      } finally {
        setLoading(false)
      }
    }

    fetchCloudinaryImages()
  }, [])

  // Animated icon switcher
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % handIcons.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Detect mobile
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    
    if (info.offset.x > swipeThreshold) {
      setCurrentImageIndex((prev) => (prev === 0 ? socialImages.length - 1 : prev - 1))
    } else if (info.offset.x < -swipeThreshold) {
      setCurrentImageIndex((prev) => (prev === socialImages.length - 1 ? 0 : prev + 1))
    }
  }

  const getCardPosition = (index: number) => {
    const centerIndex = currentImageIndex
    const diff = index - centerIndex
    
    let adjustedDiff = diff
    if (Math.abs(diff) > socialImages.length / 2) {
      adjustedDiff = diff > 0 ? diff - socialImages.length : diff + socialImages.length
    }
    
    return adjustedDiff
  }

  return (
    <section id="social" className="relative bg-[#F5F1E8] text-black py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-32 flex items-center justify-center mt-16">
          {/* Animated icon switcher */}
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black/20 border-t-black"></div>
            <p className="mt-4 text-lg text-black/60">Loading images...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        )}

        {/* Desktop View - Stack of cards */}
        {!isMobile && !loading && socialImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative h-[700px] mb-16 flex items-center justify-center"
          >
            {socialImages.map((image, i) => {
              const centerIndex = Math.floor(socialImages.length / 2)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: 0, scale: 0 }}
                  whileInView={{
                    opacity: 1,
                    rotate: (i - centerIndex) * 6,
                    scale: 1 - Math.abs(i - centerIndex) * 0.02,
                    x: (i - centerIndex) * 90,
                    y: Math.abs(i - centerIndex) * 35,
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
                  className="absolute w-80 h-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer origin-bottom"
                  style={{ zIndex: 10 - Math.abs(i - centerIndex) }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`Social post ${i + 1}`}
                      fill
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Mobile View - Swipeable carousel */}
        {isMobile && !loading && socialImages.length > 0 && (
          <div className="relative h-[600px] mb-16 flex items-center justify-center overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {socialImages.map((image, i) => {
                const position = getCardPosition(i)
                const isCenter = position === 0
                const isVisible = Math.abs(position) <= 3
                
                return (
                  <motion.div
                    key={i}
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={isCenter ? handleDragEnd : undefined}
                    initial={{ opacity: 0, rotate: 0, scale: 0 }}
                    animate={{
                      opacity: isVisible ? 1 : 0,
                      rotate: position * 6,
                      scale: isCenter ? 1 : 1 - Math.abs(position) * 0.08,
                      x: position * 44,
                      y: Math.abs(position) * 20,
                      zIndex: isCenter ? 20 : 10 - Math.abs(position),
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    className="absolute w-48 h-72 bg-white rounded-3xl shadow-2xl overflow-hidden origin-bottom"
                    style={{ 
                      touchAction: 'none',
                      pointerEvents: isCenter ? 'auto' : 'none'
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={`Social post ${i + 1}`}
                        fill
                        className="object-cover pointer-events-none select-none"
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Pagination dots */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
              {socialImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? 'bg-black w-6' : 'bg-black/30'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

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