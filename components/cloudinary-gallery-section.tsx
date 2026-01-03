"use client"

import Image from "next/image"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

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
        
        // Process resources to ensure proper video handling
        const processedResources = Array.isArray(data.resources) 
          ? data.resources.map(item => ({
              ...item,
              resource_type: item.resource_type || (item.format === 'mp4' || item.format === 'mov' || item.format === 'webm' ? 'video' : 'image')
            }))
          : []
        
        console.log('Loaded gallery items:', processedResources)
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
    lastViewedRef.current.scrollIntoView({ block: "center" })
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

  return (
    <section id="gallery" className="relative bg-[#0a0f0a] text-white py-24 px-6 md:px-12 overflow-hidden">
      {/* Animated organic background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-white blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.02, 0.03, 0.02],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -left-1/4 w-[900px] h-[900px] rounded-full bg-white blur-[140px]"
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
          className="mb-12 md:mb-16"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
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
              className="block font-light italic text-6xl md:text-8xl lg:text-9xl"
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
            className="mt-6 max-w-2xl text-white/70 text-base md:text-lg font-light"
          >
            A curated collection of visual stories. Click any item to experience it in full glory.
          </motion.p>
        </motion.div>

        {/* Filter buttons with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-wrap gap-3"
        >
          {[
            { key: "all", label: "All", count: counts.total },
            { key: "image", label: "Images", count: counts.images },
            { key: "video", label: "Videos", count: counts.videos },
          ].map(({ key, label, count }) => (
            <motion.button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-3 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                filter === key
                  ? "bg-white/20 border-white/30 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              <span className="text-sm font-medium tracking-wider uppercase">
                {label}
                <span className="ml-2 text-xs opacity-60">({count})</span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/60 text-sm">Loading gallery...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl px-6 py-4 text-white/80"
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/60 text-lg">No {filter !== "all" ? filter + "s" : "items"} found.</p>
          </motion.div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5"
          >
            {filteredItems.map((item, idx) => {
              const isVideo = item.resource_type === "video"
              const thumbUrl = isVideo
                ? `https://res.cloudinary.com/${cloudName}/video/upload/c_scale,w_720,so_0/${item.public_id}.jpg`
                : `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_720/${item.public_id}.${item.format}`
              const computedHeight = Math.max(1, Math.round((720 * item.height) / item.width))

              return (
                <motion.a
                  key={item.id}
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
                    delay: idx * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative mb-4 block break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <div className="relative">
                    <Image
                      alt={isVideo ? "Video thumbnail" : "Gallery photo"}
                      src={thumbUrl}
                      width={720}
                      height={computedHeight}
                      sizes="(max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        (max-width: 1280px) 33vw,
                        (max-width: 1536px) 25vw,
                        20vw"
                      className="h-auto w-full object-cover transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Video play button */}
                    {isVideo && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.05 + 0.2 }}
                        viewport={{ once: true }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="rounded-full bg-white/20 backdrop-blur-xl border border-white/30 p-6 transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                          <svg
                            className="w-8 h-8 text-white"
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
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-3 py-1">
                        <span className="text-white text-xs font-medium">
                          {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, "0")}
                        </span>
                      </div>
                    )}

                    {/* Type indicator */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium uppercase tracking-wider">
                        {isVideo ? "Video" : "Photo"}
                      </span>
                    </div>
                  </div>
                </motion.a>
              )
            })}
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
}: {
  cloudName: string
  items: GalleryItem[]
  index: number
  onClose: (currentId: number) => void
  onNavigate: (nextId: number) => void
}) {
  const current = items[index]
  const canPrev = index > 0
  const canNext = index + 1 < items.length
  const isVideo = current.resource_type === "video"

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

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
  }

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return
    const endX = e.changedTouches[0]?.clientX
    if (typeof endX !== "number") return

    const delta = endX - touchStartX
    setTouchStartX(null)

    if (Math.abs(delta) < 50) return
    if (delta > 0 && canPrev) {
      onNavigate(items[index - 1].id)
      return
    }
    if (delta < 0 && canNext) {
      onNavigate(items[index + 1].id)
    }
  }

  const fullUrl = isVideo
    ? `https://res.cloudinary.com/${cloudName}/video/upload/${current.public_id}.${current.format}`
    : `https://res.cloudinary.com/${cloudName}/image/upload/${current.public_id}.${current.format}`

  const mainUrl = isVideo
    ? fullUrl
    : `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_1920/${current.public_id}.${current.format}`

  const thumbIds = useMemo(() => {
    const start = clamp(index - 15, 0, items.length - 1)
    const end = clamp(index + 15, 0, items.length - 1)
    const slice = items.slice(start, end + 1)
    return slice
  }, [items, index])

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
        className="fixed inset-0 z-[9999]"
      >
        {/* Footer-inspired backdrop with texture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#282c20]"
          onClick={() => onClose(current.id)}
        >
          {/* Texture overlay from footer */}
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
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-[#CFFF04] blur-[200px]"
          />
        </motion.div>

        {/* Content */}
        <div
          className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-8"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full flex flex-col max-w-[95vw] max-h-[95vh]"
          >
            {/* Main content container - Responsive to content size */}
            <div className="relative flex-1 flex items-center justify-center min-h-0">
              <div 
                className="relative overflow-hidden rounded-xl md:rounded-2xl border border-white/20 bg-[#1a1f1a] shadow-2xl"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: isVideo ? 'auto' : 'auto',
                  height: isVideo ? 'auto' : 'auto',
                }}
              >
                {isVideo ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    controls
                    playsInline
                    controlsList="nodownload"
                    className="max-w-full max-h-[70vh] md:max-h-[75vh] w-auto h-auto object-contain"
                    src={mainUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    style={{
                      display: 'block',
                    }}
                  />
                ) : (
                  <div 
                    className="relative"
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '70vh',
                      aspectRatio: `${current.width}/${current.height}`,
                    }}
                  >
                    <Image
                      alt="Gallery image"
                      src={mainUrl}
                      width={current.width}
                      height={current.height}
                      sizes="90vw"
                      className="object-contain w-full h-full"
                      priority
                      style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        width: 'auto',
                        height: 'auto',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Top left controls */}
              <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-2 z-30">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onClose(current.id)}
                  className="rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 px-3 md:px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg"
                >
                  Close
                </motion.button>
              </div>

              {/* Top right controls */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-2 z-30">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={fullUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 px-3 md:px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg"
                >
                  Open
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={fullUrl}
                  download
                  className="rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 px-3 md:px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg"
                >
                  Download
                </motion.a>
              </div>

              {/* Video play/pause overlay button */}
              {isVideo && (
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer z-20"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full bg-[#282c20]/80 backdrop-blur-xl border-2 border-[#CFFF04] p-5 md:p-6"
                  >
                    {isPlaying ? (
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-[#CFFF04]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-[#CFFF04]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </motion.div>
                </button>
              )}

              {/* Navigation arrows */}
              {canPrev && (
                <motion.button
                  whileHover={{ scale: 1.1, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onNavigate(items[index - 1].id)}
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 p-3 md:p-4 text-[#CFFF04] hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg z-30"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              )}

              {canNext && (
                <motion.button
                  whileHover={{ scale: 1.1, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onNavigate(items[index + 1].id)}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-[#282c20]/90 backdrop-blur-xl border border-[#CFFF04]/30 p-3 md:p-4 text-[#CFFF04] hover:bg-[#CFFF04] hover:text-[#282c20] transition-all shadow-lg z-30"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Thumbnail navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 md:mt-6 overflow-hidden rounded-xl md:rounded-2xl bg-[#282c20]/80 backdrop-blur-xl border border-[#CFFF04]/20"
            >
              <div className="flex gap-2 overflow-x-auto px-3 md:px-4 py-2 md:py-3 scrollbar-thin scrollbar-thumb-[#CFFF04]/40 scrollbar-track-transparent">
                {thumbIds.map((item) => {
                  const thumbUrl = item.resource_type === "video"
                    ? `https://res.cloudinary.com/${cloudName}/video/upload/c_scale,w_180,so_0/${item.public_id}.jpg`
                    : `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_180/${item.public_id}.${item.format}`
                  const isActive = item.id === current.id
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={`relative h-14 md:h-16 w-[84px] md:w-[96px] flex-none overflow-hidden rounded-lg border transition-all ${
                        isActive
                          ? "border-[#CFFF04] shadow-[0_0_0_2px_rgba(207,255,4,0.4)] scale-105"
                          : "border-white/20 opacity-60 hover:opacity-100 hover:border-[#CFFF04]/50"
                      }`}
                      aria-label={`View ${item.resource_type} ${item.id}`}
                    >
                      <Image alt="Thumbnail" src={thumbUrl} fill className="object-cover" />
                      {item.resource_type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="rounded-full bg-[#CFFF04]/30 backdrop-blur-sm p-1">
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Info bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3 md:mt-4 flex items-center justify-between px-2"
            >
              <div className="text-white/70 text-xs md:text-sm font-medium">
                {index + 1} / {items.length}
              </div>
              <div className="text-[#CFFF04] text-xs md:text-sm uppercase tracking-wider font-bold">
                {current.resource_type === "video" ? "Video" : "Image"}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}