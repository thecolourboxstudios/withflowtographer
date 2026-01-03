"use client"

const logos = [
  { name: "Artist Connect", src: "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767456054/Artist_Connect_Logo_New_PNG_1_ferj42.png" },
  { name: "Vibe Factory", src: "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767456054/red_jbhvy7.png" },
  { name: "Pheonix", src: "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767456054/Pheonix_Logo_f3eusv.png" },
  { name: "IBOTI", src: "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767456054/Final_Logo-01_mdvwo7.png" },
  { name: "TCB", src: "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767456053/ColourBox_Main_bgolu9.png" },
   { name: "O3 Events", src: "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767456053/o3_events_logo-Black_v1spmo.png" },
   { name: "O3 Sport", src: "https://res.cloudinary.com/dbbzsyl8u/image/upload/v1767456054/O3_Sport_Blank_BG_eep891.png" },
  
]

export default function InfiniteLogoSlider() {
  // Create a sequence of logos that is definitely wide enough (4 sets)
  const singleSequence = [...logos, ...logos, ...logos, ...logos]

  // We need two copies of this sequence to loop seamlessly by moving -50%
  // This creates a very long strip: [Seq 1][Seq 2]
  const sliderContent = [...singleSequence, ...singleSequence]

  return (
    <div className="w-full overflow-hidden py-10 relative mask-gradient bg-transparent">
      {/* Inject CSS keyframes locally to ensure it works without global dependencies */}
      <style jsx>{`
        @keyframes infinite-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-slide {
          animation: infinite-slide 40s linear infinite;
        }
        /* Pause on hover if desired, but user requested infinite non-stop */
        /* .animate-infinite-slide:hover {
          animation-play-state: paused;
        } */
      `}</style>

      <div className="flex w-max animate-infinite-slide">
        {sliderContent.map((logo, index) => (
          <div
            key={index}
            className="relative bg-[#c8f550] h-[88px] w-[110px] sm:h-[120px] sm:w-[150px] flex items-center justify-center flex-shrink-0 mx-4 sm:mx-8 opacity-100 hover:grayscale hover:opacity-70 transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src || "/placeholder.svg"}
              alt={logo.name}
              className="w-auto h-[40px] sm:h-[50px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
