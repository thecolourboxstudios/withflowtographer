"use client"

import Image from "next/image"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

type GalleryItem = {
  id: number
  public_id: string
  format: string
  width: number
  height: number
  resource_type: "image" | "video"
  duration?: number
}

type GalleryApiResponse = {
  cloudName: string
  resources: GalleryItem[]
  error?: string
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function CloudinaryGallerySection() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cloudName, setCloudName] = useState<string>("")
  const [items, setItems] = useState<GalleryItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "image" | "video">("all")

  const [lastViewedId, setLastViewedId] = useState<number | null>(null)
  const lastViewedRef = useRef<HTMLAnchorElement | null>(null)

  const isMobile = useIsMobile()

  const photoIdRaw = searchParams.get("photoId")
  const photoId = photoIdRaw ? Number(photoIdRaw) : null
  const hasValidPhotoId = Number.isFinite(photoId) && photoId !== null

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" })
        const data = (await res.json()) as GalleryApiResponse
        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to load gallery")
        }
        if (!mounted) return
        setCloudName(data.cloudName)
        
        const processedResources = Array.isArray(data.resources) 
          ? data.resources.map(item => ({
              ...item,
              resource_type: item.resource_type || (item.format === 'mp4' || item.format === 'mov' || item.format === 'webm' ? 'video' : 'image')
            }))
          : []
        
        setItems(processedResources)
      } catch (e) {
        if (!mounted) return
        console.error('Gallery load error:', e)
        setError(e instanceof Error ? e.message : "Failed to load gallery")
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (photoIdRaw) return
    const stored = sessionStorage.getItem("lastViewedPhotoId")
    if (!stored) return
    const parsed = Number(stored)
    if (!Number.isFinite(parsed)) return
    setLastViewedId(parsed)
  }, [photoIdRaw])

  useEffect(() => {
    if (photoIdRaw) return
    if (lastViewedId === null) return
    if (!lastViewedRef.current) return
    lastViewedRef.current.scrollIntoView({ 
      block: "center", 
      behavior: "smooth", 
      inline: "center" 
    })
    setLastViewedId(null)
    sessionStorage.removeItem("lastViewedPhotoId")
  }, [lastViewedId, photoIdRaw])

  const openModal = (id: number) => {
    router.push(`/?photoId=${id}`, { scroll: false })
  }

  const closeModal = (currentId: number) => {
    sessionStorage.setItem("lastViewedPhotoId", String(currentId))
    router.push("/", { scroll: false })
  }

  const filteredItems = useMemo(() => {
    if (filter === "all") return items
    return items.filter((item) => item.resource_type === filter)
  }, [items, filter])

  const currentIndex = useMemo(() => {
    if (!hasValidPhotoId) return -1
    const idx = filteredItems.findIndex((item) => item.id === Number(photoId))
    return idx
  }, [hasValidPhotoId, filteredItems, photoId])

  const counts = useMemo(() => {
    const images = items.filter((item) => item.resource_type === "image").length
    const videos = items.filter((item) => item.resource_type === "video").length
    return { images, videos, total: items.length }
  }, [items])

  // Scroll to current index on mobile after load
  const galleryRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isMobile && currentIndex >= 0 && galleryRef.current && !hasValidPhotoId) {
      const scrollToIndex = () => {
        const item = galleryRef.current?.querySelector(`[data-index="${currentIndex}"]`) as HTMLElement
        if (item) {
          item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
      }
      // Delay to ensure render
      const timer = setTimeout(scrollToIndex, 100)
      return () => clearTimeout(timer)
    }
  }, [isMobile, currentIndex, hasValidPhotoId])

  return (
    <section id="gallery" className="relative  text-white py-16 md:py-24 px-4 md:px-6 lg:px-12 overflow-hidden">
      {/* Animated organic background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={isMobile ? {} : {
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -right-1/4 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] rounded-full bg-white blur-[100px] md:blur-[150px]"
        />
        <motion.div
          animate={isMobile ? {} : {
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.02, 0.03, 0.02],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -left-1/4 w-[500px] md:w-[900px] h-[500px] md:h-[900px] rounded-full bg-white blur-[100px] md:blur-[140px]"
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1960px] mx-auto relative z-10">
        {/* Header with organic reveal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="block mb-2"
            >
              GALLERY
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="block font-light italic text-5xl md:text-7xl lg:text-9xl"
              style={{
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Moments
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-6 max-w-2xl text-white/70 text-sm md:text-base lg:text-lg font-light"
          >
            A curated collection of visual stories. Click any item to experience it in full glory.
          </motion.p>
        </motion.div>

        {/* Filter buttons with glassmorphism - Horizontal scroll on very small screens if needed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-10 flex flex-row overflow-x-auto gap-2 md:gap-3 pb-2 scrollbar-hide snap-x snap-mandatory"
        >
          {[
            { key: "all", label: "All", count: counts.total },
            { key: "image", label: "Images", count: counts.images },
            { key: "video", label: "Videos", count: counts.videos },
          ].map(({ key, label, count }) => (
            <motion.button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              whileHover={{ scale: isMobile ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-none px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-xl border transition-all duration-300 min-w-max snap-center ${
                filter === key
                  ? "bg-white/20 border-white/30 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              <span className="text-xs md:text-sm font-medium tracking-wider uppercase">
                {label}
                <span className="ml-1 md:ml-2 text-xs opacity-60">({count})</span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16 md:py-20"
          >
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/60 text-xs md:text-sm">Loading gallery...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl md:rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-white/80"
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 md:py-20"
          >
            <p className="text-white/60 text-base md:text-lg">No {filter !== "all" ? filter + "s" : "items"} found.</p>
          </motion.div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <motion.div
            ref={galleryRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={
              isMobile 
                ? "flex flex-row overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth" 
                : "columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5"
            }
            style={isMobile ? { WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' } : {}}
          >
            {filteredItems.map((item, idx) => {
              const isVideo = item.resource_type === "video"
              const thumbWidth = isMobile ? 300 : 720
              const thumbUrl = isVideo
                ? `https://res.cloudinary.com/${cloudName}/video/upload/c_scale,w_${thumbWidth},so_0,f_auto,q_auto/${item.public_id}.jpg`
                : `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_${thumbWidth},f_auto,q_auto/${item.public_id}.${item.format}`
              const computedHeight = Math.max(1, Math.round((thumbWidth * item.height) / item.width))

              return (
                <motion.a
                  key={item.id}
                  data-index={idx}
                  href={`/?photoId=${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    openModal(item.id)
                  }}
                  ref={item.id === lastViewedId ? lastViewedRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: isMobile ? 0 : idx * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  className={`group relative ${isMobile ? "flex-none w-40 h-40 snap-center" : "mb-4 break-inside-avoid"} block cursor-pointer overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      loading="lazy"
                      alt={isVideo ? "Video thumbnail" : "Gallery photo"}
                      src={thumbUrl}
                      width={thumbWidth}
                      height={isMobile ? 300 : computedHeight}
                      sizes={isMobile ? "(max-width: 640px) 160px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Video play button */}
                    {isVideo && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: isMobile ? 0 : idx * 0.05 + 0.2 }}
                        viewport={{ once: true }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="rounded-full bg-white/20 backdrop-blur-xl border border-white/30 p-1.5 md:p-4 lg:p-6 transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                          <svg
                            className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </motion.div>
                    )}

                    {/* Duration badge for videos */}
                    {isVideo && item.duration && (
                      <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-1.5 py-0.5">
                        <span className="text-white text-[10px] font-medium">
                          {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, "0")}
                        </span>
                      </div>
                    )}

                 
                  </div>
                </motion.a>
              )
              })}
            </motion.div>
          )}
  
          {/* Mobile scroll indicator dots - simple UX for position awareness */}
          {isMobile && filteredItems.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-2 mt-4"
            >
              {Array.from({ length: Math.ceil(filteredItems.length / 3) }).map((_, dotIdx) => (
                <motion.div
                  key={dotIdx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    Math.floor((currentIndex || 0) / 3) === dotIdx ? 'bg-white' : 'bg-white/30'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </motion.div>
          )}
      </div>

      {hasValidPhotoId && currentIndex >= 0 && cloudName && (
        <GalleryModal
          cloudName={cloudName}
          items={filteredItems}
          index={currentIndex}
          onClose={closeModal}
          onNavigate={(nextId) => {
            router.push(`/?photoId=${nextId}`, { scroll: false })
          }}
          isMobile={isMobile}
        />
      )}
    </section>
  )
}

function GalleryModal({
  cloudName,
  items,
  index,
  onClose,
  onNavigate,
  isMobile,
}: {
  cloudName: string
  items: GalleryItem[]
  index: number
  onClose: (currentId: number) => void
  onNavigate: (nextId: number) => void
  isMobile: boolean
}) {
  const current = items[index]
  const canPrev = index > 0
  const canNext = index + 1 < items.length
  const isVideo = current.resource_type === "video"

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const thumbnailScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Mouse wheel horizontal scroll for thumbnails
  useEffect(() => {
    const scrollContainer = thumbnailScrollRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling in the thumbnail area
      if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
        e.preventDefault()
        // Convert vertical scroll to horizontal
        const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX
        scrollContainer.scrollLeft += delta
      }
    }

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Prevent download: Disable right-click, drag, and key events for save
  useEffect(() => {
    const preventDownload = (e: MouseEvent | KeyboardEvent) => {
      if (e.type === 'contextmenu' || e.type === 'dragstart' || (e.type === 'keydown' && (e as KeyboardEvent).key === 's' || (e as KeyboardEvent).key === 'S') && ((e as KeyboardEvent).ctrlKey || (e as KeyboardEvent).metaKey)) {
        e.preventDefault()
      }
    }

    const content = modalContentRef.current
    if (content) {
      content.addEventListener('contextmenu', preventDownload)
      content.addEventListener('dragstart', preventDownload)
      content.addEventListener('keydown', preventDownload)
    }

    return () => {
      if (content) {
        content.removeEventListener('contextmenu', preventDownload)
        content.removeEventListener('dragstart', preventDownload)
        content.removeEventListener('keydown', preventDownload)
      }
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(current.id)
        return
      }
      if (e.key === "ArrowLeft" && canPrev) {
        onNavigate(items[index - 1].id)
        return
      }
      if (e.key === "ArrowRight" && canNext) {
        onNavigate(items[index + 1].id)
        return
      }
      if (e.key === " " && isVideo && videoRef.current) {
        e.preventDefault()
        if (isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
        } else {
          videoRef.current.play()
          setIsPlaying(true)
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [canNext, canPrev, current.id, items, index, onClose, onNavigate, isVideo, isPlaying])

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Optional: Add haptic feedback or visual swipe indicator if needed
  }

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || touchStartY === null) return
    const endX = e.changedTouches[0]?.clientX
    const endY = e.changedTouches[0]?.clientY
    if (typeof endX !== "number" || typeof endY !== "number") return

    const deltaX = endX - touchStartX
    const deltaY = endY - touchStartY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determine if it's a horizontal swipe (ignore vertical scrolls)
    if (absDeltaX > absDeltaY && absDeltaX > 50) {
      e.preventDefault() // Prevent page scroll on swipe
      if (deltaX > 0 && canPrev) {
        onNavigate(items[index - 1].id)
      } else if (deltaX < 0 && canNext) {
        onNavigate(items[index + 1].id)
      }
    }

    setTouchStartX(null)
    setTouchStartY(null)
  }

  const fullUrl = isVideo
    ? `https://res.cloudinary.com/${cloudName}/video/upload/${current.public_id}.${current.format}`
    : `https://res.cloudinary.com/${cloudName}/image/upload/${current.public_id}.${current.format}`

  const mainUrl = isVideo
    ? fullUrl
    : `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_${isMobile ? 1080 : 1920},f_auto,q_auto/${current.public_id}.${current.format}`

  const thumbIds = useMemo(() => {
    const maxThumbs = isMobile ? 5 : 30 // Fewer thumbs on mobile for horizontal scroll
    const halfThumbs = Math.floor(maxThumbs / 2)
    const start = clamp(index - halfThumbs, 0, items.length - 1)
    const end = clamp(index + halfThumbs, 0, items.length - 1)
    const slice = items.slice(start, end + 1)
    return slice
  }, [items, index, isMobile])

  const togglePlayPause = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[10000]"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#282c20]"
          onClick={() => onClose(current.id)}
        >
          {/* Texture overlay */}
          <div
            className="absolute inset-0 w-full h-full opacity-20"
            style={{
              backgroundImage: 'url("/images/curv.svg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Animated gradient blobs */}
          <motion.div
            animate={isMobile ? {} : {
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/4 -right-1/4 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full bg-[#CFFF04] blur-[150px] md:blur-[200px]"
          />
        </motion.div>

        {/* Content */}
        <div
          ref={modalContentRef}
          className="relative z-10 flex h-full w-full items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full flex flex-col"
          >
            {/* Main content container - with padding at bottom for thumbnail strip */}
            <div className="relative flex-1 flex items-center justify-center p-1 md:p-6 lg:p-8 min-h-0 pb-32 md:pb-48 lg:pb-52">
              <div 
                className="relative overflow-hidden rounded-lg md:rounded-xl lg:rounded-2xl border border-white/20 bg-[#1a1f1a] shadow-2xl max-w-full max-h-full flex items-center justify-center"
              >
                {isVideo ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    controls
                    playsInline
                    controlsList="nodownload"
                    disablePictureInPicture
                    className="w-auto h-auto max-w-full max-h-[55vh] md:max-h-[65vh] object-contain"
                    src={mainUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    style={{
                      aspectRatio: `${current.width}/${current.height}`,
                    }}
                  />
                ) : (
                  <div 
                    className="relative flex items-center justify-center w-full h-full"
                  >
                    <Image
                      alt="Gallery image"
                      src={mainUrl}
                      width={current.width}
                      height={current.height}
                      sizes={isMobile ? "100vw" : "90vw"}
                      className="object-contain max-w-full max-h-[70vh] md:max-h-[80vh]"
                      priority
                    />
                  </div>
                )}
              </div>

              {/* Navigation arrows - More responsive sizing */}
              {canPrev && (
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.1, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onNavigate(items[index - 1].id)}
                  className={`absolute left-1 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 p-2 md:p-3 lg:p-4 text-[#CFFF04] hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg z-30 ${isMobile ? 'opacity-60 active:opacity-100 w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'}`}
                  aria-label="Previous"
                >
                  <svg className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              )}

              {canNext && (
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.1, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onNavigate(items[index + 1].id)}
                  className={`absolute right-1 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 p-2 md:p-3 lg:p-4 text-[#CFFF04] hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg z-30 ${isMobile ? 'opacity-60 active:opacity-100 w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'}`}
                  aria-label="Next"
                >
                  <svg className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Bottom section - Fixed with thumbnails and close button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="fixed bottom-0 left-0 right-0 z-[10001] pb-safe"
            >
              {/* Thumbnail navigation - Horizontal scroll with touch and mouse wheel support */}
              <div className="mx-4 mb-3 md:mx-6 md:mb-4 lg:mx-8 lg:mb-5 overflow-hidden rounded-xl md:rounded-2xl bg-[#282c20]/80 backdrop-blur-xl border border-[#CFFF04]/20 shadow-2xl">
                <div 
                  ref={thumbnailScrollRef}
                  className={`flex gap-1 md:gap-2 overflow-x-auto px-2 md:px-4 py-3 md:py-4 lg:py-5 scrollbar-thin scrollbar-thumb-[#CFFF04]/40 scrollbar-track-transparent snap-x snap-mandatory scroll-smooth ${isMobile ? 'pb-2' : ''}`}
                  style={isMobile ? { 
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-x' // Allow horizontal touch scrolling only
                  } : {}}
                >
                  {thumbIds.map((item) => {
                    const thumbWidth = isMobile ? 60 : 180
                    const thumbUrl = item.resource_type === "video"
                      ? `https://res.cloudinary.com/${cloudName}/video/upload/c_scale,w_${thumbWidth},so_0,f_auto,q_auto/${item.public_id}.jpg`
                      : `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_${thumbWidth},f_auto,q_auto/${item.public_id}.${item.format}`
                    const isActive = item.id === current.id
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        className={`relative flex-none overflow-hidden rounded-lg border transition-all snap-center ${
                          isMobile 
                            ? `h-14 w-14 md:h-16 md:w-16` 
                            : `h-14 md:h-16 w-[84px] md:w-[96px]`
                        } ${
                          isActive
                            ? "border-[#CFFF04] shadow-[0_0_0_2px_rgba(207,255,4,0.4)] scale-105"
                            : "border-white/20 opacity-60 hover:opacity-100 hover:border-[#CFFF04]/50"
                        }`}
                        aria-label={`View ${item.resource_type} ${item.id}`}
                      >
                        <Image 
                          loading="lazy"
                          alt="Thumbnail" 
                          src={thumbUrl} 
                          fill 
                          className="object-cover" 
                          sizes={isMobile ? "60px" : "100px"}
                        />
                        {item.resource_type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className={`rounded-full bg-[#CFFF04]/30 backdrop-blur-sm p-${isMobile ? '0.5' : '1'}`}>
                              <svg className={`w-2 h-2 md:w-4 md:h-4 text-white`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Close button - Below thumbnails */}
              <div className="flex items-center justify-center px-4 pb-4 md:pb-6 lg:pb-8">
                <motion.button
                  whileHover={{ scale: isMobile ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onClose(current.id)}
                  className="rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold uppercase tracking-wider text-white/90 hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}