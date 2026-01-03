"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    alt: "Mountain landscape photography",
    aspect: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
    alt: "Portrait photography",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Street photography",
    aspect: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    alt: "Urban photography",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    alt: "Nature photography",
    aspect: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&q=80",
    alt: "Portrait session",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    alt: "Landscape photography",
    aspect: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
    alt: "Professional portrait",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Street photography session",
    aspect: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    alt: "City photography",
    aspect: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    alt: "Wildlife photography",
    aspect: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&q=80",
    alt: "Fashion photography",
    aspect: "aspect-[4/3]",
  },
]

export default function MasonryGallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Background transition: Dark Green -> Dark Green -> White
  const backgroundColor = useTransform(scrollYProgress, [0, 0.6, 0.9], ["#282c20", "#ccc", "#ffffff"])

  // Y Movement: Move grid up to reveal all images
  // Starts at 0vh and moves up to -150vh to show bottom images
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-150vh"])

  const column1 = galleryImages.filter((_, i) => i % 3 === 0)
  const column2 = galleryImages.filter((_, i) => i % 3 === 1)
  const column3 = galleryImages.filter((_, i) => i % 3 === 2)

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative"
      style={{
        height: "400vh",
      }}
    >
      <motion.div className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor }}>
        <motion.div style={{ y }} className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 py-20">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Column 1 */}
            <div className="flex flex-col gap-8 w-full md:w-1/3">
              {column1.map((image, index) => (
                <MasonryCard key={`col1-${index}`} image={image} index={index * 3} />
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-8 w-full md:w-1/3">
              {column2.map((image, index) => (
                <MasonryCard key={`col2-${index}`} image={image} index={index * 3 + 1} />
              ))}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-8 w-full md:w-1/3">
              {column3.map((image, index) => (
                <MasonryCard key={`col3-${index}`} image={image} index={index * 3 + 2} />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function MasonryCard({ image, index }: { image: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative overflow-hidden rounded-xl shadow-2xl transition-all duration-500 bg-gray-900/20 border-2 border-transparent w-full ${image.aspect}`}
    >
      <Image
        src={image.src || "/placeholder.svg"}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={95}
      />
    </motion.div>
  )
}
