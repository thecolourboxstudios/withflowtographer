import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import MissionSection from "@/components/mission-section"
import RiderTechSection from "@/components/rider-tech-section"
import VideoShowcase from "@/components/video-showcase"
import SocialSection from "@/components/social-section"
import Footer from "@/components/footer"
import CloudinaryGallerySection from "@/components/cloudinary-gallery-section"
import Image from "next/image"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <HeroSection />
      <div className="relative z-10">
        <MissionSection />
        <Suspense fallback={
          <div className="relative bg-[#0a0f0a] text-white py-24 px-6 md:px-12 overflow-hidden">
            <div className="max-w-[1960px] mx-auto relative z-10">
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-white/60 text-sm">Loading gallery...</p>
                </div>
              </div>
            </div>
          </div>
        }>
          <CloudinaryGallerySection />
        </Suspense>
        {/* <RiderTechSection />
        <div className="relative w-full h-[120px] md:h-[160px] lg:h-[200px] overflow-hidden bg-white">
          <Image
            src="/images/trilha2.svg"
            alt="Decorative divider"
            fill
            className="object-cover object-center"
            priority={false}
          />
        </div> */}
        <VideoShowcase />
        <div className="relative w-full h-[120px] md:h-[160px] lg:h-[200px] overflow-hidden bg-white">
          <Image
            src="/images/splash.svg"
            alt="Decorative divider"
            fill
            className="object-cover object-center bg-lorenzo-dark"
            priority={false}
          />
        </div>
        <SocialSection />
        <Footer />
      </div>
    </main>
  )
}
