"use client"

import { Suspense, useState, type FormEvent } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera } from "@react-three/drei"
import { AnimatePresence, motion } from "framer-motion"
import Helmet3DModel from "./helmet-3d-model"
import InfiniteLogoSlider from "./infinite-logo-slider"

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 16, 16]} />
      <meshStandardMaterial color="#1a1f1a" wireframe />
    </mesh>
  )
}

export default function Footer() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })

  const submitEnquiry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setStatus({
        type: "error",
        message: "Missing Web3Forms access key. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in .env.local.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "Photography Enquiry - Rahul Vadhs",
          from_name: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          botcheck: "",
        }),
      })

      const data = await res.json()
      if (data?.success) {
        setStatus({ type: "success", message: "Thanks! Your enquiry has been sent." })
        setForm({ name: "", email: "", phone: "", message: "" })
      } else {
        setStatus({ type: "error", message: data?.message || "Something went wrong. Please try again." })
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer id="contact" className="bg-lorenzo-accent pt-0 px-4 md:px-8 min-h-screen flex flex-col justify-end relative pb-5">
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-[#f5f1e8] to-lorenzo-accent z-0" />

      {/* Main Dark Card Container */}
      <div className="relative flex-1 flex flex-col w-full max-w-[1688px] mx-auto mt-12 z-10">
        {/* SVG Background Mask */}
        <div
          className="absolute inset-0 w-full h-full z-0 bg-[#282c20] overflow-hidden"
          style={{
            maskImage: 'url("/images/footer-mask.svg")',
            WebkitMaskImage: 'url("/images/footer-mask.svg")',
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          {/* <AnimatedTextureCanvas /> */}

          <div
            className="absolute inset-0 w-full h-full opacity-30"
            style={{
              backgroundImage: 'url("/images/curv.svg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        {/* Increased padding-x to push content inwards away from mask edges, and added padding-bottom to prevent overflow */}
        <div className="relative z-20 flex flex-col h-full px-6 sm:px-8 md:px-24 py-12 md:py-20 md:pb-12 md:pl-0 md:pr-0">
          {/* Main Content Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mt-0">
            {/* Left Column - Pages */}
            <div className="md:col-span-3 text-center order-2 md:order-1 md:pl-8 flex flex-col justify-center h-full">
              <h4 className="font-black text-xs uppercase mb-6 text-lorenzo-text-light/40 tracking-[0.2em]">PAGES</h4>
              <ul className="space-y-2">
                {["HOME", "ABOUT", "GALLERY", "VIDEO", "CONTACT"].map((item) => (
                  <li className="leading-5" key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-lorenzo-text-light font-bold text-xl md:text-2xl uppercase hover:text-lorenzo-accent transition-colors inline-block leading-4"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#social"
                    className="text-lorenzo-accent font-black text-xl md:text-2xl uppercase hover:text-white transition-colors inline-block"
                  >
                    SOCIAL
                  </a>
                </li>
              </ul>
            </div>

            {/* Center Column - Helmet & Title */}
            <div className="md:col-span-6 flex flex-col items-center justify-center order-1 md:order-2 relative">
              {/* Typography Overlay - Increased top margin for more spacing */}
              <div className="absolute top-0 left-0 right-0 z-0 text-center transform sm:-translate-y-1/4 md:-translate-y-0 mt-10 sm:mt-24">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-lorenzo-text-light mix-blend-overlay opacity-90"
                >
                  <span className="font-sans block">
                    ALWAYS <span className="font-brier text-lorenzo-accent text-white md:text-[#CFFF04]">CAPTURING</span>
                  </span>
                  <span className="font-sans block">
                    THE <span className="font-brier text-lorenzo-accent text-white md:text-[#CFFF04]">MOMENT.</span>
                  </span>
                </motion.h2>
              </div>

              {/* 3D Helmet */}
              <div className="relative w-full h-[240px] sm:h-[300px] md:h-[500px] z-10 mt-16 sm:mt-24 md:mt-24">
                <Canvas>
                  <PerspectiveCamera makeDefault position={[0, 0, 6.5]} />
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[10, 10, 5]} intensity={1.5} />
                  <pointLight position={[-10, -10, -5]} intensity={0.8} color="#CFFF04" />
                  {/* <Suspense fallback={<LoadingFallback />}>
                    <Helmet3DModel modelPath="/3d/helmet-lorenzo.glb" />
                  </Suspense> */}
                  <Environment preset="city" />
                </Canvas>
              </div>

              {/* CTA Button - Adjusted bottom position to be closer to helmet */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setStatus(null)
                  setIsEnquiryOpen(true)
                }}
                className="mt-6 sm:mt-0 sm:absolute sm:-bottom-12 z-20 bg-lorenzo-accent text-lorenzo-dark font-black uppercase px-8 py-4 rounded-[14px] text-sm tracking-wider hover:bg-white transition-colors flex items-center gap-2"
              >
                PHOTOGRAPHY ENQUIRIES
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </motion.button>
            </div>

            {/* Right Column - Follow */}
            <div className="md:col-span-3 text-center order-3 md:order-2 md:pr-8 flex flex-col justify-center h-full">
              <h4 className="font-black text-xs uppercase mb-6 text-lorenzo-text-light/40 tracking-[0.2em]">
                FOLLOW ON
              </h4>
              <ul className="space-y-2">
                {[
                  { name: "TWITTER", url: "https://x.com/RVadhs76595" },
                  { name: "INSTAGRAM", url: "https://www.instagram.com/withtheflowtographer/" },
                  { name: "EMAIL", url: "mailto:rahulvadhs@gmail.com" },
                  { name: "PHONE", url: "tel:9769926713" },
                ].map((platform) => (
                  <li className="leading-5" key={platform.name}>
                    <a
                      href={platform.url}
                      target={platform.url.startsWith("http") ? "_blank" : undefined}
                      rel={platform.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-lorenzo-text-light font-bold text-xl md:text-2xl uppercase hover:text-lorenzo-accent transition-colors inline-block leading-4"
                    >
                      {platform.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Partners Row */}
          {/* Added mb-8 to ensure logos don't touch the bottom edge of the mask */}
          <div className="border-lorenzo-text-light/10 border-t-0 mb-0 mt-32 pt-0">
            <Suspense fallback={
              <div className="w-full overflow-hidden py-10 relative">
                <div className="flex justify-center items-center space-x-4 sm:space-x-8">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-300 animate-pulse h-[88px] w-[110px] sm:h-[120px] sm:w-[150px] rounded-lg opacity-50"
                    />
                  ))}
                </div>
              </div>
            }>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <InfiniteLogoSlider />
              </motion.div>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Outside Card) */}
      {/* Wrapped in max-w container to align perfectly with the card above */}
      <div className="w-full max-w-[1688px] mx-auto px-8 md:px-12 relative z-20 pt-0">
        <div className="flex flex-col md:flex-row justify-between items-center text-lorenzo-dark text-xs font-bold tracking-wider uppercase">
          <p>© 2026 Rahul Vadhs. All rights reserved</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a href="#" className="hover:opacity-60 transition-opacity">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:opacity-60 transition-opacity">
              TERMS
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEnquiryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-y-auto"
            onClick={() => setIsEnquiryOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#282c20] text-lorenzo-text-light rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="font-black uppercase tracking-wider">Photography Enquiries</div>
                <button
                  type="button"
                  onClick={() => setIsEnquiryOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={submitEnquiry} className="px-6 py-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-lorenzo-accent/40"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      required
                      className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-lorenzo-accent/40"
                      placeholder="rahul@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-lorenzo-accent/40"
                    placeholder="9769926713"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-lorenzo-accent/40 resize-none"
                    placeholder="Tell me about your shoot..."
                  />
                </div>

                {status && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm border ${
                      status.type === "success"
                        ? "bg-lorenzo-accent/10 border-lorenzo-accent/30 text-lorenzo-text-light"
                        : "bg-red-500/10 border-red-500/30 text-white"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEnquiryOpen(false)}
                    className="px-5 py-3 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-lorenzo-accent text-lorenzo-dark font-black uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
